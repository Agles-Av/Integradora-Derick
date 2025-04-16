import React from 'react';
import { Button } from 'primereact/button';

const NotFound404 = () => {
  return (
    <div className="flex flex-column align-items-center justify-content-center min-h-screen bg-gray-100 text-center px-4 bg-gradient-to-r from-gray-200 to-gray-300">
      <div className="text-8xl font-bold text-red-600 animate-pulse">404</div>
      
      <img 
        src="/src/assets/pagenotfound.svg" 
        alt="Página no encontrada" 
        className="h-20rem my-4 drop-shadow-2xl" 
      />

      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        ¡Ay caray! Te perdiste en la ciudad...
      </h1>

      <p className="text-gray-600 text-lg mb-6">
        La ruta que estás buscando se esfumó como humo de habano en Little Italy.
      </p>

      <Button 
        label="Volver a casa" 
        icon="pi pi-home" 
        className="p-button-raised p-button-rounded p-button-primary shadow-lg" 
        onClick={() => window.location.href = '/'}
      />

      <div className="mt-6 text-sm text-gray-500 italic">
        Si crees que esto es un error, hablá con el desarrollador... o con el Don. 👑
      </div>
    </div>
  );
};

export default NotFound404;
