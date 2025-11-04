import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'matriculacion.settings')
django.setup()

from inscripcion.models import Curso, Alumno

def poblar_datos():
    # Solo crear si no existen datos
    if Curso.objects.count() == 0:
        cursos = [
            {'nombre': 'Matemáticas Básicas', 'codigo': 'MATE-101', 'cupos': 30},
            {'nombre': 'Programación Python', 'codigo': 'PROG-201', 'cupos': 25},
            {'nombre': 'Base de Datos', 'codigo': 'BD-301', 'cupos': 20},
        ]
        
        for curso_data in cursos:
            Curso.objects.create(**curso_data)
        print("✅ Cursos de ejemplo creados")
    
    if Alumno.objects.count() == 0:
        alumnos = [
            {'ci': '12345678', 'nombre': 'Juan', 'apellido': 'Pérez'},
            {'ci': '87654321', 'nombre': 'María', 'apellido': 'Gómez'},
        ]
        
        for alumno_data in alumnos:
            Alumno.objects.create(**alumno_data)
        print("✅ Alumnos de ejemplo creados")

if __name__ == '__main__':
    poblar_datos()
