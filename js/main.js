// Elementos del DOM
const mazapanElement = document.getElementById('mazapan');
const scoreElement = document.getElementById('score');
const errorsScoreElement = document.getElementById('errors_score');
const clickInstructionsElement = document.getElementById('clickInstructions');
const shownEmojisElement = document.getElementById('shownEmojis');


// Inicializar objetos
const game = new Game();
const mazapan = new Mazapan(mazapanElement);

// Inicializar eventos del juego
game.initializeEvents(mazapanElement);

const arrow = new Arrow();


// Crear debug de repulsión
//const repulsionDebugElement = document.createElement('div');
//repulsionDebugElement.style.position = 'absolute';
//repulsionDebugElement.style.borderRadius = '50%';
//repulsionDebugElement.style.border = '2px solid rgba(0, 255, 0, 0.5)';
//repulsionDebugElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
//repulsionDebugElement.style.pointerEvents = 'none';
//repulsionDebugElement.style.zIndex = '1000';
//document.body.appendChild(repulsionDebugElement);

const negativeEmojis = [
'😵', '🔇', '😖', '🙁', '💩', '😟', '🤒', '🚫', '❗', '⛔',
'🛑', '☠️', '😫', '👎', '🥴', '😭', '😓', '🤢', '❌', '🤕',
'😰', '🤮', '💔', '📉', '😨', '😡', '😪', '🤧', '😩', '☹️',
'📛', '💀', '😬', '😠', '⚠️', '😦', '🚷', '😧', '😕', '❓',
'⚡', '😤', '😥', '🔴', '💥', '😮‍💨', '😢', '🖕', '😣','🤬',
];

let shownEmojis = new Set(); // Para almacenar emojis mostrados
let popupActive = false; // Bandera para controlar si hay popup activo
let tooltipTimeout = null; // Para controlar el tiempo de aparición del tooltip

function showTooltip() {
    console.log("showtool");
    let emojiCollection = negativeEmojis.map(emoji => {
        // Si el emoji está en shownEmojis, lo muestra, si no, pone ⬜
        return shownEmojis.has(emoji) ? emoji : '⬜';
    }).join(' '); // Juntamos todos los emojis y ⬜ con un espacio entre ellos

    console.log(emojiCollection);  // Verificar que se genera correctamente la colección de emojis.

    // Verificar si el tooltip ya está visible para evitar crear uno nuevo
    let existingTooltip = document.querySelector('.custom-tooltip');
    if (existingTooltip) {
        existingTooltip.textContent = emojiCollection; // Solo actualizamos el texto
        existingTooltip.style.visibility = 'visible';
        existingTooltip.style.opacity = 1;
        return; // Si ya existe, no creamos uno nuevo
    }

    // Crear el tooltip personalizado
    let tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = emojiCollection;

    // Asegúrate de que el contenedor se haya cargado correctamente
    const rect = shownEmojisElement.getBoundingClientRect();
    if (rect.top < 0 || rect.left < 0) {
        console.error("El elemento no está visible en la pantalla");
        return;  // Salir si el elemento no está disponible en la página
    }

    // Posicionar el tooltip debajo de shownEmojisElement
    tooltip.style.position = 'fixed';  // Usar 'fixed' para que se posicione relativo a la ventana del navegador
    tooltip.style.left = '50%';  // Posicionar al 50% desde la izquierda
    tooltip.style.top = `${rect.bottom + 20}px`; // Espacio de 10px debajo
    tooltip.style.transform = 'translate(-50%)';  // Usar transform para centrarlo exactamente en el medio

    // Agregar el tooltip al DOM
    document.body.appendChild(tooltip);

    // Eliminar el tooltip cuando el mouse sale de la caja
    shownEmojisElement.addEventListener('mouseleave', function () {
        tooltip.remove();
    });

    // Mostrar el tooltip activamente
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = 1;
}

// Función para ocultar el tooltip
function hideTooltip() {
    const tooltips = document.querySelectorAll('.custom-tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = 0;
        tooltip.remove();  // Eliminar tooltip del DOM
    });
}


