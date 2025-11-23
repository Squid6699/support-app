import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import Typography from "@mui/material/Typography";
import type { Usuario } from "../../types";
import { useQuery } from "@tanstack/react-query";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModalCrearUsuario from "../components/ModalCrearUsuario";
import ModalEditarUsuario from "../components/ModalEditarUsuario";
import ModalEliminarUsuario from "../components/ModalEliminarUsuario";

function Personas() {

    const HOST = import.meta.env.VITE_HOST;

    const { data: usuarios, isLoading: isLoadingUsuarios, refetch: refetchUsuarios } = useQuery<Usuario[]>({
        queryKey: ["Personas"],
        queryFn: obtenerUsuarios,
    });

    const [openModalCrearUsuario, setOpenModalCrearUsuario] = useState(false);

    const handleOpenModalCrearUsuario = (value: boolean) =>  {
        setOpenModalCrearUsuario(value);
    }

    const [openModalEditarUsuario, setOpenModalEditarUsuario] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);

    const handleOpenModalEditarUsuario = (usuario: Usuario) => {
        setOpenModalEditarUsuario(true);
        setUsuarioSeleccionado(usuario);
    }

    const handleCloseModalEditarUsuario = () => {
        setOpenModalEditarUsuario(false);
        setUsuarioSeleccionado(null);
    }

    const [openModalEliminarUsuario, setOpenModalEliminarUsuario] = useState(false);
    const [usuarioEliminarId, setUsuarioEliminarId] = useState<number | null>(null);

    const handleOpenModalEliminarUsuario = (id: number) => {
        setOpenModalEliminarUsuario(true);
        setUsuarioEliminarId(id);
    }

    const handleCloseModalEliminarUsuario = () => {
        setOpenModalEliminarUsuario(false);
        setUsuarioEliminarId(null);
    }


    async function obtenerUsuarios() {
        try {
            const response = await fetch(HOST + "api/obtenerPersonas", {
                method: 'GET',
                headers: {
                    'x-frontend-header': 'frontend',
                }
            });

            const data = await response.json();

            if (data.success) {
                return data.result;
            } else {
                return [];
            }
        } catch {
            throw new Error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <>
            <header>
                <Button
                    className="boton"
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleOpenModalCrearUsuario(true)}
                >
                    CREAR
                </Button>
            </header>

            <main>
                {isLoadingUsuarios ? <p>Cargando...</p> :

                    usuarios && usuarios.length > 0 ? (
                        usuarios.map((usuario) => (
                            <Accordion key={usuario.id}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography component="span">
                                        {usuario.nombre.toUpperCase()} - {usuario.rol.toUpperCase()}
                                    </Typography>
                                </AccordionSummary>

                                <AccordionDetails>
                                    <Typography component="span">
                                        Celular: {usuario.celular} <br />
                                    </Typography>
                                    <Typography component="span">
                                        Correo: {usuario.correo} <br />
                                    </Typography>
                                    <Typography component="span">
                                        Rol: {usuario.rol.toUpperCase()} <br />
                                    </Typography>
                                </AccordionDetails>

                                <AccordionActions>
                                    <Button onClick={() => handleOpenModalEditarUsuario(usuario)} >EDITAR</Button>
                                    <Button color="error" onClick={() => handleOpenModalEliminarUsuario(usuario.id)} >ELIMINAR</Button>
                                </AccordionActions>
                            </Accordion>
                        ))
                    ) : "No hay usuarios registrados"}
            </main>

            <ModalCrearUsuario
                open={openModalCrearUsuario}
                setOpenModalUsuario={handleOpenModalCrearUsuario}
                refetchUsuarios={refetchUsuarios}
            />
            
            <ModalEditarUsuario
                open={openModalEditarUsuario}
                setOpenModalEditarUsuario={handleCloseModalEditarUsuario}
                refetchUsuarios={refetchUsuarios}
                usuario={usuarioSeleccionado}
            />
            
            <ModalEliminarUsuario
                open={openModalEliminarUsuario}
                setOpenModalEliminarUsuario={handleCloseModalEliminarUsuario}
                refetchUsuarios={refetchUsuarios}
                id={usuarioEliminarId}
            />
        </>
    );
}

export default Personas;
