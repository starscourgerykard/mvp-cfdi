# 🚀 MVP CFDI - Setup Completo

Guía paso a paso para levantar el sistema completo en menos de 5 minutos.

## ✅ Estado del Proyecto

- ✅ **Frontend React**: Completamente funcional 
- ✅ **Backend FastAPI**: Completamente funcional
- ✅ **Conexión Frontend-Backend**: Implementada
- ✅ **Datos reales**: CFDIs basados en ejemplos del SAT
- ✅ **API Documentada**: Swagger UI disponible

## 📋 Prerrequisitos

- **Node.js 18+** - Para el frontend React
- **Python 3.9+** - Para el backend FastAPI
- **Git** - Para clonar el repositorio

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone https://github.com/starscourgerykard/mvp-cfdi.git
cd mvp-cfdi
```

### 2. Setup del Backend (Terminal 1)
```bash
cd backend

# Crear entorno virtual (recomendado)
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor con script automático
python start_backend.py
```

**O iniciar manualmente:**
```bash
python app.py
```

### 3. Setup del Frontend (Terminal 2)
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar aplicación React
npm start
```

## 🌐 URLs del Sistema

Una vez levantado todo:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **Documentación API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/api/health

## 🔧 Verificación del Setup

### Backend
1. Visita http://localhost:8000/api/health
2. Deberías ver: `{"status": "healthy", "message": "MVP CFDI API funcionando correctamente"}`

### Frontend
1. Visita http://localhost:3000
2. Verifica que aparezca la pantalla de login
3. El indicador de API debería mostrar "🟢 API Conectada"

### Conexión Completa
1. Login con cualquier usuario/contraseña (ej: `demo` / `demo`)
2. Navega por las 3 acciones del dashboard
3. Verifica que los datos se cargan desde la API

## 👤 Usuarios de Demostración

El sistema incluye usuarios predefinidos:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Admin |
| `usuario` | `user123` | User |
| `demo` | `demo` | Demo |

**Nota**: También acepta cualquier usuario/contraseña para facilitar las demos.

## 📊 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/users` - Lista usuarios demo

### CFDIs
- `GET /api/cfdis/download` - CFDIs descargados
- `GET /api/cfdis/validate` - CFDIs validados  
- `GET /api/cfdis/generate` - CFDIs generados
- `POST /api/cfdis/generate` - Crear nuevo CFDI

### Utilidades
- `GET /api/health` - Estado de la API
- `GET /api/catalogos` - Catálogos del SAT
- `GET /api/stats/general` - Estadísticas generales

## 🎯 Flujo de Demostración

1. **Login**: Usa `demo` / `demo` o cualquier credencial
2. **Dashboard**: Selecciona una de las 3 acciones:
   - 📥 Descargar CFDIs (3 registros)
   - ✅ Validar CFDIs (3 registros con estados)
   - 📄 Generar Facturas (2 registros)
3. **Resultados**: Observa los datos reales cargados desde la API

## 🐛 Solución de Problemas

### Backend no inicia
```bash
# Verificar Python
python --version  # Debe ser 3.9+

# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall

# Verificar archivo de datos
ls data/dummy_cfdis.json
```

### Frontend no conecta
```bash
# Verificar que el backend esté en el puerto 8000
curl http://localhost:8000/api/health

# Verificar instalación de Node
npm --version

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error de CORS
- Verifica que el frontend esté en http://localhost:3000
- El backend está configurado para permitir este origen

### Datos no cargan
1. Verifica que `data/dummy_cfdis.json` exista
2. Comprueba los logs del backend
3. Visita http://localhost:8000/docs para probar la API

## 📁 Estructura de Archivos

```
mvp-cfdi/
├── frontend/                   # React App
│   ├── src/
│   │   ├── pages/             # Páginas principales
│   │   ├── services/          # API service
│   │   └── App.js            # Router principal
│   └── package.json
├── backend/                    # FastAPI Server  
│   ├── routes/                # Endpoints modulares
│   │   ├── auth.py           # Autenticación
│   │   ├── cfdis.py          # Gestión CFDIs
│   │   └── utils.py          # Utilidades
│   ├── data/
│   │   └── dummy_cfdis.json  # Datos reales
│   ├── app.py                # Servidor principal
│   ├── start_backend.py      # Script de inicio
│   └── requirements.txt      # Dependencias
└── README.md
```

## 🔄 Desarrollo

### Hot Reload
- **Backend**: Se reinicia automáticamente al guardar archivos `.py`
- **Frontend**: Se recarga automáticamente al guardar archivos `.js`

### Logs
- **Backend**: Logs en consola + uvicorn access logs
- **Frontend**: Console del navegador + React dev tools

### Agregar nuevos endpoints
1. Edita archivos en `backend/routes/`
2. El servidor se reinicia automáticamente
3. Documentación se actualiza en http://localhost:8000/docs

## 📈 Próximos Pasos

Con el MVP funcionando, los siguientes pasos serían:

1. **Subida de archivos XML**: 4ta acción en dashboard
2. **Validación real con SAT**: Conectar a servicios reales del SAT
3. **Base de datos**: Migrar de JSON a PostgreSQL/MySQL
4. **Autenticación JWT**: Implementar tokens seguros
5. **Docker**: Containerizar para deploy fácil
6. **Tests**: Agregar testing automatizado
7. **Deploy**: Subir a la nube (AWS, GCP, Azure)

## 🏷️ Tags y Versiones

- **v1.0.0**: MVP funcional en 3 días
- **Frontend**: React 18 + React Router + Axios
- **Backend**: FastAPI 0.104.1 + Uvicorn
- **Datos**: JSON con estructura real de CFDIs del SAT

## 💡 Consejos para Demos

1. **Prepara el entorno**: Levanta ambos servidores antes de la demo
2. **Usuarios rápidos**: Usa `demo`/`demo` para login rápido
3. **Datos realistas**: Los CFDIs tienen estructura real del SAT
4. **API visible**: Muestra http://localhost:8000/docs para impresionar
5. **Navegación fluida**: El sistema funciona sin internet

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en ambas consolas
2. **Verifica puertos** 3000 y 8000 libres
3. **Comprueba versiones** Python 3.9+ y Node 18+
4. **API Health Check** http://localhost:8000/api/health

## 🎉 ¡Listo!

El sistema MVP está completamente funcional. En menos de 5 minutos deberías tener:

- ✅ Login funcionando con API real
- ✅ Dashboard navegable  
- ✅ 3 acciones con datos reales
- ✅ API documentada y funcional
- ✅ Frontend-Backend conectados

**¡A demostrar! 🚀**