function updateDisplay() {
    const score = game.getScore();
    scoreElement.textContent = `Mazapanes: ${score.mazapanes}`;
    errorsScoreElement.textContent = `Errores al clicar: ${score.misclicks}`;
    clickInstructionsElement.textContent = `Haz clic izquierdo sobre el mazapan`;

    if (score.misclicks > 0 && !popupActive) {
        const randomEmoji = negativeEmojis[Math.floor(Math.random() * negativeEmojis.length)];

        if (!shownEmojis.has(randomEmoji)) {
            shownEmojis.add(randomEmoji);

            const popup = document.createElement('div');
            popup.className = 'error-popup';
            popup.textContent = randomEmoji;
            let rect=scoreElement.getBoundingClientRect();
            popup.style.left = `${rect.left+rect.width*0.5-50}px`;
            popup.style.top = `${rect.top+rect.height*0.5}px`;
            //popup.style.left = `${20}px`;
            //popup.style.top = `${20}px`;
            document.body.appendChild(popup);
            
            popupActive = true; // Marca que hay un popup activo
            setTimeout(() => {
                popup.remove();
                popupActive = false; // Libera la bandera después de la animación
            }, 1000);

            // Comprueba si todos los emojis ya han salido
            if (shownEmojis.size === negativeEmojis.length) {
                alert('¡Enhorabuena! Has visto todos los emojis.');
            }

            // Esperar 3 segundos para mostrar el tooltip y luego retirarlo
            clearTimeout(tooltipTimeout); // Limpiar cualquier timeout anterior
            showTooltip();
            setTimeout(() => {hideTooltip();}, 1500);  // Retirar el tooltip después de 3 segundos
      }
    }

    // Mostrar la colección de emojis
    if (shownEmojis.size > 0) {
        shownEmojisElement.textContent = `Colección de errores: ${shownEmojis.size}/${negativeEmojis.length}`;
    }
}

// Mostrar el tooltip cuando se pasa el ratón sobre el contenedor
shownEmojisElement.addEventListener('mouseover', () => {
    showTooltip();
});

function animateGame() {
    mazapan.animate();

    //repulsionDebugElement.style.width = `${Mazapan.REPULSION_RADIUS * 2}px`;
    //repulsionDebugElement.style.height = `${Mazapan.REPULSION_RADIUS * 2}px`;
    //repulsionDebugElement.style.left = `${mazapan.mousePosition.x - Mazapan.REPULSION_RADIUS}px`;
    //repulsionDebugElement.style.top = `${mazapan.mousePosition.y - Mazapan.REPULSION_RADIUS}px`;

    // Verificar si el mazapán está fuera de la pantalla
    const { x, y, width, height } = mazapanElement.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;
   
    // Determinar posición dentro de los límites de la pantalla
    const positionX = Math.min(Math.max(0, mazapan.position.x), innerWidth - 10);
    const positionY = Math.min(Math.max(0, mazapan.position.y), innerHeight - 10);

    if (y + height < 0) {
        arrow.updatePosition(
            x + width < 0 ? 'top-left' : x > innerWidth ? 'top-right' : 'top',
            x + width < 0 ? 0 : x > innerWidth ? innerWidth - 10 : positionX,
            0
        );
    } else if (y > innerHeight) {
        arrow.updatePosition(
            x + width < 0 ? 'bottom-left' : x > innerWidth ? 'bottom-right' : 'bottom',
            x + width < 0 ? 0 : x > innerWidth ? innerWidth - 10 : positionX,
            innerHeight - 10
        );
    } else if (x + width < 0) {
        arrow.updatePosition('left', 0, positionY);
    } else if (x > innerWidth) {
        arrow.updatePosition('right', innerWidth - 10, positionY);
    } else {
        arrow.hide();
    }

    requestAnimationFrame(animateGame);
}

// Iniciar el juego
requestAnimationFrame(animateGame);
