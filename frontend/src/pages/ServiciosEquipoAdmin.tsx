import { useQuery } from "@tanstack/react-query";
import type { ServicioDeEquipo } from "../../types";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import ModalCalificarServicio from "../components/ModalCalificarServicio";

function ServiciosEquipoEncargadoAdmin() {

    const HOST = import.meta.env.VITE_HOST

    const { data: serviciosEquipos, isLoading: isLoadingServiciosEquipos, refetch } = useQuery<ServicioDeEquipo[]>({
        queryKey: ["ServiciosEquipo"],
        queryFn: obtenerServiciosEquipo,
    });

    const [servicioSeleccionado, setServicioSeleccionado] = useState<number | null>(null);
    const [openModalCalificarServicio, setOpenModalCalificarServicio] = useState<boolean>(false);
    const handleOpenModalCalificarServicio = (id_servicio: number) => {
        setServicioSeleccionado(id_servicio);
        setOpenModalCalificarServicio(true);
    }

    const handleCloseModalCalificarServicio = () => {
        setOpenModalCalificarServicio(false);
    }

    async function obtenerServiciosEquipo() {
        try {
            const response = await fetch(HOST + "api/obtenerServiciosDeEquiposAdmin", {
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

    return (
        <>
            <main>
                {isLoadingServiciosEquipos ? (
                    <p>Cargando...</p>
                ) : serviciosEquipos && serviciosEquipos.length > 0 ? (
                    serviciosEquipos.map((equipo) => (
                        <Accordion key={equipo.id_equipo}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel-${equipo.id_equipo}-content`}
                                id={`panel-${equipo.id_equipo}-header`}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Typography style={{ maxWidth: "80%" }} component="span">
                                        {equipo.nombre_equipo?.toUpperCase()}
                                    </Typography>
                                </div>
                            </AccordionSummary>

                            <AccordionDetails>
                                {equipo.servicios && equipo.servicios.length > 0 ? (
                                    equipo.servicios.map((serv) => (
                                        <div key={serv.id_incidencia} style={{ marginBottom: "1rem" }}>
                                            <Typography component="span">
                                                <strong>Servicio:</strong> {serv.nombre_servicio?.toUpperCase()} <br />
                                                <strong>Descripción:</strong> {serv.descripcion_servicio || "Sin descripción"} <br />
                                                <strong>Técnico:</strong> {serv.nombre_tecnico || "No asignado"} <br />
                                                <strong>Horas:</strong> {serv.horas_servicio ?? "N/A"} <br />
                                                <strong>Prioridad:</strong> {serv.prioridad || "No definida"} <br />
                                                <strong>Estado:</strong> {serv.estado_incidencia || "Desconocido"} <br />
                                                {/* <strong>Finalizado:</strong> {serv.incidencia_finalizada ? "Sí" : "No"} <br /> */}
                                                <strong>Fecha término:</strong> {serv.fecha_termino_incidencia || "Pendiente"}<br />
                                                <strong>Calificacion:</strong> {serv.calificacion_servicio}<br />
                                                <Button disabled={serv.calificacion_servicio !== 0} onClick={() => handleOpenModalCalificarServicio(serv.id_servicio)} >CALIFICAR</Button>
                                            </Typography>
                                            <hr style={{ margin: "1rem 0" }} />
                                        </div>
                                    ))
                                ) : (
                                    <Typography component="span" color="textSecondary">
                                        Este equipo no tiene servicios registrados.
                                    </Typography>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    "No hay servicios para tus equipos."
                )}
            </main>

            <ModalCalificarServicio
                open={openModalCalificarServicio}
                id={servicioSeleccionado}
                refetchServicio={refetch}
                handleCloseModalCalificarServicio={handleCloseModalCalificarServicio}
            />

        </>
    );

}

export default ServiciosEquipoEncargadoAdmin;