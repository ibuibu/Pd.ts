import { BaseRect } from "./baseRect";
import { OscillatorRect } from "./oscillatorRect";

export class PatchObserver {
  isPatching = false;
  outputtingObject?: BaseRect;
  patches = [];

  constructor(public c: CanvasRenderingContext2D) {}

  setOutputtingObj(obj: any) {
    this.isPatching = true;
    this.outputtingObject = obj;
  }

  setPatch(inputtingObject: any) {
    this.patches.push({ out: this.outputtingObject, in: inputtingObject });
    this.outputtingObject.isPatching = false;
    this.connect();
    this.clear();
  }

  connect() {
    for (const patch of this.patches) {
      if (patch.in instanceof OscillatorRect) {
        patch.out.audioNode.connect(patch.in.audioNode.frequency);
      } else {
        patch.out.audioNode.connect(patch.in.audioNode);
      }
    }
  }

  display() {
    for (const patch of this.patches) {
      const [ol, or, ot, ob] = patch.out.outletRectCorners();
      this.c.beginPath();
      this.c.moveTo(or, ob);
      const [il, ir, it, ib] = patch.in.inletRectCorners();
      this.c.lineTo(il, it);
      this.c.strokeStyle = "black";
      this.c.lineWidth = 1;
      this.c.stroke();
    }
  }

  clear() {
    this.isPatching = false;
    this.outputtingObject = null;
  }
}
