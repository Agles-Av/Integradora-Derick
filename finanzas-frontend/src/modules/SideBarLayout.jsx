import React, { useContext, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Tooltip } from 'primereact/tooltip';
import AuthContext from '../config/context/auth-context';
import ConfirmDialog from '../components/confirmacion/ConfirmDialog';
import { AlertHelper } from '../components/alertas/AlertHelper';

const SideBarLayout = () => {
    const [visible, setVisible] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { dispatch, user } = useContext(AuthContext);

    const menuItems = [
        { label: 'Dashboard', icon: 'pi pi-chart-bar', path: '/dashboard' },
        { label: 'Cuentas', icon: 'pi pi-wallet', path: '/accounts' },
        { label: 'Gastos', icon: 'pi pi-money-bill', path: '/expenses' },
    ];

    const logout = () => {
        AlertHelper.showAlert("Sesión cerrada", "success");
        dispatch({ type: 'SIGN_OUT' });
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar - Usando clases de PrimeReact */}
            <div 
                className={`h-screen shadow-2 flex flex-column transition-all transition-duration-300 
                    ${collapsed ? 'w-4rem' : 'w-18rem'}
                    surface-ground`}
            >
                {/* Logo and toggle section */}
                <div className={`flex justify-content-between align-items-center py-4   px-3 surface-card`}>
                    {!collapsed && (
                        <img 
                            src="/src/assets/logo.png" 
                            alt="CAMILA FINANZAS" 
                            className="w-8rem"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100?text=LOGO';
                                e.target.onerror = null;
                            }}
                        />
                    )}
                    <Button 
                        icon="pi pi-bars" 
                        text 
                        onClick={toggleSidebar}
                        className="p-1"
                        tooltip={collapsed ? "Expandir menú" : "Colapsar menú"}
                        tooltipOptions={{ position: 'right' }}
                    />
                </div>


                {/* Menu items */}
                <div className="flex-1 overflow-y-auto surface-section">
                    <ul className="list-none p-0 m-0">
                        {menuItems.map((item) => {
                            const btnId = `menu-btn-${item.path.replace('/', '')}`;
                            return (
                                <li key={item.path}>
                                    <Tooltip 
                                        target={`#${btnId}`} 
                                        content={item.label} 
                                        position="right" 
                                        disabled={!collapsed} 
                                    />
                                    <Button 
                                        id={btnId}
                                        text
                                        className={`w-full p-3  justify-content-start ${collapsed ? 'justify-content-center' : ''}`}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <i className={`${item.icon} ${collapsed ? '' : 'mr-3'}`} />
                                        {!collapsed && <span className="font-medium">{item.label}</span>}
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Logout section */}
                <div className="p-3 surface-card">
                    <Tooltip 
                        target=".logout-btn" 
                        content="Cerrar sesión" 
                        position="right" 
                        disabled={!collapsed} 
                    />
                    <Button 
                        text
                        className={`w-full p-3 border-none justify-content-start logout-btn ${collapsed ? 'justify-content-center' : ''}`}
                        onClick={() => setVisible(true)}
                    >
                        <i className={`pi pi-sign-out ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && <span className="font-medium">Cerrar sesión</span>}
                    </Button>
                </div>
            </div>

            {/* Confirmation dialog */}
            <ConfirmDialog
                visible={visible}
                onHide={() => setVisible(false)}
                onConfirm={logout}
                title="Cerrar sesión"
                message="¿Está seguro de que desea cerrar sesión?"
            />

            {/* Main content area */}
            <div className={`flex-1 overflow-auto transition-all transition-duration-300 ${collapsed ? 'ml-4rem' : 'ml-18rem'}`}>
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default SideBarLayout;