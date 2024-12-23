class Arrow {
    constructor() {
        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.width = '0';
        this.element.style.height = '0';
        this.element.style.borderStyle = 'solid';
        this.element.style.borderWidth = '50px 25px 0 25px';
        this.element.style.borderColor = 'red transparent transparent transparent';
        this.element.style.pointerEvents = 'none';
        this.element.style.display = 'none';
        this.element.style.zIndex = '1001';
        document.body.appendChild(this.element);
    }

    updatePosition(direction, x, y) {
        const { innerWidth, innerHeight } = window;

        switch (direction) {
            case 'top':
                this.element.style.top = '0';
                this.element.style.left = `${x}px`;
                this.element.style.transform = 'rotate(180deg)';
                break;
            case 'bottom':
                this.element.style.top = `${innerHeight - 50}px`;
                this.element.style.left = `${x}px`;
                this.element.style.transform = 'rotate(0deg)';
                break;
            case 'left':
                this.element.style.top = `${y}px`;
                this.element.style.left = '0';
                this.element.style.transform = 'rotate(90deg)';
                break;
            case 'right':
                this.element.style.top = `${y}px`;
                this.element.style.left = `${innerWidth - 50}px`;
                this.element.style.transform = 'rotate(-90deg)';
                break;
        }

        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }
}