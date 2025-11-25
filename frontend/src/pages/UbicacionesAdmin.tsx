import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import Typography from "@mui/material/Typography";
import type { EdificioUbicacion } from "../../types";
import { useQuery } from "@tanstack/react-query";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModalAsignarEncargado from "../components/ModalAsignarEncargado";
import ModalCrearEdificio from "../components/ModalCrearEdificio";
import ModalCrearAula from "../components/ModalCrearAula";

function UbicacionesAdmin() {
    const HOST = import.meta.env.VITE_HOST;

    const { data: edificios, isLoading: isLoadingUbicaciones, refetch: refetchUbicaciones } =
        useQuery<EdificioUbicacion[]>({
            queryKey: ["Ubicaciones"],
            queryFn: obtenerUbicaciones,
        });

    const [openModalAsignar, setOpenModalAsignar] = useState(false);
    const [edificioSeleccionado, setEdificioSeleccionado] = useState<number | null>(null);

    async function obtenerUbicaciones() {
        const response = await fetch(HOST + "api/obtenerEdificiosConAulasYEquiposAdmin", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-frontend-header": "frontend",
            },
        });

        const data = await response.json();
        return data.success ? data.result : [];
    }

    const handleAbrirModalAsignar = (id: number) => {
        setEdificioSeleccionado(id);
        setOpenModalAsignar(true);
    };

    const [openModalCrearEdificio, setOpenModalCrearEdificio] = useState(false);

    const handleOpenCrearEdificio = () => setOpenModalCrearEdificio(true);
    const handleCloseCrearEdificio = () => setOpenModalCrearEdificio(false);

    const [openModalCrearAula, setOpenModalCrearAula] = useState(false);

    const handleOpenCrearAula = () => setOpenModalCrearAula(true);
    const handleCloseCrearAula = () => setOpenModalCrearAula(false);

    return (
        <>
            <header>
                <Button className="boton" variant="contained" startIcon={<AddCircleIcon />} onClick={handleOpenCrearEdificio}>
                    CREAR EDIFICIO
                </Button>
                <Button className="boton" variant="contained" startIcon={<AddCircleIcon />} onClick={handleOpenCrearAula}>
                    CREAR AULA
                </Button>
            </header>

            <main>
                {isLoadingUbicaciones ? (
                    <p>Cargando...</p>
                ) : edificios && edificios.length > 0 ? (
                    edificios.map(edificio => (
                        <Accordion key={edificio.edificio_id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography component="span">
                                    {edificio.edificio_nombre}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                {edificio.aulas.length > 0 ? (
                                    edificio.aulas.map(aula => (
                                        <div key={aula.aula_id} style={{ marginBottom: "10px" }}>
                                            <Typography component="span">
                                                <strong>Aula:</strong> {aula.aula_nombre}
                                            </Typography>

                                            {aula.equipos?.length > 0 && (
                                                <ul style={{ marginLeft: "20px" }}>
                                                    {aula.equipos.map(equipo => (
                                                        <li key={equipo.equipo_id}>
                                                            EQUIPOS: {equipo.equipo_nombre} — {equipo.equipo_fecha}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <Typography>NO HAY AULAS EN ESTE EDIFICIO</Typography>
                                )}

                                ENCARGADO: {!edificio.persona_nombre ? "NO ASIGNADO" : edificio.persona_nombre.toUpperCase()}
                            </AccordionDetails>

                            <AccordionActions>
                                <Button onClick={() => handleAbrirModalAsignar(edificio.edificio_id)} >
                                    ASIGNAR ENCARGADO
                                </Button>

                            </AccordionActions>
                        </Accordion>
                    ))
                ) : (
                    "No hay ubicaciones disponibles"
                )}
            </main>

            <ModalAsignarEncargado
                open={openModalAsignar}
                setOpen={setOpenModalAsignar}
                edificioId={edificioSeleccionado}
                refetch={refetchUbicaciones}
            />

            <ModalCrearEdificio
                open={openModalCrearEdificio}
                handleClose={handleCloseCrearEdificio}
                refetchEdificios={refetchUbicaciones}
            />

            <ModalCrearAula
                open={openModalCrearAula}
                handleClose={handleCloseCrearAula}
                edificios={edificios ?? []}
                refetchUbicaciones={refetchUbicaciones}
            />
        </>
    );
}

export default UbicacionesAdmin;
