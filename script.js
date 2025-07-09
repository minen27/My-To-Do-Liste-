// 🌤️ Cloudy To-Do – script.js

// Elements
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const darkModeToggle = document.getElementById("darkModeToggle");
const clearBtn = document.getElementById("clearBtn");
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
const categorySelect = document.getElementById("categorySelect");
const celebrationCanvas = document.getElementById("celebration");
const splash = document.getElementById("splash");
const startDayBtn = document.getElementById("startDayBtn");
const quoteBox = document.getElementById("quoteBox");

let musicOn = false;

// 🌟 Rotating Quotes
const quotes = [
    "🌤️ Stay positive and focused.",
    "☁️ Small steps make big changes.",
    "🪴 Breathe, organize, grow.",
    "🌸 One task at a time.",
    "💭 Dream it. Do it.",
    "📅 Today is a gift.",
    "🧠 Clear mind, calm day.",
    "🌈 Progress, not perfection.",
    "💡 A little effort matters.",
    "🧘 Make space for peace."
];

function rotateQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteBox.textContent = quotes[randomIndex];
}
setInterval(rotateQuote, 6000);
rotateQuote();

// 🛫 Splash screen
startDayBtn.addEventListener("click", () => {
    splash.classList.add("hide");
    document.querySelector(".container").classList.remove("hide");
});

// 🌙 Dark Mode
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const darkMode = document.body.classList.contains("dark");
    darkModeToggle.textContent = darkMode ? "☀️" : "🌙";
    localStorage.setItem("darkMode", darkMode);
});

// 🎵 Music Toggle
musicToggle.addEventListener("click", () => {
    musicOn = !musicOn;
    if (musicOn) {
        bgMusic.play();
        musicToggle.textContent = "🔇 Mute";
    } else {
        bgMusic.pause();
        musicToggle.textContent = "🎵 Music";
    }
});

// 🗑️ Clear All Tasks
clearBtn.addEventListener("click", () => {
    if (confirm("Clear all tasks?")) {
        taskList.innerHTML = "";
        saveTasks();
    }
});

// ✅ Create Task
function createTask(text, isDone = false, category = "", deadline = "") {
    const li = document.createElement("li");
    li.className = "task";
    if (isDone) li.classList.add("done");

    const span = document.createElement("span");

    let countdown = "";
    let deadlineColor = "";

    if (deadline) {
        const today = new Date();
        const dueDate = new Date(deadline);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            countdown = `🔥 Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`;
            deadlineColor = "red";
        } else if (diffDays === 0) {
            countdown = `✅ Due today`;
            deadlineColor = "orange";
        } else {
            countdown = `⏳ ${diffDays} day${diffDays > 1 ? "s" : ""} left`;
            deadlineColor = "green";
        }
    }

    span.innerHTML = `
    ${text} 
    ${category ? `<span style="color:#999">(${category})</span>` : ""} 
    ${deadline ? `<span style="color:${deadlineColor}">⏰ ${deadline} - ${countdown}</span>` : ""}
  `;

  const checkBtn = document.createElement("button");
  checkBtn.textContent = "✔️";
  checkBtn.onclick = () => {
    li.classList.toggle("done");
    saveTasks();
    checkAllDone();
    showCelebration(); // 🎉 Every time a task is checked
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.append(span, checkBtn, deleteBtn);
  taskList.appendChild(li);
  checkAllDone();
}

// ➕ Add Task
addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const category = categorySelect.value;
  const deadline = dateInput.value;
  if (!text) return;
  createTask(text, false, category, deadline);
  taskInput.value = "";
  dateInput.value = "";
  saveTasks();
});

// 💾 Save Tasks
function saveTasks() {
  const allTasks = [];
  taskList.querySelectorAll(".task").forEach(task => {
    let fullText = task.querySelector("span").textContent;
    let text = fullText;
    let category = "";
    let deadline = "";

    let categoryMatch = fullText.match(/\((.*?)\)/);
    let deadlineMatch = fullText.match(/⏰ (\d{4}-\d{2}-\d{2})/);

    if (categoryMatch) category = categoryMatch[1];
    if (deadlineMatch) deadline = deadlineMatch[1];

    text = fullText
      .replace(`(${category})`, "")
      .replace(`⏰ ${deadline}`, "")
      .replace(/[-–—].*/, "")
      .trim();

    allTasks.push({
      text,
      done: task.classList.contains("done"),
      category,
      deadline
    });
  });

  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// ✅ All Done Celebration
function checkAllDone() {
  const tasks = taskList.querySelectorAll(".task");
  const doneTasks = taskList.querySelectorAll(".task.done");
  if (tasks.length > 0 && tasks.length === doneTasks.length) {
    showCelebration();
  }
}

// 🎉 Celebration Animation
function showCelebration() {
  const ctx = celebrationCanvas.getContext("2d");
  celebrationCanvas.classList.remove("hide");

  let particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight / 2,
    dx: (Math.random() - 0.5) * 4,
    dy: Math.random() * -5,
    radius: Math.random() * 5 + 2,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`
  }));

  function animate() {
    ctx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
  }

  celebrationCanvas.width = window.innerWidth;
  celebrationCanvas.height = window.innerHeight;

  let count = 0;
  let interval = setInterval(() => {
    animate();
    count++;
    if (count > 60) {
      clearInterval(interval);
      celebrationCanvas.classList.add("hide");
    }
  }, 1000 / 30);
}

// 🧠 Load Tasks & Theme
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTask(task.text, task.done, task.category, task.deadline));
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    darkModeToggle.textContent = "☀️";
  } else {
    darkModeToggle.textContent = "🌙";
  }
};