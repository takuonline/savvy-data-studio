from node_graph.serializers import LLMServiceKeysSerializer
from node_graph.models import LLMServiceKeys


from rest_framework.response import Response
from rest_framework import status

from rest_framework import permissions
from rest_framework import mixins, viewsets


from rest_framework_simplejwt.authentication import JWTAuthentication
import logging

logger = logging.getLogger(__name__)


class LLMServiceKeysViewSet(
    mixins.CreateModelMixin,
    #    mixins.RetrieveModelMixin,
    #    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = LLMServiceKeys.objects.all()
    serializer_class = LLMServiceKeysSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # TODO: may need to check length of key here - values look weird if too short
        first_chars = serializer.validated_data.get("api_key")[:3]
        last_chars = serializer.validated_data.get("api_key")[-4:]
        api_key_redacted = first_chars + "..." + last_chars

        item = serializer.save(
            user=self.request.user, api_key_redacted=api_key_redacted
        )

        headers = self.get_success_headers(serializer.data)

        return Response(
            {
                "id": item.id,
                "api_key_redacted": api_key_redacted,
                "name": serializer.validated_data.get("name"),
            },
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    # def perform_create(self, serializer, *args, **kwargs):
    #     serializer.save(**kwargs)

    def list(self, request, *args, **kwargs):
        user_query_set = self.get_queryset().filter(user=request.user)
        queryset = self.filter_queryset(user_query_set)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
