from .base import *
from .tracing import configure_tracing
import os

DEBUG = False

configure_tracing()


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

CORS_ALLOWED_ORIGINS = [
    "https://data-studio.takuonline.com",
    f"https://{DOMAIN_NAME}",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]


# SSL Settings
SESSION_COOKIE_SAMESITE = False
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_DOMAIN = DOMAIN_NAME
SECURE_HSTS_SECONDS = 7776000
CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = [f"https://{DOMAIN_NAME}", "https://data-studio.takuonline.com"]

# https://stackoverflow.com/questions/62047354/build-absolute-uri-with-https-behind-reverse-proxy
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
