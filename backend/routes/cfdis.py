"""
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
