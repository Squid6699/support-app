import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { style } from "../css/componentsStyle";
import toast from "react-hot-toast";

interface ModalEliminarProblemaProps {
    open: boolean;
    problemaId: number | null;
    handleClose: () => void;
    refetchProblemas: () => void;
}

function ModalEliminarProblema({ open, problemaId, handleClose, refetchProblemas }: ModalEliminarProblemaProps) {
    const HOST = import.meta.env.VITE_HOST;
    
    const handleDelete = async () => {
        try {
            const response = await fetch(HOST + "api/eliminarIncidenteCatalogo", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({ id: problemaId }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg || "Eliminado correctamente");
                handleClose();
                refetchProblemas();
            } else {
                toast.error(data.msg || "Error al eliminar");
            }
        } catch {
            toast.error("OCURRIO UN ERROR");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                    ¿Eliminar este problema?
                </Typography>

                <Button variant="contained" className="boton" onClick={handleDelete} fullWidth sx={{ mb: 2 }}>
                    ELIMINAR
                </Button>

                <Button variant="contained" className="boton-cancelar" onClick={handleClose} fullWidth>
                    CANCELAR
                </Button>
            </Box>
        </Modal>
    );
}

export default ModalEliminarProblema;
