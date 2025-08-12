💼 MVP CFDI - Sistema de Gestión Fiscal
MVP para gestión de CFDIs (Comprobantes Fiscales Digitales) desarrollado en 3 días.
🚀 Funcionalidades

✅ Login simple - Autenticación básica para demo
✅ Dashboard - 3 acciones principales para gestión de CFDIs
✅ Descarga de CFDIs - Obtención automática de comprobantes
✅ Validación de CFDIs - Verificación contra datos del SAT
✅ Generación de facturas - Creación de nuevos CFDIs
⏳ Subida de archivos - Procesamiento de XML/ZIP (próximamente)

🛠 Tecnologías

Frontend: React 18 + React Router + Axios
Backend: FastAPI + Python 3.9+ (en desarrollo)
Datos: JSON con estructura real basada en CFDIs del SAT

📁 Estructura del Proyecto
mvp-cfdi/
├── frontend/                   # React application
│   ├── src/
│   │   ├── pages/             # Páginas principales (snake_case)
│   │   │   ├── login_page.js          # Pantalla de login
│   │   │   ├── dashboard_page.js      # Dashboard principal
│   │   │   └── results_page.js        # Resultados y tablas
│   │   ├── components/        # Componentes reutilizables
│   │   └── App.js            # Configuración de rutas
│   └── package.json
├── backend/                    # FastAPI server
│   ├── data/
│   │   └── dummy_cfdis.json   # Datos reales extraídos de CFDIs
│   ├── routes/                # Endpoints de la API
│   ├── app.py                # Servidor principal
│   └── requirements.txt      # Dependencias Python
└── README.md
🚀 Instalación y Uso
Prerrequisitos

Node.js 18+
Python 3.9+
Git

Frontend Setup
bashcd frontend
npm install
npm start
URL: http://localhost:3000
Backend Setup (en desarrollo)
bashcd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python app.py
URL: http://localhost:8000
🎯 Estado Actual

✅ Frontend completamente funcional
✅ Navegación entre pantallas
✅ Datos de prueba con estructura real
⏳ Backend en desarrollo
⏳ Conexión frontend-backend

🔧 Estándares de Desarrollo

Nomenclatura: snake_case para variables, funciones y archivos
Comentarios: Código documentado para facilitar mantenimiento
Estructura: Modular y escalable para futuras funcionalidades

🎮 Demo

Login: Usa cualquier usuario/contraseña
Dashboard: Selecciona una de las 3 acciones
Resultados: Visualiza datos simulados con estructura real

🚧 Próximas Funcionalidades

 Backend FastAPI con endpoints funcionales
 Conexión real entre frontend y backend
 Subida y procesamiento de archivos XML
 Validación real contra servicios del SAT
 Dockerización del proyecto
 Deploy en la nube

📝 Notas de Desarrollo
Este proyecto utiliza datos reales extraídos de ejemplos oficiales de CFDIs del SAT para proporcionar una experiencia realista durante las demostraciones, sin comprometer información confidencial.

Desarrollado como MVP funcional en 3 días 🚀