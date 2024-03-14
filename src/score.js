export class Score {
    constructor(scoreboard, score) {
        this.scoreboard = scoreboard;
        this.score = score;
        this.draw();
    }

    draw() {
        this.scoreboard.textContent = this.score;
    }

    increase() {
        this.score++;
        this.draw();
    }
}
