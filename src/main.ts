import { setGlobalUtils } from "./globalUtil";
import { PatchObserver } from "./patchObserver";
import { DestinationRect } from "./destinationRect";
import { GainRect } from "./gainRect";
import { OscillatorRect } from "./oscillatorRect";

const canvas = document.getElementById("tutorial") as HTMLCanvasElement;

if (canvas.getContext) {
  var c = canvas.getContext("2d");
}

setGlobalUtils(canvas);

document.querySelector("#start").addEventListener("click", () => {
  const ctx = new AudioContext();

  const area = document.querySelector("#control-area") as HTMLDivElement;
  const observer = new PatchObserver(c);
  const r1 = new OscillatorRect(c, ctx, observer, area, 10, 10);
  const r2 = new GainRect(c, ctx, observer, 100, 100);
  const r3 = new DestinationRect(c, ctx, observer, 170, 150);

  setInterval(() => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    observer.display();
    r1.display();
    r2.display();
    r3.display();
  }, 0);
});

