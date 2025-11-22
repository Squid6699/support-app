import { useState } from "react";
import { useSesion } from "../hook/useSesion";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import logo from "../assets//logosistemas.png";
import SummarizeIcon from '@mui/icons-material/Summarize';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DevicesIcon from '@mui/icons-material/Devices';
import ExtensionIcon from '@mui/icons-material/Extension';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LogoutIcon from '@mui/icons-material/Logout';
import Incidencias from "../pages/Incidencias";
import IncidenciasLiberadasEncargado from "../pages/IncidenciasLiberadasEncargado";
import EquiposEncargado from "../pages/EquiposEncargado";
import ServiciosEquipoEncargado from "../pages/ServiciosEquipoEncargado";
import IncidenciasAsignadasTecnico from "../pages/IncidenciaAsignadasTecnico";
import IncidenciasAdmin from "../pages/IncidenciasAdmin";
import ServiciosDadosTecnico from "../pages/ServiciosDadosTecnico";
import IncidenciasLiberadasAdmin from "../pages/incidenciasLiberadasAdmin";
import ServiciosEquipoEncargadoAdmin from "../pages/ServiciosEquipoAdmin";

const drawerWidth = 200;

function ResponsiveDrawer() {
    const HOST = import.meta.env.VITE_HOST;
    const { usuario, rol } = useSesion();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedContent, setSelectedContent] = useState("Proyectos");

    const handleContentChange = (content: string) => {
        setSelectedContent(content);
        setMobileOpen(false);
    };

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const handleCerrarSesion = async () => {
        try {
            const response = await fetch(HOST + "api/logout", {
                method: "GET",
                headers: {
                    "X-Custom-Header": "my-frontend-identifier",
                },
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = "/";
            }
        } catch (error) { }
    };

    const drawer = (
        <div>
            <Toolbar>
                <img className="headerLogo" src={logo} alt="" />
            </Toolbar>
            <Divider />

            {rol === "Administrador" && (
                <>
                    <Divider />
                    <List>
                        {[
                            "Incidencias Creadas",
                            "Incidencias Liberadas",
                            "Servicios",
                            "Ubicaciones",
                            "Usuarios",
                            "Equipos",
                            "Piezas",
                            "Marcas",
                            "Prioridades",
                        ].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={() => handleContentChange(text)}>
                                    <ListItemIcon>
                                        {index === 0 && <SummarizeIcon />}
                                        {index === 1 && <SummarizeIcon />}
                                        {index === 2 && <ElectricalServicesIcon />}
                                        {index === 3 && <RoomPreferencesIcon />}
                                        {index === 4 && <AccountCircleIcon />}
                                        {index === 5 && <DevicesIcon />}
                                        {index === 6 && <ExtensionIcon />}
                                        {index === 7 && <BookmarkIcon />}
                                        {index === 8 && <PriorityHighIcon />}

                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            {(rol === "Tecnico Hardware" || rol === "Tecnico Software") && (
                <>
                    <Divider />
                    <List>
                        {[
                            "Incidencias Asignadas",
                            "Servicios realizados",
                            "Ubicaciones",
                        ].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={() => handleContentChange(text)}>
                                    <ListItemIcon>
                                        {index === 0 && <SummarizeIcon />}
                                        {index === 1 && <ElectricalServicesIcon />}
                                        {index === 2 && <RoomPreferencesIcon />}

                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            {rol === "Encargado Edificio" && (
                <>
                    <Divider />
                    <List>
                        {[
                            "Incidencias",
                            "Incidencias Liberadas",
                            "Equipos",
                            "Servicios de mis equipos",
                        ].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton onClick={() => handleContentChange(text)}>
                                    <ListItemIcon>
                                        {index === 0 && <SummarizeIcon />}
                                        {index === 1 && <SummarizeIcon />}
                                        {index === 2 && <DevicesIcon />}
                                        {index === 3 && <ElectricalServicesIcon />}

                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            <Divider />
            <List>
                {["Cerrar Sesion"].map((text) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton onClick={() => handleContentChange(text)}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    if (selectedContent === "Cerrar Sesion") {
        handleCerrarSesion();
    }

    return (
        <Box sx={{ display: "flex" }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: "var(--main-color)",
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {usuario} - {rol}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                    maxWidth: "92%",
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />

                {/* CONTEN MAIN */}
                {selectedContent === "Incidencias Asignadas" && <IncidenciasAsignadasTecnico />}
                {selectedContent === "Incidencias" && <Incidencias />}
                {selectedContent === "Incidencias Liberadas" && rol === "Administrador" && <IncidenciasLiberadasAdmin />}
                {selectedContent === "Servicios" && rol === "Administrador" && <ServiciosEquipoEncargadoAdmin />}

                {selectedContent === "Incidencias Liberadas" && rol === "Encargado Edificio" && <IncidenciasLiberadasEncargado />}
                {selectedContent === "Servicios de mis equipos" && <ServiciosEquipoEncargado />}

                {selectedContent === "Incidencias Creadas" && <IncidenciasAdmin />}



                {selectedContent === "Ubicaciones" && <div>Contenido de Ubicaciones</div>}
                {selectedContent === "Usuarios" && <div>Contenido de Usuarios</div>}
                {selectedContent === "Equipos" && <EquiposEncargado />}
                {selectedContent === "Piezas" && <div>Contenido de Piezas</div>}
                {selectedContent === "Marcas" && <div>Contenido de Marcas</div>}
                {selectedContent === "Prioridades" && <div>Contenido de Prioridades</div>}

                {selectedContent === "Servicios realizados" && <ServiciosDadosTecnico />}



            </Box>
        </Box>
    );
}

export default ResponsiveDrawer;