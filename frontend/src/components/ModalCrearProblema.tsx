import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import toast from "react-hot-toast";

interface ModalCrearProblemaProps {
    open: boolean;
    handleClose: () => void;
    refetchProblemas: () => void;
}

function ModalCrearProblema({ open, handleClose, refetchProblemas }: ModalCrearProblemaProps) {
    const HOST = import.meta.env.VITE_HOST;

    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        solucion: "",
        horas: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.titulo || !form.descripcion || !form.solucion || !form.horas) {
            return toast.error("TODOS LOS CAMPOS SON OBLIGATORIOS");
        }

        try {
            const response = await fetch(HOST + "api/crearIncidenteCatalogo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    titulo: form.titulo,
                    descripcion: form.descripcion,
                    solucion: form.solucion,
                    horas_promedio: Number(form.horas),
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg || "Problema creado exitosamente");
                handleClose();
                refetchProblemas();

                setForm({
                    titulo: "",
                    descripcion: "",
                    solucion: "",
                    horas: "",
                });
            } else {
                toast.error(data.msg || "Error al crear problema");
            }
        } catch {
            toast.error("Ocurrió un error al crear el problema");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Crear nuevo problema
                </Typography>

                <TextField
                    label="Título"
                    name="titulo"
                    value={form.titulo}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Descripción"
                    multiline
                    rows={3}
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Solución"
                    multiline
                    rows={3}
                    name="solucion"
                    value={form.solucion}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Horas"
                    name="horas"
                    type="number"
                    value={form.horas}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <Button type="submit" variant="contained" className="boton" fullWidth>
                    Crear Problema
                </Button>
            </Box>
        </Modal>
    );
}

export default ModalCrearProblema;
