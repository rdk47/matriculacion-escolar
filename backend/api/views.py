"""
Vistas de la API para el sistema de matriculación.
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def health_check(request):
    """
    Vista para verificar que el backend está funcionando correctamente.
    """
    return Response({
        'status': 'success',
        'message': 'Backend Django funcionando correctamente',
        'service': 'Sistema de Matriculación Escolar'
    }, status=status.HTTP_200_OK)
