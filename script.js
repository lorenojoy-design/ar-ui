// UI hooks
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const mapBtn   = $("#map-btn");
const mapPanel = $("#map-panel");
const closeMap = $("#close-map");
const langBtn  = $("#lang-btn");
const langMenu = $("#lang-menu");
const soundBtn = $("#sound-btn");
const cameraBtn= $("#camera-btn");
const videoBtn = $("#video-btn");
const resetBtn = $("#reset-btn");
const toast    = $("#toast");

// map panel
if (mapBtn && mapPanel && closeMap){
  mapBtn.addEventListener("click", () => mapPanel.classList.toggle("hidden"));
  closeMap.addEventListener("click", () => mapPanel.classList.add("hidden"));
}

// language menu
if (langBtn && langMenu){
  langBtn.addEventListener("click", () => langMenu.classList.toggle("hidden"));
  $$("#lang-menu li").forEach(li=>{
    li.addEventListener("click", ()=>{
      showToast(`Language changed to ${li.dataset.lang?.toUpperCase() || li.textContent.trim()}`);
      langMenu.classList.add("hidden");
    });
  });
}

// sound toggle
if (soundBtn){
  soundBtn.addEventListener("click", ()=>{
    const icon = soundBtn.querySelector("i");
    const on = icon.classList.contains("fa-volume-high");
    icon.classList.toggle("fa-volume-high", !on);
    icon.classList.toggle("fa-volume-xmark", on);
    showToast(on ? "Sound Off" : "Sound On");
  });
}

// 📸 Snapshot
if (cameraBtn) {
  cameraBtn.addEventListener("click", () => {
    const scene = document.querySelector("a-scene");
    if (!scene || !scene.renderer || !scene.renderer.domElement) {
      showToast("⚠️ AR scene not ready yet");
      return;
    }
    const canvas = scene.renderer.domElement;
    const imageData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imageData;
    link.download = `ar_snapshot_${Date.now()}.png`;
    link.click();

    showToast("📸 Snapshot saved");
  });
}

// 🎥 Video Recording
if (videoBtn) {
  let recording = false;
  let mediaRecorder;
  let recordedChunks = [];

  videoBtn.addEventListener("click", () => {
    const scene = document.querySelector("a-scene");
    if (!scene || !scene.renderer || !scene.renderer.domElement) {
      showToast("⚠️ AR scene not ready yet");
      return;
    }
    const icon = videoBtn.querySelector("i");

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

// reset
if (resetBtn){ resetBtn.addEventListener("click", ()=> showToast("View reset")); }

// toast
function showToast(msg){
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> toast.classList.add("hidden"), 1800);
}

// ✅ AR.js camera setup
window.onload = function() {
  var arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
    facingMode: 'environment'  // start with back cam
  });

  arToolkitSource.init(function onReady(){
    setTimeout(() => {
      onResize();
    }, 2000);
  });

  window.addEventListener('resize', onResize);

  function onResize(){
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if(arToolkitContext.arController !== null){
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
  }

  // ✅ toggle front/back camera
  if (cameraBtn){
    cameraBtn.addEventListener("click", () => {
      const newMode = (arToolkitSource.parameters.facingMode === 'environment')
        ? 'user' : 'environment';
      arToolkitSource.parameters.facingMode = newMode;
      arToolkitSource.init(onResize);
      showToast(`Camera switched to ${newMode === 'user' ? 'Front' : 'Back'}`);
    });
  }
};
