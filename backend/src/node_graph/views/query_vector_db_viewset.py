from node_graph.models.llm_service_keys import LLMServiceKeys
from node_graph.serializers import QueryVectorDBSerializer
from node_graph.models import QueryVectorDB


from rest_framework.response import Response
from rest_framework import status, viewsets, permissions, generics


from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OpenAIEmbeddings
from django.conf import settings

from pathlib import Path
from django.core.files.storage import default_storage

from rest_framework import viewsets
import logging
# from langchain.storage import (
#     InMemoryStore,
#     LocalFileStore,
#     RedisStore,
#     UpstashRedisStore,
# )
# fs = LocalFileStore("./cache/")

# underlying_embeddings  = OpenAIEmbeddings()
# cached_embedder = CacheBackedEmbeddings.from_bytes_store(
#     embedding_function, fs, namespace=embedding_function.model
# )

from langchain.text_splitter import TokenTextSplitter

logger = logging.getLogger(__name__)
text_splitter = TokenTextSplitter(
    chunk_size=300,
    chunk_overlap=0,
)


class QueryVectorDbView(viewsets.ViewSet, generics.ListAPIView):
    """ """

    queryset = QueryVectorDB.objects.all()
    serializer_class = QueryVectorDBSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def create(self, request, *args, **kwargs):
        serializer = QueryVectorDBSerializer(data=request.data)
        serializer.is_valid(raise_exception=False)

        node_id = request.data["node_id"]
        document_urls = request.data.get("document_urls", None)
        document_input = request.data.get("document", None)
        documents = []
        print("*"*60)
        print(request.data)

        print(request.data.get("llmApiKeyId"))

        api_key_instance = LLMServiceKeys.objects.get(
            user=self.request.user, id=request.data.get("llmApiKeyId")
        )

        if document_urls:
            for url in document_urls:
                url = url[1:] if url.startswith("/") else url
                file = default_storage.open(url, mode="r")
                documents.append(file.read())
                file.close()

        elif document_input:
            documents = [str(document_input)]
        else:
            return Response(
                {"message": "must pass in one of document or url"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        texts = text_splitter.create_documents(documents)

        file_path = str(
            Path(settings.MEDIA_ROOT)
            / str(request.user.id)
            / str(node_id)
            / "vector_store"
        )

        serializer.save(
            document_location=file_path,
            user=self.request.user,
        )
        embedding_function = OpenAIEmbeddings(
            api_key=api_key_instance.api_key,
        )
        db = Chroma.from_documents(
            texts,
            embedding_function,
            persist_directory=file_path,
        )
        db.persist()

        return Response(
            {
                "file_path": file_path,
            },
            status=status.HTTP_201_CREATED,
        )

    def search_db(self, request, pk=None):
        # TODO: use serializer to validate data

        node_id = request.data["node_id"]
        query = request.data["query"]
        n_results = request.data.get("n_results", 4)
        api_key_instance = LLMServiceKeys.objects.get(
            user=self.request.user, id=request.data.get("llmApiKeyId")
        )

        file_path = str(
            Path(settings.MEDIA_ROOT)
            / str(request.user.id)
            / str(node_id)
            / "vector_store"
        )

        embedding_function = OpenAIEmbeddings(
            api_key=api_key_instance.api_key,
        )

        db = Chroma(
            persist_directory=file_path,
            embedding_function=embedding_function,
        )

        similar_docs = db.similarity_search(query, k=n_results)
        logger.debug(similar_docs)
        # Custom action logic for GET request
        # Retrieve data or perform any operation based on the instance with 'pk'
        return Response({"results": [i.page_content for i in similar_docs]})
