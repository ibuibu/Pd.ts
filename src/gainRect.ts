import { BaseRect } from "./baseRect";

export class GainRect extends BaseRect {
  static DEFAULT_GAIN_VALUE = 0.1;

  isControlled = false;
  ctx: AudioContext;
  gainValue: number = GainRect.DEFAULT_GAIN_VALUE;

  constructor(
    public c: CanvasRenderingContext2D,
    ctx: AudioContext,
    observer: any,
    public area: HTMLDivElement,
    x: number,
    y: number
  ) {
    const gainNode = ctx.createGain();
    gainNode.gain.value = GainRect.DEFAULT_GAIN_VALUE;
    super(c, observer, gainNode, x, y);

    this.ctx = ctx;
  }

  display() {
    this.baseDisplay();
    this.c.fillStyle = "black";
    this.c.font = "bold 10px sans-serif";
    this.c.fillText("Gain", this.x, this.y + 10);
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
    title.textContent = "Gain";
    controllerDiv.appendChild(title);

    const pullDown = document.createElement("select");
    pullDown.addEventListener("change", (e: Event) => {
      const { target } = e;
      if (!(target instanceof HTMLSelectElement)) return;
      this.gainValue = Number(target.value);
      (this.audioNode as GainNode).gain.value = this.gainValue;
    });
    let values = [];
    for (let i = 0; i < 10; i++) {
      values.push(i / 10);
    }
    const options = values.map((value) => {
      const option = document.createElement("option");
      if (value == this.gainValue) {
        option.selected = true;
      }
      option.value = String(value);
      option.textContent = String(value);
      return option;
    });
    options.forEach((option) => {
      pullDown.appendChild(option);
    });

    controllerDiv.appendChild(pullDown);

    const children = this.area.childNodes;

    if (children.length === 0) {
      this.area.appendChild(controllerDiv);
    } else {
      this.area.replaceChild(controllerDiv, children[0]);
    }
  }
}
