import { BaseRect } from "./baseRect";
import { OscillatorRect } from "./oscillatorRect";

type Patch = {
  out: BaseRect,
  in: BaseRect;
}

export class PatchObserver {
  isPatching = false;
  outputtingObject?: BaseRect;
  patches: Patch[] = [];

  constructor(public c: CanvasRenderingContext2D) { }

  setOutputtingObj(obj: BaseRect) {
    this.isPatching = true;
    this.outputtingObject = obj;
  }

  setPatch(inputtingObject: BaseRect) {
    if (this.outputtingObject == null) return;
    this.patches.push({ out: this.outputtingObject, in: inputtingObject });
    this.outputtingObject.isPatching = false;
    this.connect();
    this.clear();
  }

  connect() {
    for (const patch of this.patches) {
      if (patch.in instanceof OscillatorRect) {
        patch.out.audioNode.connect((patch.in.audioNode as OscillatorNode).frequency);
      } else {
        patch.out.audioNode.connect(patch.in.audioNode);
      }
    }
  }

  display() {
    for (const patch of this.patches) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, or, __, ob] = patch.out.outletRectCorners();
      this.c.beginPath();
      this.c.moveTo(or, ob);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [il, ___, it, ____] = patch.in.inletRectCorners();
      this.c.lineTo(il, it);
      this.c.strokeStyle = "black";
      this.c.lineWidth = 1;
      this.c.stroke();
    }
  }

  clear() {
    this.isPatching = false;
    this.outputtingObject = undefined;
  }
}
