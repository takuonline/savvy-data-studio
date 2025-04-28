from rest_framework import serializers
from node_graph.models import NodeGraph


class NodeGraphSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    id = serializers.ReadOnlyField()
    file_path = serializers.ReadOnlyField(source="file_path.url")

    class Meta:
        model = NodeGraph
        fields = [
            "id",
            "user",
            "file_path",
            "label",
            "description",
            "created_at",
            "updated_at",
        ]
