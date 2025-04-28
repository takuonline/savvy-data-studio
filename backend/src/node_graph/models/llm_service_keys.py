from django.db import models
import uuid


class LLMServiceKeys(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("auth.User", on_delete=models.RESTRICT)

    name = models.CharField(
        max_length=100,
    )
    api_key = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        # unique=True
    )

    api_key_redacted = models.CharField(max_length=12)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
