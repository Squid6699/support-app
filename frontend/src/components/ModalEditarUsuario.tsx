import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../css/componentsStyle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import type { Usuario } from "../../types";

interface ModalEditarUsuarioProps {
    open: boolean;
    setOpenModalEditarUsuario: (value: boolean) => void;
    refetchUsuarios: () => void;
    usuario: Usuario | null;
}

function ModalEditarUsuario({ open, setOpenModalEditarUsuario, refetchUsuarios, usuario }: ModalEditarUsuarioProps) {
    const HOST = import.meta.env.VITE_HOST;

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [celular, setCelular] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");

    const [roles, setRoles] = useState<any[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    // Errores individuales por campo
    const [errors, setErrors] = useState({
        nombre: "",
        correo: "",
        celular: "",
        password: "",
        rol: ""
    });


    const handleClose = () => {
        setOpenModalEditarUsuario(false);

        // limpiar estados
        setErrors({ nombre: "", correo: "", celular: "", password: "", rol: "" });
    };


    // -----------------------------
    // CARGAR ROLES
    // -----------------------------
    async function fetchRoles() {
        try {
            const response = await fetch(HOST + "api/obtenerRoles", {
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend",
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


    // -----------------------------
    // CARGAR DATOS DEL USUARIO A EDITAR
    // -----------------------------
    useEffect(() => {
        if (open && usuario) {
            setNombre(usuario.nombre || "");
            setCorreo(usuario.correo || "");
            setCelular(usuario.celular || "");
            setPassword(usuario.contraseña || "");
            setRol(usuario.rol_id?.toString() || "");
            fetchRoles();
        }
    }, [open, usuario]);


    // -----------------------------
    // VALIDACIÓN PERSONALIZADA
    // -----------------------------
    function validarFormulario() {
        const newErrors: any = {};

        if (!nombre.trim()) newErrors.nombre = "Ingrese el nombre.";
        if (!correo.trim()) newErrors.correo = "Ingrese el correo.";
        if (!celular.trim()) newErrors.celular = "Ingrese un número celular.";
        if (!password.trim()) newErrors.password = "Ingrese la contraseña.";
        if (!rol) newErrors.rol = "Seleccione un rol.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }


    // -----------------------------
    // SUBMIT
    // -----------------------------
    async function submitUsuario(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!validarFormulario()) return;

        try {
            const response = await fetch(HOST + "api/editarPersona", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-frontend-header": "frontend"
                },
                body: JSON.stringify({
                    id: usuario?.id,
                    nombre,
                    celular,
                    correo,
                    contraseña: password,
                    rol_id: rol
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                handleClose();
                refetchUsuarios();
            } else {
                toast.error(data.message || "Error al actualizar");
            }

        } catch (error) {
            toast.error("OCURRIÓ UN ERROR AL ACTUALIZAR");
        }
    }


    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style} component={"form"} onSubmit={submitUsuario}>
                <Typography variant="h6">
                    EDITAR USUARIO
                </Typography>

                <Box sx={{ mt: 2 }}>

                    {/* NOMBRE */}
                    <Box sx={{ m: 1, width: "100%" }}>
                        <TextField
                            label="Nombre"
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

                    {/* CELULAR */}
                    <Box sx={{ m: 1, width: "100%" }}>
                        <TextField
                            label="Celular"
                            fullWidth
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                        />
                        {errors.celular && (
                            <Typography color="error" sx={{ fontSize: "14px", mt: 0.5 }}>
                                {errors.celular}
                            </Typography>
                        )}
                    </Box>

                    {/* CORREO */}
                    <Box sx={{ m: 1, width: "100%" }}>
                        <TextField
                            label="Correo"
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

                    {/* CONTRASEÑA */}
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

                    {/* BOTONES */}
                    <Box sx={{ m: 1, width: "100%" }}>
                        <Button type="submit" variant="contained" className="boton" fullWidth>
                            GUARDAR CAMBIOS
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

export default ModalEditarUsuario;
