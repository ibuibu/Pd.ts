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

let r1: any;
let r2: any;
let r3: any;

document.querySelector("#begin").addEventListener("click", () => {
  const ctx = new AudioContext();

  const observer = new PatchObserver(c);
  r1 = new OscillatorRect(c, ctx, observer, 10, 10);
  r2 = new GainRect(c, ctx, observer, 100, 100);
  r3 = new DestinationRect(c, ctx, observer, 170, 150);

  setInterval(() => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    observer.display();
    r1.display();
    r2.display();
    r3.display();
  }, 0);
});

document.querySelector("#play").addEventListener("click", () => {
  r1.oscillator.start();
});

document.querySelector("#stop").addEventListener("click", () => {
  r1.oscillator?.stop();
});
