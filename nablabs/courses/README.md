# Sistema de Cursos - Nablabs

## 📚 Cómo Agregar un Nuevo Curso

### Paso 1: Agregar el Curso al Array

Edita el archivo `script.js` y agrega tu curso al array `courses`:

```javascript
const courses = [
    {
        id: "nlpy-1",  // ID único (será usado en la URL)
        title: "NLPY-1 - Introducción a la programación con Python",
        description: "Aprende los fundamentos de programación con Python desde cero.",
        duration: "10 semanas",
        level: "Principiante",  // Principiante, Intermedio o Avanzado
        status: "available",  // available o coming-soon
        tags: ["Python", "Programación", "Fundamentos", "Principiante"]  // Tags para búsqueda y filtrado
    },
    // Agrega tu nuevo curso aquí
    {
        id: "nlia-1",
        title: "NLIA-1 - Fundamentos de Inteligencia Artificial",
        description: "Introducción a los conceptos básicos de IA y Machine Learning",
        duration: "14 semanas",
        level: "Intermedio",
        status: "coming-soon",
        tags: ["IA", "Machine Learning", "Inteligencia Artificial", "Intermedio"]
    }
];
```

**Nota sobre Tags**: Los tags ayudan a los usuarios a filtrar cursos por temas. Usa entre 3-5 tags relevantes por curso. Los tags se mostrarán automáticamente como opciones de filtro en la página principal.

### Paso 2: Crear la Página del Curso

1. **Copia el template**: `courses/_template.html`
2. **Renombra el archivo** con el ID del curso: `courses/[id-del-curso].html`
   - Ejemplo: `courses/nlia-1.html`

3. **Reemplaza los placeholders**:
   - `[COURSE-ID]` → ID del curso (ej: `nlia-1`)
   - `[COURSE-TITLE]` → Título completo
   - `[COURSE-SUBTITLE]` → Descripción breve
   - `[DURATION]` → Duración (ej: `14 semanas`)
   - `[LEVEL]` → Nivel (`Principiante`, `Intermedio` o `Avanzado`)
   - `[STATUS]` → Estado (`available` o `coming-soon`)

4. **Personaliza el contenido**:
   - Descripción del curso
   - Objetivos de aprendizaje
   - Módulos del curriculum
   - Requisitos específicos

### Paso 3: ¡Listo!

El curso aparecerá automáticamente en la página principal y será clickeable.

## 📁 Estructura de Archivos

```
nablabs/
├── index.html              # Página principal
├── styles.css              # Estilos generales
├── script.js               # Lógica de cursos
└── courses/
    ├── _template.html      # Template para nuevos cursos
    ├── course-page.css     # Estilos para páginas de cursos
    ├── nlpy-1.html         # Ejemplo: Curso de Python
    └── [nuevo-curso].html  # Tu nuevo curso aquí
```

## 🎨 Convenciones de Nomenclatura

### IDs de Cursos
- **NL**: Nablabs
- **PY**: Python
- **IA**: Inteligencia Artificial
- **CS**: Ciberseguridad
- **Número**: Nivel/Secuencia

Ejemplos:
- `nlpy-1`: Nablabs Python nivel 1
- `nlia-2`: Nablabs IA nivel 2
- `nlcs-1`: Nablabs Ciberseguridad nivel 1

### Niveles
- `Principiante`: Sin conocimientos previos
- `Intermedio`: Requiere conocimientos básicos
- `Avanzado`: Requiere experiencia significativa

### Status
- `available`: Curso disponible para inscripción
- `coming-soon`: Próximamente

## 🔧 Personalización Avanzada

### Agregar Más Módulos

Copia el bloque de módulo en el curriculum:

```html
<div class="curriculum-module">
    <h3><i class="fas fa-chevron-right"></i> Módulo X: [Nombre]</h3>
    <ul>
        <li>[Tema 1]</li>
        <li>[Tema 2]</li>
        <li>[Tema 3]</li>
    </ul>
</div>
```

### Cambiar Iconos

Usa iconos de Font Awesome 6:
- Reloj: `<i class="far fa-clock"></i>`
- Libro: `<i class="fas fa-book"></i>`
- Check: `<i class="fas fa-check"></i>`
- Laptop: `<i class="fas fa-laptop"></i>`
- [Más iconos](https://fontawesome.com/icons)

## 💡 Tips

1. **Consistencia**: Mantén el mismo formato en todos los cursos
2. **Descripciones**: Sé claro y específico sobre lo que aprenderán
3. **Requisitos**: Lista todos los requisitos previos necesarios
4. **Módulos**: Organiza el contenido de manera lógica y progresiva
5. **Duración**: Sé realista con el tiempo estimado

## 📞 Soporte

Si necesitas ayuda para agregar un curso, revisa el ejemplo completo en `courses/nlpy-1.html`.
