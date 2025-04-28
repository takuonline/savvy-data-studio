from channels.db import database_sync_to_async
import logging
from http.cookies import SimpleCookie
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)


@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class WebSocketJWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        headers = dict(scope["headers"])
        raw_str_cookies = headers.get(b"cookie", b"").decode("utf-8")

        cookie = SimpleCookie()
        cookie.load(raw_str_cookies)

        if "ACCESS_TOKEN" not in cookie:
            logger.error("No access token in cookie")
            return None

        token = cookie["ACCESS_TOKEN"].value

        try:
            access_token = AccessToken(token)
            scope["user"] = await get_user(access_token["user_id"])
        except TokenError:
            logger.error("TokenError")
            # scope["user"] = AnonymousUser()
            return None

        return await self.app(scope, receive, send)
