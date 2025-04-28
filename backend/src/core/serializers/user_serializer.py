from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    chat_model = serializers.ReadOnlyField(read_only=True)
    password = serializers.CharField(write_only=True)
    # email = serializers.EmailField()

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
        )

        return user

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "chat_model"]
