import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import Typography from "@mui/material/Typography";
import type { Incidencias } from "../../types";
import { useSesion } from "../hook/useSesion";
import { useQuery } from "@tanstack/react-query";

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from "dayjs";
import ModalCrearIncidencia from "../components/ModalCrearIncidencia";

function Incidencias() {
    const { id } = useSesion();

    const HOST = import.meta.env.VITE_HOST

    const { data: incidencias, isLoading: isLoadingIncidencias, refetch: refetchIncidencias } = useQuery<Incidencias[]>({
        queryKey: ["Incidencias"],
        queryFn: obtenerIncidencias,
    });

    const [openModalIncidencia, setOpenModalIncidencia] = useState(false);

    const handleOpenModalIncidencia = (value: boolean) => {
        setOpenModalIncidencia(value);
    }
    

    
    //SACAR INCIDENCIAS DEL ENCARGADO
    async function obtenerIncidencias() {
        try {
            const response = await fetch(HOST + "api/verIncidenciasEncargado/" + id, {
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
                <Button className="boton" variant="contained" startIcon={<AddCircleIcon />} onClick={() => handleOpenModalIncidencia(true)}>
                    CREAR
                </Button>
            </header>

            <main>
                {isLoadingIncidencias ? <p>Cargando...</p> :

                    incidencias && incidencias.length > 0 ? (
                        incidencias.map((incidencia) => {
                            let colorCirculo = "";
                            switch (incidencia.prioridad.toLowerCase()) {
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
                                <Accordion key={incidencia.incidencia_id}>
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
                                                {dayjs(incidencia.fechaincidencia).format("DD/MM/YYYY") +
                                                    " - " +
                                                    incidencia.descripcion_incidencia}
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
                                                <Typography component="span">{incidencia.prioridad}</Typography>
                                            </div>
                                        </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography component="span">AUTORIZADO: {incidencia.autorizada ? "SI" : "NO"} <br /></Typography>
                                        <Typography component="span">ESTADO: {incidencia.estado_incidencia} <br /></Typography>
                                        <Typography component="span">EDIFICIO: {incidencia.edificio.toUpperCase()} <br /></Typography>
                                        <Typography component="span">AULA: {incidencia.aula.toUpperCase()} <br /></Typography>
                                        <Typography component="span">EQUIPO: {incidencia.equipo_nombre.toUpperCase()} <br /></Typography>
                                        <Typography component="span">TECNICO ASIGNADO: {incidencia.tecnico_nombre ? incidencia.tecnico_nombre.toUpperCase() : "NO ASIGNADO"} <br /></Typography>

                                    </AccordionDetails>
                                    <AccordionActions>
                                        {/* <Button disabled={incidencia.autorizada} onClick={() => { handleOpenModalIncidenciaEdit(incidencia); }}>EDITAR</Button> */}
                                        {incidencia.estado_incidencia.toLowerCase() !== "terminado" ? null : <Button>LIBERAR</Button>}
                                        <Button disabled={incidencia.autorizada}>ELIMINAR</Button>
                                    </AccordionActions>
                                </Accordion>
                            );
                        })
                    ) : "No hay incidencias asignadas a tu cargo"}
            </main >
            <ModalCrearIncidencia
                open={openModalIncidencia}
                setOpenModalIncidencia={handleOpenModalIncidencia}
                refetchIncidencias={refetchIncidencias}
            />


        </>

    );
}
export default Incidencias;