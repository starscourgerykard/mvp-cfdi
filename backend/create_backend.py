#!/usr/bin/env python3
"""
MVP CFDI - Generador Automático del Backend
Este script crea todos los archivos del backend automáticamente
¡Sin copy/paste manual!
"""

import os
from pathlib import Path

def create_directory_structure():
    """Crea la estructura de directorios necesaria"""
    directories = [
        "backend/routes",
        "backend/data",
        "frontend/src/services"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"✅ Directorio creado: {directory}")

def create_backend_files():
    """Crea todos los archivos del backend"""
    
    files_content = {
        # ==================== APP.PY ====================
        "backend/app.py": '''"""
MVP CFDI - FastAPI Backend
Servidor principal para el MVP de gestión de CFDIs
Desarrollado en 3 días - Backend funcional con rutas modularizadas
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime
import uvicorn

# Importar las rutas modularizadas
from routes import auth, cfdis, utils

# Crear la instancia de FastAPI
app = FastAPI(
    title="MVP CFDI API",
    description="API para gestión de CFDIs - Sistema MVP desarrollado en 3 días",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS para permitir conexiones desde el frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Frontend React en desarrollo
        "http://127.0.0.1:3000",  # Alternativa localhost
        "http://localhost:3001"   # Puerto alternativo
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Incluir las rutas modularizadas
app.include_router(auth.router)    # Rutas de autenticación: /api/auth/*
app.include_router(cfdis.router)   # Rutas de CFDIs: /api/cfdis/*  
app.include_router(utils.router)   # Rutas de utilidad: /api/*

# ==================== RUTA RAÍZ ====================

@app.get("/")
async def root():
    """
    Ruta raíz - Información básica de la API
    """
    return {
        "message": "MVP CFDI API - Sistema de Gestión Fiscal",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/api/health",
            "auth": "/api/auth/*",
            "cfdis": "/api/cfdis/*"
        },
        "frontend_url": "http://localhost:3000",
        "timestamp": datetime.now().isoformat()
    }

# ==================== MANEJO DE ERRORES GLOBALES ====================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": "Endpoint no encontrado",
            "error": "404 Not Found",
            "available_endpoints": [
                "/api/health",
                "/api/auth/login",
                "/api/cfdis/download",
                "/api/cfdis/validate", 
                "/api/cfdis/generate",
                "/api/catalogos",
                "/docs"
            ],
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Error interno del servidor",
            "error": "500 Internal Server Error",
            "note": "Revisa los logs del servidor para más detalles",
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(422)
async def validation_error_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Error de validación en los datos enviados",
            "error": "422 Validation Error",
            "details": str(exc),
            "timestamp": datetime.now().isoformat()
        }
    )

# ==================== STARTUP/SHUTDOWN EVENTS ====================

@app.on_event("startup")
async def startup_event():
    print("🚀 MVP CFDI Backend iniciado exitosamente")
    print("📊 Servidor: http://localhost:8000")
    print("📖 Documentación Swagger: http://localhost:8000/docs")
    print("📘 Documentación ReDoc: http://localhost:8000/redoc")
    print("🔄 CORS habilitado para: http://localhost:3000")
    print("✅ Todas las rutas cargadas correctamente")

@app.on_event("shutdown")
async def shutdown_event():
    print("🛑 MVP CFDI Backend detenido")

# ==================== INICIALIZACIÓN ====================

if __name__ == "__main__":
    print("🚀 Iniciando MVP CFDI Backend...")
    print("📊 Servidor: http://localhost:8000")
    print("📖 Documentación: http://localhost:8000/docs")
    print("🔄 CORS habilitado para: http://localhost:3000")
    
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload en desarrollo
        log_level="info",
        access_log=True
    )
''',

        # ==================== ROUTES INIT ====================
        "backend/routes/__init__.py": '''"""
MVP CFDI - Inicializador del módulo de rutas
Facilita las importaciones de las rutas modularizadas
"""

# Importaciones de todos los routers
from .auth import router as auth_router
from .cfdis import router as cfdis_router  
from .utils import router as utils_router

# Lista de todos los routers disponibles
all_routers = [
    auth_router,
    cfdis_router,
    utils_router
]

__all__ = [
    "auth_router",
    "cfdis_router", 
    "utils_router",
    "all_routers"
]
''',

        # ==================== FRONTEND API SERVICE ====================
        "frontend/src/services/api_service.js": '''/**
 * MVP CFDI - Servicio de API
 * Maneja todas las llamadas al backend FastAPI
 * Reemplaza los datos mock con llamadas reales
 */

import axios from 'axios';

// Configuración base del API
const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const api_client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api_client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en API:', error);
    
    if (error.response) {
      const error_message = error.response.data?.message || 'Error del servidor';
      return Promise.reject({
        status: error.response.status,
        message: error_message,
        data: error.response.data
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Error de conexión - Verifica que el backend esté funcionando',
        data: null
      });
    } else {
      return Promise.reject({
        status: -1,
        message: 'Error interno',
        data: null
      });
    }
  }
);

// ==================== SERVICIOS DE AUTENTICACIÓN ====================

export const login_user = async (username, password) => {
  try {
    const response = await api_client.post('/auth/login', {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('cfdi_token', response.data.token);
      localStorage.setItem('cfdi_user', JSON.stringify(response.data.user));
    }
    
    return {
      success: true,
      data: response.data,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error al hacer login'
    };
  }
};

export const logout_user = async () => {
  try {
    const token = localStorage.getItem('cfdi_token');
    
    if (token) {
      await api_client.post('/auth/logout', { token });
    }
    
    localStorage.removeItem('cfdi_token');
    localStorage.removeItem('cfdi_user');
    
    return {
      success: true,
      message: 'Logout exitoso'
    };
  } catch (error) {
    localStorage.removeItem('cfdi_token');
    localStorage.removeItem('cfdi_user');
    
    return {
      success: true,
      message: 'Sesión cerrada'
    };
  }
};

export const check_session = () => {
  const token = localStorage.getItem('cfdi_token');
  const user = localStorage.getItem('cfdi_user');
  
  return {
    is_logged_in: !!(token && user),
    token,
    user: user ? JSON.parse(user) : null
  };
};

// ==================== SERVICIOS DE CFDIs ====================

export const get_downloaded_cfdis = async () => {
  try {
    const response = await api_client.get('/cfdis/download');
    return {
      success: true,
      data: response.data.data,
      total: response.data.total_cfdis,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      message: error.message || 'Error al obtener CFDIs descargados'
    };
  }
};

export const get_validated_cfdis = async () => {
  try {
    const response = await api_client.get('/cfdis/validate');
    return {
      success: true,
      data: response.data.data,
      total: response.data.total_cfdis,
      stats: response.data.estadisticas,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      stats: {},
      message: error.message || 'Error al obtener CFDIs validados'
    };
  }
};

export const get_generated_cfdis = async () => {
  try {
    const response = await api_client.get('/cfdis/generate');
    return {
      success: true,
      data: response.data.data,
      total: response.data.total_cfdis,
      total_amount: response.data.total_amount,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      total: 0,
      total_amount: '$0.00',
      message: error.message || 'Error al obtener CFDIs generados'
    };
  }
};

export const get_action_data = async (action) => {
  switch (action) {
    case 'download':
      return await get_downloaded_cfdis();
    case 'validate':
      return await get_validated_cfdis();
    case 'generate':
      return await get_generated_cfdis();
    default:
      return {
        success: false,
        data: [],
        message: 'Acción no válida'
      };
  }
};

export const format_table_data = (data, action) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(item => {
    const base_data = {
      id: item.id || 'N/A',
      fecha: item.fecha ? new Date(item.fecha).toLocaleDateString('es-MX') : 'N/A',
      total: item.total || '$0.00',
      estado: item.estado || 'Unknown'
    };
    
    switch (action) {
      case 'download':
        return {
          ...base_data,
          emisor: item.emisor_nombre || 'N/A',
          receptor: item.receptor_nombre || 'N/A',
          serie_folio: `${item.serie || ''}-${item.folio || ''}`
        };
      case 'validate':
        return {
          ...base_data,
          emisor: item.emisor_nombre || 'N/A',
          estatus_sat: item.estatus_sat || 'N/A',
          sello_valido: item.sello_valido ? 'Sí' : 'No'
        };
      case 'generate':
        return {
          ...base_data,
          receptor: item.receptor_nombre || 'N/A',
          uuid: item.uuid || 'N/A',
          serie_folio: `${item.serie || ''}-${item.folio || ''}`
        };
      default:
        return base_data;
    }
  });
};

export default {
  login_user,
  logout_user,
  check_session,
  get_downloaded_cfdis,
  get_validated_cfdis,
  get_generated_cfdis,
  get_action_data,
  format_table_data
};
'''
    }
    
    return files_content

