import { setGlobalUtils } from "./globalUtil";
import { PatchObserver } from "./patchObserver";
import { MyRect } from "./myRect";

const canvas = document.getElementById("tutorial") as HTMLCanvasElement;

if (canvas.getContext) {
  var c = canvas.getContext("2d");
}

setGlobalUtils(canvas);

let oscillator: any;
// 再生中でtrue
let isPlaying = false;

let ctx: any;

let observer: any;
let r1: any;
let r2: any;
let r3: any;

document.querySelector("#begin").addEventListener("click", () => {
  ctx = new AudioContext();
  // 再生中なら二重に再生されないようにする
  if (isPlaying) return;
  oscillator = ctx.createOscillator();
  oscillator.type = "sine"; // sine, square, sawtooth, triangleがある
  oscillator.frequency.setValueAtTime(440, ctx.currentTime); // 440HzはA4(4番目のラ)

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.1;

  observer = new PatchObserver(c);
  r1 = new MyRect(c, observer, oscillator, 10, 10);
  r2 = new MyRect(c, observer, gainNode, 100, 150);
  r3 = new MyRect(c, observer, ctx.destination, 170, 150);

  setInterval(() => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    observer.display();
    r1.display();
    r2.display();
    r3.display();
  }, 0);
});

document.querySelector("#play").addEventListener("click", () => {
  oscillator.start();
  isPlaying = true;
});

// oscillatorを破棄し再生を停止する
document.querySelector("#stop").addEventListener("click", () => {
  oscillator?.stop();
  isPlaying = false;
});
