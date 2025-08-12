import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de página de login
 * Pantalla 1: Login simple para demostración
 */
function LoginPage() {
  // Estados para manejar los inputs del formulario
  const [user_name, set_user_name] = useState('');
  const [password, set_password] = useState('');
  const navigate = useNavigate();

  /**
   * Maneja el evento de login
   * Para MVP: cualquier usuario/contraseña es válido
   */
  const handle_login = (e) => {
    e.preventDefault();
    
    // Validación básica - solo verificar que no estén vacíos
    if (user_name && password) {
      navigate('/dashboard');
    } else {
      alert('Por favor ingresa usuario y contraseña');
    }
  };

  // Estilos inline para el contenedor principal
  const login_container_style = {
    maxWidth: '400px',
    margin: '100px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff'
  };

  const input_style = {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  };

  const button_style = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  return (
    <div style={login_container_style}>
      <h2>Login - Sistema CFDI</h2>
      <form onSubmit={handle_login}>
        {/* Campo de usuario */}
        <div style={{ marginBottom: '15px' }}>
          <label>Usuario:</label>
          <input
            type="text"
            value={user_name}
            onChange={(e) => set_user_name(e.target.value)}
            style={input_style}
            placeholder="Ingresa tu usuario"
          />
        </div>
        
        {/* Campo de contraseña */}
        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => set_password(e.target.value)}
            style={input_style}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        
        {/* Botón de login */}
        <button type="submit" style={button_style}>
          Iniciar Sesión
        </button>
      </form>
      
      {/* Instrucciones para demo */}
      <p style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
        Demo: cualquier usuario y contraseña funciona
      </p>
    </div>
  );
}

export default LoginPage;
