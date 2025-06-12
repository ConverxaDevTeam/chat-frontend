# Arquitectura Sofia Chat Frontend v2

## Visión General del Proyecto

Sistema de chat multi-tenant con gestión de organizaciones, departamentos y agentes de IA. Frontend desarrollado en React + TypeScript con Vite, Redux Toolkit para estado global y Tailwind CSS para estilos.

## Estructura Principal

### Directorios Raíz

- **`/src`** - Código fuente de la aplicación
- **`/public`** - Archivos estáticos (imágenes, iconos, manifests)
- **`/docu`** - Documentación técnica y de arquitectura
- **`/dist`** - Build de producción (generado)
- **`/node_modules`** - Dependencias (generado)

## Arquitectura del Código Fuente (`/src`)

### **`/components`** - Componentes Reutilizables
- **Responsabilidad**: UI components sin lógica de negocio
- **Organización**: Por funcionalidad (Card, Forms, Icons, etc.)
- **Tamaño máximo**: 30 líneas por componente
- **Patrón**: Componentes funcionales con hooks

### **`/pages`** - Páginas y Vistas
- **Responsabilidad**: Contenedores de alto nivel con lógica de negocio
- **Organización**: Por funcionalidad/módulo del sistema
- **Estructura**: Una carpeta por página con componentes específicos
- **Conexión**: Redux para estado global, hooks para lógica local

### **`/services`** - Capa de Datos
- **Responsabilidad**: Comunicación con APIs y manejo de datos
- **Patrón**: Un archivo por dominio de negocio
- **Manejo de errores**: Centralizado con alertas automáticas
- **Instancia HTTP**: Axios con interceptores de autenticación

### **`/store`** - Estado Global (Redux Toolkit)
- **`/reducers`** - Slices de estado por dominio
- **`/actions`** - Actions síncronas y asíncronas
- **Dominios**: auth, chat, conversations, department, notifications

### **`/hooks`** - Lógica Reutilizable
- **Responsabilidad**: Custom hooks para casos de uso específicos
- **Patrón**: Un hook por responsabilidad, sin anidamiento
- **Inyección de dependencias**: Vía props, no hooks dentro de hooks

### **`/utils`** - Utilidades y Helpers
- **`/interfaces`** - Tipado TypeScript
- **Funciones puras**: Sin efectos secundarios
- **Validaciones**: Schemas y helpers de validación

### **`/config`** - Configuración
- **URLs de API**: Centralizadas con tipado estricto
- **Variables de entorno**: Configuración por ambiente
- **Tokens**: Configuración de autenticación

## Patrones Arquitectónicos

### **Flujo de Datos**
```
UI Component → Hook (caso de uso) → Service → API → Redux Store → UI Update
```

### **Gestión de Estado**
- **Local**: useState, useEffect para componentes
- **Global**: Redux Toolkit para estado compartido
- **Casos de uso**: Custom hooks para lógica de negocio

### **Comunicación con API**
- **Interceptores**: Manejo automático de tokens y errores
- **Tipado**: Interfaces TypeScript para requests/responses
- **Error handling**: Alertas centralizadas con SweetAlert2

### **Enrutamiento**
- **React Router v6**: Navegación declarativa
- **Rutas protegidas**: HOCs para autenticación y autorización
- **Lazy loading**: Componentes cargados bajo demanda

## Tecnologías y Librerías Clave

### **Core Framework**
- React 18 + TypeScript
- Vite (build tool y dev server)
- React Router v6

### **Estado y Datos**
- Redux Toolkit (estado global)
- Axios (HTTP client)
- React Hook Form (formularios)

### **UI y Estilos**
- Tailwind CSS (utility-first)
- React Icons
- SweetAlert2 (modales y alertas)

### **Tiempo Real**
- Socket.io-client (WebSockets)
- React Query para cache (en evaluación)

### **Utilidades**
- date-fns (manejo de fechas)
- JWT Decode (tokens)
- Yup (validación de schemas)

## Convenciones de Código

### **Nomenclatura**
- Componentes: PascalCase
- Hooks: camelCase con prefijo 'use'
- Services: camelCase con sufijo 'Service'
- Constantes: SCREAMING_SNAKE_CASE

### **Imports**
- Alias paths configurados (@components, @utils, @services, etc.)
- Imports ordenados: externos → internos → relativos
- Exports nombrados preferidos sobre default

### **Tipado**
- Interfaces para objetos de datos
- Enums para valores constantes (no strings literales)
- Tipado estricto, evitar 'any' completamente

### **Arquitectura de Archivos**
- Máximo 500 líneas por archivo
- Un caso de uso por hook
- Separación clara de responsabilidades
