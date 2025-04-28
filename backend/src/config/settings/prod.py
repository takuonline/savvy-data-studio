from .base import *

DEBUG = False


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


# SSL Settings
SESSION_COOKIE_SAMESITE = False
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_DOMAIN = DOMAIN_NAME
SECURE_HSTS_SECONDS = 7776000
CSRF_COOKIE_SECURE = True
CSRF_TRUSTED_ORIGINS = [f"https://{DOMAIN_NAME}"]

# https://stackoverflow.com/questions/62047354/build-absolute-uri-with-https-behind-reverse-proxy
USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
