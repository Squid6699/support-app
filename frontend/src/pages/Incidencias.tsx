import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Incidencia } from "../../types";
import TextField from "@mui/material/TextField";
import { useSesion } from "../hook/useSesion";

function Incidencias() {

    const { id, usuario } = useSesion();

    const [openModalIncidencia, setOpenModalIncidencia] = useState(false);

    const handleOpenModalIncidencia = () => {
        setOpenModalIncidencia(true);
    }

    const handleCloseModalIncidencia = () => {
        setOpenModalIncidencia(false);
    }

    const [incidenciaValue, setIncidenciaValue] = useState<Incidencia>({
        fecha: '',
        descripcion: '',
        usuario_id: id,
        tecnico_id: 0,
        equipo_id: 0,
        prioridad_id: 0
    });

    const handleValueChangeIncidencia = (newValue: any) => {
        setIncidenciaValue({ ...incidenciaValue, ...newValue });
    }

    // SACAR TODOS LOS TECNICOS
    // SACAR EQUIPOS DE LOS EDIFICIOS
    // SACAR PRIORIDADES

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (

        <>
            <header>
                <Button className="boton" variant="contained" startIcon={<AddCircleIcon />} onClick={handleOpenModalIncidencia}>
                    CREAR
                </Button>
            </header>
            <Modal
                open={openModalIncidencia}
                onClose={handleCloseModalIncidencia}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Nueva incidencia
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                        <Box
                            component="form"
                            sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
                            noValidate
                            autoComplete="off"
                        >
                            <div>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Descripcion"
                                    multiline
                                    rows={4}
                                    defaultValue= {incidenciaValue.descripcion}
                                    onChange={(e) => handleValueChangeIncidencia({ descripcion: e.target.value })}
                                />
                            </div>
                            <TextField id="outlined-basic" label="Encargado" variant="outlined" defaultValue={usuario} disabled />

                        </Box>
                    </Typography>
                </Box>
            </Modal>

        </>

    );
}
export default Incidencias;