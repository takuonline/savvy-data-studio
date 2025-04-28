from node_graph.serializers import QueryChatModelSerializer

from node_graph.models import QueryChatModel, LLMServiceKeys


from rest_framework.response import Response
from rest_framework import status

from rest_framework import permissions
from rest_framework import generics

from node_graph.services import simple_chat_request
from django.core.files.storage import default_storage
import traceback
import openai
import logging

logger = logging.getLogger(__name__)


class QueryChatModelView(generics.ListCreateAPIView, generics.GenericAPIView):
    """ """

    queryset = QueryChatModel.objects.all()
    serializer_class = QueryChatModelSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def create(self, request, *args, **kwargs):
        serializer = QueryChatModelSerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)

        try:
            api_key_id = request.data.get("api_key_id")

            api_key_instance = LLMServiceKeys.objects.get(id=api_key_id)

        except LLMServiceKeys.DoesNotExist:
            return Response(
                {"message": "API key not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(request.data)
        chat_prompt = request.data["chat_prompt"]
        config = request.data.get("config")
        doc_chunk_size = None

        if config:
            doc_chunk_size = int(config.get("doc_chunk_size"))

        documents = []

        if document_urls := chat_prompt.pop("document_urls"):
            for url in document_urls:
                if not url:
                    continue
                url = url[1:] if url.startswith("/") else url
                file = default_storage.open(url, mode="r")
                documents.append(file.read())
                file.close()

        try:
            response = simple_chat_request(
                data=request.data,
                api_key=api_key_instance.api_key,
                documents=documents,
                doc_chunk_size=doc_chunk_size,
            )
        except openai.AuthenticationError:
            msg = traceback.format_exc(limit=0)
            logger.error(msg)
            return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)
        except openai.RateLimitError:
            msg = traceback.format_exc(limit=0)
            logger.error(msg)
            return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)

        except (KeyError, openai.BadRequestError, ValueError):
            traceback.print_exc()

            msg = traceback.format_exc(limit=0)
            logger.error(msg)
            return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)

        request.data["chat_prompt"]["ai_response"] = response.content

        serializer.save(
            user=self.request.user,
            chat_model=request.data.get("chat_model"),
            chat_prompt=chat_prompt,
            api_key=api_key_instance,
        )

        headers = self.get_success_headers(serializer.data)
        return Response(response.content, status=status.HTTP_200_OK, headers=headers)
