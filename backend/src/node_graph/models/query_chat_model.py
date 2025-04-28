from django.db import models
from node_graph.models import ChatOpenAI, ChatPromptTemplate
from .llm_service_keys import LLMServiceKeys


class QueryChatModel(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.RESTRICT)

    chat_model = models.OneToOneField(
        ChatOpenAI,
        verbose_name="ai chat model",
        auto_created=True,
        on_delete=models.RESTRICT,
    )
    chat_prompt = models.OneToOneField(
        ChatPromptTemplate, verbose_name="ai chat prompt", on_delete=models.RESTRICT
    )
    document_prompt = models.TextField(
        null=True,
        blank=True,
    )
    api_key = models.ForeignKey(
        LLMServiceKeys,
        on_delete=models.CASCADE,
        verbose_name="llm service api key ",
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
