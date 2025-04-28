from django.db import models


class QueryVectorDB(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.RESTRICT)

    document_location = models.TextField()
    embedding_function = models.TextField(default="OpenAIEmbeddings")
    node_id = models.TextField(default="1")
    # document_url = models.FileField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
