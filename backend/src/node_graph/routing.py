from django.urls import re_path

from node_graph.consumers.chat_consumer import ChatConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
import json


class DummyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("DummyConsumer: New connection accepted.")
        await self.accept()
        print("DummyConsumer: New connection accepted.")

    async def disconnect(self, close_code):
        print(f"DummyConsumer: Connection closed with code {close_code}.")

    async def receive(self, text_data):
        print(f"DummyConsumer: Received message: {text_data}")
        await self.send(text_data=json.dumps({"message": "This is a dummy response"}))


websocket_urlpatterns = [
    re_path(r"ws/chat/$", DummyConsumer.as_asgi()),
    re_path(
        r"^ws/conversation/(?P<conversation_id>[^/]+)/?$", ChatConsumer.as_asgi()
    ),
]
