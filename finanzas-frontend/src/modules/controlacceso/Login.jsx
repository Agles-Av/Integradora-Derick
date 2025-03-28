import React, { use, useState } from 'react';
import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { login } from '../../services/authservice/LoginService';
import { useNavigate } from 'react-router-dom';
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
            <Card
                title={
                    <div className="text-center mb-4">
                        <i className="pi pi-shield text-primary text-3xl"></i>
                        <h2 className="text-primary font-bold text-xl">CAMILA FINANZAS</h2>
                    </div>
                }
                className="h-24rem w-24rem text-primary"
            >
                <div className='mt-4'>
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
                </div>
            </Card>
        </div>
    );
}

export default Login;