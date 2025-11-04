from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Curso, Alumno, Inscripcion
from .serializers import CursoSerializer, AlumnoSerializer, InscripcionSerializer

class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

class AlumnoViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer

    @action(detail=False, methods=['get'])
    def buscar_por_ci(self, request):
        ci = request.query_params.get('ci', '')
        if ci:
            alumnos = Alumno.objects.filter(ci__icontains=ci)
            serializer = self.get_serializer(alumnos, many=True)
            return Response(serializer.data)
        return Response([])

class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer

    def create(self, request, *args, **kwargs):
        alumno_id = request.data.get('alumno')
        curso_id = request.data.get('curso')
        
        # Verificar si el alumno existe
        try:
            alumno = Alumno.objects.get(id=alumno_id)
        except Alumno.DoesNotExist:
            return Response(
                {'error': 'El alumno no existe'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si el curso existe
        try:
            curso = Curso.objects.get(id=curso_id)
        except Curso.DoesNotExist:
            return Response(
                {'error': 'El curso no existe'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar si ya existe la inscripción
        if Inscripcion.objects.filter(alumno_id=alumno_id, curso_id=curso_id).exists():
            return Response(
                {'error': 'El alumno ya está inscrito en este curso'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar cupos disponibles
        inscripciones_curso = Inscripcion.objects.filter(curso_id=curso_id).count()
        if inscripciones_curso >= curso.cupos:
            return Response(
                {'error': 'No hay cupos disponibles en este curso'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)
