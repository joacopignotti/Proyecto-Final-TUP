import { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/prueba")
      .then((res) => res.json())
      .then((data) => setMensaje(data.mensaje))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h1>Proyecto Final TUP</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;

