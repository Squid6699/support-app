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
                return (data.data);
            } else {
                return [];
            }
        } catch {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    return (
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
                                            {dayjs(equipo.fecha).format("DD/MM/YYYY") +
                                                " - " +
                                                equipo.descripcion}
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
                                    <Button disabled={incidencia.autorizada} onClick={() => { handleOpenModalIncidenciaEditar(true); setIncidenciaEditar(incidencia); }}>EDITAR</Button>
                                    {incidencia.estado_incidencia.toLowerCase() !== "terminado" ? null : <Button onClick={() => { handleOpenModalLiberarIncidencia(true); setIncidenciaLiberar(incidencia.incidencia_id); }}>LIBERAR</Button>}
                                    <Button onClick={() => { handleOpenModalEliminarIncidencia(true); setIncidenciaEliminar(incidencia.incidencia_id); }} disabled={incidencia.autorizada}>ELIMINAR</Button>
                                </AccordionActions>
                            </Accordion>
                        );
                    })
                ) : "No hay incidencias asignadas a tu cargo"}
        </main >
    );
}

export default EquiposEncargado;