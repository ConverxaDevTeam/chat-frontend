# Flujos de Autenticación

## Visión General

Sistema de autenticación JWT con refresh tokens, integración OAuth de Google y gestión de organizaciones multi-tenant.

## Flujo Principal de Autenticación

```mermaid
flowchart TD
    A[Login/Google] --> B[Auth Actions]
    B --> C[API Backend]
    C --> D[JWT Tokens]
    D --> E[LocalStorage]
    B --> F[Socket Connection]
    B --> G[User Data]
    B --> H[Organizations]
    
    I[Token Expired] --> J[Refresh Token]
    J --> K{Valid?}
    K -->|Yes| D
    K -->|No| L[Logout]
```

## Estados de Autenticación

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Authenticated: Token válido
    Loading --> NotAuthenticated: Sin token/inválido
    
    NotAuthenticated --> Authenticating: Login/Google
    Authenticating --> Authenticated: Éxito
    Authenticating --> NotAuthenticated: Error
    
    Authenticated --> RefreshingToken: Token expirando
    RefreshingToken --> Authenticated: Refresh exitoso
    RefreshingToken --> NotAuthenticated: Refresh fallido
    
    Authenticated --> NotAuthenticated: Logout
```

## Componentes y Responsabilidades

### Auth State (Redux)
- **authenticated**: Estado de autenticación
- **user**: Datos del usuario actual
- **myOrganizations**: Organizaciones con roles
- **selectOrganizationId**: Organización activa
- **socket**: Conexión WebSocket

### Auth Actions
- **logInAsync**: Login con email/password
- **googleLoginAsync**: Login con Google OAuth
- **verifySessionAsync**: Validar sesión actual
- **getUserAsync**: Obtener datos de usuario
- **getMyOrganizationsAsync**: Cargar organizaciones
- **logOutAsync**: Cerrar sesión

### Token Management
- **Almacenamiento**: LocalStorage para tokens
- **Refresh automático**: Antes de expiración
- **Interceptores**: Axios para manejo automático
- **Validación**: JWT decode para verificar estado

## Roles y Permisos por Organización

```mermaid
graph LR
    A[Usuario] --> B[UserOrganization]
    B --> C[Organización]
    B --> D[Rol]
    
    D --> E[OWNER]
    D --> F[ADMIN] 
    D --> G[SUPERVISOR]
    D --> H[HITL]
    D --> I[USER]
    
    E --> J[Todos los permisos]
    F --> K[Gestión avanzada]
    G --> L[Supervisión]
    H --> M[Chat manual]
    I --> N[Solo lectura]
```

## Estructura de Datos

### User
- `id`, `email`, `first_name`, `last_name`
- `email_verified`, `is_super_admin`
- `last_login`, `created_at`, `updated_at`

### Organization Relationship
- `id` (UserOrganization ID)
- `role` (OrganizationRoleType)
- `organization` (datos de organización)

## Flujo de Verificación de Sesión

```mermaid
sequenceDiagram
    participant App
    participant Redux
    participant TokenService
    participant API
    
    App->>Redux: Inicializar app
    Redux->>TokenService: Verificar token
    TokenService->>TokenService: Validar JWT
    alt Token válido
        Redux->>API: getUserAsync
        API-->>Redux: Datos usuario
        Redux->>API: getMyOrganizationsAsync
        API-->>Redux: Organizaciones
        Redux-->>App: Estado autenticado
    else Token inválido/expirado
        TokenService->>API: Refresh token
        alt Refresh exitoso
            API-->>TokenService: Nuevos tokens
            TokenService->>Redux: Continuar flujo
        else Refresh fallido
            Redux-->>App: Estado no autenticado
        end
    end
```

## Configuración de Rutas Protegidas

### ProtectedAuth
- Verifica estado de autenticación
- Redirecciona a login si no autenticado
- Permite acceso a rutas principales

### ProtectedSuperAdmin
- Verifica rol de super administrador
- Restringe acceso a funciones globales
- Manejo de usuarios y organizaciones globales

## Socket Connection

- **Conexión automática**: Al autenticarse
- **Desconexión**: Al cerrar sesión
- **Reconexión**: Al cambiar de organización
- **Eventos**: Mensajes en tiempo real por organización