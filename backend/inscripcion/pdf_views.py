from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
import io
from .models import Curso, Alumno, Inscripcion
from datetime import datetime

def generar_reporte_inscripciones_pdf(request):
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    
    pdf.setTitle("Reporte General de Inscripciones")
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(100, 750, "Sistema de Matriculación Escolar")
    pdf.setFont("Helvetica", 12)
    pdf.drawString(100, 730, "Reporte General de Inscripciones")
    
    cursos = Curso.objects.all()
    alumnos = Alumno.objects.all()
    inscripciones = Inscripcion.objects.all()
    
    y_position = 700
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(100, y_position, "Resumen General:")
    pdf.setFont("Helvetica", 10)
    
    y_position -= 20
    pdf.drawString(120, y_position, f"Total de Cursos: {cursos.count()}")
    y_position -= 15
    pdf.drawString(120, y_position, f"Total de Alumnos: {alumnos.count()}")
    y_position -= 15
    pdf.drawString(120, y_position, f"Total de Inscripciones: {inscripciones.count()}")
    y_position -= 15
    pdf.drawString(120, y_position, f"Fecha de generación: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    
    # Lista de cursos con detalles
    y_position -= 30
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(100, y_position, "Cursos Disponibles:")
    pdf.setFont("Helvetica", 10)
    
    for curso in cursos:
        y_position -= 15
        if y_position < 50:
            pdf.showPage()
            y_position = 750
            pdf.setFont("Helvetica", 10)
        
        inscripciones_curso = inscripciones.filter(curso=curso).count()
        cupos_disponibles = curso.cupos - inscripciones_curso
        pdf.drawString(120, y_position, f"- {curso.nombre} ({curso.codigo}): {inscripciones_curso} inscritos, {cupos_disponibles} cupos disponibles")
    
    pdf.save()
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_general_inscripciones.pdf"'
    return response

def generar_reporte_cursos_pdf(request):
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    
    pdf.setTitle("Reporte de Cursos")
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(100, 750, "Sistema de Matriculación Escolar")
    pdf.setFont("Helvetica", 12)
    pdf.drawString(100, 730, "Reporte de Cursos")
    
    cursos = Curso.objects.all()
    inscripciones = Inscripcion.objects.all()
    
    y_position = 700
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(100, y_position, "Lista de Cursos:")
    pdf.setFont("Helvetica", 10)
    
    for curso in cursos:
        y_position -= 20
        if y_position < 100:
            pdf.showPage()
            y_position = 750
            pdf.setFont("Helvetica", 10)
        
        inscripciones_curso = inscripciones.filter(curso=curso).count()
        cupos_disponibles = curso.cupos - inscripciones_curso
        estado = "Disponible" if cupos_disponibles > 0 else "Completo"
        
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(100, y_position, f"{curso.nombre} ({curso.codigo})")
        pdf.setFont("Helvetica", 10)
        y_position -= 15
        pdf.drawString(120, y_position, f"Cupos totales: {curso.cupos}")
        y_position -= 12
        pdf.drawString(120, y_position, f"Inscritos: {inscripciones_curso}")
        y_position -= 12
        pdf.drawString(120, y_position, f"Cupos disponibles: {cupos_disponibles}")
        y_position -= 12
        pdf.drawString(120, y_position, f"Estado: {estado}")
        y_position -= 12
        pdf.drawString(120, y_position, f"Fecha creación: {curso.fecha_creacion.strftime('%d/%m/%Y')}")
        y_position -= 10
    
    pdf.save()
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_cursos.pdf"'
    return response

def generar_reporte_alumnos_pdf(request):
    buffer = io.BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    
    pdf.setTitle("Reporte de Alumnos")
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(100, 750, "Sistema de Matriculación Escolar")
    pdf.setFont("Helvetica", 12)
    pdf.drawString(100, 730, "Reporte de Alumnos")
    
    alumnos = Alumno.objects.all()
    inscripciones = Inscripcion.objects.all()
    
    y_position = 700
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(100, y_position, "Lista de Alumnos:")
    pdf.setFont("Helvetica", 10)
    
    for alumno in alumnos:
        y_position -= 20
        if y_position < 100:
            pdf.showPage()
            y_position = 750
            pdf.setFont("Helvetica", 10)
        
        cursos_inscritos = inscripciones.filter(alumno=alumno)
        
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(100, y_position, f"{alumno.apellido}, {alumno.nombre}")
        pdf.setFont("Helvetica", 10)
        y_position -= 15
        pdf.drawString(120, y_position, f"CI: {alumno.ci}")
        y_position -= 12
        pdf.drawString(120, y_position, f"Cursos inscritos: {cursos_inscritos.count()}")
        y_position -= 12
        pdf.drawString(120, y_position, f"Fecha registro: {alumno.fecha_creacion.strftime('%d/%m/%Y')}")
        
        # Listar cursos si está inscrito
        if cursos_inscritos.exists():
            y_position -= 12
            pdf.drawString(120, y_position, "Cursos:")
            for insc in cursos_inscritos:
                y_position -= 12
                if y_position < 50:
                    pdf.showPage()
                    y_position = 750
                    pdf.setFont("Helvetica", 10)
                pdf.drawString(140, y_position, f"- {insc.curso.nombre} ({insc.curso.codigo})")
        
        y_position -= 15
    
    pdf.save()
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="reporte_alumnos.pdf"'
    return response
