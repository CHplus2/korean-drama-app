from django.shortcuts import render
from rest_framework import generics, viewsets, permissions, status
from .models import Drama, Favorite
from .serializers import DramaSerializer, FavoriteSerializer

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

import os, requests
from django.http import JsonResponse

from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@method_decorator(csrf_protect, name='dispatch')
class DramaListCreate(generics.ListCreateAPIView):
    queryset = Drama.objects.all().order_by('-created_at')
    serializer_class = DramaSerializer

class DramaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Drama.objects.all()
    serializer_class = DramaSerializer

class FavoriteViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related("drama")
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        drama_id = request.data.get("drama_id")
        if not drama_id:
            return Response({"detail": "drama_id is required"}, status=400)
        
        try:
            drama = Drama.objects.get(pk=drama_id)
        except Drama.DoesNotExist:
            return Response({"detail": "Drama not found"}, status=404)
        
        favorite, created = Favorite.objects.get_or_create(user=request.user, drama=drama)
        if not created:
            return Response({"detail": "Already favorited"}, status=200)
        
        return Response(FavoriteSerializer(favorite).data, status=201)
    
    def destroy(self, request, pk=None):
        try:
            favorite = Favorite.objects.get(pk=pk)
        except Favorite.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)
        
        favorite.delete()
        return Response({"detail": "Favorite removed"}, status=200)

def index(request):
    return render(request, 'frontend.html')

def tmdb_search(request):
    title = request.GET.get("title", "")
    api_key = os.getenv("TMDB_API_KEY")

    if not title: 
        return JsonResponse({"error": "Missing title parameter"}, status=400)
    
    tmdb_url = (f"https://api.themoviedb.org/3/search/tv?"
                f"api_key={api_key}&query={title}&language=ko&region=KR"
    )
    
    res = requests.get(tmdb_url)
    return JsonResponse(res.json())

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")

        if not username or not password or not confirm_password:
            return JsonResponse({"error": "Missing username or password"}, status=400)
        
        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already exists"}, status=400)

        # create user
        user = User.objects.create_user(username=username, password=password)
        user.save()

        # automatically log them in after sign-up
        login(request, user)

        return JsonResponse({"message": "User created and logged in successfully"}, status=201)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)

    if user:
        login(request, user)
        return Response({"message": "Logged in"})
    else: 
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

def logout_view(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"})

def check_auth(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "authenticated": True,
            "username": request.user.username
        })
    return JsonResponse({"authenticated": False})