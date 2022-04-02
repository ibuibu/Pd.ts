export let isMousePressed = false;
export let mouseX = 0;
export let mouseY = 0;

export function setGlobalUtils(canvas: HTMLCanvasElement) {
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
}
