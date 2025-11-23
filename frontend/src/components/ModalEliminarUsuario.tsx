import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";

interface ModalEliminarUsuarioProps {
    open: boolean;
    setOpenModalEliminarUsuario: (value: boolean) => void;
    refetchUsuarios: () => void;
    id: number | null;
}

function ModalEliminarUsuario({ open, setOpenModalEliminarUsuario, refetchUsuarios, id }: ModalEliminarUsuarioProps) {

    const HOST = import.meta.env.VITE_HOST;

    const handleCloseModal = () => {
        setOpenModalEliminarUsuario(false);
    };

    async function submitEliminar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch(HOST + "api/eliminarPersona", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message || "Usuario eliminado correctamente");
                handleCloseModal();
                refetchUsuarios();
            } else {
                toast.error(data.message || "No se pudo eliminar el usuario");
            }

        } catch (error) {
            toast.error("OCURRIÓ UN ERROR");
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            aria-labelledby="modal-eliminar-usuario-title"
            aria-describedby="modal-eliminar-usuario-description"
        >
            <Box sx={style} component={"form"} onSubmit={submitEliminar}>
                <Typography id="modal-eliminar-usuario-title" variant="h6" component="h2">
                    ELIMINAR USUARIO
                </Typography>

                <Box id="modal-eliminar-usuario-description" sx={{ mt: 2 }}>

                    <Box sx={{ m: 2, width: "100%" }}>
                        <Typography component="h2">
                            ¿DESEA ELIMINAR AL USUARIO #{id}?
                        </Typography>
                    </Box>

                    <Box sx={{ m: 1, width: "100%" }}>
                        <Button type="submit" variant="contained" className="boton" fullWidth>
                            ELIMINAR USUARIO
                        </Button>
                    </Box>

                    <Box sx={{ m: 1, width: "100%" }}>
                        <Button variant="contained" className="boton-cancelar" fullWidth onClick={handleCloseModal}>
                            CANCELAR
                        </Button>
                    </Box>

                </Box>
            </Box>
        </Modal>
    );
}

export default ModalEliminarUsuario;
