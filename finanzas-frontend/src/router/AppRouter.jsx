import React, { useContext } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import AuthContext from '../config/context/auth-context'

import SideBarLayout from '../modules/SideBarLayout';
import DashBoard from '../modules/user/DashBoard';
import Cuentas from '../modules/user/Cuentas';
import Gastos from '../modules/user/Gastos';
import { lazy, Suspense } from 'react';
import NotFound404 from '../modules/NotFound404';

function AppRouter() {
    const Login = lazy(() => import('../modules/controlacceso/Login'))
    const Registrar = lazy(() => import('../modules/controlacceso/Registrar'))
    const RecuperarContrasena = lazy(() => import('../modules/controlacceso/RecuperarContrasena'))
    const { user } = useContext(AuthContext);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route>
                {/* Ruta pública */}
                <Route
                    path="/login"
                    element={<Suspense fallback={<div>Cargando...</div>}>
                        {!user?.signed ? <Login /> : <Navigate to="/" replace />}
                    </Suspense>}
                />
                <Route path='/register' element={<Suspense fallback={<>Cargando...</>}>
                <Registrar/>
                </Suspense>} />
                <Route path='/reset-password' element={<Suspense fallback={<>Cargando...</>}>
                <RecuperarContrasena/>
                </Suspense>} />

                {/* Rutas protegidas */}
                <Route
                    path="/"
                    element={user?.signed ? <SideBarLayout /> : <Navigate to="/login" replace />}
                >
                    <Route index element={<DashBoard />} />
                    <Route path="dashboard" element={<DashBoard />} />
                    <Route path="accounts" element={<Cuentas />} />
                    <Route path="expenses" element={<Gastos />} />
                </Route>

                {/* Ruta 404 */}
                <Route path="*" element={<NotFound404/>} />
            </Route>
        )
    );

    return <RouterProvider router={router} />
}

export default AppRouter