"""
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
