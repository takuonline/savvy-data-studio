from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers, status
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
import logging
from django.conf import settings
from django.middleware import csrf
from django.contrib.auth.models import User
# from drf_spectacular.extensions import OpenApiAuthenticationExtension
# from drf_spectacular.utils import OpenApiSecurityRequirement, OpenApiSecurityScheme

logger = logging.getLogger(__name__)


class TokenObtainPairResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

    def create(self, validated_data):
        raise NotImplementedError()

    def update(self, instance, validated_data):
        raise NotImplementedError()


class DecoratedTokenObtainPairView(TokenObtainPairView):
    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: TokenObtainPairResponseSerializer,
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            logger.error(e)
            raise InvalidToken(e.args[0])

        # user = User.objects.get(username=serializer.user.username)

        user = serializer.user

        refresh = RefreshToken.for_user(user)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        response.set_cookie(
            "ACCESS_TOKEN",
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
            value=str(refresh.access_token),
            httponly=True,
            secure=True,
            samesite="Lax",  # TODO: Change this to Lax
            path="/",
        )
        response.set_cookie(
            "REFRESH_TOKEN",
            max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="Lax",  # TODO: Change this to Lax
            path="/",
        )

        csrf.get_token(request)

        return response


class TokenRefreshResponseSerializer(serializers.Serializer):
    access = serializers.CharField()

    def create(self, validated_data):
        raise NotImplementedError()

    def update(self, instance, validated_data):
        raise NotImplementedError()


class DecoratedTokenRefreshView(TokenRefreshView):
    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: TokenObtainPairResponseSerializer,
        }
    )
    def post(self, request, *args, **kwargs):
        request.data["refresh"] = request.COOKIES.get("REFRESH_TOKEN")

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            logger.error(e)
            return Response(
                {"error": str(e.args[0])}, status=status.HTTP_400_BAD_REQUEST
            )

        # Assuming the serializer returns a new access token and possibly a new refresh token
        refresh = RefreshToken.for_user(request.user)

        response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        response.set_cookie(
            "ACCESS_TOKEN",
            value=str(serializer.validated_data["access"]),
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds(),
            httponly=True,
            secure=True,
            samesite="Lax",  # TODO: Change this to Lax
            path="/",
        )

        if "refresh" in serializer.validated_data:
            response.set_cookie(
                "REFRESH_TOKEN",
                value=str(serializer.validated_data["refresh"]),
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds(),
                httponly=True,
                secure=True,
                samesite="Lax",  # TODO: Change this to Lax
                path="/",
            )

        return response


class TokenVerifyResponseSerializer(serializers.Serializer):
    def create(self, validated_data):
        raise NotImplementedError()

    def update(self, instance, validated_data):
        raise NotImplementedError()


class TokenVerifyResponseSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, data):
        # Here you might want to include additional custom validations
        try:
            # This will check if the token is valid
            UntypedToken(data["token"])
        except TokenError as e:
            logger.error(f"Token verification failed: {str(e)}")
            raise serializers.ValidationError("Invalid token.")

        return data


class DecoratedTokenVerifyView(TokenVerifyView):
    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: TokenVerifyResponseSerializer,
        },
        request_body=TokenVerifyResponseSerializer,
    )
    def post(self, request, *args, **kwargs):
        request.data["token"] = request.COOKIES.get("ACCESS_TOKEN")

        serializer = TokenVerifyResponseSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except serializers.ValidationError as e:
            logger.error(f"Validation error during token verification: {str(e)}")
            return Response(
                {"error": "Invalid token", "details": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If the token is valid, return a success message or additional data as needed
        return Response({"message": "Token is valid."}, status=status.HTTP_200_OK)

        # class DecoratedTokenVerifyView(TokenVerifyView):
        #     @swagger_auto_schema(
        #         responses={
        #             status.HTTP_200_OK: TokenVerifyResponseSerializer,
        #         }
        #     )
        #     def post(self, request, *args, **kwargs):

        #         request.data["token"] = request.COOKIES.get('ACCESS_TOKEN')

        #         serializer = self.get_serializer(data= request.data
        #         )

        #         try:
        #             serializer.is_valid(raise_exception=True)
        #         except TokenError as e:
        #             logger.error(e)
        #             raise InvalidToken(e.args[0])

        #         user = request.user
        #         refresh = RefreshToken.for_user(user)

        #         response = Response(serializer.validated_data, status=status.HTTP_200_OK)
        #         response.set_cookie(
        #             'ACCESS_TOKEN',
        #                         max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),

        #             value=str(refresh.access_token),
        #             httponly=True,
        #             secure=True,

        #             samesite='None', #TODO: Change this to Lax
        #             path='/'
        #         )
        #         response.set_cookie(
        #             'REFRESH_TOKEN',
        #                         max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),

        #             value=str(refresh),
        #             httponly=True,
        #             secure=True,
        #             samesite='None', #TODO: Change this to Lax
        #             path='/'
        #         )

        # return response


class TokenBlacklistResponseSerializer(serializers.Serializer):
    def create(self, validated_data):
        raise NotImplementedError()

    def update(self, instance, validated_data):
        raise NotImplementedError()


class DecoratedTokenBlacklistView(TokenBlacklistView):
    @swagger_auto_schema(
        responses={
            status.HTTP_200_OK: TokenBlacklistResponseSerializer,
        }
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


# class CustomHttpOnlyJWTAuthenticationExtension(OpenApiAuthenticationExtension):
#     target_class = 'core.authentication.httponly_custom_jwt.CustomHttpOnlyJWTAuthentication'
#     name = 'CustomHttpOnlyJWT'

#     def get_security_definition(self, auto_schema):
#         return OpenApiSecurityScheme(
#             type=OpenApiSecurityScheme.TYPE_HTTP,
#             scheme='bearer',
#             bearer_format='JWT',
#             description='Enter JWT token only'
#         )

#     def get_security_requirements(self, auto_schema):
#         return [OpenApiSecurityRequirement({self.name: []})]
