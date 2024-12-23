// Elementos del DOM
const mazapanElement = document.getElementById('mazapan');
const scoreElement = document.getElementById('score');
const errorsScoreElement = document.getElementById('errors_score');
const clickInstructionsElement = document.getElementById('clickInstructions');

// Inicializar objetos
const game = new Game();
const mazapan = new Mazapan(mazapanElement);

// Inicializar eventos del juego
game.initializeEvents(mazapanElement);

const arrow = new Arrow();


// Crear debug de repulsión
const repulsionDebugElement = document.createElement('div');
repulsionDebugElement.style.position = 'absolute';
repulsionDebugElement.style.borderRadius = '50%';
repulsionDebugElement.style.border = '2px solid rgba(0, 255, 0, 0.5)';
repulsionDebugElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
repulsionDebugElement.style.pointerEvents = 'none';
repulsionDebugElement.style.zIndex = '1000';
document.body.appendChild(repulsionDebugElement);

function updateDisplay() {
    const score = game.getScore();
    scoreElement.textContent = `Mazapanes: ${score.mazapanes}`;
    errorsScoreElement.textContent = `Errores al clicar: ${score.misclicks}`;
    clickInstructionsElement.textContent = `Haz clic izquierdo sobre el mazapan`;
}

function animateGame() {
    mazapan.animate();

    repulsionDebugElement.style.width = `${Mazapan.REPULSION_RADIUS * 2}px`;
    repulsionDebugElement.style.height = `${Mazapan.REPULSION_RADIUS * 2}px`;
    repulsionDebugElement.style.left = `${mazapan.mousePosition.x - Mazapan.REPULSION_RADIUS}px`;
    repulsionDebugElement.style.top = `${mazapan.mousePosition.y - Mazapan.REPULSION_RADIUS}px`;

    // Verificar si el mazapán está fuera de la pantalla
    const { x, y, width, height } = mazapanElement.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;

    
    if (y + height < 0) {
        arrow.updatePosition('top', mazapan.position.x, 0);
    } else if (y > innerHeight) {
        arrow.updatePosition('bottom', mazapan.position.x, innerHeight - 10);
    }else if (x + width < 0) {
        arrow.updatePosition('left', 0, mazapan.position.y);
    } else if (x > innerWidth) {
        arrow.updatePosition('right', innerWidth - 10, mazapan.position.y);
    } else {
        arrow.hide();
    }

    requestAnimationFrame(animateGame);
}

// Iniciar el juego
requestAnimationFrame(animateGame);
