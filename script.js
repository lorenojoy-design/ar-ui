// ---------------------------
// Camera Button → Screenshot
// ---------------------------
const cameraBtn = document.getElementById("cameraBtn");
cameraBtn.addEventListener("click", () => {
  const sceneEl = document.querySelector("a-scene");
  if (!sceneEl.renderer) return;

  const canvas = sceneEl.renderer.domElement;
  const dataURL = canvas.toDataURL("image/png");

  const a = document.createElement("a");
  a.href = dataURL;
  a.download = "ar_capture.png";
  a.click();
});

// ---------------------------
// Video Button → Hold to Record
// ---------------------------
const videoBtn = document.getElementById("videoBtn");
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

videoBtn.addEventListener("pointerdown", () => {
  if (isRecording) return;

  const sceneEl = document.querySelector("a-scene");
  if (!sceneEl.renderer) return;

  const canvas = sceneEl.renderer.domElement;

  recordedChunks = [];
  const stream = canvas.captureStream(30);
  mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ar_recording.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  mediaRecorder.start();
  isRecording = true;
  videoBtn.style.backgroundColor = "var(--dark-green-active)";
});

videoBtn.addEventListener("pointerup", () => {
  if (!isRecording || !mediaRecorder) return;
  mediaRecorder.stop();
  isRecording = false;
  videoBtn.style.backgroundColor = "var(--dark-green)";
});

// ---------------------------
// Map Button placeholder
// ---------------------------
const mapBtn = document.getElementById("mapBtn");
mapBtn.addEventListener("click", () => {
  alert("Map overlay coming soon!");
});

// ---------------------------
// Language Dropdown placeholder
// ---------------------------
const languageSwitcher = document.getElementById("languageSwitcher");
languageSwitcher.addEventListener("change", e => {
  alert("Language switched to " + e.target.value);
});
