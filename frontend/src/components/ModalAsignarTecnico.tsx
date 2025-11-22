import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useQuery } from "@tanstack/react-query";
import type { Usuario } from "../../types";
import { useState } from "react";
import FormHelperText from "@mui/material/FormHelperText";

interface ModalAsignarTecnicoProps {
    open: boolean;
    handleCloseModalAsignarTecnico: () => void;
    id: number | null;
    refetchIncidencias: () => void;
}

function ModalAsignarTecnico({ open, handleCloseModalAsignarTecnico, refetchIncidencias, id }: ModalAsignarTecnicoProps) {
    const HOST = import.meta.env.VITE_HOST


    const { data: usuarios, isLoading: isLoadingUsuarios } = useQuery<Usuario[]>({
        queryKey: ["Usuarios"],
        queryFn: obtenerTecnicos,
    });

    //SACAR TECNICOS
    async function obtenerTecnicos() {
        try {
            const response = await fetch(HOST + "api/obtenerTecnicos", {
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

    const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<number>(0);
    const [error, setError] = useState<string>("");

    const handleOnchangeTecnico = (tecnicoId: number) => {
        setTecnicoSeleccionado(tecnicoId);
    }


    const handleCloseModalIncidencia = () => {
        handleCloseModalAsignarTecnico();
    }

    async function submitAsignarTecnico(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (tecnicoSeleccionado === 0) {
            setError("Seleccione un técnico");
            return;
        }

        try {
            const response = await fetch(HOST + "api/asignarTecnico/", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend',
                },
                body: JSON.stringify({ "tecnicoId": tecnicoSeleccionado, "incidenciaId": id }),
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
        <>

            <Modal
                open={open}
                onClose={handleCloseModalIncidencia}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={"form"} onSubmit={submitAsignarTecnico}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        ASIGNAR INCIDENCIA
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-autowidth-label">TECNICO</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={tecnicoSeleccionado}
                                onChange={(e) => handleOnchangeTecnico(e.target.value as number)}
                                label="Tecnico"
                            >
                                {isLoadingUsuarios ? <MenuItem value={0}>Cargando...</MenuItem> : null}
                                <MenuItem value={0} selected disabled>Seleccione un tecnico</MenuItem>
                                {usuarios ? usuarios.map((usuario) => (
                                    <MenuItem key={usuario.id} value={usuario.id}>{usuario.nombre}</MenuItem>
                                )) : <MenuItem key={0} value={0}>No hay tecnicos disponibles</MenuItem>}
                            </Select>
                            <FormHelperText error>{error}</FormHelperText>
                        </FormControl>

                        <Box sx={{ m: 1, width: '100%' }}>
                            <Button type="submit" variant="contained" className="boton" fullWidth>
                                ASIGNAR INCIDENCIA
                            </Button>
                        </Box>

                    </Box>
                </Box >
            </Modal >
        </>
    );
}
export default ModalAsignarTecnico;