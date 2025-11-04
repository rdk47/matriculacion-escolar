from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/inscripcion/', include('inscripcion.urls')),  # Nuevas URLs de inscripcion
]
