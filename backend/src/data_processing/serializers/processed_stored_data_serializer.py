from rest_framework import serializers
from data_processing.models import ProcessedStoredData


class ProcessedStoredDataSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.id")
    file_name = serializers.ReadOnlyField()
    # file_path = serializers.SerializerMethodField(read_only=True,)
    file_path = serializers.ReadOnlyField(source="file_path.url")

    class Meta:
        model = ProcessedStoredData
        fields = [
            "user",
            "file_path",
            "file_name",
            "node_id",
            "created_at",
            "updated_at",
        ]

    # def get_file_path(self, obj):

    #     return  f"user_{obj.user.id}/{obj.node_id}/{obj.file_name}"
