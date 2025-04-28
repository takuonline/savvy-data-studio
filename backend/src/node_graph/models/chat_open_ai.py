from django.db import models
from django.core.exceptions import ValidationError
from .model_list import OPEN_AI_MODEL_CHOICES


class ChatOpenAI(models.Model):
    owner = models.ForeignKey(
        "auth.User", related_name="chat_models", on_delete=models.RESTRICT
    )

    cache = models.BooleanField(
        null=True, blank=True, help_text="Whether to cache the response."
    )
    callback_manager = models.JSONField(
        null=True, blank=True, help_text="Callback manager to add to the run trace."
    )
    callbacks = models.JSONField(
        null=True, blank=True, help_text="Callbacks to add to the run trace."
    )
    default_headers = models.JSONField(
        null=True, blank=True, help_text="Default headers for HTTP requests."
    )
    default_query = models.JSONField(
        null=True, blank=True, help_text="Default query parameters for HTTP requests."
    )
    http_client = models.TextField(
        null=True, blank=True, help_text="Optional httpx.Client."
    )
    max_retries = models.IntegerField(
        default=6, help_text="Maximum number of retries to make when generating."
    )
    max_tokens = models.IntegerField(
        null=True, blank=True, help_text="Maximum number of tokens to generate."
    )
    metadata = models.JSONField(
        null=True, blank=True, help_text="Metadata to add to the run trace."
    )
    model_kwargs = models.JSONField(
        null=True,
        blank=True,
        default=dict,
        help_text="Holds any model parameters valid for create call not explicitly specified.",
    )
    model_name = models.CharField(
        null=True,
        blank=True,
        max_length=100,
        choices=OPEN_AI_MODEL_CHOICES,
        default="gpt-3.5-turbo-0613",
        help_text="Model name to use.",
    )
    n = models.IntegerField(
        null=True,
        blank=True,
        default=1,
        help_text="Number of chat completions to generate for each prompt.",
    )
    openai_api_base = models.CharField(
        null=True,
        blank=True,
        max_length=200,
        help_text="Base URL path for API requests, leave blank if not using a proxy or service emulator.",
    )
    openai_api_key = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        help_text="API key for OpenAI, automatically inferred from env var OPENAI_API_KEY if not provided.",
    )
    openai_organization = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        default="",
        help_text="Organization ID for OpenAI, automatically inferred from env var OPENAI_ORG_ID if not provided.",
    )
    openai_proxy = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        default="",
        help_text="Proxy settings for OpenAI API.",
    )
    request_timeout = models.FloatField(
        null=True,
        blank=True,
        help_text="Timeout for requests to OpenAI completion API. Can be float, httpx.Timeout or None.",
    )
    streaming = models.BooleanField(
        default=False, help_text="Whether to stream the results or not."
    )
    tags = models.JSONField(
        null=True, blank=True, help_text="Tags to add to the run trace."
    )
    temperature = models.FloatField(
        null=True, blank=True, default=0.7, help_text="Sampling temperature to use."
    )
    tiktoken_model_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Model name to pass to tiktoken. Use a different model name here in special cases.",
    )
    verbose = models.BooleanField(
        null=True,
        blank=True,
        default=False,
        help_text="Whether to print out response text.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def clean(self):
        # Add validation logic here
        if self.max_retries < 0:
            raise ValidationError("Max retries must be non-negative.")
        # More validation conditions can be added as needed
