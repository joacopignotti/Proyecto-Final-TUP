
import { useEffect, useState, type SyntheticEvent } from "react";
import { useAuth } from "../../context/useAuth";
import { request } from "../../services/apiClient";

export type Rol = "administrador" | "tecnico";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
  activo: boolean;
}

const ROLES: Rol[] = ["administrador", "tecnico"];

const ETIQUETAS_ROL: Record<Rol, string> = {
  administrador: "Administrador",
  tecnico: "Técnico",
};

export default function Usuarios() {
  const { usuario } = useAuth();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState<Record<number, Rol>>({});
  const [cargando, setCargando] = useState(true);
  const [guardandoId, setGuardandoId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  const esAdmin = usuario?.rol === "administrador";

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await fetch("/api/v1/usuarios", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taller.token") ?? ""}`,
          },
        });

        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los usuarios.");
        }

        const lista: Usuario[] = await respuesta.json();

        setUsuarios(lista);

        const inicial: Record<number, Rol> = {};
        for (const u of lista) {
          inicial[u.id] = u.rol;
        }

        setRolesSeleccionados(inicial);
      } catch (err) {
        setError((err as Error).message || "Error al cargar usuarios.");
      } finally {
        setCargando(false);
      }
    };

    void cargar();
  }, []);

  const handleGuardarRol = async (e: SyntheticEvent, u: Usuario) => {
    e.preventDefault();
    if (!esAdmin) return;

    const nuevoRol = rolesSeleccionados[u.id] ?? u.rol;

    setGuardandoId(u.id);
    setError(null);
    setMensajeOk(null);

    try {
      await request<Usuario>(`/usuarios/${u.id}/rol`, {
        method: "PATCH",
        body: { rol: nuevoRol },
      });

      setUsuarios((prev) =>
        prev.map((item) =>
          item.id === u.id ? { ...item, rol: nuevoRol } : item
        )
      );

      setMensajeOk(
        `Rol de ${u.nombre} ${u.apellido} actualizado a ${ETIQUETAS_ROL[nuevoRol]}.`
      );
    } catch (err) {
      setError((err as Error).message || "Error al guardar el rol.");
    } finally {
      setGuardandoId(null);
    }
  };

  if (!usuario) return null;

  return (
    <section>
      <h1>Usuarios</h1>
      <p className="estado-api">Altas, bajas y asignación de perfiles</p>

      {!esAdmin && (
        <p className="aviso aviso--error">
          Solo los usuarios con rol Administrador pueden asignar roles.
        </p>
      )}

      {cargando && <p className="aviso">Cargando usuarios…</p>}
      {error && <p className="aviso aviso--error">{error}</p>}
      {mensajeOk && <p className="aviso aviso--ok">{mensajeOk}</p>}

      {!cargando && (
        <div className="tabla">
          <table>
            <thead>
              <tr>
                <th>Nombre y apellido</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Rol actual</th>
                <th>Asignar rol</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6} className="tabla__vacia">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => {
                  const rolElegido = rolesSeleccionados[u.id] ?? u.rol;
                  const sinCambios = rolElegido === u.rol;
                  const ocupada = guardandoId === u.id || !esAdmin;

                  return (
                    <tr key={u.id}>
                      <td>
                        {u.nombre} {u.apellido}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.activo ? "Activo" : "Inactivo"}</td>
                      <td>{ETIQUETAS_ROL[u.rol] ?? u.rol}</td>

                      <td>
                        <select
                          aria-label={`Rol de ${u.nombre} ${u.apellido}`}
                          value={rolElegido}
                          disabled={ocupada}
                          onChange={(e) => {
                            const valor = e.target.value as Rol;

                            setMensajeOk(null);
                            setError(null);

                            setRolesSeleccionados((prev) => ({
                              ...prev,
                              [u.id]: valor,
                            }));
                          }}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {ETIQUETAS_ROL[r]}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn"
                          disabled={ocupada || sinCambios}
                          onClick={(e) => void handleGuardarRol(e, u)}
                        >
                          {guardandoId === u.id ? "Guardando…" : "Guardar"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}


