import { BaseRect } from "./baseRect";

export class OscillatorRect extends BaseRect {
  oscillator: OscillatorNode;

  constructor(
    public c: CanvasRenderingContext2D,
    ctx: AudioContext,
    observer: any,
    x: number,
    y: number
  ) {
    const oscillatorNode = ctx.createOscillator();
    oscillatorNode.type = "sine"; // sine, square, sawtooth, triangle
    oscillatorNode.frequency.setValueAtTime(440, ctx.currentTime);
    super(c, observer, oscillatorNode, x, y);

    this.oscillator = oscillatorNode;
  }

  display() {
    this.baseDisplay();
    this.c.fillStyle = "black";
    this.c.fillText("Oscillator", this.x, this.y + 10);
  }
}
