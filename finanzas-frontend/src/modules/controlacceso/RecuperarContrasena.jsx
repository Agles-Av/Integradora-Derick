import { Card } from 'primereact/card';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { changePassword } from '../../services/authservice/CambiarContrasena';
import { AlertHelper } from '../../components/alertas/AlertHelper';
import ConfirmDialog from '../../components/confirmacion/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

const RecuperarContrasena = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [visible, setVisible] = useState(false);

  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [formValid, setFormValid] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = location.search.split('?=')[1];
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setToken('');
    }
  }, [location]);

  useEffect(() => {
    const isValidPassword = password.length >= 5;
    const passwordsMatch = password === confirmPassword;
    setFormValid(isValidPassword && passwordsMatch);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!token) {
      setError('Token no válido');
      return;
    }

    try {
      await changePassword(token, password);
      AlertHelper.showAlert("Contraseña cambiada exitosamente", "success");
      setError('');
      setPassword('');
      setConfirmPassword('');
      setVisible(false);
      navigate('/login');
    } catch (error) {
      setError(error.message || "Error al cambiar la contraseña");
    } finally {
      setPassword('');
      setConfirmPassword('');
      setToken('');
      setVisible(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (formValid) {
      setVisible(true);
    }
  };

  return (
    <div className='flex justify-content-center align-items-center h-screen text-primary'>
      <Card
        title={
          <div className="text-center mb-4">
            <img src="/src/assets/logo.png" alt="CAMILA FINANZAS" width={100} height={100} />
            <h3>Cambia tu contraseña</h3>
          </div>
        }
        className="w-24rem text-primary z-1"
        style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <div>
            <FloatLabel>
              <InputText
                id="password"
                className={`w-full ${touched.password && password.length < 5 ? 'p-invalid' : ''}`}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              />
              <label htmlFor="password">
                <i className="pi pi-lock mr-2"></i> Nueva contraseña
              </label>
            </FloatLabel>
            {touched.password && password.length < 5 && (
              <small className="p-error">La contraseña debe tener al menos 5 caracteres</small>
            )}
          </div>

          <div className='mt-4'>
            <FloatLabel>
              <InputText
                id="confirmPassword"
                className={`w-full ${touched.confirmPassword && confirmPassword !== password ? 'p-invalid' : ''}`}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
              />
              <label htmlFor="confirmPassword">
                <i className="pi pi-lock mr-2"></i> Confirmar contraseña
              </label>
            </FloatLabel>
            {touched.confirmPassword && confirmPassword !== password && (
              <small className="p-error">Las contraseñas no coinciden</small>
            )}
          </div>

          {error && <div className='mt-2 p-error text-center'>{error}</div>}

          <div className='mt-4 h-full w-full'>
            <Button
              label='Cambiar contraseña'
              type='submit'
              className='w-full'
              disabled={!formValid}
            />
            <div className='text-center mt-4'>
              <a href="/login">Recordé mi contraseña</a>
            </div>
          </div>
        </form>
      </Card>

      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        onConfirm={handleSubmit}
        title="Confirmar cambio de contraseña"
        message="¿Estás seguro de que deseas cambiar tu contraseña?"
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default RecuperarContrasena;
