import React, { useState } from 'react';
import { login } from '../services/authService';

interface LoginProps {
  onLogin: (token: string, userData: any) => void;
  setMensaje: (mensaje: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, setMensaje }) => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting login...');
      
      const response = await login(loginData.username, loginData.password);
      console.log('Login successful:', response);
      
      // Guardar el token
      localStorage.setItem('token', response.access);
      
      // Llamar al callback de login exitoso
      onLogin(response.access, response.user);
      
      setMensaje({ tipo: "success", texto: "Login exitoso" });
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 401) {
        setMensaje({ tipo: "error", texto: "Credenciales inválidas. Usa: admin / password" });
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setMensaje({ tipo: "error", texto: "Error de conexión con el servidor" });
      } else {
        setMensaje({ tipo: "error", texto: `Error: ${error.response?.data?.error || error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px",
      }}>
        <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Sistema de Matriculación</h2>
        <form onSubmit={handleLogin}>
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}} htmlFor="username">Usuario</label>
            <input
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
              type="text"
              id="username"
              value={loginData.username}
              onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              placeholder="admin"
              required
              disabled={loading}
            />
          </div>
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', fontWeight: '600'}} htmlFor="password">Contraseña</label>
            <input
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
              type="password"
              id="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              placeholder="password"
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            style={{
              padding: "12px 24px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              width: '100%',
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Conectando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div style={{marginTop: '20px', textAlign: 'center', color: '#7f8c8d'}}>
          <p>Usuario: <strong>admin</strong></p>
          <p>Contraseña: <strong>password</strong></p>
          <p style={{marginTop: '10px', fontSize: '0.9rem'}}>
            Backend conectado correctamente ✅
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
