import React, { use, useState } from 'react';
import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { login } from '../../services/authservice/LoginService';
import { useNavigate } from 'react-router-dom';
import { Player } from '@lottiefiles/react-lottie-player';
import AuthContext from '../../config/context/auth-context';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
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

    return (
        <div className="flex justify-content-center align-items-center h-screen text-primary">
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
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <label htmlFor="username">
                                    <i className="pi pi-user mr-2"></i> Usuario
                                </label>
                            </FloatLabel>
                        </div>

                        <div className='mt-4'>
                            <FloatLabel>
                                <InputText
                                    id="password"
                                    className="w-full"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="password">
                                    <i className="pi pi-lock mr-2"></i> Contraseña
                                </label>
                            </FloatLabel>
                        </div>

                        <div className='mt-4 h-full w-full'>
                            <Button
                                label='Iniciar sesión'
                                type='submit'
                                className='w-full'
                            />
                        </div>
                    </form>
                    <div className='felx space-between mt-4'>
                        <p className="text-center">
                            <a href="/register" className="text-blue-500 hover:underline">
                                ¿No tienes cuenta? crea una
                            </a>
                        </p>
                        <p className="text-center">
                            <a href="/forgot-password" className="text-blue-500 hover:underline mt-2">
                                Recuperar  contraseña
                            </a>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Login;