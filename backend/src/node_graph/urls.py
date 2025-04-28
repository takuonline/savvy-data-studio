from django.urls import path, include
from rest_framework.routers import DefaultRouter
from node_graph import views


app_name = "node_graph"

# Initialize the router and register viewsets
router = DefaultRouter()
router.register("chat-models", views.ChatOpenAIViewSet)
router.register("chat-prompts", views.ChatPromptTemplateViewSet)
router.register("node-graphs", views.NodeGraphViewSet)  # Use plural form for resources
router.register(
    "api-services", views.LLMServiceKeysViewSet
)  # Use plural form for resources


urlpatterns = [
    # Additional paths for custom actions or views not covered by the router
    path("query-model/", views.QueryChatModelView.as_view()),
    path(
        "vector-db/generate/",
        views.QueryVectorDbView.as_view({"post": "create", "get": "list"}),
        name="generate_vector_db",
    ),
    path(
        "vector-db/search/",
        views.QueryVectorDbView.as_view({"post": "search_db"}),
        name="search_vector_db",
    ),
    # Include the router's URLs
    path("", include(router.urls)),
]


# # Create a router and register our viewsets with it.
# router = DefaultRouter()

# router.register(
#     r"chat-models",
#     views.ChatOpenAIViewSet)

# router.register(
#     r"chat-prompts",
#     views.ChatPromptTemplateViewSet,
# )
# router.register(
#     r"node-graph",
#     views.NodeGraphViewSet,
# )

# generate_vector_db = views.QueryVectorDbView.as_view(
#     {
#         "post": "create",
#         "get": "list",
#     }
# )

# search_vector_db = views.QueryVectorDbView.as_view(
#     {
#         "post": "search_db",
#     }
# )


# # The API URLs are now determined automatically by the router.
# urlpatterns = [
#     # path('chat_prompt/', views.ChatPromptTemplateView.as_view(),),
#     path("query-model/", views.QueryChatModelView.as_view()),
#     path("generate-vector-db/", generate_vector_db),
#     path("search-vector-db/", search_vector_db),
#     # path("query-vector-db/", views.QueryVectorDbView.as_view()),
#     # path('query-vector-db/', views.QueryVectorDbView.as_view({'post': 'query_db'})),
#     path("", include(router.urls)),
# ]
