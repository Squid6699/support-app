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
import { useEffect, useState } from "react";

import type { AulaEquipos, Equipo } from "../../types";

interface ModalEditarEquipoProps {
    open: boolean;
    handleClose: () => void;
    aulas: AulaEquipos[];
    equipo: Equipo | null;
    refetchAulas: () => void;
}

function ModalEditarEquipo({
    open,
    handleClose,
    aulas,
    equipo,
    refetchAulas
}: ModalEditarEquipoProps) {

    const HOST = import.meta.env.VITE_HOST;

    const [nombre, setNombre] = useState("");
    const [aulaId, setAulaId] = useState<number | "">("");

    // Cargar valores cuando se selecciona un equipo
    useEffect(() => {
        
        if (equipo) {
            setNombre(equipo.nombre);
            setAulaId(equipo.aula_id ?? "");
        }
    }, [equipo]);
    if (!equipo) return null;

    async function submitEditarEquipo(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!equipo) return;

        if (!nombre.trim()) {
            toast.error("INTRODUCE UN NOMBRE PARA EL EQUIPO");
            return;
        }

        // if (!aulaId) {
        //     toast.error("SELECCIONA UN AULA");
        //     return;
        // }

        try {
            const response = await fetch(HOST + "api/editarEquipo", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    id: equipo.id,
                    nombre,
                    aula_id: aulaId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("EQUIPO EDITADO CORRECTAMENTE");

                handleClose();
                refetchAulas();
            } else {
                toast.error(data.msg || "ERROR AL EDITAR EQUIPO");
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={submitEditarEquipo}>
                <Typography variant="h6">EDITAR EQUIPO</Typography>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        label="NOMBRE DEL EQUIPO"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </Box>

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

                <Box sx={{ mt: 3 }}>
                    <Button type="submit" variant="contained" className="boton" fullWidth>
                        GUARDAR CAMBIOS
                    </Button>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <Button variant="contained" fullWidth className="boton-cancelar" onClick={handleClose}>
                        CANCELAR
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalEditarEquipo;
