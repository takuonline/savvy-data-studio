class LoginView:
    pass


#     permission_classes = (permissions.AllowAny,)

#     authentication_classes = [BasicAuthentication]
# def post(self, request, *args, **kwargs):
#     username = request.data.get("username")
#     password = request.data.get("password")
#     user = authenticate(username=username, password=password)
#     if user is not None:
#         return Response({
#             "user": UserSerializer(user, context=self.get_serializer_context()).data,
#             "token": AuthToken.objects.create(user)[1]
#         })
#     else:
#         return Response({"error": "Invalid credentials"})
