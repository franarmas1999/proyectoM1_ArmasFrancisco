# Picasso Paletas

Generador de paletas de colores aleatorias, rápido y sin vueltas.

**Proyecto M1 — Armas Francisco**

🔗 **Demo:** https://franarmas1999.github.io/proyectoM1/
📦 **Repositorio:** https://github.com/franarmas1999/proyectoM1

---

## Qué es

Una aplicación web que genera paletas de colores al azar con un solo
botón. Permite elegir cuántos colores tendrá la paleta, en qué formato se
muestra el código de cada color, y copiar ese código al portapapeles con un
click.

Está hecha con HTML, CSS y JavaScript puro, sin frameworks ni librerías
externas.

## Funcionalidades

- Generación de paletas de colores aleatorios con un botón.
- Selección del tamaño de la paleta: 6, 8 o 9 colores.
- Selección del formato del código: **HSL** o **RGBA**.
- Cada color muestra su código escrito encima.
- Click sobre un color para copiarlo al portapapeles.
- Aviso visual ("toast") que confirma el copiado y desaparece solo.

## Cómo se usa

1. Elegí la cantidad de colores que querés (6, 8 o 9).
2. Elegí el formato en el que querés ver los códigos (HSL o RGBA).
3. Apretá **Generar Paleta**.
4. Hacé click en cualquier color para copiar su código.

Cambiar el formato **no regenera la paleta**: los mismos colores se vuelven a
mostrar con el código traducido al otro formato. Cambiar la cantidad sí genera
una paleta nueva, porque hacen falta más o menos colores que los que había.

## Estructura del proyecto

```
proyectoM1/
├── docs/                 → código fuente de la aplicación
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── src/
│   │   └── script.js
│   └── pictures/
│       └── trimmed-image.png
└── documentacion/        → README, capturas y documentación del uso de IA
```

## Cómo ejecutarlo localmente

No necesita instalación ni dependencias.

**Opción 1 — abrir el archivo directamente**

Cloná el repositorio y abrí `docs/index.html` con el navegador.

```bash
git clone https://github.com/franarmas1999/proyectoM1.git
```

**Opción 2 — con un servidor local (recomendado)**

La función de copiar al portapapeles usa `navigator.clipboard`, que en algunos
navegadores requiere un contexto seguro. Abriendo el proyecto con la extensión
**Live Server** de VS Code (o cualquier servidor estático) funciona siempre y
además replica las condiciones reales del sitio publicado.

## Cómo se despliega

El sitio está publicado con **GitHub Pages**:

1. En el repositorio, ir a **Settings → Pages**.
2. En *Source*, elegir **Deploy from a branch**.
3. Seleccionar la rama `master` y la carpeta `/docs`.
4. Guardar y esperar unos minutos a que termine la primera construcción.

Cada push a `master` vuelve a publicar el sitio automáticamente.

---

## Decisiones técnicas

### Los colores se generan en HSL, no en RGB

Sortear los tres canales RGB por separado produce muchos grises, marrones y
colores sucios, porque la mayoría de las combinaciones posibles no son colores
vistosos. Generando en HSL solo se sortea el **tono** (0 a 359) y se dejan fijas
la saturación y la luminosidad, lo que garantiza que todos los colores salgan
vivos y con una intensidad pareja.

### El array `paleta` es la única fuente de verdad

La primera versión generaba los colores dentro de la misma función que los
dibujaba. El efecto no deseado era que al cambiar de formato se generaba una
paleta nueva, cuando lo esperable es que se vean los mismos colores con otro
código.

La solución fue guardar la paleta actual en un array y que el dibujo lea de ahí
en lugar de inventar colores. Separar **el estado** de **su representación** es
lo que permite redibujar las veces que haga falta sin alterar los datos.

### `generarPaleta` y `dibujarPaleta` están separadas

Como consecuencia de lo anterior, hay dos funciones con responsabilidades
distintas:

- `generarPaleta()` — crea colores nuevos, los guarda en el array y manda a dibujar.
- `dibujarPaleta()` — solo construye el HTML a partir de lo que ya está guardado.

Cada control llama a la que corresponde: el botón principal y los de cantidad
generan, los de formato únicamente redibujan.

### La conversión de HSL a RGBA la hace el navegador

Para mostrar el mismo color en los dos formatos hace falta convertir entre
sistemas. En lugar de implementar la fórmula a mano, se aprovecha que el
navegador ya sabe hacerlo: se crea un elemento auxiliar en memoria, se le asigna
el color en HSL y al leer esa misma propiedad se obtiene el valor ya convertido
a RGB, al que solo resta agregarle el canal alfa.

Es menos código, menos propenso a errores y usa el motor de colores del propio
navegador.

### El estado visual se maneja con clases, no con estilos en línea

JavaScript nunca asigna colores ni medidas directamente: se limita a agregar o
quitar clases (`activo` en los botones seleccionados, `visible` en el aviso de
copiado) y es el CSS el que decide qué significa visualmente cada estado. Así,
cambiar la apariencia no implica tocar la lógica.

La única excepción es el color de fondo de cada cuadrado de la paleta, que se
escribe en el atributo `style` porque es un valor dinámico imposible de prever
desde la hoja de estilos.

### El HTML se arma en una variable y se asigna una sola vez

Dentro del bucle, cada cuadrado se concatena a una variable de texto, y recién
al terminar se asigna todo junto con `innerHTML =`. Esto cumple dos funciones:
el `=` reemplaza el contenido anterior, lo que evita tener que vaciar el
contenedor en un paso aparte, y además el navegador reconstruye el DOM una sola
vez en lugar de una por color.

### Los listeners de los colores se reasignan en cada dibujo

`querySelectorAll` devuelve una lista estática: una foto del momento en que se
ejecutó. Como los cuadrados se destruyen y se recrean en cada dibujo, buscarlos
una sola vez al cargar la página no funciona. Por eso la búsqueda y la
asignación de listeners viven dentro de `dibujarPaleta`, después de escribir el
HTML.

### Variables CSS para la identidad visual

La paleta de la marca —tomada del logo— está declarada como variables en
`:root`. Cambiar un color del sitio es modificar una línea, y no buscar y
reemplazar en toda la hoja de estilos.

### La carpeta se llama `docs` y no `Desarrollo`

GitHub Pages, en modo *deploy from a branch*, solo puede publicar desde la raíz
del repositorio o desde una carpeta llamada exactamente `/docs`. Para poder
publicar la demo sin configuración adicional, el código fuente vive en `docs/`.

---

## Extra credit implementado

- **Copiar el código al portapapeles** haciendo click sobre un color.
- **Animaciones sutiles**: transiciones en los botones, en los links del menú y
  entrada deslizada del aviso de copiado.

## Pendientes / posibles mejoras

- Bloqueo de colores individuales para conservarlos al regenerar.
- Guardado de paletas en `localStorage`.
- Color de texto adaptable según la luminosidad de cada color, para garantizar
  contraste en toda la gama.

---

**Autor:** Armas Francisco
