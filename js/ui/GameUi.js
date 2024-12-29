class GameUI {
    constructor(emojiManager) {
        this.emojiManager = emojiManager; // Referencia al EmojiManager
        
        this.mazapanElement = document.getElementById('mazapan');
        this.scoreElement = document.getElementById('score');
        this.errorsScoreElement = document.getElementById('errors_score');
        this.clickInstructionsElement = document.getElementById('clickInstructions');
        this.shownEmojisElement = document.getElementById('shownEmojis');
        
        // Bind event listeners correctamente
        this.shownEmojisElement.addEventListener('mouseover', () => this.emojiManager.showTooltip());
        this.mazapanElement.addEventListener('click', () => this.finishGame());
    }

    updateScore(mazapanes, misclicks) {
        this.scoreElement.textContent = `Mazapanes: ${mazapanes}`;
        this.errorsScoreElement.textContent = `Errores al clicar: ${misclicks}`;
        this.clickInstructionsElement.textContent = 'Haz clic izquierdo sobre el mazapan';
    }

    finishGame() {
        window.location.href = './pages/end.html';
    }
}