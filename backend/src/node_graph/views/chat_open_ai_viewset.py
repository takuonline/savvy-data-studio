from node_graph.serializers import ChatOpenaiSerializer
from node_graph.models import ChatOpenAI


# from node_graph.serializers import ChatOpenaiSerializerPrompt
# from node_graph.models import ChatOpenAIPrompt

# from rest_framework.views import APIView

from rest_framework import viewsets
from rest_framework import permissions


class ChatOpenAIViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    """

    # authentication_classes = (TokenAuthentication,)

    queryset = ChatOpenAI.objects.all()
    serializer_class = ChatOpenaiSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        # IsOwnerOrReadOnly
    ]

    # @action(detail=True, renderer_classes=[renderers.JSONRenderer])
    # def highlight(self, request, *args, **kwargs):
    #     snippet = self.get_object()
    #     return Response(snippet.highlighted)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
