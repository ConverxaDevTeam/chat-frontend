# Guías UI/UX - Converxa Chat Frontend

## Principios de Diseño

### Consistencia Visual
- Tipografía: Poppins para textos, Quicksand para títulos
- Colores: Converxa design tokens (app-superDark, app-electricGreen, etc.)
- Espaciado: Múltiplos de 4px (8px, 16px, 24px, 32px)
- Bordes: 4px radius por defecto

### Componentes Base
- **Button**: Estados hover, disabled, loading
- **Input**: Focus states, error states, placeholders descriptivos
- **Modal**: Overlay oscuro, escape para cerrar
- **Table**: Headers ordenables, hover en filas
- **Pagination**: Números de página, items por página selector

## Patrones de Layout

### Headers de Página
```
[Título] [Botón Primario] [Botón Secundario] [Filtros]
```

### Tablas con Datos
```
[Filtros horizontales]
[Header con ordenamiento]
[Filas con hover]
[Paginación centrada]
```

### Estados de Carga
- Loading spinner centrado
- Skeleton loaders para contenido específico
- Progress bars para operaciones largas

## Sistema de Filtros

### Estructura Estándar
- **Búsqueda**: Input con ícono de lupa, debounce 500ms
- **Dropdowns**: Contexto menu con opciones
- **Fechas**: Date pickers con presets comunes
- **Chips**: Filtros activos removibles

### Comportamiento
- Reset a página 1 al cambiar filtros
- Persistencia durante sesión
- Clear all option disponible
- Estados vacíos informativos

## Paginación

### Elementos
- Números de página (max 5 visibles)
- Botones anterior/siguiente
- Selector items por página: [10, 20, 50]
- Total items indicator

### Responsividad
- Desktop: Paginación completa
- Mobile: Solo anterior/siguiente

## Feedback de Usuario

### Estados de Éxito
- Toast notifications (react-toastify)
- Iconos de confirmación en acciones
- Estados visuales inmediatos

### Estados de Error
- Mensajes específicos (no genéricos)
- Opciones de retry cuando aplicable
- Colores de error consistentes

### Estados Vacíos
- Íconos descriptivos
- Mensaje explicativo
- Acción sugerida (botón o link)

## Accesibilidad

### Navegación
- Tab order lógico
- Focus indicators visibles
- Escape para cerrar modales/dropdowns

### Semántica
- Aria-labels para iconos
- Roles ARIA apropiados
- Alt text para imágenes informativas

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Adaptaciones
- Tablas → Cards en mobile
- Filtros inline → Modal en mobile
- Sidebars → Hamburger menu

## Iconografía

### Sistema de Iconos
- SVG icons en `/public/mvp/`
- Tamaño estándar: 20x20px
- Estados hover para interactivos

### Convenciones
- Acciones: pencil (editar), trash (eliminar), three-dots (menú)
- Estados: check (éxito), x (error), info (información)
- Navegación: chevron-left/right (páginas), chevron-down (dropdown)

## Performance UI

### Optimizaciones
- Debounce en búsquedas (500ms)
- Memoization en componentes pesados
- Lazy loading para modales/dropdowns

### Loading States
- Inmediato: Skeleton placeholders
- Corto (< 2s): Spinner
- Largo (> 2s): Progress bar con descripción

## Validación de Formularios

### Timing
- Real-time para formato (email, teléfono)
- On blur para validaciones complejas
- On submit para validación final
n
### Mensajes
- Específicos por campo
- Positivos cuando sea posible
- Ubicación consistente (debajo del input)
