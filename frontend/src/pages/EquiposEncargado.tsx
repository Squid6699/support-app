// NO TERMINADO

import type { EquiposPorEncargado } from "../../types";
import { useSesion } from "../hook/useSesion";
import { useQuery } from "@tanstack/react-query";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import { useState } from "react";
import ModalDetalleEquipo from "../components/ModalDetalleEquipos";

function EquiposEncargado() {
    const { id } = useSesion();
    const HOST = import.meta.env.VITE_HOST

    const { data: equipos, isLoading: isLoadingEquipos, refetch: refetchEquipos } = useQuery<EquiposPorEncargado[]>({
        queryKey: ["Equipos"],
        queryFn: obtenerEquipos,
    });

    // SACAR EQUIPOS POR ENCARGADO
    async function obtenerEquipos() {
        try {
            const response = await fetch(HOST + "api/verEquiposEncargado/" + id, {
                method: 'GET',
                headers: {
                    'x-frontend-header': 'frontend',
                },
            });
            const data = await response.json();

            if (data.success) {
                return (data.result);
            } else {
                return [];
            }
        } catch {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    const [open, setOpen] = useState(false);
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<number | null>(null);

    const handleOpenModal = (equipoId: number) => {
        setEquipoSeleccionado(equipoId);
        setOpen(true);
    }

    const handleModalClose = () => {
        setOpen(false);
    }

    return (
        <>
            <main>
                {isLoadingEquipos ? <p>Cargando...</p> :

                    equipos && equipos.length > 0 ? (
                        equipos.map((equipo) => {

                            return (
                                <Accordion key={equipo.id}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "nowrap",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                width: "100%",
                                            }}
                                        >
                                            <Typography style={{ maxWidth: "80%" }} component="span">
                                                {dayjs(equipo.fechaequipo).format("DD/MM/YYYY") +
                                                    " - " +
                                                    equipo.nombreequipo.toUpperCase()}
                                            </Typography>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="span">EDIFICIO: {equipo.nombreedificio.toUpperCase()} <br /></Typography>
                                        <Typography component="span">AULA: {equipo.nombreaula.toUpperCase()} <br /></Typography>

                                    </AccordionDetails>
                                    <AccordionActions>
                                        <Button>EDITAR</Button>
                                        <Button>ELIMINAR</Button>
                                        <Button onClick={() => handleOpenModal(equipo.id)}>DETALLES</Button>
                                    </AccordionActions>
                                </Accordion>
                            );
                        })
                    ) : "No hay equipos asignados."}
            </main >
            <ModalDetalleEquipo open={open} handleClose={handleModalClose} equipoId={equipoSeleccionado} />
        </>
    );

}

export default EquiposEncargado;