// 1.  BILOWGA 
let currentLang = localStorage.getItem("lang") || "so";
let currentUnit = localStorage.getItem("unit") || "ml";
let savedGoal = parseInt(localStorage.getItem("userGoal")) || 2000;
let waterData = JSON.parse(localStorage.getItem("waterData")) || { logs: [], total: 0 };

const getEl = (id) => document.getElementById(id);

// 2. MARKA BOGGU KCO
window.onload = () => {
    applyLanguage();
    if (getEl("langSelect")) getEl("langSelect").value = currentLang;
    if (getEl("unitSelect")) getEl("unitSelect").value = currentUnit;
    if (getEl("displayGoal")) getEl("displayGoal").textContent = formatVolume(savedGoal);
    if (getEl("logListFull")) displayHistory(); 
    updateUI();
};

// 3. SETTINGS
function resetTracker() {
    let confirmMsg = currentLang === "so" ? "Ma hubtaa inaad tirtirto dhammaan xogta?" : "Are you sure you want to reset all data?";
    if (confirm(confirmMsg)) {
        localStorage.clear();
        window.location.href = "index.html";
    }
}

function changeLanguage() {
    const langSelect = getEl("langSelect");
    if (langSelect) {
        localStorage.setItem("lang", langSelect.value);
        location.reload(); 
    }
}

function changeUnit() {
    const unitSelect = getEl("unitSelect");
    if (unitSelect) {
        localStorage.setItem("unit", unitSelect.value);
        location.reload(); 
    }
}

// 4. HOME PAGE
function setGoal() {
    const goalInput = getEl("goalInput");
    const msgArea = getEl("homeMessage");
    if (!goalInput) return;
    const val = parseInt(goalInput.value);

    if (isNaN(val) || val < 500) {
        if (msgArea) {
            msgArea.textContent = currentLang === "so" ? "❌ Fadlan geli ugu yaraan 500ml!" : "❌ Please enter at least 500ml!";
            msgArea.style.color = "#e74c3c";
        }
        return; 
    }

    localStorage.setItem("userGoal", val);
    localStorage.setItem("waterData", JSON.stringify({ logs: [], total: 0 }));
    window.location.href = "tracker.html"; 
}

// 5. TRACKER & UI
function formatVolume(amount) {
    if (currentUnit === "L") return (amount / 1000).toFixed(2) + " L";
    return amount + " ml";
}

function updateUI() {
    const display = getEl("totalDisplay");
    const bar = getEl("progressBar");
    const statusText = getEl("statusText");

    if (display) display.textContent = formatVolume(waterData.total);
    if (bar) {
        let percent = (waterData.total / savedGoal) * 100;
        bar.style.width = Math.min(percent, 100) + "%";
    }

    if (statusText) {
        if (waterData.total === 0) {
            statusText.textContent = currentLang === "so" ? "Weli wax maadan cabin 💧" : "No water yet 💧";
        } else if (waterData.total >= savedGoal) {
            statusText.textContent = currentLang === "so" ? "🏆 Hadafkaagii waad buuxisay!" : "🏆 Goal Completed!";
        } else {
            let dhiman = savedGoal - waterData.total;
            statusText.textContent = currentLang === "so" ? `Dhiman: ${formatVolume(dhiman)} 📈` : `Remaining: ${formatVolume(dhiman)} 📈`;
        }
    }
}

function addWater() {
    const input = getEl("waterInput");
    const msgArea = getEl("message"); 
    const amount = input ? parseInt(input.value) : 0;

    if (isNaN(amount) || amount <= 0) {
        if (msgArea) {
            msgArea.textContent = currentLang === "so" ? "❌ Fadlan geli tiro sax ah!" : "❌ Please enter a valid amount!";
            msgArea.style.color = "#e74c3c";
        }
        return; 
    }

    if ((waterData.total + amount) > savedGoal) {
        let fariin = currentLang === "so" ? "Hadafkaagii waad gaartay! Ma rabtaa inaad ku darto biyo dheeraad ah?" : "Goal reached! Add more anyway?";
        if (!confirm(fariin)) return;
    }

    waterData.logs.push({ amount, time: new Date().toLocaleTimeString(), date: new Date().toLocaleDateString() });
    waterData.total += amount;
    localStorage.setItem("waterData", JSON.stringify(waterData));

    updateUI();
    if (input) input.value = "";
    if (msgArea) msgArea.textContent = "";
}

// 6. HISTORY & LANGUAGES
function displayHistory() {
    const list = getEl("logListFull"); 
    if (!list) return;
    if (waterData.logs.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#888;">Weli wax xog ah lama kaydin.</p>`;
        return;
    }
    list.innerHTML = waterData.logs.slice().reverse().map(log => `
        <div style="background:white; padding:15px; margin-bottom:10px; border-radius:12px; display:flex; justify-content:space-between; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <div><span style="font-weight:bold; color:#0077b6;">💧 ${formatVolume(log.amount)}</span><br><small>${log.date}</small></div>
            <div><span style="background:#e3f2fd; color:#0077b6; padding:4px 10px; border-radius:20px; font-size:0.8rem;">${log.time}</span></div>
        </div>
    `).join("");
}

function applyLanguage() {
    const translations = {
        so: { stgTitle: "Hagaajinta Xogta", stgSub: "Maamul xogtaada...", lblLang: "Luqadda App-ka", lblUnit: "Cabirka (Units)", lblDanger: "⚠️ Danger Zone" },
        en: { stgTitle: "Data Settings", stgSub: "Manage your personal data.", lblLang: "App Language", lblUnit: "Units", lblDanger: "⚠️ Danger Zone" }
    };
    const t = translations[currentLang] || translations.so;
    if (getEl("stg-title")) getEl("stg-title").textContent = t.stgTitle;
    if (getEl("stg-subtitle")) getEl("stg-subtitle").textContent = t.stgSub;
    if (getEl("lbl-lang")) getEl("lbl-lang").textContent = t.lblLang;
    if (getEl("lbl-unit")) getEl("lbl-unit").textContent = t.lblUnit;
    if (getEl("lbl-danger")) getEl("lbl-danger").textContent = t.lblDanger;
}