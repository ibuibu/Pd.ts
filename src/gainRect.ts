import { BaseRect } from "./myRect";

export class GainRect extends BaseRect {
  constructor(
    public c: CanvasRenderingContext2D,
    ctx: AudioContext,
    observer: any,
    x: number,
    y: number
  ) {
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.1;
    super(c, observer, gainNode, x, y);
  }

  display() {
    this.baseDisplay();
    this.c.fillStyle = "black";
    this.c.fillText("Gain", this.x, this.y + 10);
  }
}
