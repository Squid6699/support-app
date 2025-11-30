import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import { useSesion } from "../hook/useSesion";
import type { CatalogoIncidencias } from "../../types";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";

interface ModalDarServiciosProps {
    open: boolean;
    incidenciaSeleccionada: number | null;
    handleModalClose: () => void;
    refetchIncidencias: () => void;
}

function ModalDarServicio({ open, incidenciaSeleccionada, handleModalClose, refetchIncidencias }: ModalDarServiciosProps) {
    const { id, usuario } = useSesion();
    const HOST = import.meta.env.VITE_HOST;

    const { data: catalogo, isLoading: isLoadingCatalogo } = useQuery<CatalogoIncidencias[]>({
        queryKey: ["CatalogoIncidentes"],
        queryFn: obtenerCatalogoIncidencias,
    });

    async function obtenerCatalogoIncidencias(): Promise<CatalogoIncidencias[]> {
        const response = await fetch(HOST + "api/catalogoIncidencias", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-frontend-header": "frontend",
            },
        });
        const data = await response.json();
        return data.success ? data.result : [];
    }

    const [descSeleccionada, setDescSeleccionada] = useState<number>(0);

    const handleChangeDescripcion = (value: number) => {
        setDescSeleccionada(value);
    };

    const [servicioValue, setServicioValue] = useState<any>({
        nombre: "",
        descripcion: "",
        horas: 0,
        solucion: "",
        encargado_id: id,
        observaciones: "",
    });

    const [servicioError, setServicioError] = useState({
        descripcion: "",
    });

    const handleCloseModalIncidencia = () => {
        handleModalClose();
        setServicioValue({
            nombre: "",
            descripcion: "",
            horas: 0,
            solucion: "",
            encargado_id: id,
            observaciones: "",
        });
        setDescSeleccionada(0);
    };

    // ---------------------------------------------------------
    // AUTOCOMPLETAR TODO CUANDO SE SELECCIONA UNA DESCRIPCIÓN
    // ---------------------------------------------------------
    useEffect(() => {
        if (!descSeleccionada || !catalogo) return;

        const seleccionado = catalogo.find(
            (p) => p.id_catalogo_incidente === descSeleccionada
        );

        if (seleccionado) {
            setServicioValue({
                nombre: seleccionado.titulo_catalogo_incidente,
                descripcion: seleccionado.descripcion_catalogo_incidente,
                horas: seleccionado.horas_promedio_catalogo_incidente,
                solucion: seleccionado.solucion_catalogo_incidente,
                encargado_id: id,
                observaciones: servicioValue.observaciones,
            });
        }
    }, [descSeleccionada, catalogo]);

    async function submitIncidencia(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setServicioError({ descripcion: "" });

        if (descSeleccionada === 0) {
            setServicioError({ descripcion: "Debe seleccionar una descripción" });
            return;
        }

        try {
            const response = await fetch(HOST + "api/crearServicio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    id_incidencia: incidenciaSeleccionada,
                    nombre: servicioValue.nombre,
                    descripcion: servicioValue.descripcion,
                    horas: servicioValue.horas,
                    solucion: servicioValue.solucion,
                    tecnico_id: servicioValue.encargado_id,
                    observaciones: servicioValue.observaciones,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg);
                handleCloseModalIncidencia();
                refetchIncidencias();
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error("OCURRIO UN ERROR");
        }
    }

    return (
        <Modal open={open} onClose={handleModalClose}>
            <Box sx={style} component={"form"} onSubmit={submitIncidencia}>
                <Typography variant="h6">DAR SERVICIO A INCIDENCIA</Typography>

                {/* SELECT DESCRIPCIÓN */}
                <Box sx={{ m: 2, width: "100%" }}>
                    <FormControl fullWidth>
                        <InputLabel id="select-descripcion">Descripción</InputLabel>

                        <Select
                            labelId="select-descripcion"
                            value={descSeleccionada}
                            onChange={(e) => handleChangeDescripcion(e.target.value as number)}
                            label="Descripción"
                        >
                            {isLoadingCatalogo && (
                                <MenuItem value={0}>Cargando...</MenuItem>
                            )}

                            <MenuItem value={0} disabled>
                                Seleccione una descripción
                            </MenuItem>

                            {catalogo?.map((p) => (
                                <MenuItem key={p.id_catalogo_incidente} value={p.id_catalogo_incidente}>
                                    {p.descripcion_catalogo_incidente}
                                </MenuItem>
                            ))}
                        </Select>

                        <FormHelperText error>{servicioError.descripcion}</FormHelperText>
                    </FormControl>
                </Box>

                {/* NOMBRE */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        label="Nombre"
                        value={servicioValue.nombre}
                        disabled
                        fullWidth
                    />
                </Box>

                {/* SOLUCIÓN */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        label="Solución"
                        value={servicioValue.solucion}
                        multiline
                        rows={3}
                        disabled
                        fullWidth
                    />
                </Box>

                {/* OBSERVACIONES */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        label="Observaciones"
                        value={servicioValue.observaciones}
                        multiline
                        rows={3}
                        fullWidth
                        onChange={(e) => setServicioValue({ ...servicioValue, observaciones: e.target.value })}
                    />
                </Box>

                {/* ENCARGADO */}
                <Box sx={{ m: 2 }}>
                    <TextField value={usuario} label="Encargado" disabled fullWidth />
                </Box>

                {/* HORAS */}
                <Box sx={{ m: 2 }}>
                    <TextField
                        label="Horas"
                        type="number"
                        value={servicioValue.horas}
                        disabled
                        fullWidth
                    />
                </Box>

                <Box sx={{ m: 2 }}>
                    <Button type="submit" variant="contained" className="boton" fullWidth>
                        Dar Servicio
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalDarServicio;
