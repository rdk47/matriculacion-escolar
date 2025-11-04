from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        'message': 'Backend Django funcionando correctamente',
        'endpoints': {
            'admin': '/admin/',
            'api_health': '/api/health/',
            'inscripcion_api': '/api/inscripcion/'
        }
    })

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/inscripcion/', include('inscripcion.urls')),
]
