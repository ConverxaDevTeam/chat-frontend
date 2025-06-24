# Caso de Uso: Script de Integración de WebChat

## Descripción
Generación y gestión del script de integración que permite a las organizaciones embeber el WebChat de Sofia en sus sitios web.

## Componentes Involucrados

### Archivo Principal
- **Ubicación**: `src/pages/Workspace/components/EditCors.tsx`
- **Responsabilidad**: Gestión de dominios CORS y generación del script de integración

### Hooks Personalizados
- **`useScriptManager`**: Genera el script y maneja la funcionalidad de copiado
- **`useDomainManager`**: Gestiona la lista de dominios permitidos

### Configuración
- **Archivo**: `src/config/config.ts`
- **Variable**: `urlFiles` (desde `VITE_PUBLIC_URL_FILES`)

## Flujo de Integración

```mermaid
flowchart TD
    A[Usuario accede a EditCors] --> B[useScriptManager genera script]
    B --> C[Script: urlFiles/sofia-chat/CI{integrationId}.js]
    C --> D[Usuario copia script]
    D --> E[Usuario pega script en etiqueta head de su sitio]
    E --> F[Validación CORS contra dominios registrados]
    F --> G[WebChat se carga en el sitio]
```

## Estructura del Script Generado

### Formato del Script
```
<script src="{VITE_PUBLIC_URL_FILES}/sofia-chat/CI{integrationId}.js"></script>
```

### Variables de Entorno Requeridas
- **`VITE_PUBLIC_URL_FILES`**: URL base para archivos estáticos
- **Ejemplo desarrollo**: `http://localhost:3001`
- **Ejemplo producción**: `https://files.sofia.com`

## Componentes de UI

### ScriptViewer
- **Responsabilidad**: Mostrar el script generado con instrucciones
- **Características**:
  - Visualización del script dentro de ejemplo HTML
  - Botón de copiado al portapapeles
  - Instrucciones detalladas de implementación

### CorsInput y CorsTagList
- **Responsabilidad**: Gestión de dominios permitidos
- **Seguridad**: Solo dominios registrados pueden cargar el WebChat

## Reglas de Negocio

### Generación del Script
1. El script se genera usando el ID único de la integración
2. La URL base proviene de variables de entorno
3. Formato: `CI{integrationId}.js`

### Seguridad CORS
1. Solo dominios registrados pueden cargar el WebChat
2. Los dominios deben incluir protocolo (https://)
3. Validación en tiempo real al agregar dominios

### Instrucciones de Integración
1. El script debe colocarse dentro de la etiqueta `<head>`
2. Se proporciona ejemplo visual de implementación
3. Mensajes claros sobre la funcionalidad de seguridad

## Casos de Uso Específicos

### Agregar Nuevo Dominio
1. Usuario ingresa dominio en formato `https://dominio.com`
2. Sistema valida que no esté duplicado
3. Se agrega a la lista de CORS de la integración
4. WebChat queda habilitado para ese dominio

### Copiar Script de Integración
1. Sistema genera script con ID único
2. Usuario hace clic en botón copiar
3. Script se copia al portapapeles
4. Confirmación visual del copiado

### Implementar WebChat
1. Usuario copia script generado
2. Pega script en etiqueta `<head>` de su sitio
3. Archivo `CI{id}.js` se carga desde el servidor
4. WebChat se inicializa automáticamente

## Consideraciones Técnicas

### Variables de Entorno
- **Desarrollo**: URLs localhost para testing
- **Producción**: URLs definitivas del servidor de archivos
- **Flexibilidad**: Configuración por entorno sin cambios de código

### Manejo de Errores
- Validación de formato de dominio
- Prevención de dominios duplicados
- Feedback visual en operaciones de copiado

### Performance
- Script ligero cargado dinámicamente
- Sin dependencias adicionales
- Carga asíncrona no bloquea el sitio web

## Archivo de Prueba
- **Ubicación**: `test-chat.html`
- **Propósito**: Testing local del script de integración
- **Ejemplo**: Script `CI13.js` para pruebas de desarrollo