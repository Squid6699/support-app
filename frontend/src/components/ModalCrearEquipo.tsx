import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import toast from "react-hot-toast";
import { style } from "../css/componentsStyle";
import { useState } from "react";

import type { AulaEquipos } from "../../types";

interface ModalCrearEquipoProps {
    open: boolean;
    handleClose: () => void;
    aulas: AulaEquipos[];
    refetchAulas: () => void;
}

function ModalCrearEquipo({ open, handleClose, aulas, refetchAulas }: ModalCrearEquipoProps) {
    const HOST = import.meta.env.VITE_HOST;

    const [nombre, setNombre] = useState("");
    const [aulaId, setAulaId] = useState<number | "">("");

    async function submitEquipo(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.error("INTRODUCE UN NOMBRE PARA EL EQUIPO");
            return;
        }

        if (!aulaId) {
            toast.error("SELECCIONA UN AULA");
            return;
        }

        try {
            const response = await fetch(HOST + "api/crearEquipo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    nombre,
                    aula_id: aulaId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("EQUIPO CREADO CORRECTAMENTE");

                setNombre("");
                setAulaId("");

                handleClose();
                refetchAulas();
            } else {
                toast.error(data.msg || "ERROR AL CREAR EQUIPO");
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={submitEquipo}>
                <Typography variant="h6">CREAR EQUIPO</Typography>

                {/* Nombre del equipo */}
                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="NOMBRE DEL EQUIPO"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </Box>

                {/* Select de Aulas */}
                <Box sx={{ mt: 3 }}>
                    <FormControl fullWidth>
                        <InputLabel id="select-aula-label">AULA</InputLabel>
                        <Select
                            labelId="select-aula-label"
                            label="AULA"
                            value={aulaId}
                            onChange={(e) => setAulaId(Number(e.target.value))}
                        >
                            {aulas.map((a) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                {/* Botón Crear */}
                <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" className="boton" fullWidth>
                        CREAR EQUIPO
                    </Button>
                </Box>

                {/* Botón Cancelar */}
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

export default ModalCrearEquipo;
