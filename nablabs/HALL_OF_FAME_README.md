# Salón de la Fama - Guía de Actualización

## Cómo Agregar Nuevos Proyectos

Para agregar un nuevo proyecto al Salón de la Fama, sigue estos pasos:

### 1. Preparar la Imagen del Proyecto

1. Guarda la imagen del proyecto en la carpeta `/static/img/`
2. Usa un formato optimizado (`.webp` o `.jpg`)
3. Tamaño recomendado: 800x600px o similar (proporción 4:3)
4. Nombre descriptivo: ej. `proyecto-ia-clima.webp`

### 2. Agregar el Card del Proyecto

Abre el archivo `hall-of-fame.html` y busca la sección con `id="projectsGrid"`.

Agrega un nuevo `<article>` siguiendo esta plantilla:

```html
<article class="project-card" data-github="URL_GITHUB_AQUI">
    <div class="project-image">
        <img src="/static/img/TU_IMAGEN.webp" alt="Descripción del proyecto">
        <div class="project-overlay">
            <i class="fab fa-github"></i>
            <span>Ver en GitHub</span>
        </div>
    </div>
    <div class="project-content">
        <h3 class="bona-nova-sc-bold">Título del Proyecto</h3>
        <p class="project-author cormorant-regular">
            <i class="fas fa-user"></i>
            <span>Nombre del Estudiante</span>
        </p>
        <p class="project-description cormorant-regular">
            Descripción breve del proyecto (2-3 líneas máximo).
        </p>
        <div class="project-tags">
            <span class="tag">Tecnología 1</span>
            <span class="tag">Tecnología 2</span>
            <span class="tag">Tecnología 3</span>
        </div>
    </div>
</article>
```

### 3. Campos a Completar

- **data-github**: URL completa del repositorio de GitHub del proyecto
- **src**: Ruta a la imagen del proyecto
- **alt**: Descripción breve para accesibilidad
- **h3**: Título del proyecto
- **project-author span**: Nombre del estudiante
- **project-description**: Descripción del proyecto (máx. 150 caracteres)
- **tag**: Tecnologías utilizadas (3-5 tags recomendado)

### 4. Ejemplo Completo

```html
<article class="project-card" data-github="https://github.com/estudiante/mi-proyecto">
    <div class="project-image">
        <img src="/static/img/proyecto-chatbot.webp" alt="Chatbot Educativo">
        <div class="project-overlay">
            <i class="fab fa-github"></i>
            <span>Ver en GitHub</span>
        </div>
    </div>
    <div class="project-content">
        <h3 class="bona-nova-sc-bold">Chatbot para Aprender Matemáticas</h3>
        <p class="project-author cormorant-regular">
            <i class="fas fa-user"></i>
            <span>Juan Pérez</span>
        </p>
        <p class="project-description cormorant-regular">
            Asistente virtual que ayuda a estudiantes de secundaria a resolver problemas 
            de álgebra usando IA y explicaciones paso a paso.
        </p>
        <div class="project-tags">
            <span class="tag">Python</span>
            <span class="tag">OpenAI</span>
            <span class="tag">Flask</span>
        </div>
    </div>
</article>
```

### 5. Recomendaciones

- **Orden**: Coloca los proyectos más recientes o destacados primero
- **Imágenes**: Usa screenshots atractivos del proyecto en acción
- **Descripción**: Sé conciso pero claro sobre qué hace el proyecto
- **Tags**: Usa entre 3-5 tags con las tecnologías principales
- **GitHub**: Asegúrate de que el repositorio sea público

### 6. Testing

Después de agregar un proyecto:

1. Abre `hall-of-fame.html` en el navegador
2. Verifica que la imagen se cargue correctamente
3. Haz click en el card y confirma que abre el GitHub en nueva pestaña
4. Revisa que el diseño responsive funcione en móvil

## Estructura de Archivos

```
nablabs/
├── hall-of-fame.html      # Página principal del salón de la fama
├── hall-of-fame.css       # Estilos específicos
├── hall-of-fame.js        # Funcionalidad de clicks
└── HALL_OF_FAME_README.md # Esta guía
```

## Notas Importantes

- **No modificar** el código JavaScript a menos que necesites cambiar la funcionalidad
- **No modificar** el CSS a menos que quieras cambiar el diseño general
- Solo necesitas editar el HTML para agregar/quitar proyectos
- Mantén consistencia en el formato de todos los cards

## Solución de Problemas

**Problema**: La imagen no se muestra
- Solución: Verifica la ruta de la imagen y que el archivo exista en `/static/img/`

**Problema**: El click no abre GitHub
- Solución: Verifica que el atributo `data-github` tenga la URL completa (con https://)

**Problema**: El diseño se ve raro
- Solución: Asegúrate de copiar exactamente la estructura HTML de la plantilla
