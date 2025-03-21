let countdown;
let timeLeft; // Store the remaining time
const countdownDisplay = document.getElementById("countdown");
const timeInput = document.getElementById("timeInput");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const resetBtn = document.getElementById("resetBtn");
const toggleBtn = document.getElementById("mode-toggle");
const icon = document.getElementById("mode-icon");

// Load audio for timer running and completion
const runningAudio = new Audio('ticking-timer.mp3'); // Path to your running sound file
const completionAudio = new Audio(''); // Path to your completion sound file

// Check for user's preferred color scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add("dark-mode");
    icon.classList.replace("fa-moon", "fa-sun"); // Change to sun icon
} else if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    icon.classList.replace("fa-moon", "fa-sun"); // Change to sun icon
}

startBtn.addEventListener("click", startTimer);
timeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        startTimer();
    }
});

resetBtn.addEventListener("click", resetTimer);

pauseBtn.addEventListener("click", pauseTimer);
resumeBtn.addEventListener("click", resumeTimer);

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        icon.classList.replace("fa-moon", "fa-sun"); // Switch to sun
        localStorage.setItem("theme", "dark");
    } else {
        icon.classList.replace("fa-sun", "fa-moon"); // Switch to moon
        localStorage.setItem("theme", "light");
    }
});

function startTimer() {
    timeLeft = parseInt(timeInput.value);
    if (isNaN(timeLeft) || timeLeft <= 0) {
        alert("Please enter a valid number of seconds!");
        return;
    }
    clearInterval(countdown);
    updateDisplay(timeLeft);
    startBtn.disabled = true; // Disable start button
    pauseBtn.disabled = false; // Enable pause button
    resetBtn.disabled = false; // Enable reset button

    // Play the running sound
    runningAudio.loop = true; // Loop the sound while the timer is running
    runningAudio.play();

    countdown = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(countdown);
            runningAudio.pause(); // Stop the running sound
            runningAudio.currentTime = 0; // Reset the sound to the beginning
            completionAudio.play(); // Play completion sound
            countdownDisplay.innerText = "Time's Up!";
            blinkScreen(); // Start blinking effect
            resetTimer(); // Reset timer when time is up
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(countdown);
    runningAudio.pause(); // Stop the running sound
    pauseBtn.disabled = true; // Disable pause button
    resumeBtn.disabled = false; // Enable resume button
}

function resumeTimer() {
    // Resume the countdown from the current timeLeft
    countdown = setInterval(() => {
        timeLeft--;
        updateDisplay(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(countdown);
            runningAudio.pause(); // Stop the running sound
            runningAudio.currentTime = 0; // Reset the sound to the beginning
            completionAudio.play(); // Play completion sound
            countdownDisplay.innerText = "Time's Up!";
            blinkScreen(); // Start blinking effect
            resetTimer(); // Reset timer when time is up
        }
    }, 1000);
    
    resumeBtn.disabled = true; // Disable resume button
    pauseBtn.disabled = false; // Enable pause button
}

function resetTimer() {
    clearInterval(countdown);
    countdownDisplay.innerText = "00:00";
    timeInput.value = "";
    startBtn.disabled = false; // Enable start button
    pauseBtn.disabled = true; // Disable pause button
    resumeBtn.disabled = true; // Disable resume button
}

function updateDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    countdownDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Function to create a blinking effect
function blinkScreen() {
    const originalColor = document.body.style.backgroundColor;
    let isOriginalColor = true;

    const blinkInterval = setInterval(() => {
        document.body.style.backgroundColor = isOriginalColor ? 'red' : originalColor; // Change to red
        isOriginalColor = !isOriginalColor;
    }, 500); // Blink every 500ms

    // Stop blinking after 5 seconds
    setTimeout(() => {
        clearInterval(blinkInterval);
        document.body.style.backgroundColor = originalColor; // Reset to original color
    }, 5000);
}
