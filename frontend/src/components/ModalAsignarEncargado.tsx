import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { style } from "../css/componentsStyle";
import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";
import type { Encargados } from "../../types";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;
    edificioId: number | null;
    refetch: () => void;
}

function ModalAsignarEncargado({ open, setOpen, edificioId, refetch }: Props) {
    const HOST = import.meta.env.VITE_HOST;
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");

    const { data: usuarios = [] } = useQuery<Encargados[]>({
        queryKey: ["usuarios"],
        queryFn: async () => {
            const res = await fetch(HOST + "api/ObtenerEncargados", {
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
            });
            const data = await res.json();
            return data.success ? data.result : [];
        }
    });

    const handleClose = () => {
        setUsuarioSeleccionado("");
        setOpen(false);
    };

    async function asignarEncargado(e: React.FormEvent) {
        e.preventDefault();

        if (!usuarioSeleccionado || !edificioId) return;

        const response = await fetch(HOST + "api/asignarEncargado", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-frontend-header": "frontend",
            },
            body: JSON.stringify({
                "edificio_id": edificioId,
                "encargado_id": usuarioSeleccionado,
            }),
        });

        const data = await response.json();

        if (data.success) {
            toast.success(data.msg);
            handleClose();
            refetch();
        } else {
            toast.error(data.msg);
        }
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={asignarEncargado}>
                <Typography variant="h6">ASIGNAR ENCARGADO</Typography>

                <Box sx={{ mt: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel>Usuario</InputLabel>
                        <Select
                            label="Usuario"
                            value={usuarioSeleccionado}
                            onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                        >
                            {usuarios?.length > 0 ? (
                                usuarios?.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.nombre}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No hay usuarios</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        className="boton"
                        fullWidth
                        disabled={!usuarioSeleccionado}
                    >
                        ASIGNAR ENCARGADO
                    </Button>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Button
                        variant="contained"
                        className="boton-cancelar"
                        fullWidth
                        onClick={handleClose}
                    >
                        CANCELAR
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalAsignarEncargado;
