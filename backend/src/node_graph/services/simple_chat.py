from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    BaseChatPromptTemplate,
)
from langchain.text_splitter import TokenTextSplitter
from typing import Optional
import logging

logger = logging.getLogger(__name__)


def prepare_simple_chat_prompt(
    data: dict,
    doc_chunk_size: Optional[int],
    prompt_variables: Optional[dict] = None,
    documents: Optional[list[str]] = [],
):
    prompt_templates = [
        {
            "promptTemplateClass": SystemMessagePromptTemplate,
            "prompt_type": "system_prompt",
        },
        {
            "promptTemplateClass": HumanMessagePromptTemplate,
            "prompt_type": "human_prompt",
        },
        {
            "promptTemplateClass": HumanMessagePromptTemplate,
            "prompt_type": "document_prompt",
        },
    ]

    chat_prompt_list = []

    for p_template in prompt_templates:
        res = get_prompt_template(**p_template, data=data["chat_prompt"])
        if res:
            chat_prompt_list.append(res)

    if documents:
        for doc in documents:
            ts = TokenTextSplitter.from_tiktoken_encoder(
                chunk_size=doc_chunk_size or 3500, chunk_overlap=0
            )

            if not len(doc):
                continue

            msg = ts.split_text(doc)[0]
            prompt = HumanMessagePromptTemplate.from_template(msg)
            dummy_variables = {i: i for i in prompt.input_variables}

            formatted_prompt = prompt.format(**dummy_variables)

            chat_prompt_list.append(formatted_prompt)

    if prompt_variables:
        chat_prompt = ChatPromptTemplate.from_messages(chat_prompt_list)
        prompt = chat_prompt.format_prompt(**prompt_variables).to_messages()
    else:
        prompt = chat_prompt_list

    return prompt


def get_prompt_template(
    promptTemplateClass: BaseChatPromptTemplate, prompt_type: str, data: dict
):
    if value := data.get(prompt_type):
        if prompt_type == "document_prompt":
            value = str(value)
            prompt = promptTemplateClass.from_template(value)
            dummy_variables = {i: "" for i in prompt.input_variables}

            return prompt.format(**dummy_variables)

        else:
            prompt = promptTemplateClass.from_template(value)
            dummy_variables = {i: "" for i in prompt.input_variables}
            return prompt.format(**dummy_variables)

    return None


def simple_chat_request(
    data: dict,
    api_key: str,
    doc_chunk_size: Optional[int],
    prompt_variables: Optional[dict] = None,
    documents: Optional[list[str]] = [],
):
    chat = ChatOpenAI(
        **data["chat_model"],
        openai_api_key=api_key,
    )

    prompt = prepare_simple_chat_prompt(data,doc_chunk_size, prompt_variables, documents)
    print(prompt)

    print([ (p.type,p.content[:20]) for p in prompt])

    result = chat(prompt)
    return result

    # try:
    #     result = chat(prompt)
    #     return result
    # except (openai.BadRequestError, openai.RateLimitError):
    #     prompt = [clip_prompt(i) for i in prompt]

    #     result = chat(prompt)
    #     return result


# def simple_template_chat_request(data: dict):
#     chat = ChatOpenAI(**data["chat_model"].pop("callbacks"))

#     system_template = "You are an Ai recipe assistant that speciallizes in {dietary_preference} dishes that cna be prepared in {cooking_time} "
#     system_message_prompt = SystemMessagePromptTemplate.from_template(system_template)

#     human_template = "{recipe_request}"
#     human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
#     chat_prompt = ChatPromptTemplate.from_messages(
#         [system_message_prompt, human_message_prompt]
#     )
#     prompt = chat_prompt.format_prompt(
#         cooking_time="15 min",
#         recipe_request="Quick Snack",
#         dietary_preference="meaty",
#     ).to_messages()

#     result = chat(prompt)

#     return result
