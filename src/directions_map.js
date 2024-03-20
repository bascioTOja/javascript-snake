import {Vector} from "./vector";
import {Board} from "./board";

export const directionMap = {
    'left': new Vector(-Board.tileSize, 0),
    'up': new Vector(0, -Board.tileSize),
    'right': new Vector(Board.tileSize, 0),
    'down': new Vector(0, Board.tileSize),
};
