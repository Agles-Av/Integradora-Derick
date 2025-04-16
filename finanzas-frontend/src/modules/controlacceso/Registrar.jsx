import { Card } from 'primereact/card'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { registrar } from '../../services/authservice/RegistrarService'

const Registrar = () => {
    const [name, setName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [age, setAge] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await registrar(name, lastName, age, email, password);
            navigate('/login');
        } catch (error) {
        }
    }

    return (
        <div className="flex justify-content-center align-items-center h-screen w-full text-primary">
            <Card
                title={
                    <div>
                        <div className="text-center mb-4">
                            <img src="/src/assets/logo.png" alt="CAMILA FINANZAS" width={100} height={100} />
                        </div>
                        <h2 className="text-center">Crear cuenta</h2>
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
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <FloatLabel>
                                <InputText
                                    id="name"
                                    className="w-full"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <label htmlFor="name">
                                    <i className="pi pi-user mr-2"></i> Nombre
                                </label>
                            </FloatLabel>
                        </div>
                        <div className="mb-4">
                            <FloatLabel>
                                <InputText
                                    id="lastName"
                                    className="w-full"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <label htmlFor="lastName">
                                    <i className="pi pi-user mr-2"></i> Apellidos
                                </label>
                            </FloatLabel>
                        </div>
                        <div className="mb-4">
                            <FloatLabel>
                                <InputText
                                    id="age"
                                    keyfilter="int" // Solo permite números enteros
                                    className="w-full"
                                    value={age}
                                    onChange={(e) => {
                                        // Validación para asegurar que sea un número positivo
                                        const value = e.target.value;
                                        if (value === '' || (Number(value) > 0 && Number(value) <= 120)) {
                                            setAge(value);
                                        }
                                    }}
                                    maxLength={3} // Máximo 3 dígitos
                                />
                                <label htmlFor="age">
                                    <i className="pi pi-user mr-2"></i> Edad
                                </label>
                            </FloatLabel>
                            {age && (Number(age) <= 0 || Number(age) > 120) && (
                                <small className="p-error">La edad debe estar entre 1 y 120 años</small>
                            )}
                        </div>
                        <div className="mb-4">
                            <FloatLabel>
                                <InputText
                                    id="email"
                                    className="w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="email">
                                    <i className="pi pi-envelope mr-2"></i> Email
                                </label>
                            </FloatLabel>
                        </div>
                        <div className="mb-4">
                            <FloatLabel>
                                <InputText
                                    id="password"
                                    className="w-full"
                                    type='password'
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
                                label='Crear cuenta'
                                type='submit'
                                className='w-full'
                            />
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    )
}

export default Registrar