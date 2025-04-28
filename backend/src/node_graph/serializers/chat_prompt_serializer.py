from rest_framework import serializers
from node_graph.models import ChatPromptTemplate


class ChatPromptTemplateSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = ChatPromptTemplate
        fields = [
            "owner",
            "system_prompt",
            "human_prompt",
            "document_prompt",
            "ai_prompt",
            "ai_response",
            "created_at",
            "updated_at",
        ]
