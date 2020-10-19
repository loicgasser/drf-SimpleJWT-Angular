from rest_framework import status
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class PingViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):
    """
    Helpful class for internal health checks
    for when your server deploys. Typical of AWS
    applications behind ALB which does default 30
    second ping/health checks.
    """
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        return Response(
            data={"id": request.GET.get("id")},
            status=status.HTTP_200_OK
        )

    def create(self, request, *args, **kwargs):
        return Response(request.data, status=status.HTTP_201_CREATED)
