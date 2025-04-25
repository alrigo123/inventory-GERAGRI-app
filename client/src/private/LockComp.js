import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_API_URL_USER;


const LockComp = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     console.log("AH YA")
    } catch (error) {
      console.error('Error en el login:', error);
      alert('Server error');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LockComp;
