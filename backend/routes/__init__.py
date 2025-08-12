"""
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
