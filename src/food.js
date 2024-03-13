export class Food {
    static color = '#ab4343';

    constructor(position) {
        this.position = position;
    }

    draw(context, canvas) {
        this.position.drawRect(context, Food.color);
    }
}
