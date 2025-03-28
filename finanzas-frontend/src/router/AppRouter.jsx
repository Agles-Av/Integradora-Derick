import React, { useContext } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import AuthContext from '../config/context/auth-context'
import Login from '../modules/controlacceso/Login';
import SideBarLayout from '../modules/SideBarLayout';

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
                
                {/* Rutas protegidas */}
                <Route 
                    path="/" 
                    element={user?.signed ? <SideBarLayout /> : <Navigate to="/login" replace />}
                >
                    <Route index element={<div>DASHBOARD</div>} />
                    <Route path="dashboard" element={<div>DASHBOARD</div>} />
                    <Route path="accounts" element={<div>CUENTAS</div>} />
                    <Route path="expenses" element={<div>GASTOS</div>} />
                </Route>
                
                {/* Ruta 404 */}
                <Route path="*" element={<div>404 NOT FOUND</div>} />
            </Route>
        )
    );

    return <RouterProvider router={router} />
}

export default AppRouter