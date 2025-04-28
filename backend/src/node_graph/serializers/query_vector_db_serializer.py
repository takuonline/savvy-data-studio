from rest_framework import serializers
from node_graph.models import QueryVectorDB


class QueryVectorDBSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")
    document = serializers.CharField(
        read_only=True,
        style={"base_template": "textarea.html"},
    )
    document_location = serializers.ReadOnlyField()
    n_results = serializers.IntegerField(required=False, max_value=100)
    document_urls = serializers.ListField(read_only=True, child=serializers.CharField())

    class Meta:
        model = QueryVectorDB
        fields = [
            "user",
            "document_location",
            "embedding_function",
            "node_id",
            "document_urls",
            "document",
            "n_results",
            "created_at",
            "updated_at",
        ]

    # def create(
    #     self,
    #     validated_data,
    #     # user, chat_model_data, chat_prompt_data
    # ):
    #     chat_model_data = validated_data.pop("chat_model")
    #     chat_prompt_data = validated_data.pop("chat_prompt")
    #     user = validated_data.pop("user")

    #     chat_model = ChatOpenAI.objects.create(owner=user, **chat_model_data)
    #     chat_prompt = ChatPromptTemplate.objects.create(owner=user, **chat_prompt_data)

    #     return QueryChatModel.objects.create(
    #         user=user, chat_model=chat_model, chat_prompt=chat_prompt, **validated_data
    #     )
