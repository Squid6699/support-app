import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import TextField from "@mui/material/TextField";
import { useState } from "react";


interface ModalCalificarServicioProps {
    open: boolean;
    refetchServicio: () => void;
    id: number | null;
    handleCloseModalCalificarServicio: () => void;
}

function ModalCalificarServicio({ open, handleCloseModalCalificarServicio, refetchServicio, id }: ModalCalificarServicioProps) {
    const HOST = import.meta.env.VITE_HOST

    const [calificacion, setCalificacion] = useState<number>(0);

    async function submitIncidencia(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();


        try {
            const response = await fetch(HOST + "api/calificarServicio", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend',
                },
                body: JSON.stringify({ "id": id, "calificacion": calificacion }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.msg);
                handleCloseModalCalificarServicio();
                refetchServicio();
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
                onClose={handleCloseModalCalificarServicio}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} component={"form"} onSubmit={submitIncidencia}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        CALIFICAR SERVICIO
                    </Typography>
                    <Box id="modal-modal-description" sx={{ mt: 2 }}>

                        <Box sx={{ m: 2, width: '100%' }}>
                            <Typography id="modal-modal-title" component="h2">
                                SERVICIO A CALIFICAR
                            </Typography>
                        </Box>

                        <Box
                            sx={{ m: 2, width: '100%' }}
                        >
                            <TextField id="outlined-basic" label="CALIFICACION" variant="outlined" defaultValue={0} fullWidth onChange={(e) => setCalificacion(Number(e.target.value))} />
                        </Box>

                        <Box sx={{ m: 1, width: '100%' }}>
                            <Button type="submit" variant="contained" className="boton" fullWidth>
                                CALIFICAR SERVICIO
                            </Button>
                        </Box>
                        
                    </Box>
                </Box >
            </Modal >
        </>
    );
}
export default ModalCalificarServicio;