export class Score {
    constructor(scoreboard, score) {
        this.scoreboard = scoreboard;
        this.score = score;
        this.draw();
    }

    draw() {
        this.scoreboard.textContent = this.score;
    }

    increase(amount = 1) {
        this.score += amount;
        this.draw();
    }

    set(score) {
        this.score = score;
        this.draw();
    }
}
