// Inicialización del juego
const emojiManager = new EmojiCollectionManager(document.getElementById('shownEmojis'));
const gameUI = new GameUI(emojiManager);
const game = new Game();

const mazapan = new Mazapan(gameUI.mazapanElement);
const arrow = new Arrow();

const animationManager = new AnimationManager(mazapan, arrow);



// Función para actualizar la interfaz
function updateDisplay() {
    const score = game.getScore();
    gameUI.updateScore(score.mazapanes, score.misclicks);
    emojiManager.showEmojiPopup(score,document.getElementById('score'));
}

// Inicializar eventos del juego
game.initializeEvents(gameUI.mazapanElement);
// Iniciar las animaciones
animationManager.animate();