import { BaseRect } from "./baseRect";
import { PatchObserver } from "./patchObserver";

export class StereoPannerRect extends BaseRect {
  static TITLE = "Panner";
  isControlled = false;
  ctx: AudioContext;
  panValue = 0;

  constructor(
    public c: CanvasRenderingContext2D,
    ctx: AudioContext,
    observer: PatchObserver,
    public area: HTMLDivElement,
    x: number,
    y: number
  ) {
    const pannerNode = ctx.createStereoPanner();
    super(c, observer, pannerNode, x, y);

    this.ctx = ctx;
  }

  display() {
    this.baseDisplay();
    this.c.fillStyle = "black";
    this.c.font = "bold 10px sans-serif";
    this.c.fillText(StereoPannerRect.TITLE, this.x, this.y + 10);
    this.c.font = "10px sans-serif";
    this.c.fillText(String(this.panValue), this.x, this.y + 20);

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
    title.textContent = StereoPannerRect.TITLE
    controllerDiv.appendChild(title);

    const pullDown = document.createElement("select");
    pullDown.addEventListener("change", (e: Event) => {
      const { target } = e;
      if (!(target instanceof HTMLSelectElement)) return;
      this.panValue = Number(target.value);
      (this.audioNode as StereoPannerNode).pan.value = this.panValue;
    });
    const values = [];
    for (let i = -10; i < 11; i++) {
      values.push(i / 10);
    }
    const options = values.map((value) => {
      const option = document.createElement("option");
      if (value == this.panValue) {
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
