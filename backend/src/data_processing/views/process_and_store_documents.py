from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication

from data_processing.services import handle_file_upload
from rest_framework.response import Response
from rest_framework import permissions


from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from data_processing.serializers import ProcessedStoredDataSerializer
from data_processing.models import ProcessedStoredData
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from http import HTTPMethod

from rest_framework.decorators import action
import logging

logger = logging.getLogger(__name__)


class DocumentProcessingViewSet(ModelViewSet):
    queryset = ProcessedStoredData.objects.all()
    serializer_class = ProcessedStoredDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        results = []

        for file in list(request.FILES.values()):
            data = handle_file_upload(file)
            # handle_file_type.delay
            results.append(data)

        return Response({"results": results})

    @action(detail=False, methods=[HTTPMethod.POST], url_path="process-store")
    def process_store(self, request, *args, **kwargs):
        serializer = ProcessedStoredDataSerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)

        results = []
        # node_id = request.data["node_id"]

        for file in request.FILES.values():
            file_name = file.name + ".txt"
            data = handle_file_upload(file)

            results.append(data)

            content_file = ContentFile(data["data"], name=file_name)

            process_store_document = serializer.save(
                file_name=file_name, user=self.request.user, file_path=content_file
            )

            # python refrencing allows you to add url to data
            # dict even after pushing it to the list
            data["url"] = process_store_document.file_path.url

        return Response(results)

    @action(detail=False, methods=["get"], url_path="retrieve-stored")
    def retrieve_stored(self, request, *args, **kwargs):
        # Retrieve query parameters from the URL
        node_id = request.query_params.get("node_id")
        results = []

        if node_id:
            # Filtering the database for the specified node_id
            obj = ProcessedStoredData.objects.values(
                "file_path",
                "file_name",
                "node_id",
                "created_at",
            ).filter(
                node_id=node_id,
            )

            # If the filtered query set is not empty
            if obj.exists():
                for item in obj:
                    logger.info(item)
                    try:
                        # Attempting to open the file
                        file = default_storage.open(item["file_path"], mode="r")
                        item["data"] = file.read()
                        file.close()
                    except Exception as e:
                        # Handle possible exceptions, such as file not found
                        logger.error(f"Error opening file: {e}")
                    else:
                        results.append(item)

            return Response(results, status=status.HTTP_200_OK)

        # If node_id is not provided or any other issue, you ccodan customize this response
        return Response(
            {"error": "Node ID is required."}, status=status.HTTP_400_BAD_REQUEST
        )
