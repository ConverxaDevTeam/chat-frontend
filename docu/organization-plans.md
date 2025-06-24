# Diagramas de Gestión de Planes de Organización

Este documento describe la arquitectura y flujos relacionados con la gestión de planes de organización en Sofia Chat Frontend.

## Estructura de Datos de Planes

```mermaid
classDiagram
    class OrganizationType {
        <<enumeration>>
        PRODUCTION
        MVP
        FREE
        CUSTOM
    }
    
    class IOrganization {
        +id number
        +logo string
        +created_at string
        +updated_at string
        +name string
        +type OrganizationType
        +agentType AgentType
        +description string
        +users number
        +email string
        +departments number
        +limitInfo PlanLimitInfo
        +owner OrganizationOwner
    }
    
    class PlanLimitInfo {
        +hasReachedLimit boolean
        +limit number
        +current number
        +daysRemaining number
    }
    
    class OrganizationOwner {
        +id number
        +role OrganizationRoleType
        +user User
    }
    
    class User {
        +id number
        +first_name string
        +last_name string
        +email string
    }
    
    IOrganization --> OrganizationType: type
    IOrganization --> PlanLimitInfo: limitInfo
    IOrganization --> OrganizationOwner: owner
    OrganizationOwner --> User: user
```

## Flujo de Gestión de Planes Personalizados

```mermaid
flowchart TD
    A[Usuario SuperAdmin] -->|Selecciona organización| B[OrganizationCard]
    B -->|Clic en Set Custom Plan| C[SetCustomPlanModal]
    
    C -->|Si plan no es custom| D[Confirmación de cambio]
    D -->|Confirmar| E[setOrganizationPlanToCustom]
    E -->|PATCH /api/plan/:id/set-custom| F[Backend API]
    F -->|Actualiza tipo de plan| F
    F -->|Respuesta exitosa| E
    E -->|Actualiza UI| G[Configurar detalles]
    
    C -->|Si plan ya es custom| G
    G -->|Ingresa límite de conversaciones| H[updateCustomPlanDetails]
    H -->|PATCH /api/plan/:id/details| F
    F -->|Actualiza detalles del plan| F
    F -->|Respuesta exitosa| H
    H -->|Notifica éxito| I[Cierra modal]
    I -->|Actualiza lista| J[Organizations]
```

## Flujo de Solicitud de Plan Personalizado

```mermaid
flowchart TD
    A[Usuario] -->|Ve banner de plan| B[PlanStatusBanner]
    B -->|Muestra días restantes| A
    A -->|Clic en Actualiza a Pro| C[handleRequestCustomPlan]
    C -->|POST /api/plan/request-custom| D[Backend API]
    D -->|Registra solicitud| D
    D -->|Respuesta exitosa| C
    C -->|Notifica éxito| A
```

## Arquitectura de Componentes de Planes

```mermaid
classDiagram
    class PlanService {
        +requestCustomPlan(organizationId) Promise
        +setOrganizationPlanToCustom(organizationId) Promise
        +updateCustomPlanDetails(organizationId, details) Promise
    }
    
    class PlanStatusBanner {
        -handleRequestCustomPlan() Promise
        +render() JSX
    }
    
    class SetCustomPlanModal {
        -organization IOrganization
        -onClose Function
        -onPlanUpdated Function
        -isLoading boolean
        -step string
        -conversationCountInput string
        -handleConfirmChangeToCustom() Promise
        -handleSavePlanDetails() Promise
        +render() JSX
    }
    
    class OrganizationCard {
        -organization IOrganization
        -onEdit Function
        -onDelete Function
        -onSetCustomPlan Function
        +render() JSX
    }
    
    class Organizations {
        -organizations IOrganization[]
        -handleSetCustomPlan(organization) void
        +render() JSX
    }
    
    class Interface {
        +render() JSX
    }
    
    PlanService <-- PlanStatusBanner: Usa
    PlanService <-- SetCustomPlanModal: Usa
    Organizations --> OrganizationCard: Renderiza
    Organizations --> SetCustomPlanModal: Renderiza
    Interface --> PlanStatusBanner: Renderiza
```

## Ciclo de Vida del Plan de Organización

```mermaid
stateDiagram-v2
    [*] --> Free
    Free --> SolicitandoCustom
    SolicitandoCustom --> Free
    SolicitandoCustom --> Custom
    
    Free --> Custom
    Custom --> Custom
    
    Free --> MVP
    Free --> Production
    MVP --> Production
    Production --> MVP
    
    Custom --> Free
    Custom --> MVP
    Custom --> Production
```
