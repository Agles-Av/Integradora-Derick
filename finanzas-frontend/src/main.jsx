import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { PrimeReactProvider } from 'primereact/api';
import { AlertContainer } from './components/alertas/AlertHelper.jsx';


import 'primereact/resources/primereact.css'; // Estilos base primero
import 'primereact/resources/themes/mdc-light-deeppurple/theme.css'
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


createRoot(document.getElementById('root')).render(

    <StrictMode>
      <PrimeReactProvider>
        <AlertContainer/>
          <App/>
      </PrimeReactProvider>
    </StrictMode>
  

)
