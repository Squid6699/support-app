import Typography from "@mui/material/Typography";
import type { ServiciosDadosTecnico } from "../../types";
import { useSesion } from "../hook/useSesion";
import { useQuery } from "@tanstack/react-query";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from "dayjs";

function ServiciosDadosTecnico() {
    const { id } = useSesion();

    const HOST = import.meta.env.VITE_HOST

    const { data: servicios, isLoading: isLoadingServicios } = useQuery<ServiciosDadosTecnico[]>({
        queryKey: ["ServiciosDadosTecnico"],
        queryFn: obtenerServicios,
    });


    //SACAR SERVICIOS DEL TECNICO
    async function obtenerServicios() {
        try {
            const response = await fetch(HOST + "api/obtenerServiciosDeTecnico/" + id, {
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
            <header>
                {/* <Button className="boton" variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpenModalIncidencia(true)}>
                    CREAR
                </Button> */}
            </header>

            <main>
                {isLoadingServicios ? <p>Cargando...</p> :

                    servicios && servicios.length > 0 ? (
                        servicios.map((servicio) => {
                            let colorCirculo = "";
                            switch (servicio.prioridad_incidencia.toLowerCase()) {
                                case "alta":
                                    colorCirculo = "red";
                                    break;
                                case "media":
                                    colorCirculo = "orange";
                                    break;
                                case "baja":
                                    colorCirculo = "green";
                                    break;
                                default:
                                    colorCirculo = "";
                            }

                            return (
                                <Accordion key={servicio.id_servicio}>
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
                                                {dayjs(servicio.fecha_incidencia).format("DD/MM/YYYY") +
                                                    " - " +
                                                    servicio.descripcion_incidencia}
                                            </Typography>

                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                {colorCirculo && (
                                                    <span
                                                        style={{
                                                            width: "12px",
                                                            height: "12px",
                                                            borderRadius: "50%",
                                                            backgroundColor: colorCirculo,
                                                            display: "inline-block",
                                                        }}
                                                    ></span>
                                                )}
                                                <Typography component="span">{servicio.prioridad_incidencia}</Typography>
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="span">AUTORIZADO: {servicio.incidencia_autorizada ? "SI" : "NO"} <br /></Typography>
                                        <Typography component="span">ESTADO: {servicio.estado_incidencia} <br /></Typography>
                                        <Typography component="span">EDIFICIO: {servicio.nombre_edificio.toUpperCase()} <br /></Typography>
                                        <Typography component="span">AULA: {servicio.nombre_aula.toUpperCase()} <br /></Typography>
                                        <Typography component="span">EQUIPO: {servicio.nombre_equipo.toUpperCase()} <br /></Typography>
                                        <Typography component="span">TECNICO ASIGNADO: {servicio.nombre_tecnico ? servicio.nombre_tecnico.toUpperCase() : "NO ASIGNADO"} <br /></Typography>
                                        <br />
                                        <Typography component="span">SERVICIO <br /></Typography>
                                        <Typography component="span">NOMBRE DEL SERVICIO: {servicio.nombre_servicio.toUpperCase()} <br /></Typography>
                                        <Typography component="span">DESCRIPCIÓN DEL SERVICIO: {servicio.descripcion_servicio.toUpperCase()} <br /></Typography>
                                        <Typography component="span">HORAS DEL SERVICIO: {servicio.horas_servicio} <br /></Typography>
                                        <Typography component="span">CALIFICACIÓN DEL SERVICIO: {servicio.calificacion_servicio ? servicio.calificacion_servicio : "SIN CALIFICAR"} <br /></Typography>

                                        <br />
                                        <Typography component="span">UBICACION <br /></Typography>
                                        <Typography component="span">AULA: {servicio.nombre_aula.toUpperCase()} <br /></Typography>
                                        <Typography component="span">EDIFICIO: {servicio.nombre_edificio.toUpperCase()} <br /></Typography>


                                    </AccordionDetails>
                                </Accordion>
                            );
                        })
                    ) : "No hay servicios asignados."}
            </main >
            

        </>

    );
}
export default ServiciosDadosTecnico;