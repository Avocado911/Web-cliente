import { useState } from "react";
import "./App.css";

// Cada ejercicio se importa aqui y se pone en Componente cuando este hecho
const EJERCICIOS = [
  { id: "ej-01", titulo: "1 · Hola componente", Componente: null },
  { id: "ej-02", titulo: "2 · Tarjeta de perfil", Componente: null },
  { id: "ej-03", titulo: "3 · Contador +3", Componente: null },
  { id: "ej-04", titulo: "4 · Lista de tareas", Componente: null },
  { id: "ej-05", titulo: "5 · Filtro derivado", Componente: null },
  { id: "ej-06", titulo: "6 · Reloj con useEffect", Componente: null },
  { id: "ej-07", titulo: "7 · Levantar el estado", Componente: null },
  { id: "ej-08", titulo: "8 · Tema con useContext", Componente: null },
  { id: "ej-09", titulo: "9 · Reducer de carrito", Componente: null },
  { id: "ej-10", titulo: "10 · Refactor anti-efecto", Componente: null },
];

export default function App() {
  const [activo, setActivo] = useState(EJERCICIOS[0].id);
  // el ejercicio que se ve se deriva del id: no se guarda el objeto entero en estado
  const ejercicio = EJERCICIOS.find((e) => e.id === activo);
  const { Componente } = ejercicio;

  return (
    <div className="app">
      <nav>
        <h1>Ejercicios · Tema 3</h1>
        {EJERCICIOS.map((e) => (
          <button key={e.id} className={e.id === activo ? "activo" : ""} onClick={() => setActivo(e.id)}>
            {e.titulo}
          </button>
        ))}
      </nav>
      <main>{Componente ? <Componente /> : <p>{ejercicio.titulo}: sin hacer todavia.</p>}</main>
    </div>
  );
}
