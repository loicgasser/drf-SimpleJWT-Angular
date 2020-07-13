from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenCookieDeleteView

from rest_framework import routers
router = routers.DefaultRouter()
router.register('ping', views.PingViewSet, basename="ping")

urlpatterns = [
    path('api/token/access/', TokenRefreshView.as_view(), name='token_refresh'),  # token_refresh is the default view name
    path('api/token/both/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/delete/', TokenCookieDeleteView.as_view(), name='token_delete'),
    path('api/', include(router.urls))
]

"""
- For the first view, you send the refresh token to get a new access token.
- For the second view, you send the client credentials (username and password)
  to get BOTH a new access and refresh token.
"""
