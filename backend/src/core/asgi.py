"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

django_asgi_app = get_asgi_application()

from node_graph import routing as node_graph_routing
from core.authentication import WebSocketJWTAuthMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        # "websocket": AllowedHostsOriginValidator(
        #     AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns))
        # ),
        "websocket": WebSocketJWTAuthMiddleware(
            URLRouter(node_graph_routing.websocket_urlpatterns)
        ),
    }
)
