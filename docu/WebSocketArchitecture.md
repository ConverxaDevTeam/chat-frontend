# Arquitectura WebSocket en Converxa Frontend

Este documento describe la arquitectura de WebSockets utilizada en el proyecto Converxa Frontend.

## Diagrama de Conexión WebSocket Global (Redux)

```mermaid
sequenceDiagram
    participant Usuario
    participant Redux
    participant WebSocketService
    participant Servidor

    Usuario->>Redux: Inicia sesión
    Redux->>Redux: Ejecuta connectSocketAsync
    Redux->>WebSocketService: connectWebSocket(token)
    WebSocketService->>Servidor: Conexión socket.io (token)
    Servidor-->>WebSocketService: Conexión establecida
    WebSocketService-->>Redux: Instancia de Socket
    Redux->>WebSocketService: Registra event listener "message"

    Note over Usuario, Servidor: La conexión permanece activa durante toda la sesión

    Servidor->>WebSocketService: Evento "message" (update-user)
    WebSocketService->>Redux: Notifica cambio
    Redux->>Redux: Actualiza estado (getUserAsync)

    Servidor->>WebSocketService: Evento "message" (new-message)
    WebSocketService->>Redux: Notifica nuevo mensaje
    Redux->>Redux: Actualiza conversaciones (newMessageChat)

    Usuario->>Redux: Cierra sesión
    Redux->>WebSocketService: disconnectWebSocket()
    WebSocketService->>Servidor: Desconexión
    Servidor-->>WebSocketService: Confirma desconexión
```

## Diagrama de Conexión WebSocket de Chat (Componente Chat)

```mermaid
sequenceDiagram
    participant Usuario
    participant ChatComponent
    participant useWebSocketConnection
    participant WebSocketService
    participant Servidor

    Usuario->>ChatComponent: Abre componente de chat
    ChatComponent->>useWebSocketConnection: Inicializa hook
    useWebSocketConnection->>WebSocketService: joinRoom(roomName)
    WebSocketService->>Servidor: Evento "join" (roomName)

    useWebSocketConnection->>WebSocketService: Registra event listeners
    useWebSocketConnection->>WebSocketService: onWebSocketEvent("message", messageHandler)
    useWebSocketConnection->>WebSocketService: onWebSocketEvent("typing", typingHandler)
    useWebSocketConnection->>WebSocketService: onWebSocketEvent("agent:updated", agentUpdateHandler)

    Usuario->>ChatComponent: Envía mensaje
    ChatComponent->>WebSocketService: emitWebSocketEvent("message", {text, room, identifier})
    WebSocketService->>Servidor: Evento "message"

    Servidor->>WebSocketService: Respuesta del agente (evento "message")
    WebSocketService->>useWebSocketConnection: Notifica messageHandler
    useWebSocketConnection->>ChatComponent: addMessage({sender: "agent", text})
    ChatComponent->>Usuario: Muestra mensaje del agente

    Usuario->>ChatComponent: Cierra componente de chat
    ChatComponent->>useWebSocketConnection: Desmonta componente
    useWebSocketConnection->>WebSocketService: leaveRoom(roomName)
    WebSocketService->>Servidor: Evento "leave" (roomName)
    useWebSocketConnection->>WebSocketService: Elimina event listeners
```

## Diagrama de Flujo General de WebSockets

```mermaid
flowchart TD
    A[Usuario] -->|Inicia sesión| B[Redux Auth]
    B -->|connectSocketAsync| C[WebSocketService]
    C -->|socket.io| D[Servidor WebSocket]

    E[Usuario] -->|Abre chat| F[Componente Chat]
    F -->|useWebSocketConnection| G[WebSocketService]
    G -->|joinRoom| D

    E -->|Envía mensaje| F
    F -->|emitWebSocketEvent| G
    G -->|Evento message| D

    D -->|Respuesta| G
    G -->|Notifica evento| F
    F -->|Actualiza UI| E

    H[Servidor] -->|Notificaciones| D
    D -->|Evento message| G
    G -->|Notifica| B
    B -->|Actualiza estado| A
```

## Estructura de Datos de Mensajes WebSocket

```mermaid
classDiagram
    class WebSocketBaseResponse {
        +conf: {
            threadId: string
            agentId: string
        }
    }

    class WebSocketChatTestResponse {
        +text: string
    }

    class Message {
        +sender: "user" | "agent"
        +text: string
        +images?: string[]
        +threat_id?: string
    }

    class ChatAgentIdentifier {
        +agentId: number
        +type: AgentIdentifierType.CHAT_TEST
    }

    class TestAgentIdentifier {
        +type: AgentIdentifierType.TEST
        +threatId?: string
        +LLMAgentId?: string
        +agentId: number
        +agent: AgenteType
    }

    WebSocketBaseResponse <|-- WebSocketChatTestResponse
```

## Estructura de Servicios y Clases WebSocket

```mermaid
classDiagram
    class WebSocketService {
        -Socket websocket
        +connectWebSocket(token) Socket
        +disconnectWebSocket() Promise~string~
        +onWebSocketEvent(event, callback) void
        +removeWebSocketEvent(event, callback) void
        +emitWebSocketEvent(event, data) void
        +joinRoom(roomName) void
        +leaveRoom(roomName) void
    }

    class ReduxAuthActions {
        +connectSocketAsync() AsyncThunk
        +disconnectSocketAsync() AsyncThunk
        +disconnectSocketAndLogOut() Function
    }

    class useWebSocketConnection {
        +roomName: string
        +agentId: number
        +agentIdState: string
        +threatId: string
        +setThreatId() Function
        +setAgentId() Function
        +addMessage() Function
        +resetChat() Function
    }

    class useChat {
        -messages: Message[]
        -threatId: string
        -LLMAgentId: string
        +addMessage() Function
        +handleSendMessage() Function
        +resetChat() Function
    }

    WebSocketService <-- ReduxAuthActions: Usa
    WebSocketService <-- useWebSocketConnection: Usa
    useWebSocketConnection --> useChat: Actualiza
```

## Ciclo de Vida de la Conexión WebSocket

```mermaid
stateDiagram-v2
    [*] --> Desconectado
    Desconectado --> Conectando: connectWebSocket(token)
    Conectando --> Conectado: Conexión exitosa
    Conectando --> Error: Fallo de conexión
    Error --> Desconectado

    Conectado --> Escuchando: onWebSocketEvent()
    Escuchando --> Escuchando: Recibe eventos

    Conectado --> Emitiendo: emitWebSocketEvent()
    Emitiendo --> Conectado

    Conectado --> Uniendo: joinRoom()
    Uniendo --> Conectado

    Conectado --> Saliendo: leaveRoom()
    Saliendo --> Conectado

    Conectado --> Desconectando: disconnectWebSocket()
    Desconectando --> Desconectado: Evento "disconnect"
```
