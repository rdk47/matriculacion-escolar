from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .pdf_views import generar_reporte_inscripciones_pdf, generar_reporte_cursos_pdf, generar_reporte_alumnos_pdf
from .auth_views import login_view, logout_view, verify_token

router = DefaultRouter()
router.register(r'cursos', views.CursoViewSet)
router.register(r'alumnos', views.AlumnoViewSet)
router.register(r'inscripciones', views.InscripcionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('reportes/general/', generar_reporte_inscripciones_pdf, name='reporte-general'),
    path('reportes/cursos/', generar_reporte_cursos_pdf, name='reporte-cursos'),
    path('reportes/alumnos/', generar_reporte_alumnos_pdf, name='reporte-alumnos'),
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/verify/', verify_token, name='verify-token'),
]
