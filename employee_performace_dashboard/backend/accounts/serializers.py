from rest_framework import serializers
from accounts.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "password"]

    def create(self, validated_data):
        # Extract password and role safely
        password = validated_data.pop("password")
        role = validated_data.pop("role", "employee")  # default role = employee

        # Create user instance
        user = User(**validated_data)
        user.set_password(password)   # hash the password
        user.role = role              # assign role
        user.save()
        return user


# ✅ Custom JWT Serializer to include role in the token
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["role"] = user.role
        token["username"] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Include role and username in the response body too
        data["role"] = self.user.role
        data["username"] = self.user.username
        return data
