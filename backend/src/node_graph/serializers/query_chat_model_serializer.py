from rest_framework import serializers
from node_graph.models import (
    QueryChatModel,
    ChatOpenAI,
    ChatPromptTemplate,
    LLMServiceKeys,
)
from node_graph.serializers import ChatOpenaiSerializer, ChatPromptTemplateSerializer
from node_graph.serializers.llm_service_keys_serializer import LLMServiceKeysSerializer


class QueryChatModelSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="owner.username")
    chat_model = ChatOpenaiSerializer(
        read_only=True,
    )
    chat_prompt = ChatPromptTemplateSerializer(read_only=True)
    api_key = LLMServiceKeysSerializer(read_only=True)

    class Meta:
        model = QueryChatModel
        fields = [
            "user",
            "chat_model",
            "chat_prompt",
            "api_key",
            "document_prompt",
            "created_at",
            "updated_at",
        ]

    def create(
        self,
        validated_data,
    ):
        chat_model_data = validated_data.pop("chat_model")
        chat_prompt_data = validated_data.pop("chat_prompt")
        user = validated_data.pop("user")

        chat_model = ChatOpenAI.objects.create(owner=user, **chat_model_data)
        chat_prompt = ChatPromptTemplate.objects.create(owner=user, **chat_prompt_data)

        return QueryChatModel.objects.create(
            user=user, chat_model=chat_model, chat_prompt=chat_prompt, **validated_data
        )
