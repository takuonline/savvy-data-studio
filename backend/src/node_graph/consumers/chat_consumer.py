import json
from channels.generic.websocket import AsyncWebsocketConsumer
from openai import AsyncOpenAI
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from django.core.files.storage import default_storage

from node_graph.models import LLMServiceKeys
from node_graph.services import simple_chat
from langchain.schema import BaseMessage, HumanMessage, AIMessage, SystemMessage
import logging

logger = logging.getLogger(__name__)


def convert_to_openai_messages(messages: list[BaseMessage]) -> list[dict]:
    openai_messages = []
    for message in messages:
        if isinstance(message, HumanMessage):
            role = "user"
        elif isinstance(message, AIMessage):
            role = "assistant"
        elif isinstance(message, SystemMessage):
            role = "system"
        else:
            raise ValueError(f"Unsupported message type: {type(message)}")

        openai_messages.append({"role": role, "content": message.content})
    return openai_messages


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user")
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]

        query_params = parse_qs(self.scope["query_string"].decode())
        self.api_key_id = query_params.get("oaid", [None])[0].strip(r"/")

        logger.info(f"Conversation ID: {self.conversation_id}, OAID: {self.api_key_id}")

        if self.user.is_authenticated:
            self.messages = []
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        logger.info("Disconnecting...")
        # if self.user.is_authenticated:
        #     pass
        # await self.save_conversation(self.conversation_id, self.messages)
        # delete conversation if no messages
        # if not self.messages:
        #     await self.delete_conversation(self.conversation_id)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print("text_data_json", text_data_json)
        data = text_data_json["message"]
        chat_prompt = data["chat_prompt"]
        if config := data.get("config"):
            doc_chunk_size = int(config.get("doc_chunk_size"))

        documents = await self.load_documents(chat_prompt)

        prompt = simple_chat.prepare_simple_chat_prompt(
            data,
            doc_chunk_size=doc_chunk_size,
            prompt_variables=None,
            documents=documents,
        )
        print("*" * 60)
        print(self.conversation_id)

        self.messages.extend(convert_to_openai_messages(prompt))

        api_key = await self.get_key()

        client = AsyncOpenAI(api_key=api_key)
        stream = await client.chat.completions.create(
            model=data["chat_model"]["model_name"],
            temperature=data["chat_model"]["temperature"],
            max_tokens=data["chat_model"]["max_tokens"],
            presence_penalty=0,
            frequency_penalty=0,
            messages=self.messages,
            stream=True,
        )

        full_message = ""
        async for chunk in stream:
            message_chunk = chunk.choices[0].delta.content
            if message_chunk:
                full_message += message_chunk
                await self.send(text_data=json.dumps({"message": message_chunk}))

        self.messages.append(
            {
                "role": "assistant",
                "content": full_message,
            }
        )

        await client.close()
        # await self.send(text_data=json.dumps({"close": True}))

        await self.close()


    @database_sync_to_async
    def get_key(self):
        print(self.api_key_id)
        api_key_instance = LLMServiceKeys.objects.get(
            user=self.user, id=self.api_key_id
        )

        return api_key_instance.api_key

    @database_sync_to_async
    def load_documents(self, chat_prompt):
        documents = []

        if document_urls := chat_prompt.pop("document_urls"):
            for url in document_urls:
                if not url:
                    continue
                url = url[1:] if url.startswith("/") else url
                file = default_storage.open(url, mode="r")
                documents.append(file.read())
                file.close()
        return documents
