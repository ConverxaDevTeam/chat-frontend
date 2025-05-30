# Diagramas de Autenticación

Este documento contiene los diagramas que describen los flujos de autenticación en Sofia Chat Frontend.

## Flujo de Autenticación General

```mermaid
flowchart TD
    A[Usuario] -->|Ingresa credenciales| B[Página de Login]
    B -->|logInAsync| C[Redux Auth Actions]
    C -->|POST /api/auth/log-in| D[Backend API]
    D -->|Valida credenciales| D
    D -->|Devuelve tokens| C
    C -->|Almacena tokens| E[LocalStorage]
    C -->|Actualiza estado| F[Redux Auth State]
    C -->|Conecta WebSocket| G[WebSocketService]
    C -->|getUserAsync| H[Obtiene datos de usuario]
    C -->|getMyOrganizationsAsync| I[Obtiene organizaciones]
    F -->|authenticated: true| J[Redirección a Dashboard]
    
    K[Usuario] -->|Cierra sesión| L[logOutAsync]
    L -->|POST /api/auth/log-out| D
    L -->|Elimina tokens| E
    L -->|Actualiza estado| F
    L -->|Desconecta WebSocket| G
    F -->|authenticated: false| B
```

## Flujo de Autenticación con Google

```mermaid
flowchart TD
    A[Usuario] -->|Clic en botón Google| B[GoogleLoginButton]
    B -->|useGoogleLogin| C[Google OAuth API]
    C -->|Ventana de autenticación| D[Google Auth]
    D -->|Selecciona cuenta| D
    D -->|Devuelve access_token| C
    C -->|access_token| B
    B -->|googleLoginAsync| E[Redux Auth Actions]
    E -->|POST /api/auth/google-login| F[Backend API]
    F -->|Verifica token con Google| F
    F -->|Crea/Actualiza usuario| F
    F -->|Devuelve tokens JWT| E
    E -->|Almacena tokens| G[LocalStorage]
    E -->|Actualiza estado| H[Redux Auth State]
    E -->|Conecta WebSocket| I[WebSocketService]
    E -->|getUserAsync| J[Obtiene datos de usuario]
    E -->|getMyOrganizationsAsync| K[Obtiene organizaciones]
    H -->|authenticated: true| L[Redirección a Dashboard]
```

## Estructura de Autenticación

```mermaid
classDiagram
    class AuthState {
        +authenticated: boolean
        +loading: boolean
        +user: User | null
        +selectOrganizationId: number | null
        +myOrganizations: Organization[]
        +socket: Socket | null
    }
    
    class AuthActions {
        +logInAsync(credentials) AsyncThunk
        +googleLoginAsync(token) AsyncThunk
        +logOutAsync() AsyncThunk
        +verifySessionAsync() AsyncThunk
        +getUserAsync() AsyncThunk
        +getMyOrganizationsAsync() AsyncThunk
        +connectSocketAsync() AsyncThunk
        +disconnectSocketAsync() AsyncThunk
    }
    
    class LoginComponent {
        -email: string
        -password: string
        -error: string | null
        -active: boolean
        +handleSubmit() void
        +handleChange() void
    }
    
    class GoogleLoginButton {
        -setError: Function
        +login() void
    }
    
    class TokenService {
        +getToken() string
        +getRefreshToken() string
        +validateToken() boolean
        +updatedToken() boolean
        +isTokenAboutToExpire() boolean
        +isRefreshTokenAboutToExpire() boolean
        +deleteAccess() void
    }
    
    AuthActions --> AuthState: Actualiza
    LoginComponent --> AuthActions: Usa
    GoogleLoginButton --> AuthActions: Usa
    AuthActions --> TokenService: Usa
```

## Ciclo de Vida de la Sesión

```mermaid
stateDiagram-v2
    [*] --> NoAutenticado
    NoAutenticado --> Autenticando: logInAsync/googleLoginAsync
    Autenticando --> Autenticado: Éxito
    Autenticando --> Error: Fallo
    Error --> NoAutenticado
    
    Autenticado --> Verificando: verifySessionAsync
    Verificando --> Autenticado: Token válido
    Verificando --> NoAutenticado: Token inválido/expirado
    
    Autenticado --> Actualizando: Actualiza token
    Actualizando --> Autenticado: Éxito
    Actualizando --> NoAutenticado: Fallo
    
    Autenticado --> CerrandoSesión: logOutAsync
    CerrandoSesión --> NoAutenticado: Sesión cerrada
```
