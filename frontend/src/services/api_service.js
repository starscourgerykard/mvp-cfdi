/**
 * MVP CFDI - Servicio de API Completo
 * Maneja todas las llamadas al backend FastAPI
 */

import axios from 'axios';

// Configuración base del API
const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const api_client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

export const create_cfdi = async (cfdi_data) => {
  try {
    const response = await api_client.post('/cfdis/generate', cfdi_data);
    return {
      success: true,
      data: response.data.cfdi,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error.message || 'Error al crear CFDI'
    };
  }
};

// ==================== SERVICIOS DE UTILIDAD ====================

export const check_api_health = async () => {
  try {
    const response = await api_client.get('/health');
    return {
      success: true,
      status: response.data.status,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      status: 'error',
      message: error.message || 'API no disponible'
    };
  }
};

export const get_sat_catalogs = async () => {
  try {
    const response = await api_client.get('/catalogos');
    return {
      success: true,
      data: response.data.catalogos,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: {},
      message: error.message || 'Error al obtener catálogos'
    };
  }
};

export const get_general_stats = async () => {
  try {
    const response = await api_client.get('/stats/general');
    return {
      success: true,
      data: response.data.stats,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      data: {},
      message: error.message || 'Error al obtener estadísticas'
    };
  }
};

// ==================== FUNCIONES DE MANEJO DE DATOS ====================

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

// Exportación por defecto
export default {
  login_user,
  logout_user,
  check_session,
  get_downloaded_cfdis,
  get_validated_cfdis,
  get_generated_cfdis,
  create_cfdi,
  check_api_health,
  get_sat_catalogs,
  get_general_stats,
  get_action_data,
  format_table_data
};