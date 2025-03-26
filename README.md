# Proyecto de Finanzas - Equipo Camila

## Descripción
Este proyecto es una aplicación web de gestión de gastos personales que permite a los usuarios administrar sus cuentas bancarias, registrar sus gastos y visualizar su actividad financiera mediante un dashboard interactivo. La aplicación se desarrolla utilizando Django para el backend, MySQL como base de datos y React con PrimeReact y PrimeFlex para el frontend.

## Tecnologías utilizadas
- **Backend:** Django
- **Base de datos:** MySQL
- **Frontend:** React con PrimeReact y PrimeFlex

## Requerimientos funcionales

### Modelos de base de datos
#### Usuario
- `username` (correo electrónico)
- `password`
- `token` (recuperación)
- `nombre_completo`
- `edad`

#### Cuentas_de_banco
- `usuario` (relación con Usuario)
- `banco`
- `is_favorita`
- `saldo`
- `fecha_de_ultimo_deposito`

#### Gastos
- `usuario` (relación con Usuario)
- `monto`
- `fecha`
- `descripción`
- `titulo`

#### Fecha
- `mes`
- `año`

### Funcionalidades principales
- **Dashboard interactivo:**
  - Visualización de la actividad de gastos por mes del usuario autenticado.
  - Gráficos y estadísticas sobre los gastos.
- **API REST:**
  - Soporte para operaciones **CRUD (GET, POST, PUT, DELETE)** en todas las entidades del sistema.
  - Arquitectura asíncrona para una mejor experiencia de usuario.
- **Identidad de empresa:**
  - Desarrollo bajo la marca **CAMILA**.
- **Descarga de gastos:**
  - Posibilidad de exportar estados de cuenta de bancos.

## Requerimientos no funcionales

- **Estilos y Diseño:**
  - UI amigable basada en **PrimeReact y PrimeFlex**.
- **Responsividad:**
  - Diseño adaptativo para móviles y escritorios.
- **Usabilidad:**
  - Consejos y guías para el usuario.
  - Indicadores de carga (spinners).
  - Mensajes de notificación y feedback.
  - Aplicación de estándares de desarrollo.

## Instalación y Ejecución
### Backend (Django + MySQL)
1. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```
2. Configurar base de datos en `settings.py`.
3. Ejecutar migraciones:
   ```bash
   python manage.py migrate
   ```
4. Levantar el servidor:
   ```bash
   python manage.py runserver
   ```

### Frontend (React + PrimeReact + PrimeFlex)
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar el servidor de desarrollo:
   ```bash
   npm start
   ```

## API Endpoints
| Método | Endpoint | Descripción |
|---------|----------|-------------|
| **GET** | `/api/usuarios/` | Obtener lista de usuarios |
| **POST** | `/api/usuarios/` | Crear un nuevo usuario |
| **PUT** | `/api/usuarios/{id}/` | Actualizar usuario |
| **DELETE** | `/api/usuarios/{id}/` | Eliminar usuario |
| **GET** | `/api/gastos/` | Obtener lista de gastos |
| **POST** | `/api/gastos/` | Registrar un gasto |
| **GET** | `/api/cuentas/` | Obtener lista de cuentas bancarias |
| **POST** | `/api/cuentas/` | Registrar una cuenta bancaria |

## Contribución
Si deseas contribuir a este proyecto, sigue estos pasos:
1. Realiza un **fork** del repositorio.
2. Crea una nueva rama (`git checkout -b feature-nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Agrega nueva funcionalidad"`).
4. Sube los cambios a tu fork (`git push origin feature-nueva-funcionalidad`).
5. Abre un **pull request**.

## Contacto
Desarrollado por **Equipo Camila**. Para más información o dudas, contáctanos a [correo@empresa.com](mailto:correo@empresa.com).
