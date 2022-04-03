import { PatchObserver } from "./patchObserver";
import { isMousePressed, mouseX, mouseY } from "./globalUtil";

export class BaseRect {
  audioNode: AudioNode;
  observer: PatchObserver;
  x = 0;
  y = 0;
  w = 60;
  h = 40;
  isDragging = false;
  isPatching = false;
  offsetX = 0;
  offsetY = 0;
  lineStartX = 0;
  lineStartY = 0;

  constructor(
    public c: CanvasRenderingContext2D,
    observer: any,
    audioNode: AudioNode,
    x: number,
    y: number
  ) {
    this.observer = observer;
    this.audioNode = audioNode;
    this.x = x;
    this.y = y;
  }

  baseDisplay() {
    this.base();
    this.outlet();
    this.inlet();
  }

  base() {
    if (
      this.x < mouseX &&
      mouseX < this.x + this.w &&
      this.y < mouseY &&
      mouseY < this.y + this.h
    ) {
      if (isMousePressed) {
        if (!this.isDragging) {
          this.offsetX = mouseX - this.x;
          this.offsetY = mouseY - this.y;
          this.isDragging = true;
        }
      } else {
        this.isDragging = false;
      }
      // this.c.fillStyle = "rgba(200, 0, 200, 0.5)";
    } else {
      // this.c.fillStyle = "rgba(0, 0, 200, 0.5)";
    }
    if (this.isDragging) {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
    }
    this.c.strokeRect(this.x + 1, this.y, this.w - 2, this.h);
    // this.c.fillRect(this.x, this.y, this.w, this.h);
  }

  outletRectCorners() {
    return [
      this.x + this.w - 10,
      this.x + this.w,
      this.y + this.h,
      this.y + this.h + 10,
    ];
  }

  outlet() {
    this.c.fillStyle = "black";
    const [ol, or, ot, ob] = this.outletRectCorners();
    if (ol < mouseX && mouseX < or && ot < mouseY && mouseY < ob) {
      this.c.fillStyle = "blue";
    }
    if (isMousePressed) {
      if (ol < mouseX && mouseX < or && ot < mouseY && mouseY < ob) {
        if (!this.isPatching) {
          this.lineStartX = mouseX;
          this.lineStartY = mouseY;
          this.isPatching = true;
          this.observer.setOutputtingObj(this);
        }
      }
    } else {
      this.isPatching = false;
      this.observer.clear();
    }
    if (this.isPatching) {
      this.c.beginPath();
      this.c.moveTo(this.lineStartX, this.lineStartY);
      this.c.lineTo(mouseX, mouseY);
      this.c.strokeStyle = "black";
      this.c.lineWidth = 1;
      this.c.stroke();
    }
    this.c.fillRect(this.x + this.w - 10, this.y + this.h, 10, 10);
  }

  inletRectCorners() {
    return [this.x, this.x + 10, this.y - 10, this.y];
  }

  inlet() {
    this.c.fillStyle = "black";
    const [il, ir, it, ib] = this.inletRectCorners();
    if (il < mouseX && mouseX < ir && it < mouseY && mouseY < ib) {
      this.c.fillStyle = "blue";
      if (this.observer.isPatching) {
        this.observer.setPatch(this);
      }
    }
    this.c.fillRect(this.x, this.y - 10, 10, 10);
  }
}
