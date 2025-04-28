from node_graph.serializers import ChatPromptTemplateSerializer
from node_graph.models import ChatPromptTemplate


# from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import renderers
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
import logging

logger = logging.getLogger(__name__)


class ChatPromptTemplateViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides default
      create(), retrieve(), update(), partial_update(), destroy() and list() actions.

    """

    # authentication_classes = (TokenAuthentication,)

    queryset = ChatPromptTemplate.objects.all()
    serializer_class = ChatPromptTemplateSerializer

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    @action(detail=True, renderer_classes=[renderers.JSONRenderer])
    def prompt(self, request, *args, **kwargs):
        chat_prompt = self.get_object()
        # chat_prompt
        return Response(chat_prompt)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
