from django.db import models


DEFAULT_SYSTEM_PROMPT = """

Always assist with care, respect, and truth. Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. Ensure replies promote fairness and positivity."""


DEFAULT_HUMAN_PROMPT = """
Classify the text into neutral, negative or positive.
Text: I think the vacation is okay.
Sentiment
"""


class ChatPromptTemplate(models.Model):
    owner = models.ForeignKey("auth.User", on_delete=models.RESTRICT)
    system_prompt = models.TextField(
        null=True,
        blank=True,
        default=DEFAULT_SYSTEM_PROMPT,
        help_text="System message prompt template",
    )
    human_prompt = models.TextField(
        null=False,
        default=DEFAULT_HUMAN_PROMPT,
        help_text="Human message prompt template.",
    )

    document_prompt = models.TextField(
        null=True,
        blank=True,
        help_text="Human message prompt template.",
    )

    ai_prompt = models.TextField(
        null=True, blank=True, help_text="	AI message prompt template."
    )
    ai_response = models.TextField(
        null=True, blank=True, help_text="	AI message response template."
    )

    # image_prompt = models.ImageField(

    # )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
