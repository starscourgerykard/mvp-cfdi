"""
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
