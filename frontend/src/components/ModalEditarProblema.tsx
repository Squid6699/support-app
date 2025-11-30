import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

interface ModalEditarProblemaProps {
    open: boolean;
    problema: any; 
    handleClose: () => void;
    refetchProblemas: () => void;
}

function ModalEditarProblema({ open, problema, handleClose, refetchProblemas }: ModalEditarProblemaProps) {
    const HOST = import.meta.env.VITE_HOST;

    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        solucion: "",
        horas: "",
    });

    useEffect(() => {
        if (problema) {
            setForm({
                titulo: problema.titulo_catalogo_incidente,
                descripcion: problema.descripcion_catalogo_incidente,
                solucion: problema.solucion_catalogo_incidente,
                horas: problema.horas_promedio_catalogo_incidente,
            });
        }
    }, [problema]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(HOST + "api/editarIncidenteCatalogo", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({
                    id_catalogo_incidente: problema.id_catalogo_incidente,
                    titulo: form.titulo,
                    descripcion: form.descripcion,
                    solucion: form.solucion,
                    horas_promedio: Number(form.horas),
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg || "Problema actualizado");
                handleClose();
                refetchProblemas();
            } else {
                toast.error(data.msg || "Error al actualizar");
            }
        } catch {
            toast.error("OCURRIO UN ERROR");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Editar Problema
                </Typography>

                <TextField label="Titulo" name="titulo" value={form.titulo} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Descripción" multiline rows={3} name="descripcion" value={form.descripcion} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Solución" multiline rows={3} name="solucion" value={form.solucion} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
                <TextField label="Horas" type="number" name="horas" value={form.horas} onChange={handleChange} fullWidth sx={{ mb: 2 }} />

                <Button type="submit" variant="contained" className="boton" fullWidth>
                    Guardar Cambios
                </Button>
            </Box>
        </Modal>
    );
}

export default ModalEditarProblema;
