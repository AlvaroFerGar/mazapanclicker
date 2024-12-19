// Variables del juego
let mazapanes_count = 0;
let misclick_count = 0;
let currentClickRequirement = 'left';
let originalX, originalY;

// Elementos del DOM
const mazapanElement = document.getElementById('mazapan');
const scoreElement = document.getElementById('score');
const errorsScoreElement = document.getElementById('errors_score');
const clickInstructionsElement = document.getElementById('clickInstructions');

const mazapan = new Mazapan(mazapanElement);

function animateGame() {
    mazapan.animate();

    repulsionDebugElement.style.width = `${Mazapan.REPULSION_RADIUS * 2}px`;
    repulsionDebugElement.style.height = `${Mazapan.REPULSION_RADIUS * 2}px`;
    repulsionDebugElement.style.left = `${mazapan.mousePosition.x - Mazapan.REPULSION_RADIUS}px`;
    repulsionDebugElement.style.top = `${mazapan.mousePosition.y - Mazapan.REPULSION_RADIUS}px`;

    requestAnimationFrame(animateGame);
}

const repulsionDebugElement = document.createElement('div');
repulsionDebugElement.style.position = 'absolute';
repulsionDebugElement.style.borderRadius = '50%';
repulsionDebugElement.style.border = '2px solid rgba(255, 0, 0, 0.5)';
repulsionDebugElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
repulsionDebugElement.style.pointerEvents = 'none';
repulsionDebugElement.style.zIndex = '1000';
document.body.appendChild(repulsionDebugElement);

requestAnimationFrame(animateGame);


// Evento de click en la cookie
mazapanElement.addEventListener('mousedown', (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto

    switch(currentClickRequirement) {
        case 'left':
            if (event.button === 0)
            {
                misclick_count ++;
                currentClickRequirement = 'right';
                clickInstructionsElement.textContent = 'Haz clic derecho';
            }
            break;
        case 'right':
            if (event.button === 2)
            {
                misclick_count ++;
                currentClickRequirement = 'left';
                clickInstructionsElement.textContent = 'Haz clic izquierdo';
             }
            break;
        case 'middle':
            if (event.button === 1)
            {
                misclick_count ++;
                currentClickRequirement = 'left';
                clickInstructionsElement.textContent = 'Haz clic izquierdo';
            }
            break;
    }

    updateDisplay();
});

// Prevenir menú contextual en clic derecho
window.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});
// Prevenir menú contextual en clic derecho
mazapanElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Actualizar la pantalla
function updateDisplay() {
    scoreElement.textContent = `Mazapanes: ${Math.floor(mazapanes_count)}`;
    errorsScoreElement.textContent = `Errores al clicar: ${Math.floor(misclick_count)}`;

    console.log('Estado actual ', mazapanes_count);
}