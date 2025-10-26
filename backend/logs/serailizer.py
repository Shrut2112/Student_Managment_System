from rest_framework import serializers
from .models import LogDetails

class LogDetailsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    class Meta:
        model = LogDetails
        fields = '__all__'
        