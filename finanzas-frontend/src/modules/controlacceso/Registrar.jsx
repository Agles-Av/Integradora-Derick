import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrar } from '../../services/authservice/RegistrarService';

const Registrar = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        age: '',
        email: '',
        password: ''
    });

    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const newErrors = {};

        if (touched.name && formData.name.trim() === '') newErrors.name = 'El nombre es requerido';
        if (touched.name && !/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.name)) newErrors.name = 'Solo se permiten letras';
        if (touched.lastName && formData.lastName.trim() === '') newErrors.lastName = 'Los apellidos son requeridos';
        if (touched.lastName && !/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.lastName)) newErrors.lastName = 'Solo se permiten letras';
        if (touched.age && formData.age.trim() === '') newErrors.age = 'La edad es requerida';
        if (touched.age) {
            if (formData.age === '' || Number(formData.age) <= 0 || Number(formData.age) > 120) {
                newErrors.age = 'Edad entre 1 y 120 años';
            }
        }
        if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
        if (touched.password && formData.password.length < 5) newErrors.password = 'Mínimo 5 caracteres';

        setErrors(newErrors);
        setIsValid(Object.keys(newErrors).length === 0 &&
                   Object.values(formData).every(val => val.trim() !== ''));

    }, [formData, touched]);

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        setTouched({ ...touched, [field]: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registrar(
                formData.name,
                formData.lastName,
                formData.age,
                formData.email,
                formData.password
            );
            navigate('/login');
        } catch (error) {
            console.error(error);
        }finally{
            setFormData({
                name: '',
                lastName: '',
                age: '',
                email: '',
                password: ''
            });
            setTouched({});
            setErrors({});
            setIsValid(false);
        }
    };

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
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
                }}
            >
                <form onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <div className="mb-4">
                        <FloatLabel>
                            <InputText
                                id="name"
                                className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                                value={formData.name}
                                onChange={handleChange('name')}
                                maxLength={50}
                            />
                            <label htmlFor="name">
                                <i className="pi pi-user mr-2"></i> Nombre
                            </label>
                        </FloatLabel>
                        {errors.name && <small className="p-error">{errors.name}</small>}
                    </div>

                    {/* Apellidos */}
                    <div className="mb-4">
                        <FloatLabel>
                            <InputText
                                id="lastName"
                                className={`w-full ${errors.lastName ? 'p-invalid' : ''}`}
                                value={formData.lastName}
                                onChange={handleChange('lastName')}
                                maxLength={50}
                            />
                            <label htmlFor="lastName">
                                <i className="pi pi-user mr-2"></i> Apellidos
                            </label>
                        </FloatLabel>
                        {errors.lastName && <small className="p-error">{errors.lastName}</small>}
                    </div>

                    {/* Edad */}
                    <div className="mb-4">
                        <FloatLabel>
                            <InputText
                                id="age"
                                keyfilter="int"
                                className={`w-full ${errors.age ? 'p-invalid' : ''}`}
                                value={formData.age}
                                onChange={handleChange('age')}
                                maxLength={3}
                            />
                            <label htmlFor="age">
                                <i className="pi pi-user mr-2"></i> Edad
                            </label>
                        </FloatLabel>
                        {errors.age && <small className="p-error">{errors.age}</small>}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <FloatLabel>
                            <InputText
                                id="email"
                                className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                                value={formData.email}
                                onChange={handleChange('email')}
                                maxLength={76}
                            />
                            <label htmlFor="email">
                                <i className="pi pi-envelope mr-2"></i> Email
                            </label>
                        </FloatLabel>
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>

                    {/* Contraseña */}
                    <div className="mb-4">
                        <FloatLabel>
                            <InputText
                                id="password"
                                type="password"
                                className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                                value={formData.password}
                                onChange={handleChange('password')}
                                maxLength={76}
                            />
                            <label htmlFor="password">
                                <i className="pi pi-lock mr-2"></i> Contraseña
                            </label>
                        </FloatLabel>
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>

                    {/* Botón */}
                    <div className="mt-4">
                        <Button
                            label='Crear cuenta'
                            type='submit'
                            className='w-full'
                            disabled={!isValid}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Registrar;
