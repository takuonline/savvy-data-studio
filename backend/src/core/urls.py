"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.conf import settings

from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework.routers import DefaultRouter
from django.conf.urls.static import static

from core import views

router = DefaultRouter()
router.register("", views.UserViewSet, basename="user")


urlpatterns = [
    # =====================================================================
    # Authentication
    # =====================================================================
    path("o/", include("oauth2_provider.urls", namespace="oauth2_provider")),
    path(
        "token/verify/",
        views.DecoratedTokenVerifyView.as_view(),
        name="token_verify",
    ),
    path(
        "token/",
        views.DecoratedTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "token/refresh/",
        views.DecoratedTokenRefreshView.as_view(),
        name="token_refresh",
    ),
    # =====================================================================
    # Swagger API
    # =====================================================================
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "v1/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(
            url_name="schema",
        ),
        name="swagger-ui",
    ),
    path(
        "v1/schema/redoc/",
        SpectacularRedocView.as_view(
            url_name="schema",
        ),
        name="redoc",
    ),
    # =====================================================================
    # Node graphs
    # =====================================================================
    path(
        "v1/node-graph/",
        include(
            "node_graph.urls",
        ),
    ),
    # =====================================================================
    # Data processing
    # =====================================================================
    path(
        "v1/",
        include(
            "data_processing.urls",
        ),
    ),
    # =====================================================================
    # Monitoring
    # =====================================================================
    path(
        "v1/",
       include('django_prometheus.urls')
    ),



    # =====================================================================
    # Misc
    # =====================================================================
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("users/", include(router.urls)),
]


if settings.DEBUG:
    urlpatterns.append(path("__debug__/", include("debug_toolbar.urls")))

urlpatterns = [
    path(settings.URL_PREFIX, include(urlpatterns)),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
