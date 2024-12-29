// Inicialización del juego
const emojiManager = new EmojiCollectionManager();
const gameUI = new GameUI(emojiManager);
const game = new Game();

const mazapan = new Mazapan(gameUI.mazapanElement);
const arrow = new Arrow();

const animationManager = new AnimationManager(mazapan, arrow);

// Inicializar eventos del juego
game.initializeEvents(gameUI.mazapanElement);

// Función para actualizar la interfaz
function updateDisplay() {
    const score = game.getScore();
    gameUI.updateScore(score.mazapanes, score.misclicks);
    emojiManager.showErrorPopup(score);
}

// Iniciar las animaciones
animationManager.animate();