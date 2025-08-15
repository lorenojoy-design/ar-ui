// Start camera feed
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        document.getElementById("camera-feed").srcObject = stream;
    } catch (err) {
        alert("Camera access denied: " + err.message);
    }
}
startCamera();

// UI interactions
const mapBtn = document.getElementById("map-btn");
const mapPanel = document.getElementById("map-panel");
const closeMap = document.getElementById("close-map");
const langBtn = document.getElementById("lang-btn");
const langMenu = document.getElementById("lang-menu");
const toast = document.getElementById("toast");

mapBtn.addEventListener("click", () => {
    mapPanel.classList.toggle("hidden");
});
closeMap.addEventListener("click", () => {
    mapPanel.classList.add("hidden");
});
langBtn.addEventListener("click", () => {
    langMenu.classList.toggle("hidden");
});
document.querySelectorAll("#lang-menu li").forEach(li => {
    li.addEventListener("click", () => {
        showToast("Language changed to " + li.innerText);
        langMenu.classList.add("hidden");
    });
});

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove("hidden");
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 2000);
}
