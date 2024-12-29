class EmojiCollectionManager {
    constructor() {
        this.completeListOfEmojis = [
            '😵', '💀', '🙁', '💩', '😢', '🚫', '😣', '🖕', '❌', '🤕',
            '🛑', '😫', '👎', '🥴', '😭', '😓', '🤢', '☹️', '🤬', '❓',
            '😰', '🤮', '💔', '📉', '😨', '😡', '⚠️', '😤', '⛔', '🚷',
        ];
        this.collectedEmojis = new Set();
        this.startTime = new Date();
        this.popupActive = false;
        this.tooltipTimeout = null;
    }

    showTooltip() {
        let emojiCollection = this.completeListOfEmojis.map(emoji => 
            this.collectedEmojis.has(emoji) ? emoji : '(?)'
        ).join(' ');

        let existingTooltip = document.querySelector('.custom-tooltip');
        if (existingTooltip) {
            existingTooltip.textContent = emojiCollection;
            existingTooltip.style.visibility = 'visible';
            existingTooltip.style.opacity = 1;
            return;
        }

        const tooltip = this.createTooltipElement(emojiCollection);
        this.positionTooltip(tooltip);
    }

    createTooltipElement(content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = content;
        document.body.appendChild(tooltip);
        return tooltip;
    }

    positionTooltip(tooltip) {
        const rect = gameUI.shownEmojisElement.getBoundingClientRect();
        if (rect.top < 0 || rect.left < 0) {
            console.error("El elemento no está visible en la pantalla");
            return;
        }

        tooltip.style.position = 'fixed';
        tooltip.style.left = '50%';
        tooltip.style.top = `${rect.bottom + 20}px`;
        tooltip.style.transform = 'translate(-50%)';
        
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = 1;

        gameUI.shownEmojisElement.addEventListener('mouseleave', () => tooltip.remove());
    }

    hideTooltip() {
        document.querySelectorAll('.custom-tooltip').forEach(tooltip => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = 0;
            tooltip.remove();
        });
    }

    showErrorPopup(score) {
        if (score.misclicks > 0 && !this.popupActive) {
            const randomEmoji = this.completeListOfEmojis[Math.floor(Math.random() * this.completeListOfEmojis.length)];
            
            this.createAndShowPopup(randomEmoji);
            
            if (!this.collectedEmojis.has(randomEmoji)) {
                this.collectedEmojis.add(randomEmoji);
                this.checkCompletion(score.mazapanes);
            }
        }

        if (this.collectedEmojis.size > 0) {
            gameUI.shownEmojisElement.textContent = 
                `Colección de errores: ${this.collectedEmojis.size}/${this.completeListOfEmojis.length}`;
        }
    }

    createAndShowPopup(emoji) {
        const popup = document.createElement('div');
        popup.className = 'error-popup';
        popup.textContent = emoji;
        
        const rect = gameUI.scoreElement.getBoundingClientRect();
        popup.style.left = `${rect.left + rect.width * 0.5 - 50}px`;
        popup.style.top = `${rect.top + rect.height * 0.5}px`;
        
        document.body.appendChild(popup);
        this.popupActive = true;
        
        setTimeout(() => {
            popup.remove();
            this.popupActive = false;
        }, 1000);

        clearTimeout(this.tooltipTimeout);
        this.showTooltip();
        setTimeout(() => this.hideTooltip(), 1500);
    }

    checkCompletion(mazapanes) {
        if (this.collectedEmojis.size === this.completeListOfEmojis.length) {
            const timeSpent = Math.floor((new Date() - this.startTime) / 1000);
            const minutes = Math.floor(timeSpent / 60);
            const seconds = timeSpent % 60;
            const timeMessage = minutes > 0 
                ? `${minutes} minutos y ${seconds} segundos` 
                : `${seconds} segundos`;
                
            if (mazapanes === 0) {
                alert(`¡Enhorabuena! Has visto todos los emojis en solo ${timeMessage}. Mientras tanto, llevas 0 clics al mazapan`);
            }
        }
    }
}