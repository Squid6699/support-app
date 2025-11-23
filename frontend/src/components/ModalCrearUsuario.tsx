import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

interface ModalAgregarUsuarioProps {
    open: boolean;
    setOpenModalUsuario: (value: boolean) => void;
    refetchUsuarios: () => void;
}

function ModalAgregarUsuario({ open, setOpenModalUsuario, refetchUsuarios }: ModalAgregarUsuarioProps) {

    const HOST = import.meta.env.VITE_HOST;

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");

    const [roles, setRoles] = useState<any[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    // ERRORES POR CAMPO
    const [errors, setErrors] = useState({
        nombre: "",
        correo: "",
        password: "",
        rol: ""
    });

    const handleClose = () => {
        setOpenModalUsuario(false);

        // limpiar inputs y errores al cerrar
        setNombre("");
        setCorreo("");
        setPassword("");
        setRol("");
        setErrors({
            nombre: "",
            correo: "",
            password: "",
            rol: ""
        });
    };

    async function fetchRoles() {
        try {
            const response = await fetch(HOST + "api/obtenerRoles", {
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend"
                },
            });

            const data = await response.json();

            if (data.success) {
                setRoles(data.result);
            } else {
                toast.error("No se pudieron cargar los roles");
            }

        } catch (error) {
            toast.error("Error al cargar roles");
        } finally {
            setLoadingRoles(false);
        }
    }

    useEffect(() => {
        if (open) fetchRoles();
    }, [open]);


    // -----------------------------
    // VALIDACIÓN PERSONALIZADA
    // -----------------------------
    function validarFormulario() {
        const newErrors: any = {};

        if (!nombre.trim()) newErrors.nombre = "Ingrese el nombre del usuario.";
        if (!correo.trim()) newErrors.correo = "Ingrese un correo válido.";
        if (!password.trim()) newErrors.password = "Ingrese una contraseña.";
        if (!rol) newErrors.rol = "Seleccione un rol.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }


    async function submitUsuario(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validarFormulario()) return;

        try {
            const response = await fetch(HOST + "api/crearPersona", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend"
                },
                body: JSON.stringify({
                    nombre,
                    correo,
                    password,
                    "rol_id": rol
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.msg);
                handleClose();
                refetchUsuarios();
            } else {
                toast.error(data.msg);
            }

        } catch (error) {
            toast.error("OCURRIÓ UN ERROR AL CREAR EL USUARIO");
        }
    }


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} component={"form"} onSubmit={submitUsuario}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    AGREGAR USUARIO
                </Typography>

                <Box id="modal-modal-description" sx={{ mt: 2 }}>

                    {/* NOMBRE */}
                    <Box sx={{ m: 1, width: "100%" }}>
                        <TextField
                            label="Nombre completo"
                            fullWidth
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                        {errors.nombre && (
                            <Typography color="error" sx={{ fontSize: "14px", mt: 0.5 }}>
                                {errors.nombre}
                            </Typography>
                        )}
                    </Box>

                    {/* CORREO */}
                    <Box sx={{ m: 1, width: "100%" }}>
                        <TextField
                            label="Correo electrónico"
                            type="email"
                            fullWidth
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                        {errors.correo && (
                            <Typography color="error" sx={{ fontSize: "14px", mt: 0.5 }}>
                                {errors.correo}
                            </Typography>
                        )}
                    </Box>

                    {/* PASSWORD */}
                    <Box sx={{ m: 1, width: "100%" }}>
                        <TextField
                            label="Contraseña"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <Typography color="error" sx={{ fontSize: "14px", mt: 0.5 }}>
                                {errors.password}
                            </Typography>
                        )}
                    </Box>

                    {/* SELECT ROL */}
                    <Box sx={{ m: 1, width: "100%" }}>
                        <TextField
                            select
                            label="Rol"
                            fullWidth
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                        >
                            {loadingRoles ? (
                                <MenuItem disabled>Cargando roles...</MenuItem>
                            ) : (
                                roles.map((r) => (
                                    <MenuItem key={r.id} value={r.id}>
                                        {r.nombre}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>

                        {errors.rol && (
                            <Typography color="error" sx={{ fontSize: "14px", mt: 0.5 }}>
                                {errors.rol}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ m: 1, width: "100%" }}>
                        <Button type="submit" variant="contained" className="boton" fullWidth>
                            AGREGAR USUARIO
                        </Button>
                    </Box>

                    <Box sx={{ m: 1, width: "100%" }}>
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
            </Box>
        </Modal>
    );
}

export default ModalAgregarUsuario;
