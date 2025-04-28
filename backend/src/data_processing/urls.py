from django.urls import path, include
from data_processing import views
from rest_framework.routers import DefaultRouter


app_name = "data_processing"

router = DefaultRouter()
router.register("documents", views.DocumentProcessingViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

# # Create a router and register our viewsets with it.
# router = DefaultRouter()
# router.register(r"chat-models", views.ChatOpenAIViewSet)

# # router.register(r"users", views.UserViewSet)
# router.register(
#     r"chat-prompts",
#     views.ChatPromptTemplateViewSet,
# )

# create_docs = views.DocumentProcessing.as_view(
#     {
#         "post": "create",
#         # 'get': 'list',
#     }
# )


# process_store_document = views.DocumentProcessing.as_view(
#     {
#         "post": "process_store_document",
#         "get": "list",
#     }
# )
# retrieve_stored_document = views.DocumentProcessing.as_view(
#     {
#         "post": "retrieve_stored_document",
#     }
# )

# # The API URLs are now determined automatically by the router.
# urlpatterns = [
#     path("retrieve-stored-documents/", retrieve_stored_document),
#     path("process-store-documents/", process_store_document),
#     path("create-documents/", create_docs),
#     # path("process-document/", views.DocumentProcessing.as_view()),
# ]
