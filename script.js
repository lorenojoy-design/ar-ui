// Mobile-friendly screenshot function
const cameraBtn = document.getElementById("cameraBtn");
cameraBtn.addEventListener("click", async () => {
  const sceneEl = document.querySelector("a-scene");
  if (!sceneEl.renderer) return;

  // Get the canvas
  const canvas = sceneEl.renderer.domElement;

  try {
    // Convert to blob for mobile compatibility
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ar_capture.png";
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (err) {
    console.error("Screenshot failed:", err);
    alert("Cannot capture screenshot on this device.");
  }
});

// Video Hold-to-Record (mobile-compatible)
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

  try {
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  } catch (err) {
    alert("Video recording not supported on this device.");
    return;
  }

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
  videoBtn.style.backgroundColor = "rgba(14, 163, 113, 0.7)";
});

videoBtn.addEventListener("pointerup", () => {
  if (!isRecording || !mediaRecorder) return;
  mediaRecorder.stop();
  isRecording = false;
  videoBtn.style.backgroundColor = "rgba(33, 199, 138, 0.6)";
});

// Map button placeholder
document.getElementById("mapBtn").addEventListener("click", () => {
  alert("Map overlay coming soon!");
});

// Language dropdown placeholder
document.getElementById("languageSwitcher").addEventListener("change", e => {
  alert("Language switched to " + e.target.value);
});
