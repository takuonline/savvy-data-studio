from rest_framework import serializers
from node_graph.models import LLMServiceKeys


class LLMServiceKeysSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="user.username")
    api_key_redacted = serializers.ReadOnlyField()
    id = serializers.ReadOnlyField()
    api_key = serializers.CharField(write_only=True)

    class Meta:
        model = LLMServiceKeys
        fields = [
            "id",
            "owner",
            "name",
            "api_key",
            "api_key_redacted",
            "created_at",
            "updated_at",
        ]

    def to_internal_value(self, data):
        data["api_key"] = data.pop(
            "apiKey", None
        )  # Rename 'apiKey' from the input to 'api_key'
        return super().to_internal_value(data)
