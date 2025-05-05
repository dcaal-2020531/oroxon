// src/components/Usuarios.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const getUsuarios = async () => {
      try {
        // Asegúrate de que la ruta sea correcta
        const response = await axios.get("http://localhost:1998/v1/usuarios");
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    getUsuarios();
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>{usuario.nombre}</li> // Ajusta según tu modelo
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
