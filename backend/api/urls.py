"""
URLs de la API.
"""
from django.urls import path
from . import views

urlpatterns = [
    # Ruta para verificar el estado del backend
    path('health/', views.health_check, name='health-check'),
]
