import { useQuery } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

function PiezasSolicitadas() {
    const HOST = import.meta.env.VITE_HOST;

    

    const { data: solicitudes, isLoading, refetch } = useQuery({
        queryKey: ["SolicitudesPiezas"],
        queryFn: obtenerSolicitudes,
    });

    async function obtenerSolicitudes() {
        try {
            let url = HOST + "api/obtenerSolicitudesPiezas";

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "x-frontend-header": "frontend",
                },
            });

            const data = await response.json();
            if (!data.success) return [];

            let result = data.result;

            
            return result;
        } catch (err) {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    return (
        <>

            <main>
                {isLoading ? (
                    <p>Cargando...</p>
                ) : solicitudes && solicitudes.length > 0 ? (
                    solicitudes.map((s) => (
                        <Accordion key={s.solicitud_id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>                                
                                <Typography>
                                    {s.nombre_pieza} - {dayjs(s.fecha).format("DD/MM/YYYY")}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Typography component="div">
                                    <strong>PIEZA SOLICITADA:</strong> {s.nombre_pieza.toUpperCase()} <br />
                                    <strong>CANTIDAD SOLICITADA:</strong> {s.cantidad_solicitada} <br />
                                    <strong>DESCRIPCION:</strong> {s.descripcion_solicitud.toUpperCase()} <br />
                                    <strong>AUTORIZADO:</strong> {s.autorizado_solicitud ? "SI" : "NO"} <br />
                                    <strong>STOCK:</strong> {s.stock_pieza} <br />
                                    <strong>INCIDENCIA:</strong> {s.descripcion_incidencia.toUpperCase()} <br />
                                    <strong>EQUIPO:</strong> {s.equipo_nombre} <br />
                                    <strong>EDIFICIO:</strong> {s.edificio} <br />
                                    <strong>ENCARGADO DEL EDIFICIO:</strong> {s.nombre_encargado.toUpperCase() || "NO REGISTRADO"} <br />
                                    <strong>AULA:</strong> {s.aula} <br />
                                    <strong>TÉCNICO ASIGNADO:</strong> {s.nombre_tecnico.toUpperCase() || "NO ASIGNADO"}
                                </Typography>
                            </AccordionDetails>

                            <AccordionActions>
                               
                            </AccordionActions>
                        </Accordion>
                    ))
                ) : (
                    "No hay solicitudes registradas"
                )}
            </main>

        </>
    );
}

export default PiezasSolicitadas;
