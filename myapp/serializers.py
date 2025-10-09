from rest_framework import serializers
from .models import Drama, Favorite

class DramaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Drama
        fields = ['id', 'title', 'description', 'genre', 'poster_url', 
                  'release_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
        
class FavoriteSerializer(serializers.ModelSerializer):
    drama = DramaSerializer(read_only=True)
    drama_id = serializers.PrimaryKeyRelatedField(
        queryset=Drama.objects.all(), source="drama", write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'drama', 'drama_id', 'added_at']
        read_only_fields = ['id', 'added_at']