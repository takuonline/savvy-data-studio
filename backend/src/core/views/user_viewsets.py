from rest_framework import permissions, status
from django.contrib.auth.models import User
from core.serializers import UserSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, viewsets
from rest_framework.decorators import action
from http import HTTPMethod


class UserViewSet(
    viewsets.ReadOnlyModelViewSet,
    generics.CreateAPIView,
    generics.UpdateAPIView,
    generics.ListCreateAPIView,
):
    """
    This viewset automatically provides `list` and `retrieve` actions.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        user = User.objects.get(pk=serializer.data["id"])

        refresh = RefreshToken.for_user(user)
        results_data = {
            "token": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            **dict(serializer.data),
        }

        return Response(results_data, status=status.HTTP_201_CREATED, headers=headers)

    @action(
        detail=False,
        methods=[HTTPMethod.GET],
        permission_classes=[permissions.IsAuthenticated],
    )
    def me(self, request, pk=None):
        """Get current user.

        Returns the details of the current authenticated user.
        Accessible at /users/me/.

        """
        user = self.request.user
        serializer = self.get_serializer(user)

        return Response({**serializer.data})

    @action(detail=False, methods=[HTTPMethod.GET])
    def logout(self, request, pk=None):
        """Get current user.

        Returns the details of the current authenticated user.
        Accessible at /users/me/.

        """
        response = Response({"detail": "Logged out"})
        response.delete_cookie("ACCESS_TOKEN")
        response.delete_cookie("REFRESH_TOKEN")

        return response


# class UserUpdateView():
#     """
#     This viewset automatically provides `list` and `retrieve` actions.
#     """

#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     permission_classes = [permissions.IsAuthenticated]


# class UserListView(generics.ListCreateAPIView):
#     """
#     This viewset automatically provides `list` and `retrieve` actions.
#     """

#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     permission_classes = [permissions.IsAdminUser]
