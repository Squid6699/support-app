
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import { useSesion } from "../hook/useSesion";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import type { Incidencias } from "../../types";
import { useQuery } from "@tanstack/react-query";
import type { Pieza } from "../pages/Piezas";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

interface ModalSolicitarPiezaProps {
    open: boolean;
    // Propiedad cambiada de incidenciaId a incidencia
    incidencia: Incidencias | null;
    handleModalClose: () => void;
    refetchIncidencias: () => void;
}

// Interfaz para los datos que se enviarán en la solicitud de pieza
interface SolicitudPieza {
    id_pieza: number;
    tipo_pieza: string;
    descripcion: string;
    incidencia_id: number;
    equipo_id: number;
    edificio: string;
    aula: string;
    tecnico_id: number;
    tecnico_nombre: string;
    cantidad: number;
}


function ModalSolicitarPieza({ open, incidencia, handleModalClose, refetchIncidencias }: ModalSolicitarPiezaProps) {
    const { id, usuario } = useSesion();
    const HOST = import.meta.env.VITE_HOST;

    const initialSolicitud: SolicitudPieza = {
        id_pieza: 0,
        tipo_pieza: "",
        descripcion: "",
        incidencia_id: incidencia?.incidencia_id || 0,
        equipo_id: incidencia?.equipo_id || 0,
        edificio: incidencia?.edificio.toUpperCase() || "",
        aula: incidencia?.aula.toUpperCase() || "",
        tecnico_id: id,
        tecnico_nombre: usuario || "",
        cantidad: 1,
    }

    const [solicitudPieza, setSolicitudPieza] = useState<SolicitudPieza>(initialSolicitud);
    const [solicitudError, setSolicitudError] = useState({ tipo_pieza: "" });




    const { data: piezas, isLoading: isLoadingPiezas, refetch: refetchPiezas } = useQuery<Pieza[]>({
        queryKey: ["Piezas"],
        queryFn: obtenerPiezas,
    });

    async function obtenerPiezas() {
        try {
            const response = await fetch(HOST + "api/obtenerPiezas", {
                method: "GET",
                headers: {
                    "x-frontend-header": "frontend",
                },
            });
            const data = await response.json();
            if (data.success) return data.result;
            return [];
        } catch (error) {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    // Usa useEffect para inicializar el formulario cuando la prop 'incidencia' cambie (es decir, cuando se abre el modal)
    useEffect(() => {
        if (incidencia) {
            setSolicitudPieza({
                id_pieza: 0, // Siempre limpiar este campo
                tipo_pieza: "", // Siempre limpiar este campo
                descripcion: "", // Siempre limpiar este campo
                incidencia_id: incidencia.incidencia_id,
                equipo_id: incidencia.equipo_id,
                edificio: incidencia.edificio.toUpperCase(),
                aula: incidencia.aula.toUpperCase(),
                tecnico_id: id,
                tecnico_nombre: usuario,
                cantidad: 1,
            });
        }
    }, [incidencia, id, usuario]);

    const handleCloseModalSolicitud = () => {
        handleModalClose();
        // Resetear el formulario usando los datos de la incidencia, si están disponibles, o el estado inicial
        setSolicitudPieza(incidencia ? {
            id_pieza: 0,
            tipo_pieza: "",
            descripcion: "",
            incidencia_id: incidencia.incidencia_id,
            equipo_id: incidencia.equipo_id,
            edificio: incidencia.edificio.toUpperCase(),
            aula: incidencia.aula.toUpperCase(),
            tecnico_id: id,
            tecnico_nombre: usuario,
            cantidad: 1,
        } : initialSolicitud);
        setSolicitudError({ tipo_pieza: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSolicitudPieza({
            ...solicitudPieza,
            [e.target.name]: e.target.value,
        });
        setSolicitudError({ tipo_pieza: "" });
    };

    async function submitSolicitudPieza(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (solicitudPieza.tipo_pieza.trim() === "") {
            setSolicitudError({ tipo_pieza: "Debe especificar el tipo de pieza solicitada" });
            return;
        }

        try {
            const response = await fetch(HOST + "api/crearSolicitudPieza", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({ "pieza_id": solicitudPieza.id_pieza, "incidente_id": solicitudPieza.incidencia_id, "cantidad": solicitudPieza.cantidad, "descripcion": solicitudPieza.descripcion, "tecnico_id": solicitudPieza.tecnico_id }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg);
                handleCloseModalSolicitud();
                refetchIncidencias();
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    if (!incidencia && open) {
        return (
            <Modal open={open} onClose={handleModalClose}>
                <Box sx={style}>
                    <Typography color="error">Error: No se pudo cargar la información de la incidencia.</Typography>
                    <Button onClick={handleCloseModalSolicitud}>Cerrar</Button>
                </Box>
            </Modal>
        );
    }
    console.log(solicitudPieza.id_pieza);
    return (
        <Modal open={open} onClose={handleModalClose}>
            <Box sx={style} component={"form"} onSubmit={submitSolicitudPieza}>
                <Typography variant="h6" gutterBottom>SOLICITAR PIEZA PARA INCIDENCIA #{incidencia?.incidencia_id}</Typography>

                {/* TIPO DE PIEZA (Campo a rellenar) */}
                <Box sx={{ m: 2 }}>
                    <FormControl fullWidth error={!!solicitudError.tipo_pieza}>
                        <InputLabel id="select-pieza">PIEZA</InputLabel>

                        <Select
                            labelId="select-pieza"
                            label="Pieza"
                            value={solicitudPieza.id_pieza}
                            onChange={(e) =>
                                setSolicitudPieza({
                                    ...solicitudPieza,
                                    id_pieza: Number(e.target.value), // guarda la ID real
                                })
                            }
                        >
                            {isLoadingPiezas && (
                                <MenuItem value="">
                                    Cargando...
                                </MenuItem>
                            )}

                            {!isLoadingPiezas && piezas?.length === 0 && (
                                <MenuItem value="" disabled>
                                    NO HAY PIEZAS DISPONIBLES
                                </MenuItem>
                            )}

                            {!isLoadingPiezas &&
                                piezas?.map((pieza) => (
                                    <MenuItem key={pieza.id} value={pieza.id}>
                                        {pieza.nombre}
                                    </MenuItem>
                                ))}
                        </Select>

                        <FormHelperText>{solicitudError.tipo_pieza}</FormHelperText>
                    </FormControl>
                </Box>


                {/* CANTIDAD (Campo a rellenar) */}

                <Box sx={{ m: 2 }}>
                    <TextField
                        name="CANTIDAD"
                        label="CANTIDAD"
                        type="number"
                        value={solicitudPieza.cantidad}
                        onChange={handleChange}
                        fullWidth
                    />
                </Box>

                {/* DESCRIPCIÓN (Campo a rellenar) */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        name="DESCRIPCION"
                        label="DESCRIPCIÓN / JUSTIFICACIÓN DE LA SOLICITUD"
                        value={solicitudPieza.descripcion}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                    />
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, ml: 2 }}>Información de la Incidencia</Typography>

                {/* EDIFICIO (Prellenado y no modificable) */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        label="EDIFICIO"
                        value={solicitudPieza.edificio}
                        disabled
                        fullWidth
                    />
                </Box>

                {/* AULA (Prellenado y no modificable) */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        label="AULA"
                        value={solicitudPieza.aula}
                        disabled
                        fullWidth
                    />
                </Box>

                {/* EQUIPO ID (Prellenado y no modificable) */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        label="EQUIPO"
                        // Usamos el nombre del equipo de la prop
                        value={incidencia?.equipo_nombre.toUpperCase() || solicitudPieza.equipo_id}
                        disabled
                        fullWidth
                    />
                </Box>

                {/* TÉCNICO ASIGNADO (Prellenado y no modificable) */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        label="TÉCNICO SOLICITANTE"
                        value={solicitudPieza.tecnico_nombre}
                        disabled
                        fullWidth
                    />
                </Box>

                <Box sx={{ m: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button onClick={handleCloseModalSolicitud} className="boton-cancelar" variant="contained">
                        CANCELAR
                    </Button>
                    <Button type="submit" variant="contained" className="boton" >
                        ENVIAR SOLICITUD
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalSolicitarPieza;