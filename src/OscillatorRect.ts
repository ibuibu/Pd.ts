import { BaseRect } from "./baseRect";

export class OscillatorRect extends BaseRect {
  isControlled = false;
  oscillatorType: OscillatorType = "sine";
  ctx: AudioContext;
  isPlaying = false;

  constructor(
    public c: CanvasRenderingContext2D,
    ctx: AudioContext,
    observer: any,
    public area: HTMLDivElement,
    x: number,
    y: number
  ) {
    const oscillatorNode = ctx.createOscillator();
    oscillatorNode.type = "sine"; // sine, square, sawtooth, triangle
    oscillatorNode.frequency.setValueAtTime(440, ctx.currentTime);
    super(c, observer, oscillatorNode, x, y);

    this.ctx = ctx;
  }

  display() {
    this.baseDisplay();
    this.c.fillStyle = "black";
    this.c.font = "bold 10px sans-serif";
    this.c.fillText("Oscillator", this.x, this.y + 10);
    this.c.font = "10px sans-serif";
    this.c.fillText(this.oscillatorType, this.x, this.y + 20);
    this.c.fillText(
      this.isPlaying ? "playing" : "stopped",
      this.x,
      this.y + 30
    );

    if (this.isDragging) {
      if (!this.isControlled) {
        this.setController();
        this.isControlled = true;
      }
    } else {
      this.isControlled = false;
    }
  }

  // もう一度oscillatorを生成して、connectもしなおす
  play() {
    const oscillatorNode = this.ctx.createOscillator();
    oscillatorNode.type = this.oscillatorType;
    oscillatorNode.frequency.setValueAtTime(440, this.ctx.currentTime);
    this.audioNode = oscillatorNode;
    this.observer.connect();
    oscillatorNode.start();
    this.isPlaying = true;
  }

  stop() {
    const oscillator = this.audioNode as OscillatorNode;
    oscillator.stop();
    this.isPlaying = false;
  }

  setController() {
    const controllerDiv = document.createElement("div");

    const title = document.createElement("p");
    title.textContent = "Oscillator";
    controllerDiv.appendChild(title);

    const pullDown = document.createElement("select");
    pullDown.addEventListener("change", (e: Event) => {
      const { target } = e;
      if (!(target instanceof HTMLSelectElement)) return;
      this.oscillatorType = target.value as OscillatorType;
    });
    const oscillatorTypes = ["sine", "square", "sawtooth", "triangle"];
    const options = oscillatorTypes.map((oscillatorType) => {
      const option = document.createElement("option");
      option.value = oscillatorType;
      option.textContent = oscillatorType;
      return option;
    });
    options.forEach((option) => {
      pullDown.appendChild(option);
    });

    controllerDiv.appendChild(pullDown);

    const playButton = document.createElement("button");
    playButton.textContent = "play";
    playButton.addEventListener("click", () => {
      this.play();
    });
    controllerDiv.appendChild(playButton);

    const stopButton = document.createElement("button");
    stopButton.textContent = "stop";
    stopButton.addEventListener("click", () => {
      this.stop();
    });
    controllerDiv.appendChild(stopButton);

    const children = this.area.childNodes;

    if (children.length === 0) {
      this.area.appendChild(controllerDiv);
    } else {
      this.area.replaceChild(controllerDiv, children[0]);
    }
  }
}
