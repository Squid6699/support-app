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
  const [nombre, setNombre] = useState<string | null>(null);
  const [correo, setCorreo] = useState<string | null>(null);
  const [autorization, setAutorization] = useState<string | null>(null);

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
          setNombre(data.nombre);
          setCorreo(data.correo);
          setAutorization(data.autorization);
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
        nombre,
        setNombre,
        correo,
        setCorreo,
        autorization,
        setAutorization,
      }}
    >
      {children}
    </SesionContext.Provider>
  );
}
