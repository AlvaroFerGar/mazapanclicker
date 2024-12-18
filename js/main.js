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

// Configuración de parámetros
const REPULSION_RADIUS = 100; // Radio de repulsión
const VERLET_ITERATIONS = 1; // Número de iteraciones para estabilidad
const DAMPING = 0.9; // Reduce el movimiento gradualmente
const RETURN_STRENGTH = 0.025; // Fuerza de retorno a la posición original

// Estado del mazapán
let mazapanPos = { x: 0, y: 0 };
let mazapanPrevPos = { x: 0, y: 0 };
let mousePos = { x: 0, y: 0 };

// Función de integración de Verlet
function verletIntegrate(current, previous) {
    const temp = { ...current };
    current.x += (current.x - previous.x);
    current.y += (current.y - previous.y);
    
    previous.x = temp.x;
    previous.y = temp.y;
}

// Función para calcular la distancia más cercana entre un punto y un rectángulo
function distanceToRectangle(point, rect) {
    // Calcular el punto más cercano dentro del rectángulo
    const closestX = Math.max(rect.left, Math.min(point.x, rect.right));
    const closestY = Math.max(rect.top, Math.min(point.y, rect.bottom));

    // Calcular la distancia entre el punto del ratón y el punto más cercano del rectángulo
    const distanceX = point.x - closestX;
    const distanceY = point.y - closestY;

    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
}

window.addEventListener('load', () => {
    // Configurar posición inicial
    originalX = mazapanElement.offsetLeft;
    originalY = mazapanElement.offsetTop;
    
    mazapanPos.x = originalX;
    mazapanPos.y = originalY;
    mazapanPrevPos = { ...mazapanPos };
});

// Rastrear posición del ratón
document.addEventListener('mousemove', (event) => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
});

// Bucle de animación para movimiento suave
function animateMazapan() {


const mazapanRect = mazapanElement.getBoundingClientRect();

// Crear objeto de rectángulo para cálculos
const rectangleBounds = {
    left: mazapanRect.left,
    right: mazapanRect.right,
    top: mazapanRect.top,
    bottom: mazapanRect.bottom
};

// Integración de Verlet
verletIntegrate(mazapanPos, mazapanPrevPos);
    
for (let i = 0; i < VERLET_ITERATIONS; i++) {
    // Calcular distancia considerando todo el rectángulo
    const dist = distanceToRectangle(mousePos, rectangleBounds);
    
    if (dist <= REPULSION_RADIUS) {
        // Calcular punto central del rectángulo
        const centerX = (rectangleBounds.left + rectangleBounds.right) / 2;
        const centerY = (rectangleBounds.top + rectangleBounds.bottom) / 2;

        // Calcular ángulo desde el centro del rectángulo
        const angle = Math.atan2(mazapanPos.y - mousePos.y, mazapanPos.x - mousePos.x);
        
        // Calcular factor de repulsión
        const repulsionFactor = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;
        
        // Aplicar repulsión
        mazapanPos.x += Math.cos(angle) * repulsionFactor * 5;
        mazapanPos.y += Math.sin(angle) * repulsionFactor * 5;
    }
    
    // Retorno a posición original (similar al código anterior)
    if(dist >= REPULSION_RADIUS * 1.2) {
        mazapanPos.x += (originalX - mazapanPos.x) * RETURN_STRENGTH;
        mazapanPos.y += (originalY - mazapanPos.y) * RETURN_STRENGTH;
    }
}
    
// Aplicar amortiguación
mazapanPrevPos.x = mazapanPos.x + (mazapanPrevPos.x - mazapanPos.x) * DAMPING;
mazapanPrevPos.y = mazapanPos.y + (mazapanPrevPos.y - mazapanPos.y) * DAMPING;

// Actualizar posición visual
mazapanElement.style.left = `${mazapanPos.x}px`;
mazapanElement.style.top = `${mazapanPos.y}px`;

repulsionDebugElement.style.width = `${REPULSION_RADIUS * 2}px`;
repulsionDebugElement.style.height = `${REPULSION_RADIUS * 2}px`;
repulsionDebugElement.style.left = `${mousePos.x - REPULSION_RADIUS}px`;
repulsionDebugElement.style.top = `${mousePos.y - REPULSION_RADIUS}px`;

// Continuar animación
requestAnimationFrame(animateMazapan);
}

const repulsionDebugElement = document.createElement('div');
repulsionDebugElement.style.position = 'absolute';
repulsionDebugElement.style.borderRadius = '50%';
repulsionDebugElement.style.border = '2px solid rgba(255, 0, 0, 0.5)';
repulsionDebugElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
repulsionDebugElement.style.pointerEvents = 'none';
repulsionDebugElement.style.zIndex = '1000';
document.body.appendChild(repulsionDebugElement);


// Iniciar bucle de animación
requestAnimationFrame(animateMazapan);

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
mazapanElement.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Actualizar la pantalla
function updateDisplay() {
    scoreElement.textContent = `Mazapanes: ${Math.floor(mazapanes_count)}`;
    errorsScoreElement.textContent = `Errores al clicar: ${Math.floor(misclick_count)}`;

    console.log('Estado actual ', mazapanes_count);
}