from .base import *
import os
import openai


# used by django toolbar
INTERNAL_IPS = [
    # ...
    "127.0.0.1",
    # ...
]

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

openai.api_key = os.getenv("OPENAI_API_KEY")

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get(
            "DB_USER",
        ),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST"),
        "PORT": os.environ.get("DB_PORT"),
    }
}

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": "mydatabase",
#     }
# }


# # Explicitly set Trusted origins for Admin login
# CSRF_TRUSTED_ORIGINS = [DOMAIN_NAME]

# SSL Settings
SESSION_COOKIE_SAMESITE = False
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_DOMAIN = DOMAIN_NAME
SECURE_HSTS_SECONDS = 7776000
CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = [f"https://{DOMAIN_NAME}"]


# TODO: FIX this
CORS_ORIGIN_ALLOW_ALL = True

# CORS_ORIGIN_WHITELIST = (
#   'http://localhost:8000',
# )
# CORS_ALLOWED_ORIGINS = [
#     "https://example.com",
#     "https://sub.example.com",
#     "http://localhost:3080",
#     "http://127.0.0.1:3000",
#     "https://0.0.0.0",
#     "https://localhost",
# ]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = (
    "Authentication",
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)


# VECTOR_PERSIST_DIR = "src/data/vector_persist"
