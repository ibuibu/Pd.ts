import { setGlobalUtils } from "./globalUtil";
import { PatchObserver } from "./patchObserver";
import { DestinationRect } from "./destinationRect";
import { GainRect } from "./gainRect";
import { OscillatorRect } from "./oscillatorRect";
import { StereoPannerRect } from "./stereoPannerRect";
import { BaseRect } from "./baseRect";

const canvas = document.getElementById("tutorial") as HTMLCanvasElement;

if (canvas.getContext) {
  var c = canvas.getContext("2d");
}

setGlobalUtils(canvas);

const startButton = document.querySelector("#start");
const rectSelector = document.getElementById("rect-selector");
const area = document.querySelector("#control-area") as HTMLDivElement;

let ctx: AudioContext;
let observer: PatchObserver;
let rects = [];

rectSelector.addEventListener("change", (e: Event) => {
  const { target } = e;
  if (!(target instanceof HTMLSelectElement)) return;
  let rect: BaseRect;
  switch (target.value) {
    case "oscillator":
      rect = new OscillatorRect(c, ctx, observer, area, 0, 10);
      break;
    case "gain":
      rect = new GainRect(c, ctx, observer, area, 0, 10);
      break;
    case "panner":
      rect = new StereoPannerRect(c, ctx, observer, area, 0, 10);
      break;
    case "out":
      rect = new DestinationRect(c, ctx, observer, 0, 10);
      break;
    default:
      return;
  }
  rects.push(rect);

  (rectSelector as HTMLSelectElement).options[0].selected = true;
});

startButton.addEventListener("click", () => {
  startButton.remove();
  rectSelector.classList.remove("hidden");
  rectSelector.classList.add("show");
  ctx = new AudioContext();

  observer = new PatchObserver(c);

  setInterval(() => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    observer.display();
    rects.forEach((rect) => {
      rect.display();
    });
  }, 0);
});
