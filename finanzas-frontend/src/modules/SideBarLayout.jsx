import React, { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import AuthContext from '../config/context/auth-context';

const SideBarLayout = () => {
    const navigate = useNavigate();
    const {dispatch}  = useContext(AuthContext);

    const menuItems = [
        { label: 'Dashboard', icon: 'pi pi-chart-bar', path: '/dashboard' },
        { label: 'Cuentas', icon: 'pi pi-wallet', path: '/accounts' },
        { label: 'Gastos', icon: 'pi pi-money-bill', path: '/expenses' },
    ];

    const logout = () => {
        dispatch({ type: 'SIGN_OUT' });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar - Fixed width and always visible */}
            <div className="w-18rem h-screen bg-white shadow-2 border-right-1 surface-border flex flex-column">
                {/* Logo section */}
                <div className="flex flex-column align-items-center py-4 border-bottom-1 surface-border">
                    <i className="pi pi-shield text-primary" style={{ fontSize: '2.5rem' }}></i>
                    <span className="text-xl font-bold text-primary mt-2">CAMILA</span>
                    <span className="text-xl font-bold text-primary">FINANZAS</span>
                </div>

                {/* Menu items */}
                <div className="flex-1 overflow-y-auto">
                    <ul className="list-none p-0 m-0">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Button 
                                    text
                                    className="w-full p-3 border-none justify-content-start"
                                    onClick={() => navigate(item.path)}
                                >
                                    <i className={`${item.icon} mr-3`} />
                                    <span className="font-medium">{item.label}</span>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Logout section */}
                <div className="p-3 border-top-1 surface-border">
                    <Button 
                        text
                        className="w-full p-3 border-none justify-content-start"
                        onClick={() => {
                            logout();
                        }}
                    >
                        <i className="pi pi-sign-out mr-3" />
                        <span className="font-medium">Cerrar sesión</span>
                    </Button>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-auto bg-gray-50">
                <Outlet />
            </div>
        </div>
    );
};

export default SideBarLayout;