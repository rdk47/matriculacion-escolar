import React, { useState, useEffect } from "react";
import axios from "axios";

// Configuración de la API
const API_BASE = 'https://matriculacion-escolar-ulqn.onrender.com/api';

// Configurar axios base URL
axios.defaults.baseURL = API_BASE;

// Interfaces TypeScript
interface Curso {
  id: number;
  nombre: string;
  codigo: string;
  cupos: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

interface Alumno {
  id: number;
  ci: string;
  nombre: string;
  apellido: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

interface Inscripcion {
  id: number;
  alumno: number;
  curso: number;
  fecha_inscripcion: string;
  alumno_nombre?: string;
  alumno_apellido?: string;
  curso_nombre?: string;
  curso_codigo?: string;
}

// Estilos
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "30px",
    padding: "20px",
    background: "linear-gradient(135deg, #3498db, #2980b9)",
    color: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  loginContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
  loginBox: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  tabs: {
    display: "flex",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "30px",
  },
  tab: {
    flex: 1,
    padding: "15px 0",
    textAlign: "center" as const,
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "600",
    fontSize: "1.1rem",
    borderBottom: "3px solid transparent",
  },
  tabActive: {
    borderBottom: "3px solid #3498db",
    color: "#3498db",
  },
  tabContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
    gap: "10px",
  },
  btn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  btnPrimary: {
    backgroundColor: "#3498db",
    color: "white",
  },
  btnSuccess: {
    backgroundColor: "#2ecc71",
    color: "white",
  },
  btnDanger: {
    backgroundColor: "#e74c3c",
    color: "white",
  },
  btnWarning: {
    backgroundColor: "#f39c12",
    color: "white",
  },
  cursosGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  cursoCard: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative" as const,
  },
  cursoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  cursoStatus: {
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  statusAvailable: {
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    color: "#2ecc71",
  },
  statusFull: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    color: "#e74c3c",
  },
  cupoDisponible: {
    color: "#2ecc71",
    fontWeight: "600",
    margin: "15px 0",
  },
  cupoLleno: {
    color: "#e74c3c",
    fontWeight: "600",
    margin: "15px 0",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  select: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: "white",
  },
  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    alignItems: "flex-end",
  },
  alumnosList: {
    marginTop: "20px",
  },
  alumnoItem: {
    padding: "15px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alumnoCurso: {
    color: "#3498db",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px",
    color: "#7f8c8d",
  },
  alert: {
    padding: "12px 15px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontWeight: "600",
  },
  alertSuccess: {
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    color: "#2ecc71",
    borderLeft: "4px solid #2ecc71",
  },
  alertError: {
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    color: "#e74c3c",
    borderLeft: "4px solid #e74c3c",
  },
  modal: {
    position: "fixed" as const,
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto" as const,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#7f8c8d",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#ecf0f1",
    borderRadius: "4px",
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  selectionCard: {
    border: "2px solid #3498db",
    borderRadius: "8px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
  },
  selectedInfo: {
    backgroundColor: "#e8f4fd",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #3498db",
  },
};

