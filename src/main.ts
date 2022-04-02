const canvas = document.getElementById("tutorial") as HTMLCanvasElement;

if (canvas.getContext) {
  var c = canvas.getContext("2d");
}

class PatchObserver {
  isPatching = false;
  outputtingObject?: MyRect;
  patches = [];

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
      c.beginPath();
      c.moveTo(or, ob);
      const [il, ir, it, ib] = patch.in.inletRectCorners();
      c.lineTo(il, it);
      c.strokeStyle = "black";
      c.lineWidth = 1;
      c.stroke();
    }
  }

  clear() {
    this.isPatching = false;
    this.outputtingObject = null;
  }
}

class MyRect {
  audioNode: AudioNode;
  observer: PatchObserver;
  x = 0;
  y = 0;
  w = 50;
  h = 50;
  isDragging = false;
  isPatching = false;
  offsetX = 0;
  offsetY = 0;
  lineStartX = 0;
  lineStartY = 0;

  constructor(observer: any, audioNode: AudioNode, x: number, y: number) {
    this.observer = observer;
    this.audioNode = audioNode;
    this.x = x;
    this.y = y;
  }

  display() {
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
      c.fillStyle = "rgba(200, 0, 200, 0.5)";
    } else {
      c.fillStyle = "rgba(0, 0, 200, 0.5)";
    }
    if (this.isDragging) {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
    }
    c.fillRect(this.x, this.y, this.w, this.h);
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
    c.fillStyle = "black";
    const [ol, or, ot, ob] = this.outletRectCorners();
    if (ol < mouseX && mouseX < or && ot < mouseY && mouseY < ob) {
      c.fillStyle = "pink";
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
      c.beginPath();
      c.moveTo(this.lineStartX, this.lineStartY);
      c.lineTo(mouseX, mouseY);
      c.strokeStyle = "black";
      c.lineWidth = 1;
      c.stroke();
    }
    c.fillRect(this.x + this.w - 10, this.y + this.h, 10, 10);
  }

  inletRectCorners() {
    return [this.x, this.x + 10, this.y - 10, this.y];
  }

  inlet() {
    c.fillStyle = "black";
    const [il, ir, it, ib] = this.inletRectCorners();
    if (il < mouseX && mouseX < ir && it < mouseY && mouseY < ib) {
      c.fillStyle = "pink";
      if (this.observer.isPatching) {
        this.observer.setPatch(this);
      }
    }
    c.fillRect(this.x, this.y - 10, 10, 10);
  }
}

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

  observer = new PatchObserver();
  r1 = new MyRect(observer, oscillator, 10, 10);
  r2 = new MyRect(observer, gainNode, 100, 150);
  r3 = new MyRect(observer, ctx.destination, 170, 150);

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

// GLOBAL
let isMousePressed = false;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e) => {
  var rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener("mousedown", (_e) => {
  isMousePressed = true;
});

canvas.addEventListener("mouseup", (_e) => {
  isMousePressed = false;
});
