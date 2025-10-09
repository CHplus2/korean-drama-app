from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import DramaListCreate, DramaDetail, FavoriteViewSet, index, tmdb_search, signup_view, login_view, logout_view, check_auth

router = DefaultRouter()
router.register(r"favorites", FavoriteViewSet, basename="favorite")
urlpatterns = [
    path('', index, name='index'),
    path('api/tmdb_search/', tmdb_search, name="tmdb-search"),
    path('api/dramas/', DramaListCreate.as_view(), name='drama-list'),
    path('api/dramas/<int:pk>/', DramaDetail.as_view(), name='drama-detail'),
    path('api/signup/', signup_view, name="signup"),
    path('api/login/', login_view, name="login"),
    path('api/logout/', logout_view, name="logout"),
    path('api/check-auth/', check_auth, name="check_auth")
] + router.urls