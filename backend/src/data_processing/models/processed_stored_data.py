from django.db import models
from django.conf import settings
from django.db import models

# from .storages import MyLocalStorage, MyRemoteStorage
import uuid


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/node_id/<filename>
    return f"user_{instance.user.id}/processed_data/{instance.node_id}/{uuid.uuid4()}/{filename}"


class ProcessedStoredData(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.RESTRICT)

    file_path = models.FileField(upload_to=user_directory_path, max_length=300)
    file_name = models.CharField(
        default="filename",
        max_length=100,
    )
    node_id = models.CharField(
        default="_",
        null=False,
        max_length=100,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
