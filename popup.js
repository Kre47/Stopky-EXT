const time = document.getElementById("time");
const toggleButton = document.getElementById("toggleButton");
const startButton = document.getElementById("startButton");
const sendButton = document.getElementById("sendButton");
const message = document.getElementById("message");

let startTime = 0;
let savedTime = 0;
let timer;
let running = false;

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const leftSeconds = seconds % 60;

  return String(minutes).padStart(2, "0") + ":" + String(leftSeconds).padStart(2, "0");
}

function updateTime() {
  time.textContent = formatTime(savedTime + Date.now() - startTime);
}

toggleButton.addEventListener("click", function () {
  if (running) {
    savedTime += Date.now() - startTime;
    clearInterval(timer);
    running = false;
    toggleButton.textContent = "Start";
    time.textContent = formatTime(savedTime);
  } else {
    startTime = Date.now();
    running = true;
    toggleButton.textContent = "Stop";
    message.textContent = "";
    timer = setInterval(updateTime, 100);
    updateTime();
  }
});

resetButton.addEventListener("click", function () {
  clearInterval(timer);
  savedTime = 0;
  running = false;
  time.textContent = "00:00";
  toggleButton.textContent = "Start";
  message.textContent = "";
});

sendButton.addEventListener("click", async function () {
  if (running) {
    message.textContent = "Zastav stopky před odesláním.";
    return;
  }

  if (savedTime === 0) {
    message.textContent = "Nahraj před odesláním čas.";
    return;
  }

  const websiteUrl = "https://example.com/api/save";
  const recordedTime = formatTime(savedTime);
  message.textContent = "Odesílání...";

  try {
    const response = await fetch(websiteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time: recordedTime })
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    message.textContent = "Čas odeslán úspěšně.";
  } catch (error) {
    message.textContent = "Nepodařilo se odeslat čas. Zkontroluj URL a zkuste to znovu.";
    console.error(error);
  }
});
