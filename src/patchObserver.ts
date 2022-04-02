import { MyRect } from "./myRect";

export class PatchObserver {
  isPatching = false;
  outputtingObject?: MyRect;
  patches = [];

  constructor(public c: CanvasRenderingContext2D) {}

  setOutputtingObj(obj: any) {
    this.isPatching = true;
    this.outputtingObject = obj;
  }

  setPatch(inputtingObject: any) {
    this.patches.push({ out: this.outputtingObject, in: inputtingObject });
    this.outputtingObject.isPatching = false;
    this.outputtingObject.audioNode.connect(inputtingObject.audioNode);
    this.clear();
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
