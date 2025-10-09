from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Drama(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    release_date = models.DateField()
    genre = models.CharField(max_length=100)
    poster_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} <{self.release_date}>: {self.description}"
    
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    drama = models.ForeignKey('Drama', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'drama')

    def __str__(self):
        return f"{self.user.username} -> {self.drama.title}"