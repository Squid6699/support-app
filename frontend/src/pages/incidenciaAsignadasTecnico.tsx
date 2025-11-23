import Button from "@mui/material/Button";
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
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ModalDarServicio from "../components/ModalDarServicio";
import toast from "react-hot-toast";

function IncidenciasAsignadasTecnico() {
    const { id } = useSesion();

    const HOST = import.meta.env.VITE_HOST

    const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");

    const { data: incidencias, isLoading: isLoadingIncidencias, refetch: refetchIncidencias } = useQuery<Incidencias[]>({
        queryKey: ["IncidenciasTecnico", filtroEstado],
        queryFn: obtenerIncidenciasTecnico,
    });

    const [openModalDarServicio, setOpenModalDarServicio] = useState(false);
    const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<number | null>(0);

    const handleOpenModal = (incidenciaId: number) => {
        setIncidenciaSeleccionada(incidenciaId);
        setOpenModalDarServicio(true);
    }

    const handleModalClose = () => {
        setOpenModalDarServicio(false);
    }




    //SACAR INCIDENCIAS ASIGNADAS AL TECNICO
    async function obtenerIncidenciasTecnico() {
        try {
            let url = HOST + "api/incidenciasTecnico/" + id;

            const params = new URLSearchParams();
            if (filtroEstado && filtroEstado !== "TODOS") params.append("estado", filtroEstado);

            if (params.toString()) {
                url += "?" + params.toString();
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-frontend-header': 'frontend',
                },
            });
            const data = await response.json();

            if (data.success) {
                return (data.incidencias);
            } else {
                return [];
            }
        } catch {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    const handleIniciarIncidencia = async (incidenciaId: number) => {
        try {
            const response = await fetch(HOST + "api/iniciarIncidencia", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend',
                },
                body: JSON.stringify({"id": incidenciaId}),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg);
                refetchIncidencias();
            } else {
                toast.error(data.msg);
            }


        }catch (error) {
            toast.error("OCURRIO UN ERROR");
        }
    }




return (

    <>
        <header>

            <Box
                sx={{ m: 2, display: 'flex', gap: 2, flexDirection: 'row', flexWrap: 'nowrap' }}
            >
                <FormControl>
                    <InputLabel id="demo-simple-select-autowidth-label">Filtros</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={filtroEstado}
                        onChange={(e) => { setFiltroEstado(e.target.value); refetchIncidencias(); }}
                        label="Filtros"

                    >
                        <MenuItem key={0} value={"TODOS"} selected>TODOS</MenuItem>
                        <MenuItem key={1} value={"AUTORIZADO"}>AUTORIZADO</MenuItem>
                        <MenuItem key={2} value={"NO AUTORIZADO"}>NO AUTORIZADO</MenuItem>
                        <MenuItem key={3} value={"NO INICIADO"}>NO INICIADO</MenuItem>
                        <MenuItem key={4} value={"EN PROCESO"}>EN PROCESO</MenuItem>
                        <MenuItem key={5} value={"TERMINADO"}>TERMINADO</MenuItem>
                        <MenuItem key={6} value={"LIBERADO"}>LIBERADO</MenuItem>
                        <MenuItem key={7} value={"SINTÉCNICO"}>SIN TÉCNICO</MenuItem>
                        <MenuItem key={8} value={"TECNICOASIGNADO"}>TÉCNICO ASIGNADO</MenuItem>
                    </Select>
                </FormControl>
            </Box>

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
                                    {incidencia.estado_incidencia === "EN PROCESO" && <Button onClick={() => handleOpenModal(incidencia.incidencia_id)}>DAR SERVICIO</Button>}
                                    <Button onClick={() => handleIniciarIncidencia(incidencia.incidencia_id)} disabled={incidencia.estado_incidencia === "EN PROCESO"}>INICIAR INCIDENCIA</Button>
                                </AccordionActions>
                            </Accordion>
                        );
                    })
                ) : "No hay incidencias asignadas a tu cargo"}
        </main >

        <ModalDarServicio
            open={openModalDarServicio}
            incidenciaSeleccionada={incidenciaSeleccionada}
            handleModalClose={handleModalClose}
            refetchIncidencias={refetchIncidencias}
        />
    </>


);
}
export default IncidenciasAsignadasTecnico;