def write_files():
    """Escribe todos los archivos del backend"""
    create_directory_structure()
    
    files = create_backend_files()
    
    for file_path, content in files.items():
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Archivo creado: {file_path}")
        except Exception as e:
            print(f"❌ Error creando {file_path}: {e}")

def create_routes_files():
    """Crea los archivos de rutas por separado"""
    
    # AUTH.PY - Rutas de autenticación
    auth_content = '''"""
MVP CFDI - Rutas de Autenticación
Endpoints para login y manejo de sesiones básicas
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime, timedelta
import hashlib

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

class LoginRequest(BaseModel):
    username: str
    password: str

DEMO_USERS = {
    "admin": {
        "password": "admin123",
        "nombre": "Administrador Demo",
        "rol": "admin",
        "email": "admin@mvp-cfdi.com"
    },
    "usuario": {
        "password": "user123", 
        "nombre": "Usuario Demo",
        "rol": "user",
        "email": "usuario@mvp-cfdi.com"
    },
    "demo": {
        "password": "demo",
        "nombre": "Usuario Demostración",
        "rol": "demo",
        "email": "demo@mvp-cfdi.com"
    }
}

def generate_demo_token(username: str) -> str:
    timestamp = datetime.now().isoformat()
    raw_token = f"{username}:{timestamp}:mvp-cfdi-2024"
    return hashlib.md5(raw_token.encode()).hexdigest()

def validate_credentials(username: str, password: str) -> Dict[str, Any]:
    if username in DEMO_USERS:
        user_data = DEMO_USERS[username]
        if user_data["password"] == password:
            return {
                "valid": True,
                "user": {
                    "username": username,
                    "nombre": user_data["nombre"],
                    "rol": user_data["rol"],
                    "email": user_data["email"]
                }
            }
    
    if username and password:
        return {
            "valid": True,
            "user": {
                "username": username,
                "nombre": f"Usuario {username.title()}",
                "rol": "demo",
                "email": f"{username}@demo.com"
            }
        }
    
    return {"valid": False, "user": None}

@router.post("/login")
async def login(credentials: LoginRequest):
    try:
        if not credentials.username or not credentials.password:
            raise HTTPException(
                status_code=400, 
                detail="Username y password son requeridos"
            )
        
        validation = validate_credentials(credentials.username, credentials.password)
        
        if validation["valid"]:
            token = generate_demo_token(credentials.username)
            
            user_data = validation["user"]
            user_data.update({
                "login_time": datetime.now().isoformat(),
                "session_expires": (datetime.now() + timedelta(hours=8)).isoformat()
            })
            
            return {
                "success": True,
                "message": "Login exitoso",
                "user": user_data,
                "token": token,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(
                status_code=401,
                detail="Credenciales inválidas"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno durante login: {str(e)}"
        )

@router.post("/logout")
async def logout(token: Dict[str, str]):
    try:
        user_token = token.get("token", "")
        
        if user_token:
            return {
                "success": True,
                "message": "Logout exitoso",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise HTTPException(status_code=400, detail="Token requerido")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error durante logout: {str(e)}"
        )
'''
    
    # CFDIS.PY - Rutas de CFDIs  
    cfdis_content = '''"""
MVP CFDI - Rutas de CFDIs
Endpoints específicos para la gestión de CFDIs
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
import json
import os
from datetime import datetime

router = APIRouter(prefix="/api/cfdis", tags=["CFDIs"])

DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "dummy_cfdis.json")

def load_cfdi_data() -> Dict[str, Any]:
    try:
        with open(DATA_FILE_PATH, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Archivo de datos no encontrado")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error al leer el archivo de datos")

def save_cfdi_data(data: Dict[str, Any]) -> bool:
    try:
        with open(DATA_FILE_PATH, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        return True
    except Exception:
        return False

@router.get("/download")
async def get_downloaded_cfdis():
    try:
        data = load_cfdi_data()
        cfdis = data.get("cfdis_descargados", [])
        
        return {
            "success": True,
            "action": "download",
            "total_cfdis": len(cfdis),
            "message": f"Se obtuvieron {len(cfdis)} CFDIs descargados",
            "data": cfdis,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener CFDIs descargados: {str(e)}")

@router.get("/validate")
async def get_validated_cfdis():
    try:
        data = load_cfdi_data()
        cfdis = data.get("cfdis_validacion", [])
        
        stats = {
            "validos": 0,
            "cancelados": 0,
            "errores": 0
        }
        
        for cfdi in cfdis:
            estado = cfdi.get("estado", "").lower()
            if estado == "válido":
                stats["validos"] += 1
            elif estado == "cancelado":
                stats["cancelados"] += 1
            else:
                stats["errores"] += 1
        
        return {
            "success": True,
            "action": "validate",
            "total_cfdis": len(cfdis),
            "message": f"Se validaron {len(cfdis)} CFDIs",
            "estadisticas": stats,
            "data": cfdis,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al validar CFDIs: {str(e)}")

@router.get("/generate")
async def get_generated_cfdis():
    try:
        data = load_cfdi_data()
        cfdis = data.get("cfdis_generados", [])
        
        total_amount = 0
        for cfdi in cfdis:
            total_str = cfdi.get("total", "$0.00").replace("$", "").replace(",", "")
            try:
                total_amount += float(total_str)
            except ValueError:
                pass
        
        return {
            "success": True,
            "action": "generate",
            "total_cfdis": len(cfdis),
            "total_amount": f"${total_amount:,.2f}",
            "message": f"Se generaron {len(cfdis)} facturas exitosamente",
            "data": cfdis,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener CFDIs generados: {str(e)}")
'''

    # UTILS.PY - Rutas de utilidad
    utils_content = '''"""
MVP CFDI - Rutas de Utilidad
Endpoints para health check, catálogos y funciones auxiliares
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import json
import os
from datetime import datetime

router = APIRouter(prefix="/api", tags=["Utilidades"])

DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "dummy_cfdis.json")

def load_cfdi_data() -> Dict[str, Any]:
    try:
        with open(DATA_FILE_PATH, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Archivo de datos no encontrado")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Error al leer el archivo de datos")

@router.get("/health")
async def health_check():
    try:
        data = load_cfdi_data()
        data_status = "OK" if data else "ERROR"
        
        return {
            "status": "healthy",
            "message": "MVP CFDI API funcionando correctamente",
            "version": "1.0.0",
            "data_file_status": data_status,
            "endpoints_available": [
                "/api/health",
                "/api/auth/login",
                "/api/cfdis/download",
                "/api/cfdis/validate", 
                "/api/cfdis/generate",
                "/api/catalogos",
                "/docs"
            ],
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Health check failed: {str(e)}"
        )

@router.get("/catalogos")
async def get_sat_catalogs():
    try:
        data = load_cfdi_data()
        catalogos = data.get("catalogos_sat", {})
        
        return {
            "success": True,
            "catalogos": catalogos,
            "total_catalogos": len(catalogos),
            "message": "Catálogos del SAT obtenidos correctamente",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al obtener catálogos: {str(e)}"
        )
'''

    # Escribir archivos de rutas
    routes_files = {
        "backend/routes/auth.py": auth_content,
        "backend/routes/cfdis.py": cfdis_content,
        "backend/routes/utils.py": utils_content
    }
    
    for file_path, content in routes_files.items():
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Archivo creado: {file_path}")
        except Exception as e:
            print(f"❌ Error creando {file_path}: {e}")

def main():
    """Función principal que crea todo el backend"""
    print("🚀 Creando backend FastAPI automáticamente...")
    print("=" * 50)
    
    # Verificar que estamos en el directorio correcto
    if not os.path.exists("backend") and not os.path.exists("frontend"):
        print("❌ Error: Ejecuta este script desde la raíz del proyecto mvp-cfdi/")
        print("   Estructura esperada: mvp-cfdi/backend/ y mvp-cfdi/frontend/")
        return
    
    # Crear estructura y archivos
    write_files()
    create_routes_files()
    
    print("=" * 50)
    print("✅ Backend creado exitosamente!")
    print("\n🚀 Para iniciar:")
    print("cd backend")
    print("pip install -r requirements.txt")
    print("python app.py")
    print("\n🌐 URLs:")
    print("• API: http://localhost:8000")
    print("• Docs: http://localhost:8000/docs")
    print("• Health: http://localhost:8000/api/health")

if __name__ == "__main__":
    main()