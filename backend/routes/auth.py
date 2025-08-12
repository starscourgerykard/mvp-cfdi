"""
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
