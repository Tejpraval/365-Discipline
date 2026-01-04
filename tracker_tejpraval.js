const YEAR = new Date().getFullYear();
const TOTAL_DAYS = 365;
const STORAGE_KEY = "365-discipline";

const yearEl = document.getElementById("year");
const statsEl = document.getElementById("stats");
const gridEl = document.getElementById("grid");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");

const today = new Date();
const startOfYear = new Date(YEAR, 0, 1);
const todayIndex = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));

yearEl.textContent = `YEAR ${YEAR}`;

let data = loadData();
let dirty = false;

function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);

    return {
        year: YEAR,
        days: Array.from({
            length: TOTAL_DAYS
        }, (_, i) => ({
            done: false,
            date: new Date(YEAR, 0, i + 1).toISOString().slice(0, 10),
        })),
    };
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    dirty = false;
    saveBtn.disabled = true;
    statusEl.textContent = "SAVED";
}

function calculateStreak() {
    let streak = 0;
    for (let i = todayIndex; i >= 0; i--) {
        if (data.days[i]?.done) streak++;
        else break;
    }
    return streak;
}

function updateStats() {
    const completed = data.days.filter(d => d.done).length;
    const percent = Math.floor((completed / TOTAL_DAYS) * 100);
    const streak = calculateStreak();

    statsEl.textContent =
        `${completed}/${TOTAL_DAYS} | ${percent}% | STREAK: ${streak}`;
}

function renderGrid() {
    gridEl.innerHTML = "";

    data.days.forEach((day, index) => {
        const box = document.createElement("div");
        box.className = "box" + (day.done ? " checked" : "");

        if (index === todayIndex) {
            box.addEventListener("click", () => {
                day.done = !day.done; // UNDO allowed before save
                dirty = true;
                saveBtn.disabled = false;
                statusEl.textContent = "";
                renderGrid();
                updateStats();
            });
        } else {
            box.style.cursor = "not-allowed";
            box.style.opacity = index < todayIndex ? "0.4" : "0.2";
        }

        gridEl.appendChild(box);
    });
}

saveBtn.addEventListener("click", saveData);

renderGrid();
updateStats();