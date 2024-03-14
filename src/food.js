export class Food {
    constructor(position) {
        this.position = position;
        let type = this.choseFoodType();
        this.color = type.color;
        this.hasConfetti = type.confetti;
        this.confettiColors = type.confettiColors;
        this.worth = type.worth;
    }

    choseFoodType() {
        if (Math.floor(Math.random() * 128) === 1) {
            return foodTypes.legendary;
        }

        if (Math.floor(Math.random() * 45) === 1) {
            return foodTypes.epic;
        }

        if (Math.floor(Math.random() * 18) === 1) {
            return foodTypes.rare;
        }

        if (Math.floor(Math.random() * 6) === 1) {
            return foodTypes.common;
        }

        return foodTypes.normal;
    }

    playConfetti(confetti) {
        if (this.hasConfetti) {
            confetti.addConfetti({
                confettiColors: this.confettiColors,
                confettiNumber: this.worth * 12,
            });
        }
    }

    draw(context, canvas) {
        this.position.drawRect(context, this.color);
    }
}

const foodTypes = {
    normal: {
        color: '#ab4343',
        confetti: false,
        confettiColors: [],
        worth: 1,
    },
    common: {
        color: '#6aa84f',
        confetti: true,
        confettiColors: ['#8eff77', '#9af472', '#6aa84f', '#395b2b', '#090e06'],
        worth: 3,
    },
    rare: {
        color: '#46bdc6',
        confetti: true,
        confettiColors: ['#5addff', '#5af3ff', '#46bdc6', '#2a7379', '#2a7379'],
        worth: 5,
    },
    epic: {
        color: '#fbbc04',
        confetti: true,
        confettiColors: ['#fcff03', '#ffe004', '#fbbc04', '#fbbc04', '#614801'],
        worth: 7,
    },
    legendary: {
        color: '#ff00ff',
        confetti: true,
        confettiColors: ['#ff0098', '#ff00ba', '#ff00dc', '#ff00dc', '#650057'],
        worth: 11,
    },
};
