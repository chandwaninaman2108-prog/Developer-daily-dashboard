'use strict';

// -------------------------------------------------------------
// 1. DOM ELEMENTS
// -------------------------------------------------------------
const refreshBtn = document.getElementById('refreshBtn');
const errorBanner = document.getElementById('errorBanner');
const errorMessage = document.getElementById('errorMessage');

const weatherLoader = document.getElementById('weatherLoader');
const weatherContent = document.getElementById('weatherContent');
const tempDisplay = document.getElementById('tempDisplay');
const weatherDetails = document.getElementById('weatherDetails');

const quoteLoader = document.getElementById('quoteLoader');
const quoteContent = document.getElementById('quoteContent');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');

// -------------------------------------------------------------
// 2. API FETCH FUNCTIONS
// -------------------------------------------------------------

// Fetch Local Weather via Open-Meteo API (Free, no API key required)
async function fetchWeather(lat = 21.19, lon = 81.38) { // Default coordinates (Bhilai, CG)
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!response.ok) throw new Error('Failed to fetch weather data.');

    const data = await response.json();
    const temp = data.current_weather.temperature;
    const wind = data.current_weather.windspeed;

    // Render weather UI
    tempDisplay.textContent = `${temp}°C`;
    weatherDetails.textContent = `Wind Speed: ${wind} km/h (Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)})`;

    weatherLoader.classList.add('hidden');
    weatherContent.classList.remove('hidden');
  } catch (err) {
    showError('Weather API Error: ' + err.message);
  }
}

// Fetch Random Programming Quote
async function fetchQuote() {
  try {
    const response = await fetch('https://dummyjson.com/quotes/random');

    if (!response.ok) throw new Error('Failed to fetch quote.');

    const data = await response.json();

    // Render quote UI
    quoteText.textContent = `"${data.quote}"`;
    quoteAuthor.textContent = `— ${data.author}`;

    quoteLoader.classList.add('hidden');
    quoteContent.classList.remove('hidden');
  } catch (err) {
    showError('Quote API Error: ' + err.message);
  }
}

// -------------------------------------------------------------
// 3. GEOLOCATION & CONTROLLER
// -------------------------------------------------------------
function showError(msg) {
  errorMessage.textContent = msg;
  errorBanner.classList.remove('hidden');
}

function clearError() {
  errorBanner.classList.add('hidden');
}

async function loadDashboard() {
  clearError();

  // Reset loader states
  weatherLoader.classList.remove('hidden');
  weatherContent.classList.add('hidden');
  quoteLoader.classList.remove('hidden');
  quoteContent.classList.add('hidden');

  // Trigger Quote API
  fetchQuote();

  // Trigger Geolocation & Weather API
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        console.warn('Geolocation declined/failed. Falling back to default location.');
        fetchWeather(); // Fallback to default coordinates
      }
    );
  } else {
    fetchWeather();
  }
}

// -------------------------------------------------------------
// 4. EVENT LISTENERS & INIT
// -------------------------------------------------------------
refreshBtn.addEventListener('click', loadDashboard);
document.addEventListener('DOMContentLoaded', loadDashboard);
// ... existing app.js logic ...

// -------------------------------------------------------------
// 5. LOCAL STORAGE TASK LIST LOGIC (PASTE AT BOTTOM)
// -------------------------------------------------------------
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('dev_tasks')) || [];

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = tasks.map((task, index) => `
    <li class="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-700">
      <span>${task}</span>
      <button onclick="deleteTask(${index})" class="text-red-400 hover:text-red-300 font-bold px-2">✕</button>
    </li>
  `).join('');
  localStorage.setItem('dev_tasks', JSON.stringify(tasks));
}

window.deleteTask = function(index) {
  tasks.splice(index, 1);
  renderTasks();
};

addTaskBtn?.addEventListener('click', () => {
  if (taskInput.value.trim()) {
    tasks.push(taskInput.value.trim());
    taskInput.value = '';
    renderTasks();
  }
});

renderTasks();