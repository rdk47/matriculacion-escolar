from rest_framework import serializers
from .models import Curso, Alumno, Inscripcion

class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = ['id', 'nombre', 'codigo', 'cupos', 'fecha_creacion', 'fecha_actualizacion']

class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = ['id', 'ci', 'nombre', 'apellido', 'fecha_creacion', 'fecha_actualizacion']

class InscripcionSerializer(serializers.ModelSerializer):
    alumno_nombre = serializers.CharField(source='alumno.nombre', read_only=True)
    alumno_apellido = serializers.CharField(source='alumno.apellido', read_only=True)
    curso_nombre = serializers.CharField(source='curso.nombre', read_only=True)
    curso_codigo = serializers.CharField(source='curso.codigo', read_only=True)

    class Meta:
        model = Inscripcion
        fields = [
            'id', 'alumno', 'curso', 'fecha_inscripcion',
            'alumno_nombre', 'alumno_apellido', 'curso_nombre', 'curso_codigo'
        ]