function App() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [tabActiva, setTabActiva] = useState("cursos");
  const [mensaje, setMensaje] = useState<{tipo: string, texto: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);
  const [editando, setEditando] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [searchCI, setSearchCI] = useState("");
  const [alumnosFiltrados, setAlumnosFiltrados] = useState<Alumno[]>([]);

  // Estados para la inscripción
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [busquedaInscripcion, setBusquedaInscripcion] = useState("");

  // Cargar datos del backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      cargarDatos();
    }
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [cursosRes, alumnosRes, inscripcionesRes] = await Promise.all([
        axios.get("/inscripcion/cursos/"),
        axios.get("/inscripcion/alumnos/"),
        axios.get("/inscripcion/inscripciones/")
      ]);

      setCursos(cursosRes.data);
      setAlumnos(alumnosRes.data);
      setInscripciones(inscripcionesRes.data);
      setAlumnosFiltrados(alumnosRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setMensaje({
        tipo: "error",
        texto: "Error conectando con el servidor"
      });
    } finally {
      setLoading(false);
    }
  };

  // Función de login CORREGIDA
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Login attempt to:', `${API_BASE}/inscripcion/auth/login/`);
      
      const response = await axios.post("/inscripcion/auth/login/", loginData);
      console.log('Login response:', response.data);
      
      // El backend responde con JWT
      if (response.data.access) {
        const token = response.data.access;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
        setMensaje({ tipo: "success", texto: "Login exitoso" });
        cargarDatos();
      } else {
        setMensaje({ tipo: "error", texto: "Respuesta inesperada del servidor" });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error details:', error.response?.data);
      
      if (error.response?.status === 404) {
        setMensaje({ tipo: "error", texto: "Endpoint no encontrado. Verifica la URL del backend." });
      } else if (error.response?.status === 401) {
        setMensaje({ tipo: "error", texto: "Credenciales inválidas. Usa: admin / password" });
      } else {
        setMensaje({ tipo: "error", texto: `Error: ${error.response?.data?.error || error.message}` });
      }
    }
  };

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setMensaje({ tipo: "success", texto: "Sesión cerrada" });
  };

  // Función de búsqueda por CI
  const buscarPorCI = async () => {
    if (!searchCI.trim()) {
      setAlumnosFiltrados(alumnos);
      return;
    }

    try {
      const response = await axios.get(`/api/inscripcion/alumnos/buscar_por_ci/?ci=${searchCI}`);
      setAlumnosFiltrados(response.data);
    } catch (error) {
      console.error("Error buscando alumnos:", error);
      setMensaje({ tipo: "error", texto: "Error en la búsqueda" });
    }
  };

  // Filtrar alumnos para inscripción
  const alumnosParaInscripcion = alumnos.filter(alumno => 
    alumno.ci.toLowerCase().includes(busquedaInscripcion.toLowerCase()) ||
    alumno.nombre.toLowerCase().includes(busquedaInscripcion.toLowerCase()) ||
    alumno.apellido.toLowerCase().includes(busquedaInscripcion.toLowerCase())
  );

  // Filtrar cursos con cupos disponibles
  const cursosConCupos = cursos.filter(curso => {
    const inscripcionesCurso = inscripciones.filter(insc => insc.curso === curso.id).length;
    return inscripcionesCurso < curso.cupos;
  });

  const cambiarTab = (tab: string) => {
    setTabActiva(tab);
    // Resetear selecciones al cambiar de pestaña
    if (tab !== "inscripcion") {
      setAlumnoSeleccionado(null);
      setCursoSeleccionado(null);
      setBusquedaInscripcion("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const abrirModal = (tipo: string, item?: any) => {
    setModalAbierto(tipo);
    if (item) {
      setEditando(item);
      if (tipo === 'curso') {
        setFormData({
          cursoNombre: item.nombre,
          cursoCodigo: item.codigo,
          cursoCupos: item.cupos.toString(),
          ci: "", nombre: "", apellido: "", cursoId: ""
        });
      } else if (tipo === 'alumno') {
        setFormData({
          ci: item.ci,
          nombre: item.nombre,
          apellido: item.apellido,
          cursoNombre: "", cursoCodigo: "", cursoCupos: "30", cursoId: ""
        });
      }
    } else {
      setEditando(null);
      setFormData({
        ci: "", nombre: "", apellido: "", cursoId: "",
        cursoNombre: "", cursoCodigo: "", cursoCupos: "30"
      });
    }
  };

  const cerrarModal = () => {
    setModalAbierto(null);
    setEditando(null);
  };

  // Estados del formulario (para modales)
  const [formData, setFormData] = useState({
    ci: "",
    nombre: "",
    apellido: "",
    cursoId: "",
    cursoNombre: "",
    cursoCodigo: "",
    cursoCupos: "30",
  });

  // Funciones CRUD para Cursos
  const crearCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/inscripcion/cursos/", {
        nombre: formData.cursoNombre,
        codigo: formData.cursoCodigo,
        cupos: parseInt(formData.cursoCupos)
      });
      setMensaje({ tipo: "success", texto: "Curso creado exitosamente" });
      cerrarModal();
      cargarDatos();
    } catch (error: any) {
      setMensaje({ tipo: "error", texto: error.response?.data?.error || "Error al crear curso" });
    }
  };

  const editarCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/inscripcion/cursos/${editando.id}/`, {
        nombre: formData.cursoNombre,
        codigo: formData.cursoCodigo,
        cupos: parseInt(formData.cursoCupos)
      });
      setMensaje({ tipo: "success", texto: "Curso actualizado exitosamente" });
      cerrarModal();
      cargarDatos();
    } catch (error: any) {
      setMensaje({ tipo: "error", texto: error.response?.data?.error || "Error al actualizar curso" });
    }
  };

  const eliminarCurso = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este curso?")) {
      try {
        await axios.delete(`/api/inscripcion/cursos/${id}/`);
        setMensaje({ tipo: "success", texto: "Curso eliminado exitosamente" });
        cargarDatos();
      } catch (error: any) {
        setMensaje({ tipo: "error", texto: error.response?.data?.error || "Error al eliminar curso" });
      }
    }
  };

  // Funciones CRUD para Alumnos
  const crearAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/inscripcion/alumnos/", {
        ci: formData.ci,
        nombre: formData.nombre,
        apellido: formData.apellido
      });
      setMensaje({ tipo: "success", texto: "Alumno creado exitosamente" });
      cerrarModal();
      cargarDatos();
    } catch (error: any) {
      setMensaje({ tipo: "error", texto: error.response?.data?.error || "Error al crear alumno" });
    }
  };

  const editarAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/api/inscripcion/alumnos/${editando.id}/`, {
        ci: formData.ci,
        nombre: formData.nombre,
        apellido: formData.apellido
      });
      setMensaje({ tipo: "success", texto: "Alumno actualizado exitosamente" });
      cerrarModal();
      cargarDatos();
    } catch (error: any) {
      setMensaje({ tipo: "error", texto: error.response?.data?.error || "Error al actualizar alumno" });
    }
  };

  const eliminarAlumno = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este alumno?")) {
      try {
        await axios.delete(`/api/inscripcion/alumnos/${id}/`);
        setMensaje({ tipo: "success", texto: "Alumno eliminado exitosamente" });
        cargarDatos();
      } catch (error: any) {
        setMensaje({ tipo: "error", texto: error.response?.data?.error || "Error al eliminar alumno" });
      }
    }
  };

  // Función para inscripción con alumnos y cursos existentes
  const realizarInscripcion = async () => {
    if (!alumnoSeleccionado || !cursoSeleccionado) {
      setMensaje({ tipo: "error", texto: "Debe seleccionar un alumno y un curso" });
      return;
    }

    try {
      await axios.post("/api/inscripcion/inscripciones/", {
        alumno: alumnoSeleccionado.id,
        curso: cursoSeleccionado.id
      });

      setMensaje({ 
        tipo: "success", 
        texto: `Alumno ${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido} inscrito exitosamente en ${cursoSeleccionado.nombre}` 
      });
      
      // Limpiar selecciones
      setAlumnoSeleccionado(null);
      setCursoSeleccionado(null);
      setBusquedaInscripcion("");
      
      // Recargar datos
      cargarDatos();
    } catch (error: any) {
      console.error("Error en inscripción:", error);
      setMensaje({ 
        tipo: "error", 
        texto: error.response?.data?.error || "Error al realizar la inscripción" 
      });
    }
  };

  // Funciones para generar reportes PDF
  const generarReporte = async (tipo: string) => {
    try {
      const response = await axios.get(`/api/inscripcion/reportes/${tipo}/`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${tipo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMensaje({ tipo: "success", texto: `Reporte de ${tipo} generado exitosamente` });
    } catch (error) {
      setMensaje({ tipo: "error", texto: `Error al generar reporte de ${tipo}` });
    }
  };

  // Calcular inscripciones por curso
  const getInscripcionesPorCurso = (cursoId: number) => {
    return inscripciones.filter(insc => insc.curso === cursoId).length;
  };

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.loginContainer}>
          <div style={styles.loginBox}>
            <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Sistema de Matriculación</h2>
            <form onSubmit={handleLogin}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="username">Usuario</label>
                <input
                  style={styles.input}
                  type="text"
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="admin"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="password">Contraseña</label>
                <input
                  style={styles.input}
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="password"
                  required
                />
              </div>
              <button type="submit" style={{...styles.btn, ...styles.btnPrimary, width: '100%'}}>
                Iniciar Sesión
              </button>
            </form>
            <div style={{marginTop: '20px', textAlign: 'center', color: '#7f8c8d'}}>
              <p>Usuario: <strong>admin</strong></p>
              <p>Contraseña: <strong>password</strong></p>
              <p style={{marginTop: '10px', fontSize: '0.8rem'}}>
                Backend: {API_BASE}
              </p>
            </div>
          </div>
        </div>

        {mensaje && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            ...styles.alert,
            ...(mensaje.tipo === "success" ? styles.alertSuccess : styles.alertError)
          }}>
            {mensaje.texto}
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{textAlign: 'center', padding: '40px'}}>
          <h2>Cargando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Sistema de Matriculación Escolar</h1>
        <p>Gestiona cursos, alumnos e inscripciones</p>
        <div style={styles.userInfo}>
          <span>Bienvenido, <strong>admin</strong></span>
          <button style={{...styles.btn, ...styles.btnDanger}} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div style={styles.tabs}>
        <div style={{...styles.tab, ...(tabActiva === "cursos" ? styles.tabActive : {})}} onClick={() => cambiarTab("cursos")}>
          Cursos
        </div>
        <div style={{...styles.tab, ...(tabActiva === "alumnos" ? styles.tabActive : {})}} onClick={() => cambiarTab("alumnos")}>
          Alumnos
        </div>
        <div style={{...styles.tab, ...(tabActiva === "inscripcion" ? styles.tabActive : {})}} onClick={() => cambiarTab("inscripcion")}>
          Inscripción
        </div>
      </div>

      {/* Pestaña Cursos */}
      {tabActiva === "cursos" && (
        <div style={styles.tabContent}>
          <div style={styles.actionBar}>
            <h2>Cursos Disponibles</h2>
            <div style={{display: 'flex', gap: '10px'}}>
              <button style={{...styles.btn, ...styles.btnSuccess}} onClick={() => abrirModal('curso')}>
                + Nuevo Curso
              </button>
              <button style={{...styles.btn, ...styles.btnPrimary}} onClick={() => generarReporte('cursos')}>
                📊 Reporte Cursos
              </button>
            </div>
          </div>

          <div style={styles.cursosGrid}>
            {cursos.map((curso) => {
              const inscripcionesCurso = getInscripcionesPorCurso(curso.id);
              const cuposDisponibles = curso.cupos - inscripcionesCurso;
              const tieneCupo = cuposDisponibles > 0;

              return (
                <div key={curso.id} style={styles.cursoCard}>
                  <div style={styles.cursoHeader}>
                    <h3>{curso.nombre}</h3>
                    <span style={{...styles.cursoStatus, ...(tieneCupo ? styles.statusAvailable : styles.statusFull)}}>
                      {tieneCupo ? "Disponible" : "Sin cupo"}
                    </span>
                  </div>
                  <p><strong>Código:</strong> {curso.codigo}</p>
                  <div style={tieneCupo ? styles.cupoDisponible : styles.cupoLleno}>
                    {tieneCupo ? `Cupos disponibles: ${cuposDisponibles}/${curso.cupos}` : "No hay cupos disponibles"}
                  </div>
                  <p><strong>Inscritos:</strong> {inscripcionesCurso}</p>
                  <p><strong>Actualizado:</strong> {new Date(curso.fecha_actualizacion).toLocaleDateString()}</p>
                  
                  <div style={styles.cardActions}>
                    <button style={{...styles.btn, ...styles.btnPrimary}} onClick={() => abrirModal('curso', curso)}>
                      Editar
                    </button>
                    <button style={{...styles.btn, ...styles.btnDanger}} onClick={() => eliminarCurso(curso.id)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pestaña Alumnos */}
      {tabActiva === "alumnos" && (
        <div style={styles.tabContent}>
          <div style={styles.actionBar}>
            <h2>Alumnos Registrados</h2>
            <div style={{display: 'flex', gap: '10px'}}>
              <button style={{...styles.btn, ...styles.btnSuccess}} onClick={() => abrirModal('alumno')}>
                + Nuevo Alumno
              </button>
              <button style={{...styles.btn, ...styles.btnPrimary}} onClick={() => generarReporte('alumnos')}>
                📊 Reporte Alumnos
              </button>
              <button style={{...styles.btn, ...styles.btnWarning}} onClick={() => generarReporte('general')}>
                📋 Reporte General
              </button>
            </div>
          </div>

          {/* Búsqueda por CI */}
          <div style={styles.searchBox}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="searchCI">Buscar por Cédula</label>
              <input
                style={styles.input}
                type="text"
                id="searchCI"
                value={searchCI}
                onChange={(e) => setSearchCI(e.target.value)}
                placeholder="Ingrese CI del alumno"
              />
            </div>
            <button style={{...styles.btn, ...styles.btnPrimary}} onClick={buscarPorCI}>
              🔍 Buscar
            </button>
            <button style={{...styles.btn, ...styles.btnWarning}} onClick={() => {
              setSearchCI("");
              setAlumnosFiltrados(alumnos);
            }}>
              🔄 Limpiar
            </button>
          </div>

          <div style={styles.alumnosList}>
            {alumnosFiltrados.length === 0 ? (
              <div style={styles.emptyState}>
                <span role="img" aria-label="books">📚</span>
                <h3>No se encontraron alumnos</h3>
                <p>{searchCI ? "No hay alumnos con ese CI" : "Los alumnos aparecerán aquí una vez que se registren."}</p>
              </div>
            ) : (
              alumnosFiltrados.map((alumno) => {
                const inscripcionesAlumno = inscripciones.filter(insc => insc.alumno === alumno.id);
                return (
                  <div key={alumno.id} style={styles.alumnoItem}>
                    <div>
                      <strong>{alumno.nombre} {alumno.apellido}</strong>
                      <div><strong>CI:</strong> {alumno.ci}</div>
                      <div><strong>Registro:</strong> {new Date(alumno.fecha_creacion).toLocaleDateString()}</div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <div style={styles.alumnoCurso}>
                        {inscripcionesAlumno.length > 0 ? `${inscripcionesAlumno.length} curso(s)` : "Sin cursos"}
                      </div>
                      <button style={{...styles.btn, ...styles.btnPrimary}} onClick={() => abrirModal('alumno', alumno)}>
                        Editar
                      </button>
                      <button style={{...styles.btn, ...styles.btnDanger}} onClick={() => eliminarAlumno(alumno.id)}>
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Pestaña Inscripción - NUEVA INTERFAZ */}
      {tabActiva === "inscripcion" && (
        <div style={styles.tabContent}>
          <div style={styles.actionBar}>
            <h2>Inscripción de Alumnos</h2>
            <button style={{...styles.btn, ...styles.btnWarning}} onClick={() => generarReporte('general')}>
              📋 Reporte General
            </button>
          </div>
          <p>Selecciona un alumno y un curso para realizar la inscripción</p>

          {/* Información de selección */}
          {(alumnoSeleccionado || cursoSeleccionado) && (
            <div style={styles.selectedInfo}>
              <h3>Selección Actual:</h3>
              {alumnoSeleccionado && (
                <p><strong>Alumno:</strong> {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido} (CI: {alumnoSeleccionado.ci})</p>
              )}
              {cursoSeleccionado && (
                <p><strong>Curso:</strong> {cursoSeleccionado.nombre} ({cursoSeleccionado.codigo})</p>
              )}
              {alumnoSeleccionado && cursoSeleccionado && (
                <button 
                  style={{...styles.btn, ...styles.btnSuccess, marginTop: '10px'}}
                  onClick={realizarInscripcion}
                >
                  ✅ Realizar Inscripción
                </button>
              )}
            </div>
          )}

          <div style={styles.twoColumns}>
            {/* Columna Alumnos */}
            <div style={styles.selectionCard}>
              <h3>Seleccionar Alumno</h3>
              <div style={styles.formGroup}>
                <label style={styles.label}>Buscar Alumno</label>
                <input
                  style={styles.input}
                  type="text"
                  value={busquedaInscripcion}
                  onChange={(e) => setBusquedaInscripcion(e.target.value)}
                  placeholder="Buscar por CI, nombre o apellido..."
                />
              </div>
              
              <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                {alumnosParaInscripcion.length === 0 ? (
                  <div style={{...styles.emptyState, padding: '20px'}}>
                    <p>No se encontraron alumnos</p>
                  </div>
                ) : (
                  alumnosParaInscripcion.map((alumno) => (
                    <div 
                      key={alumno.id}
                      style={{
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '5px',
                        cursor: 'pointer',
                        backgroundColor: alumnoSeleccionado?.id === alumno.id ? '#3498db' : 'white',
                        color: alumnoSeleccionado?.id === alumno.id ? 'white' : 'inherit'
                      }}
                      onClick={() => setAlumnoSeleccionado(alumno)}
                    >
                      <strong>{alumno.nombre} {alumno.apellido}</strong>
                      <div>CI: {alumno.ci}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Columna Cursos */}
            <div style={styles.selectionCard}>
              <h3>Seleccionar Curso</h3>
              <div style={{maxHeight: '350px', overflowY: 'auto'}}>
                {cursosConCupos.length === 0 ? (
                  <div style={{...styles.emptyState, padding: '20px'}}>
                    <p>No hay cursos con cupos disponibles</p>
                  </div>
                ) : (
                  cursosConCupos.map((curso) => {
                    const inscripcionesCurso = inscripciones.filter(insc => insc.curso === curso.id).length;
                    const cuposDisponibles = curso.cupos - inscripcionesCurso;
                    
                    return (
                      <div 
                        key={curso.id}
                        style={{
                          padding: '10px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          marginBottom: '5px',
                          cursor: 'pointer',
                          backgroundColor: cursoSeleccionado?.id === curso.id ? '#3498db' : 'white',
                          color: cursoSeleccionado?.id === curso.id ? 'white' : 'inherit'
                        }}
                        onClick={() => setCursoSeleccionado(curso)}
                      >
                        <strong>{curso.nombre}</strong>
                        <div>Código: {curso.codigo}</div>
                        <div>Cupos disponibles: {cuposDisponibles}/{curso.cupos}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Botón para crear nuevo alumno si no existe */}
          {alumnosParaInscripcion.length === 0 && busquedaInscripcion && (
            <div style={{textAlign: 'center', marginTop: '20px'}}>
              <p>¿No encuentras al alumno?</p>
              <button 
                style={{...styles.btn, ...styles.btnSuccess}}
                onClick={() => abrirModal('alumno')}
              >
                + Crear Nuevo Alumno
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modales (se mantienen igual) */}
      {modalAbierto === 'curso' && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{editando ? 'Editar Curso' : 'Nuevo Curso'}</h2>
              <button style={styles.closeButton} onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={editando ? editarCurso : crearCurso}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="cursoNombre">Nombre del Curso *</label>
                <input style={styles.input} type="text" id="cursoNombre" name="cursoNombre" value={formData.cursoNombre} onChange={handleInputChange} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="cursoCodigo">Código del Curso *</label>
                <input style={styles.input} type="text" id="cursoCodigo" name="cursoCodigo" value={formData.cursoCodigo} onChange={handleInputChange} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="cursoCupos">Cupos Totales *</label>
                <input style={styles.input} type="number" id="cursoCupos" name="cursoCupos" value={formData.cursoCupos} onChange={handleInputChange} required min="1" />
              </div>
              <button type="submit" style={{...styles.btn, ...styles.btnSuccess, width: '100%'}}>
                {editando ? 'Actualizar Curso' : 'Crear Curso'}
              </button>
            </form>
          </div>
        </div>
      )}

      {modalAbierto === 'alumno' && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2>{editando ? 'Editar Alumno' : 'Nuevo Alumno'}</h2>
              <button style={styles.closeButton} onClick={cerrarModal}>×</button>
            </div>
            <form onSubmit={editando ? editarAlumno : crearAlumno}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="ci">Cédula de Identidad *</label>
                <input style={styles.input} type="text" id="ci" name="ci" value={formData.ci} onChange={handleInputChange} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="nombre">Nombre *</label>
                <input style={styles.input} type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="apellido">Apellido *</label>
                <input style={styles.input} type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} required />
              </div>
              <button type="submit" style={{...styles.btn, ...styles.btnSuccess, width: '100%'}}>
                {editando ? 'Actualizar Alumno' : 'Crear Alumno'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mensajes de alerta */}
      {mensaje && (
        <div style={{...styles.alert, ...(mensaje.tipo === "success" ? styles.alertSuccess : styles.alertError)}}>
          {mensaje.texto}
        </div>
      )}
    </div>
  );
}

export default App;
