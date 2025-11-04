from django.contrib import admin
from .models import Curso, Alumno, Inscripcion

@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'codigo', 'cupos', 'fecha_creacion']
    search_fields = ['nombre', 'codigo']
    list_filter = ['fecha_creacion']

@admin.register(Alumno)
class AlumnoAdmin(admin.ModelAdmin):
    list_display = ['ci', 'nombre', 'apellido', 'fecha_creacion']
    search_fields = ['ci', 'nombre', 'apellido']
    list_filter = ['fecha_creacion']

@admin.register(Inscripcion)
class InscripcionAdmin(admin.ModelAdmin):
    list_display = ['alumno', 'curso', 'fecha_inscripcion']
    search_fields = ['alumno__nombre', 'alumno__apellido', 'curso__nombre']
    list_filter = ['fecha_inscripcion', 'curso']
