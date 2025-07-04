# Caso de Uso: Gestión de Usuarios en Organizaciones

## Descripción

Sistema para administrar usuarios dentro de una organización específica, incluyendo operaciones de listado, creación, edición y eliminación de usuarios con roles específicos.

## Flujo Principal

```mermaid
flowchart TD
    A[OWNER accede a Users] --> B[Cargar usuarios de organización]
    B --> C[getUserMyOrganization API]
    C --> D[Mostrar lista de usuarios]
    
    D --> E{Acción del usuario}
    E -->|Agregar| F[Modal ModalAddUser]
    E -->|Editar| G[Modal ModalAddUser - cambio password]
    E -->|Eliminar| H[Confirmar eliminación]
    E -->|Click en Rol| M[Modal ModalChangeRole]
    
    F --> I[addUserInOrganizationById]
    G --> J[changeUserPassword]
    H --> K[deleteUserFromOrganization]
    M --> N[changeUserRole]
    
    I --> L[Refrescar lista]
    J --> L
    K --> L
    N --> L
    L --> D
```

## Componentes Involucrados

### UsersOrganization (`/pages/Users/UsersOrganization/`)
- **Responsabilidad**: Contenedor principal con lógica de negocio
- **Estado local**: usuarios, modales, loading, usuario seleccionado
- **Permisos**: Solo OWNER puede agregar/eliminar usuarios
- **Hooks**: useState, useEffect, useSelector

### UserCard (`/pages/Users/UsersOrganization/UserCard.tsx`)
- **Responsabilidad**: Mostrar información de usuario individual
- **Props**: userData, onEdit, onDelete, onChangeRole
- **UI**: Avatar, email, nombre, rol clickeable, botones de acción

### ModalAddUser (`/pages/Users/UsersOrganization/ModalAddUser.tsx`)
- **Responsabilidad**: Formulario para agregar usuarios y cambiar contraseñas
- **Modos**: 
  - Creación: Campo email para invitar usuario
  - Edición: Campo password para cambiar contraseña
- **Validación**: 
  - Agregar: Email requerido y formato válido
  - Editar: Password mínimo 6 caracteres

### ModalChangeRole (`/pages/Users/UsersOrganization/ModalChangeRole.tsx`)
- **Responsabilidad**: Modal de confirmación para cambio de rol
- **Props**: currentRole, userEmail, handleChangeRole, close
- **Roles soportados**: USER ↔ HITL (intercambiables)
- **UI**: Radio buttons para selección de nuevo rol

## Servicios de Datos

### getUserMyOrganization
- **Endpoint**: `/api/user/all/${organizationId}`
- **Método**: GET
- **Retorna**: Array de usuarios con roles en la organización
- **Mapeo**: Transforma respuesta a formato IUserApi

### addUserInOrganizationById
- **Endpoint**: `/api/user/add/${organizationId}`
- **Método**: POST
- **Parámetros**: { email: string }
- **Función**: Invita usuario a organización

### changeUserPassword
- **Endpoint**: `/api/user/change-password/${userId}`
- **Método**: POST
- **Parámetros**: { newPassword: string }
- **Función**: Cambia contraseña de usuario existente
- **Permisos**: OWNER o superadmin

### deleteUserFromOrganization
- **Endpoint**: `/api/user/organization/${organizationId}/user/${userId}`
- **Método**: DELETE
- **Parámetros**: organizationId, userId
- **Función**: Elimina relación usuario-organización
- **Respuesta**: { userDeleted, roleDeleted, message }

### changeUserRole
- **Endpoint**: `/api/user/organization/${organizationId}/users/${userId}/role`
- **Método**: PATCH
- **Parámetros**: { role: OrganizationRoleType }
- **Función**: Cambia el rol de un usuario en la organización
- **Permisos**: Solo OWNER puede cambiar roles
- **Restricciones**: Solo entre USER y HITL, no se puede cambiar propio rol si es OWNER

## Estructura de Datos

### IUserApi Interface
```typescript
{
  id: number; // User ID usado para delete
  email: string;
  first_name: string | null;
  last_name: string | null;
  email_verified: boolean;
  last_login: string | null;
  userOrganizations: {
    role: OrganizationRoleType;
    organization: { id?: number; name?: string; } | null;
  }[];
}
```

### OrganizationRoleType Enum
- **OWNER**: Propietario con todos los permisos
- **ADMIN**: Administrador con permisos avanzados
- **SUPERVISOR**: Supervisor de conversaciones
- **HITL**: Agente humano en el bucle
- **USER**: Usuario básico solo lectura

## Reglas de Negocio

### Permisos por Rol
- **OWNER**: Puede agregar, editar, eliminar usuarios y cambiar roles
- **ADMIN+**: Solo visualización (implementación futura)
- **Otros roles**: Sin acceso a gestión de usuarios

### Validaciones
- **Agregar**: Email único por organización y formato válido
- **Editar**: Contraseña mínimo 6 caracteres
- **Eliminar**: No se puede eliminar el último OWNER
- **Cambio de rol**: Solo entre USER y HITL, OWNER no puede cambiar su propio rol
- Confirmación requerida para eliminación y cambio de rol

### Estados y Operaciones
- **Activo**: Usuario con acceso completo
- **Invitado**: Usuario invitado pendiente de activación  
- **Cambio password**: Actualización de credenciales por OWNER
- **Eliminado**: Usuario removido de organización

### Casos de Error

### Permisos Insuficientes
- **Código**: 403 Forbidden
- **Mensaje**: "No tienes permisos para realizar esta acción"
- **Acción**: Toast de error, bloqueo de UI

### Password Inválido
- **Validación**: Frontend
- **Mensaje**: "La contraseña debe tener al menos 6 caracteres"
- **Acción**: Bloquear submit, mostrar error

### Usuario No Encontrado
- **Código**: 404 Not Found
- **Mensaje**: "El usuario especificado no existe"
- **Acción**: Refrescar lista, mostrar error

### Último Owner
- **Código**: 409 Conflict
- **Mensaje**: "No se puede eliminar el último propietario"
- **Acción**: Bloquear eliminación, mensaje explicativo

## Consideraciones Técnicas

### Performance
- Lista paginada para organizaciones grandes
- Cache local de usuarios durante sesión
- Optimistic updates en eliminación

### UX/UI
- Loading states en operaciones
- Confirmación modal para delete y cambio de rol
- RoleBadge clickeable con hover effects
- Toast notifications para feedback
- Diseño responsive grid layout

### Seguridad
- Verificación de permisos en frontend y backend
- Validación de userId y organizationId antes de eliminación
- Audit log de cambios de usuarios (backend)

## Dependencias

### Redux State
- `auth.selectOrganizationId`: Organización actual
- `auth.myOrganizations`: Roles del usuario autenticado
- `auth.user`: Datos del usuario actual

### Servicios Externos
- API de autenticación para validar permisos
- Sistema de notificaciones para invitaciones
- Logs de auditoría para tracking

### Librerías
- React Hook Form para formularios
- React Toastify para notificaciones
- Axios para llamadas HTTP