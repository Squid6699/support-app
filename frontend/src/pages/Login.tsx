import { useState } from 'react'
import "../css/login.css"
import logoTec from "../assets/logosistemas.png"
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {useSesion} from "../hook/useSesion.ts"
import LoadingButton from '@mui/lab/LoadingButton';
import toast from 'react-hot-toast';

function Login(){
    const HOST = import.meta.env.VITE_HOST
    const {setUsuario, setCorreo, setRol, setCelular, setId} = useSesion();
    const [correo, setCorreoLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({correo: false, password: false})
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const submitFormLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!correo){
            setError(prevState => ({...prevState, correo: true}))
            return
        }

        if (!password){
            setError(prevState => ({...prevState, password: true}))
            return
        }

        try{
            setLoading(true);
            const response = await fetch(HOST+"api/auth/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'x-frontend-header': 'frontend',
                },
                body: JSON.stringify({ correo: correo, contrasena: password }),
                credentials: "include"
            })

            const data = await response.json()
            console.log(data);
            if (data.success){
                setId(data.id);
                setUsuario(data.usuario);
                setCorreo(data.correo);
                setCelular(data.celular);
                setRol(data.rol);
                setLoading(false);
                window.location.href = "/";
            }else{
                toast.error(data.msg);
                setLoading(false);
            }

        }catch(Exce){
            setLoading(false);
        }
    }

    return(
        <>
            <section className='container'>
                <main className='contenedorForm'>

                    <div style={{textAlign: "center"}}>
                        <img src= {logoTec} alt="Tecnm - Culiacan"/>
                        <h4>Aqui va un buen titulo</h4>
                    </div>
                    
                    <form className = "formLogin" onSubmit={submitFormLogin}>
                        <div className='formGroup'>
                            <Box
                                sx={{ '& > :not(style)': { m: 1, width: '60%' } }}
                                >
                                <TextField id="correoForm" label="Correo" variant="outlined" value={correo} onChange={(e) => setCorreoLogin(e.target.value)} error = {error.correo} helperText = {error.correo && "Correo Invalido"}/>
                            </Box>
                        </div>
                        <div className='formGroup'>
                            <Box
                                sx={{ '& > :not(style)': { m: 1, width: '60%' } }}
                                >
                                <TextField 
                                id="passwordForm" 
                                label="Contraseña" 
                                variant="outlined" 
                                type={showPassword ? 'text' : 'password'}
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                error = {error.password} 
                                helperText = {error.password && "Contraseña Invalida"}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                />
                            </Box>
                        </div>

                        <div className='formGroup'>
                            <Box sx={{ '& > :not(style)': { m: 1, width: '60%' } }}>
                                <LoadingButton id = "btnLoading" loading={loading} type="submit" variant="contained">
                                    Iniciar Sesión
                                </LoadingButton>
                            </Box>
                        </div>
                    </form>
                </main>
            </section>
        </>
    );
}

export default Login;