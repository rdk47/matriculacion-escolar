"""
Configuración WSGI para el proyecto matriculacion.
"""
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'matriculacion.settings')

application = get_wsgi_application()
