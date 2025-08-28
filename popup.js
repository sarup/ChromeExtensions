document.getElementById('captureBtn').onclick = function () {
  chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl) {
    let img = new window.Image();
    img.onload = function() {
      let canvas = document.getElementById('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.style.display = 'block';
      document.getElementById('controls').style.display = 'block';
    };
    img.src = dataUrl;
    window.screenshotDataUrl = dataUrl;
  });
};

let drawing = false;
let lastX = 0, lastY = 0;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let color = document.getElementById('colorPicker').value;
let size = document.getElementById('sizePicker').value;

document.getElementById('colorPicker').oninput = function(e) {
  color = e.target.value;
};
document.getElementById('sizePicker').oninput = function(e) {
  size = e.target.value;
};

canvas.addEventListener('mousedown', function(e) {
  drawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mousemove', function(e) {
  if (!drawing) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

document.getElementById('clearBtn').onclick = function() {
  if (window.screenshotDataUrl) {
    let img = new window.Image();
    img.onload = function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = window.screenshotDataUrl;
  }
};

document.getElementById('saveBtn').onclick = function() {
  let link = document.createElement('a');
  link.download = 'screenshot.png';
  link.href = canvas.toDataURL();
  link.click();
};