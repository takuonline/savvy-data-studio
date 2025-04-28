from node_graph.serializers import NodeGraphSerializer
from node_graph.models import NodeGraph


from rest_framework.response import Response
from rest_framework import status

from rest_framework import permissions

from rest_framework_simplejwt.authentication import JWTAuthentication


from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
from rest_framework import viewsets
import logging

logger = logging.getLogger(__name__)


class NodeGraphViewSet(viewsets.ModelViewSet):
    queryset = NodeGraph.objects.all()
    serializer_class = NodeGraphSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    # pagination_class =

    def create(self, request, *args, **kwargs):
        serializer = NodeGraphSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        node_graph = request.data
        file_name = node_graph.get("label")
        content_file = ContentFile(json.dumps(node_graph), name=file_name)

        process_store_document = serializer.save(
            user=self.request.user, file_path=content_file
        )

        url = process_store_document.file_path.url

        logger.info(url)

        return Response(
            {"url": url, "label": file_name},
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset()).order_by("created_at")

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)

            for item in serializer.data:
                file_path = item["file_path"]
                if file_path.startswith("/"):
                    file_path = file_path[1:]

                file = default_storage.open(file_path, mode="r")
                item["node_graph"] = file.read()

            return self.get_paginated_response(serializer.data[::-1])

        serializer = self.get_serializer(queryset, many=True)

        for item in serializer.data:
            file_path = item["file_path"]
            if item["file_path"].startswith("/"):
                file_path = item["file_path"][1:]

            file = default_storage.open(file_path, mode="r")
            item["node_graph"] = file.read()

        return Response(serializer.data[::-1])

    def destroy(self, request, *args, **kwargs):
        """
        Destroy a model instance.
        """
        instance = self.get_object()
        logger.debug(instance)

        file_path = instance.file_path.path
        logger.debug(file_path)

        x = default_storage.delete(file_path)

        logger.debug(x)

        logger.debug(instance)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()
