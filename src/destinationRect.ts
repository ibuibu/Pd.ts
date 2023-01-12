import { BaseRect } from "./baseRect";
import { PatchObserver } from "./patchObserver";

export class DestinationRect extends BaseRect {
  constructor(
    public c: CanvasRenderingContext2D,
    ctx: AudioContext,
    observer: PatchObserver,
    x: number,
    y: number
  ) {
    super(c, observer, ctx.destination, x, y);
  }

  display() {
    this.baseDisplay();
    this.c.fillStyle = "black";
    this.c.font = "bold 10px sans-serif"
    this.c.fillText("Out", this.x, this.y + 10);
  }
}
