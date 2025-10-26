from rest_framework import serializers
from .models import Department
from Instructor.serializer import InstSerializer


class DeptSerializer(serializers.ModelSerializer):
    hod_first_name = serializers.CharField(source="hod.user.first_name",read_only=True)
    hod_last_name = serializers.CharField(source="hod.user.last_name",read_only=True)
    class Meta:
        model = Department
        fields = ["dept_name","det_id", "hod","n_student", "n_instructor",'hod_first_name','hod_last_name']
        read_only_fields = ["n_student", "n_instructor"]
    