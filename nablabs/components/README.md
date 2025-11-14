# Componentes Modulares de Nablabs

Este directorio contiene los componentes reutilizables de la interfaz de Nablabs (navbar y footer) y el script que los carga dinámicamente en todas las páginas.

## Estructura

```
components/
├── navbar.html    # Componente de navegación
├── footer.html    # Componente de pie de página
├── loader.js      # Script de carga dinámica
└── README.md      # Este archivo
```

## Uso en Páginas

Para usar los componentes modulares en cualquier página de Nablabs, sigue estos pasos:

### 1. Agregar Contenedores en HTML

En el `<body>` de tu página, reemplaza el navbar y footer con:

```html
<body>
    <!-- Navbar Container -->
    <div id="navbar-container"></div>

    <!-- Tu contenido aquí -->

    <!-- Footer Container -->
    <div id="footer-container"></div>

    <!-- Cargar componentes -->
    <script src="ruta/al/components/loader.js"></script>
    <!-- Tus otros scripts -->
</body>
```

### 2. Rutas Según Ubicación

**Para páginas en `/nablabs/`** (index.html, hall-of-fame.html, etc.):
```html
<script src="components/loader.js"></script>
```

**Para páginas en `/nablabs/courses/`** (nlpy-1.html, etc.):
```html
<script src="../components/loader.js"></script>
```

### 3. Estilos Requeridos

Asegúrate de que tu página incluya:
```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=Bona+Nova+SC:ital,wght@0,400;0,700;1,400&family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap" rel="stylesheet">
```

## Características

### Navbar (`navbar.html`)

- **Responsive**: Menu hamburguesa en móviles
- **Active State**: Resalta automáticamente la página actual
- **Rutas Dinámicas**: Se ajustan según la ubicación de la página
- **Clases de Estilo**: Usa `bona-nova-sc-regular` para mantener consistencia

Elementos del navbar:
- Logo y marca Nablabs
- Links de navegación (Inicio, El Problema, etc.)
- Salón de la Fama
- Botón CTA "Comenzar Ahora"

### Footer (`footer.html`)

- **Secciones**: Enlaces rápidos, Legal, Redes sociales
- **Año Dinámico**: Se actualiza automáticamente
- **Clases de Estilo**: Usa `bona-nova-sc-bold` y `cormorant-regular`

Secciones del footer:
- **Enlaces Rápidos**: Inicio, Cursos, Salón de la Fama, Contacto
- **Legal**: Privacidad, Términos y Condiciones
- **Redes Sociales**: Facebook, Twitter, Instagram, LinkedIn

### Loader (`loader.js`)

El script de carga automáticamente:

1. **Detecta la Ubicación**: Determina si estás en raíz o subdirectorio
2. **Carga Componentes**: Fetch de navbar.html y footer.html
3. **Ajusta Rutas**: Modifica links según la ubicación
4. **Inicializa Eventos**: Menu toggle, active states, etc.
5. **Actualiza Año**: Inserta el año actual en el footer

## Modificar Componentes

### Actualizar Navbar

Edita `navbar.html` para:
- Agregar/quitar links
- Cambiar el logo
- Modificar estructura

**IMPORTANTE**: Mantén los IDs y clases:
- `id="navToggle"` - Botón hamburguesa
- `id="navMenu"` - Menu de navegación
- `.nav-menu` - Lista de links
- `.nav-cta` - Botón CTA

### Actualizar Footer

Edita `footer.html` para:
- Cambiar links
- Actualizar redes sociales
- Modificar secciones

**IMPORTANTE**: Mantén la clase `.current-year` para el año automático.

### Modificar Comportamiento

Edita `loader.js` para:
- Cambiar lógica de rutas
- Agregar nuevas funcionalidades
- Personalizar active states

## Troubleshooting

### Los componentes no se cargan

**Problema**: Consola muestra error 404
- **Solución**: Verifica la ruta en el `<script src="...">`. Debe ser relativa a la página actual.

**Problema**: CORS error
- **Solución**: Sirve el sitio desde un servidor local (no file://)

### Links no funcionan correctamente

**Problema**: Los links llevan a páginas incorrectas
- **Solución**: El script `loader.js` ajusta automáticamente las rutas. Verifica que la función `getBasePath()` detecte correctamente tu ubicación.

### Navbar no es responsive

**Problema**: El menú hamburguesa no funciona
- **Solución**: Asegúrate de que `loader.js` se carga ANTES de otros scripts y que los IDs están correctos.

### El año no se actualiza

**Problema**: Footer muestra año estático
- **Solución**: Verifica que el elemento tenga la clase `.current-year` en `footer.html`.

## Páginas Actualizadas

Estas páginas ya usan los componentes modulares:

✅ `/nablabs/index.html`
✅ `/nablabs/hall-of-fame.html`
✅ `/nablabs/courses/nlpy-1.html`

## Agregar a Nueva Página

Para agregar los componentes a una nueva página:

1. Copia esta estructura HTML:
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Meta tags y estilos -->
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Navbar Container -->
    <div id="navbar-container"></div>

    <!-- Tu contenido aquí -->

    <!-- Footer Container -->
    <div id="footer-container"></div>

    <script src="components/loader.js"></script>
</body>
</html>
```

2. Ajusta la ruta de `loader.js` según la ubicación de tu página
3. ¡Listo! Los componentes se cargarán automáticamente

## Ventajas

✨ **Mantenimiento Fácil**: Cambia navbar/footer en un solo lugar
✨ **Consistencia**: Mismo diseño en todas las páginas
✨ **DRY**: No repetir código HTML
✨ **Flexibilidad**: Ajustes automáticos de rutas
✨ **Performance**: Carga asíncrona de componentes

## Notas Importantes

- ⚠️ No modifiques los IDs de los contenedores (`navbar-container`, `footer-container`)
- ⚠️ Mantén la estructura de clases CSS en los componentes
- ⚠️ Carga `loader.js` ANTES de scripts que dependan de navbar/footer
- ⚠️ Sirve desde servidor local para evitar CORS errors
