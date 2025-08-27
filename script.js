// Camera button → screenshot
const cameraBtn = document.getElementById("cameraBtn");
cameraBtn.addEventListener("click", () => {
  const sceneEl = document.querySelector("a-scene");
  if (!sceneEl.renderer) return;
  const canvas = sceneEl.renderer.domElement;

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ar_capture.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
});

// Video button → hold to record
const videoBtn = document.getElementById("videoBtn");
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

videoBtn.addEventListener("pointerdown", () => {
  if (isRecording) return;
  const sceneEl = document.querySelector("a-scene");
  if (!sceneEl.renderer) return;

  const canvas = sceneEl.renderer.domElement;
  const stream = canvas.captureStream(30);

  recordedChunks = [];
  try {
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  } catch (err) {
    alert("Video recording not supported on this device.");
    return;
  }

  mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
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

AFRAME.registerComponent('markerhandler', {
  schema: { markerId: {type: 'string'} },
  init: function () {
    const marker = this.el;
    const id = this.data.markerId;
    const model = marker.querySelector('a-gltf-model');
    const textEl = marker.querySelector('a-text');
    const soundEl = marker.querySelector('a-sound');

    marker.addEventListener('markerFound', () => {
      model.setAttribute('visible', true);
      if(soundEl.components.sound) soundEl.components.sound.playSound();

      const lang = document.getElementById('languageSwitcher').value;
      if (translations[lang] && translations[lang][id]){
        textEl.setAttribute('value', translations[lang][id]);
      }
    });

    marker.addEventListener('markerLost', () => {
      model.setAttribute('visible', false);
      if(soundEl.components.sound) soundEl.components.sound.stopSound();
    });
  }
});

// Update texts when language changes
document.getElementById("languageSwitcher").addEventListener("change", e => {
  const lang = e.target.value;
  ['marker1','marker2',].forEach(id => {
    const textEl = document.getElementById(id+'Text');
    if(translations[lang] && translations[lang][id]){
      textEl.setAttribute('value', translations[lang][id]);
    }
  });
});
