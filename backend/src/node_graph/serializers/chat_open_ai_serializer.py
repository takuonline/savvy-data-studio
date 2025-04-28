from rest_framework import serializers
from node_graph.models import ChatOpenAI


class ChatOpenaiSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = ChatOpenAI
        fields = [
            "owner",
            "cache",
            "callback_manager",
            "callbacks",
            "default_headers",
            "default_query",
            "http_client",
            "max_retries",
            "max_tokens",
            "metadata",
            "model_kwargs",
            "model_name",
            "n",
            "openai_api_base",
            "openai_api_key",
            "openai_organization",
            "openai_proxy",
            "request_timeout",
            "streaming",
            "tags",
            "temperature",
            "tiktoken_model_name",
            "verbose",
            "created_at",
            "updated_at",
        ]
