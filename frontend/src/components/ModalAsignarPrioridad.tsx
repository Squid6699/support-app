import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { style } from "../css/componentsStyle";
import { useState } from "react";
import toast from "react-hot-toast";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { useQuery } from "@tanstack/react-query";

interface Prioridad {
    id: number;
    nombre: string;
}

interface ModalAsignarPrioridadProps {
    open: boolean;
    handleCloseModalAsignarPrioridad: () => void;
    id: number | null;
    refetchIncidencias: () => void;
}

function ModalAsignarPrioridad({
    open,
    handleCloseModalAsignarPrioridad,
    refetchIncidencias,
    id
}: ModalAsignarPrioridadProps) {

    const HOST = import.meta.env.VITE_HOST;

    // Obtener prioridades
    const { data: prioridades, isLoading: isLoadingPrioridades } = useQuery<Prioridad[]>({
        queryKey: ["Prioridades"],
        queryFn: obtenerPrioridades,
    });

    async function obtenerPrioridades() {
        try {
            const response = await fetch(HOST + "api/obtenerPrioridades", {
                method: 'GET',
                headers: { 'x-frontend-header': 'frontend' }
            });

            const data = await response.json();
            return data.success ? data.result : [];

        } catch {
            throw new Error("OCURRIO UN ERROR");
        }
    }

    const [prioridadSeleccionada, setPrioridadSeleccionada] = useState<number>(0);
    const [error, setError] = useState<string>("");

    const handleOnchangePrioridad = (value: number) => {
        setPrioridadSeleccionada(value);
    };

    const handleClose = () => {
        handleCloseModalAsignarPrioridad();
    };

    async function submitAsignarPrioridad(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (prioridadSeleccionada === 0) {
            setError("Seleccione una prioridad");
            return;
        }

        try {
            const response = await fetch(HOST + "api/asignarPrioridad", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    prioridadId: prioridadSeleccionada,
                    incidenciaId: id
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg);
                handleClose();
                refetchIncidencias();
            } else {
                toast.error(data.msg);
            }

        } catch {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-prioridad-title"
            aria-describedby="modal-prioridad-description"
        >
            <Box sx={style} component="form" onSubmit={submitAsignarPrioridad}>
                <Typography id="modal-prioridad-title" variant="h6">
                    ASIGNAR PRIORIDAD
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="select-prioridad">PRIORIDAD</InputLabel>

                        <Select
                            labelId="select-prioridad"
                            value={prioridadSeleccionada}
                            onChange={(e) => handleOnchangePrioridad(e.target.value as number)}
                            label="PRIORIDAD"
                        >
                            {isLoadingPrioridades && <MenuItem value={0}>Cargando...</MenuItem>}

                            <MenuItem value={0} disabled>
                                Seleccione una prioridad
                            </MenuItem>

                            {prioridades?.map((prioridad) => (
                                <MenuItem key={prioridad.id} value={prioridad.id}>
                                    {prioridad.nombre}
                                </MenuItem>
                            )) || (
                                <MenuItem value={0}>No hay prioridades disponibles</MenuItem>
                            )}
                        </Select>

                        <FormHelperText error>{error}</FormHelperText>
                    </FormControl>

                    <Box sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" className="boton" fullWidth>
                            ASIGNAR PRIORIDAD
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalAsignarPrioridad;
