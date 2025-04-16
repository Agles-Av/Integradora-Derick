import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { login } from '../../services/authservice/LoginService';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import { Dialog } from 'primereact/dialog';
import { sendEmail } from '../../services/authservice/RecuperarContrasena';
import AuthContext from '../../config/context/auth-context';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const { dispatch } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validaciones
        const newErrors = {};
        const usernameValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(username);
        if (!usernameValid) newErrors.username = 'El correo electrónico no es válido';
        if (!username.trim()) newErrors.username = 'El usuario es requerido';
        if (!password.trim()) newErrors.password = 'La contraseña es requerida';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        try {
            const response = await login(username, password);
            dispatch({
                type: 'SIGN_IN',
                payload: {
                    token: response.token,
                    user: response.user
                }
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const sendEmailRecover = async () => {
        
        try {
            await sendEmail(email);
            setVisible(false);
        } catch (error) {
        }finally{
            setEmail('');
            setVisible(false);
        }
    }
    const handleClose = () => {
        setEmail('');
        setErrors({});
        setVisible(false);
    }
    return (
        <div className="flex justify-content-center align-items-center h-screen text-primary ">
            <div
                className="fixed top-0 left-0 w-full h-full overflow-hidden z-0"
                style={{ pointerEvents: 'none' }}
            >
                <Player
                    autoplay
                    loop
                    src="/src/assets/animations/Animation - 1743203645744.json"
                    style={{ position: 'absolute', zIndex: -1, width: '100%', height: '100%' }}
                />
            </div>

            <Card
                title={
                    <div className="text-center mb-4">
                        <img src="/src/assets/logo.png" alt="CAMILA FINANZAS" width={100} height={100} />
                    </div>
                }
                className=" w-24rem text-primary z-1 "
                style={{
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo semi-transparente
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                }}
            >
                <div >
                    <form onSubmit={handleSubmit}>
                        <div>
                            <FloatLabel>
                                <InputText
                                    id="username"
                                    className="w-full"
                                    value={username}
                                    onChange={(e) => {
                                        const value = e.target.value.trim();
                                        setUsername(value);
                                        setErrors(prev =>{
                                            const newErrors = {...prev};
                                            if(value && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)){
                                                delete newErrors.username;
                                            }
                                            return newErrors;
                                        });
                                    }}
                                    maxLength={76}
                                />
                                <label htmlFor="username">
                                    <i className="pi pi-user mr-2"></i> Usuario
                                </label>
                            </FloatLabel>
                            {errors.username && <small className="p-error">{errors.username}</small>}
                        </div>

                        <div className='mt-4'>
                            <FloatLabel>
                                <InputText
                                    id="password"
                                    className="w-full"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        const value = e.target.value.trim();
                                        setPassword(value);
                                    
                                        setErrors(prev => {
                                            const newErrors = { ...prev };
                                            if (value) {
                                                delete newErrors.password;
                                            }
                                            return newErrors;
                                        });
                                    }}
                                    maxLength={76}
                                    
                                />
                                <label htmlFor="password">
                                    <i className="pi pi-lock mr-2"></i> Contraseña
                                </label>
                            </FloatLabel>
                            {errors.password && <small className="p-error">{errors.password}</small>}
                        </div>

                        <div className='mt-4 h-full w-full'>
                            <Button
                                label='Iniciar sesión'
                                type='submit'
                                className='w-full'
                                disabled={!username || !password || Object.keys(errors).length > 0}
                            />
                        </div>
                    </form>
                    <div className=' mt-4'>
                        <p className="text-center">
                            <a href="/register" >
                                ¿No tienes cuenta? crea una
                            </a>
                        </p>
                        <p className="text-center">
                            <a onClick={() => setVisible(true)} className=' text-primary cursor-pointer'>
                                Has clic aquí si olvidaste tu contraseña
                            </a>
                        </p>
                    </div>
                </div>
            </Card>

            <Dialog header="Ingrese correo de recuperación" visible={visible} onHide={() => handleClose()}
            style={{ width: '30vw' }} 
            >
                    <div className="mt-3 ">
                        <FloatLabel>
                            <InputText
                                id="email"
                                className="w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email" className=''>
                                <i className="pi pi-envelope mr-2"></i> Correo electrónico
                            </label>
                        </FloatLabel>
                        <Button label='Enviar' onClick={()=>sendEmailRecover()}  className=' mt-4 w-full' 
                            disabled={!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)}
                            />
                    </div>

               
            </Dialog>
        </div>
    );
}

export default Login;