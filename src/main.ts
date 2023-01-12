import { setGlobalUtils } from "./globalUtil";
import { PatchObserver } from "./patchObserver";
import { DestinationRect } from "./destinationRect";
import { GainRect } from "./gainRect";
import { EnvelopeRect } from './envelopeRect'
import { OscillatorRect } from "./oscillatorRect";
import { StereoPannerRect } from "./stereoPannerRect";
import { BaseRect } from "./baseRect";

const canvas = document.getElementById("tutorial") as HTMLCanvasElement;
const startButton = document.getElementById("start");
const rectSelector = document.getElementById("rect-selector");
const area = document.querySelector("#control-area") as HTMLDivElement;

const c = canvas.getContext("2d");
setGlobalUtils(canvas);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
startButton!.addEventListener("click", () => {
  if (c == null) return;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  startButton!.remove();
  canvas.style.display = "inline";

  if (rectSelector == null) return;

  rectSelector.classList.remove("hidden");
  rectSelector.classList.add("show");
  const ctx = new AudioContext();
  const observer = new PatchObserver(c);

  const rects: BaseRect[] = [];
  rectSelector.addEventListener("change", (e: Event) => {
    if (c == null) return;

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
      case "envelope":
        rect = new EnvelopeRect(c, ctx, observer, area, 0, 10);
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

  setInterval(() => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    observer.display();
    rects.forEach((rect) => {
      rect.display();
    });
  }, 0);
});
