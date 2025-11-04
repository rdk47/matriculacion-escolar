from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        print(f"Login attempt: {username}")  # Para debugging
        
        # Credenciales fijas para admin
        if username == 'admin' and password == 'password':
            # Crear o obtener usuario admin
            user, created = User.objects.get_or_create(
                username='admin',
                defaults={
                    'is_staff': True,
                    'is_superuser': True
                }
            )
            if created:
                user.set_password('password')
                user.save()
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'username': 'admin',
                    'is_admin': True
                }
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Credenciales inválidas. Use: admin / password'
        }, status=status.HTTP_401_UNAUTHORIZED)
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # Para debugging
        return Response({
            'error': f'Error en el servidor: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    return Response({
        'message': 'Logout exitoso'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def verify_token(request):
    return Response({
        'user': {
            'username': 'admin',
            'is_admin': True
        }
    }, status=status.HTTP_200_OK)
