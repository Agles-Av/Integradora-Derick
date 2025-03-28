import React, { useEffect, useReducer } from 'react';
import AppRouter from './router/AppRouter';
import AuthContext from './config/context/auth-context';
import { authManager } from './config/context/auth-manager';

const init = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || null);
    return {
        signed: !!token,
        user: token ? { token, user } : null
    };
};

function App() {
    const [user, dispatch] = useReducer(authManager, {}, init);

    return (
        <AuthContext.Provider value={{ user, dispatch }}>
            <AppRouter />
        </AuthContext.Provider>
    );
}

export default App;