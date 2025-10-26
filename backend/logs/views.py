from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import LogDetails
from .serailizer import LogDetailsSerializer
# Create your views here.
class ActivityLog(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        logs = LogDetails.objects.all().order_by('-timestamp')[:50]
        seralizer = LogDetailsSerializer(logs,many=True)
        return Response(seralizer.data)
    
