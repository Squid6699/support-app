import { useQuery } from "@tanstack/react-query";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

import type { AulaEquipos, Equipo } from "../../types";
import ModalCrearEquipo from "../components/ModalCrearEquipo";
import { useState } from "react";
import Button from "@mui/material/Button";
import ModalEditarEquipo from "../components/ModalEditarEquipo";
import ModalEliminarEquipo from "../components/ModalEliminarEquipo";

function EquiposAll() {
    const HOST = import.meta.env.VITE_HOST;

    const { data: aulas, isLoading, refetch } = useQuery<AulaEquipos[]>({
        queryKey: ["AulasConEquipos"],
        queryFn: obtenerAulasConEquipos,
    });

    const [openModalEquipo, setOpenModalEquipo] = useState(false);
    const [openModalEditar, setOpenModalEditar] = useState(false);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);

    const [openModalEliminar, setOpenModalEliminar] = useState(false);
    const [equipoSeleccionadoEliminar, setEquipoSeleccionadoEliminar] = useState<any>(null);

    async function obtenerAulasConEquipos() {
        const response = await fetch(HOST + "api/obtenerEquiposPorAula", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-frontend-header": "frontend",
            },
        });

        const data = await response.json();
        return data.success ? data.result : [];
    }

    return (
        <>
            <header>
                <Button className="boton" variant="contained" startIcon={<AddCircleIcon />} onClick={() => setOpenModalEquipo(true)}>
                    CREAR EQUIPO
                </Button>
            </header>
            <main>
                {isLoading ? (
                    <p>Cargando aulas...</p>
                ) : aulas && aulas.length > 0 ? (
                    aulas.map(aula => (
                        <Accordion key={aula.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography><strong>Aula:</strong> {aula.nombre}</Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                {aula.equipos.length > 0 ? (
                                    <ul>
                                        {aula.equipos.map(equipo => (
                                            <li key={equipo.id}>
                                                {equipo.nombre} — {equipo.fecha}

                                                <Button
                                                    onClick={() => {
                                                        setEquipoSeleccionado(equipo);
                                                        setOpenModalEditar(true);
                                                    }}
                                                >
                                                    EDITAR
                                                </Button>
                                                <Button
                                                    color="error"
                                                    onClick={() => {
                                                        setEquipoSeleccionadoEliminar(equipo);
                                                        setOpenModalEliminar(true);
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Typography>Esta aula no tiene equipos</Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    "No hay aulas disponibles"
                )}
            </main>

            <ModalCrearEquipo
                open={openModalEquipo}
                handleClose={() => setOpenModalEquipo(false)}
                aulas={aulas ?? []}
                refetchAulas={refetch}
            />

            <ModalEditarEquipo
                open={openModalEditar}
                handleClose={() => setOpenModalEditar(false)}
                aulas={aulas ?? []}
                equipo={equipoSeleccionado}
                refetchAulas={refetch}
            />

            <ModalEliminarEquipo
                open={openModalEliminar}
                setOpenModalEliminar={setOpenModalEliminar}
                refetchEquipos={refetch}
                id={equipoSeleccionadoEliminar?.id || null}
                nombre={equipoSeleccionadoEliminar?.nombre || null}
            />

        </>

    );
}

export default EquiposAll;
