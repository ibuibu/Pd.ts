import { BaseRect } from "./baseRect";

export class EnvelopeRect extends BaseRect {
  static DEFAULT_GAIN_VALUE = 0.1;

  isControlled = false;
  ctx: AudioContext;
  gainValue: number = EnvelopeRect.DEFAULT_GAIN_VALUE;

  constructor(
    public c: CanvasRenderingContext2D,
    ctx: AudioContext,
    observer: any,
    public area: HTMLDivElement,
    x: number,
    y: number
  ) {
    const gainNode = ctx.createGain();
    gainNode.gain.value = EnvelopeRect.DEFAULT_GAIN_VALUE;
    super(c, observer, gainNode, x, y);

    this.ctx = ctx;
  }

  display() {
    this.baseDisplay();
    this.c.fillStyle = "black";
    this.c.font = "bold 10px sans-serif";
    this.c.fillText("Envelope", this.x, this.y + 10);
    this.c.font = "10px sans-serif";
    this.c.fillText(String(this.gainValue), this.x, this.y + 20);

    if (this.isDragging) {
      if (!this.isControlled) {
        this.setController();
        this.isControlled = true;
      }
    } else {
      this.isControlled = false;
    }
  }

  setController() {
    const controllerDiv = document.createElement("div");

    const title = document.createElement("p");
    title.textContent = "Envelope";
    controllerDiv.appendChild(title);

    const button = document.createElement("button");
    button.textContent = "bang";
    button.addEventListener("click", () => {
      (this.audioNode as GainNode).gain.setValueAtTime(1.0, this.ctx.currentTime);
      (this.audioNode as GainNode).gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1)
    });

    controllerDiv.appendChild(button);

    const children = this.area.childNodes;

    if (children.length === 0) {
      this.area.appendChild(controllerDiv);
    } else {
      this.area.replaceChild(controllerDiv, children[0]);
    }
  }
}
