import React, { useContext } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import AuthContext from '../config/context/auth-context'
import Login from '../modules/controlacceso/Login';
import SideBarLayout from '../modules/SideBarLayout';
import DashBoard from '../modules/user/DashBoard';
import Cuentas from '../modules/user/Cuentas';
import Gastos from '../modules/user/Gastos';
import Registrar from '../modules/controlacceso/Registrar';

function AppRouter() {
    const { user } = useContext(AuthContext);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                {/* Ruta pública */}
                <Route 
                    path="/login" 
                    element={!user?.signed ? <Login /> : <Navigate to="/" replace />} 
                />
                <Route path='/register' element={<Registrar/>} />
                
                {/* Rutas protegidas */}
                <Route 
                    path="/" 
                    element={user?.signed ? <SideBarLayout /> : <Navigate to="/login" replace />}
                >
                    <Route index element={<DashBoard/>} />
                    <Route path="dashboard" element={<DashBoard/>} />
                    <Route path="accounts" element={<Cuentas/>} />
                    <Route path="expenses" element={<Gastos/>} />
                </Route>
                
                {/* Ruta 404 */}
                <Route path="*" element={<div>404 NOT FOUND</div>} />
            </Route>
        )
    );

    return <RouterProvider router={router} />
}

export default AppRouter