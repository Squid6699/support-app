import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export const SesionContext = createContext<any>(undefined);

type SesionProviderProps = {
  children: ReactNode;
};

export function SesionProvider({ children }: SesionProviderProps) {
  const HOST = import.meta.env.VITE_HOST;
  const navigate = useNavigate();
  const [id, setId] = useState<number | null>(null);
  const [usuario, setUsuario] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string | null>(null);
  const [celular, setCelular] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(HOST + "api/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await response.json();
        if (data.success) {
          setId(data.id);
          setUsuario(data.usuario);
          setCorreo(data.correo);
          setCelular(data.celular);
          setRol(data.rol);
          navigate("/");
          document.title = "HOME";
        } else {
          navigate("/auth/login");
          document.title = "LOGIN";
        }
      } catch (error) {
        console.error("Error en SesionProvider:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <SesionContext.Provider
      value={{
        usuario,
        setUsuario,
        correo,
        setCorreo,
        celular,
        setCelular,
        id,
        setId,
        rol,
        setRol,
      }}
    >
      {children}
    </SesionContext.Provider>
  );
}
