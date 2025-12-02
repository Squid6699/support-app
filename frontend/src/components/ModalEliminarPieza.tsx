import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import { style } from "../css/componentsStyle";

interface ModalEliminarPiezaProps {
    open: boolean;
    handleClose: () => void;
    refetchPiezas: () => void;
    id: number;
}


function ModalEliminarPieza({ open, handleClose, refetchPiezas, id }: ModalEliminarPiezaProps) {
    const HOST = import.meta.env.VITE_HOST;


    async function submitEliminar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();


        try {
            const response = await fetch(HOST + "api/eliminarPieza", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({ id }),
            });


            const data = await response.json();


            if (data.success) {
                toast.success(data.msg);
                handleClose();
                refetchPiezas();
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }


    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={submitEliminar}>
                <Typography variant="h6">ELIMINAR PIEZA</Typography>


                <Box sx={{ mt: 2 }}>
                    <Typography>¿DESEA ELIMINAR LA PIEZA #{id}?</Typography>
                </Box>


                <Box sx={{ mt: 3 }}>
                    <Button type="submit" className="boton" variant="contained" fullWidth>
                        ELIMINAR PIEZA
                    </Button>
                </Box>


                <Box sx={{ mt: 1 }}>
                    <Button variant="contained" className="boton-cancelar" fullWidth onClick={handleClose}>
                        CANCELAR
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}


export default ModalEliminarPieza;