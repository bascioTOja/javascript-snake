export class Board {
    static tileSize = 21;
    static tileColors = ['#2e3336', '#3f4549'];

    constructor(canvas) {
        this.widthTiles = Math.floor(canvas.width / Board.tileSize);
        this.heightTiles = Math.floor(canvas.height / Board.tileSize);
    }

    draw(context) {
        for (let y = 0; y < this.widthTiles; y++) {
            for (let x = 0; x < this.heightTiles; x++) {
                context.fillStyle = Board.tileColors[(x + y) % 2];
                context.fillRect(x * Board.tileSize, y * Board.tileSize, Board.tileSize, Board.tileSize);
            }
        }
    }
}
