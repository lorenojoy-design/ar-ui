// Quick selector shortcuts
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// UI elements
const mapBtn    = $("#map-btn");
const mapPanel  = $("#map-panel");
const closeMap  = $("#close-map");
const langBtn   = $("#lang-btn");
const langMenu  = $("#lang-menu");
const soundBtn  = $("#sound-btn");
const cameraBtn = $("#camera-btn");
const videoBtn  = $("#video-btn");
const resetBtn  = $("#reset-btn");
const toast     = $("#toast");
const langText  = $("#lang-text");

// Multilingual text data (example)
const textData = {
  en: "Welcome to the exhibit!",
  fil: "Maligayang pagdating sa eksibit!"
};

// 🔁 Update language text
function updateLanguage(lang) {
  langText.textContent = textData[lang] || "Text not available.";
}

// Toast helper
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add("hidden"), 2000);
}

// 🗺️ Map Panel Toggle
if (mapBtn && mapPanel && closeMap) {
  mapBtn.addEventListener("click", () => mapPanel.classList.toggle("hidden"));
  closeMap.addEventListener("click", () => mapPanel.classList.add("hidden"));
}

// 🌐 Language Selector
if (langBtn && langMenu) {
  langBtn.addEventListener("click", () => langMenu.classList.toggle("hidden"));
  $$("#lang-menu li").forEach(li => {
    li.addEventListener("click", () => {
      const lang = li.dataset.lang;
      updateLanguage(lang);
      showToast(`Language: ${lang.toUpperCase()}`);
      langMenu.classList.add("hidden");
    });
  });
}

// 🔊 Sound Toggle
if (soundBtn) {
  soundBtn.addEventListener("click", () => {
    const sound = $("#markerSound");
    const icon = soundBtn.querySelector("i");
    const on = icon.classList.contains("fa-volume-high");

    if (sound) {
      if (on) sound.components.sound.pauseSound();
      else sound.components.sound.playSound();
    }

    icon.classList.toggle("fa-volume-high", !on);
    icon.classList.toggle("fa-volume-xmark", on);
    showToast(on ? "🔇 Sound Off" : "🔊 Sound On");
  });
}

// 📸 Take Snapshot
if (cameraBtn) {
  cameraBtn.addEventListener("click", () => {
    const scene = document.querySelector("a-scene");
    if (!scene || !scene.renderer || !scene.renderer.domElement) {
      showToast("⚠️ AR scene not ready");
      return;
    }
    const canvas = scene.renderer.domElement;
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `snapshot_${Date.now()}.png`;
    link.click();
    showToast("📸 Snapshot saved");
  });
}

// 🎥 Record Video
if (videoBtn) {
  let recording = false;
  let mediaRecorder;
  let recordedChunks = [];

  videoBtn.addEventListener("click", () => {
    const scene = document.querySelector("a-scene");
    const icon = videoBtn.querySelector("i");

    if (!scene || !scene.renderer || !scene.renderer.domElement) {
      showToast("⚠️ AR scene not ready");
      return;
    }

    if (!recording) {
      const stream = scene.renderer.domElement.captureStream(30);
      mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

      recordedChunks = [];
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ar_video_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      icon.classList.replace("fa-video", "fa-stop");
      showToast("🎥 Recording started");
      recording = true;
    } else {
      mediaRecorder.stop();
      icon.classList.replace("fa-stop", "fa-video");
      showToast("🛑 Recording saved");
      recording = false;
    }
  });
}

// ♻️ Reset 3D Model
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const model = $("#model");
    if (model) {
      model.setAttribute("rotation", "0 0 0");
      model.setAttribute("scale", "0.5 0.5 0.5");
    }
    showToast("🔄 View reset");
  });
}

// 🤝 Make model interactive (rotate, zoom)
AFRAME.registerComponent('interactive-model', {
  init: function () {
    this.rotation = this.el.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    this.scale = this.el.getAttribute
