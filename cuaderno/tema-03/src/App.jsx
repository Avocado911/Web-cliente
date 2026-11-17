import { useState } from "react";
import "./App.css";

// Cada ejercicio se importa aqui y se pone en Componente cuando este hecho
const EJERCICIOS = [
  { id: "1-1", titulo: "1.1 La tripulacion", Componente: null },
  { id: "1-2", titulo: "1.2 Estado de la esclusa", Componente: null },
  { id: "1-3", titulo: "1.3 Ranking arcade", Componente: null },
  { id: "1-4", titulo: "1.4 El aplausometro", Componente: null },
  { id: "quiz", titulo: "Mision 1 · Trivial", Componente: null },
  { id: "habitos", titulo: "Mision 2 · Habitos", Componente: null },
  { id: "videoclub", titulo: "Mision 3 · Videoclub", Componente: null },
  { id: "reto", titulo: "Reto jefe · Memoria Cosmica", Componente: null },
];

export default function App() {
  const [activo, setActivo] = useState(EJERCICIOS[0].id);
  // el ejercicio que se ve se deriva del id: no se guarda el objeto entero en estado
  const ejercicio = EJERCICIOS.find((e) => e.id === activo);
  const { Componente } = ejercicio;

  return (
    <div className="app">
      <nav>
        <h1>Cuaderno 3 · React Core</h1>
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
