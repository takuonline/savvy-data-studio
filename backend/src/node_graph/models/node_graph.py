from django.db import models
import uuid


def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/node_id/<filename>
    return f"user_{instance.user.id}/node_graphs/{uuid.uuid4()}/{filename}"


# def select_storage():
#     return MyLocalStorage() if settings.DEBUG else MyRemoteStorage()


class NodeGraph(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.RESTRICT)
    file_path = models.FileField(upload_to=user_directory_path, max_length=300)
    label = models.CharField(max_length=70)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
