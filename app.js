const populationName = document.querySelector("#first_variable");
const temperatureName = document.querySelector("#second_variable");
const humidityName = document.querySelector("#third_variable");
const foodName = document.querySelector("#fourth_variable");
const moodName = document.querySelector("#fifth_variable");

const populationDisplay = document.querySelector("#first_variable .response1");
const temperatureDisplay = document.querySelector("#second_variable .response1");
const humidityDisplay = document.querySelector("#third_variable .response1");
const foodDisplay = document.querySelector("#fourth_variable .response1");
const moodDisplay = document.querySelector("#fifth_variable .response1");

const moreTempButton = document.querySelector("#more_temperature");
const lessTempButton = document.querySelector("#less_temperature");
const moreHumidButton = document.querySelector("#more_humidity");
const lessHumidButton = document.querySelector("#less_humidity");
const moreFoodButton = document.querySelector("#more_food");
const lessFoodButton = document.querySelector("#less_food");

const generalConditionDisplay = document.querySelector("#general_condition .response2");
const alertMessageDisplay = document.querySelector("#message_alert .response3");

const onButton = document.querySelector("#power_button");
const pauseButton = document.querySelector("#pause_button");
const offButton = document.querySelector("#off_button");

const themeButton = document.querySelector("#theme_button");
const field = document.querySelector("#bacteria_field");

//---------------------Main-Mood-------------------//

let temperature = 18;
let humidity = 50;
let food = 1;
let mood = "neutral";

let messageStatus = "";
let alertStatus = "";

let lifeBegins = false;
let isPaused = false;
let systemTimer = null;

//-----------------------------------------------//
let bacteria = [];

function resetLabels() {
    populationName.childNodes[0].textContent = "1st variable: ";
    temperatureName.childNodes[0].textContent = "2nd variable: ";
    humidityName.childNodes[0].textContent = "3rd variable: ";
    foodName.childNodes[0].textContent = "4th variable: ";
    moodName.childNodes[0].textContent = "5th variable: ";

    populationDisplay.textContent = "";
    temperatureDisplay.textContent = "";
    humidityDisplay.textContent = "";
    foodDisplay.textContent = "";
    moodDisplay.textContent = "";

    generalConditionDisplay.textContent = "";
    alertMessageDisplay.textContent = "";
}

function realNames() {
    populationName.childNodes[0].textContent = "Population: ";
    temperatureName.childNodes[0].textContent = "Temperature: ";
    humidityName.childNodes[0].textContent = "Humidity: ";
    foodName.childNodes[0].textContent = "Food: ";
    moodName.childNodes[0].textContent = "Mood: ";
}

function updateUI() {
    populationDisplay.textContent = bacteria.length;
    temperatureDisplay.textContent = temperature + " °C";
    humidityDisplay.textContent = humidity + " %";
    foodDisplay.textContent = food.toFixed(1);
    moodDisplay.textContent = mood;

    generalConditionDisplay.textContent = messageStatus;
    alertMessageDisplay.textContent = alertStatus;
}

function evaluateHealth() {
    let stress = 0;

    if (temperature < 10 || temperature > 45) stress += 3;
    else if (temperature < 25 || temperature > 38) stress += 1;

    if (humidity < 30) stress += 2;
    else if (humidity < 40) stress += 1;

    if (food <= 0) stress += 3;
    else if (food < 0.3) stress += 2;
    else if (food < 1) stress += 1;

    if (stress >= 5) {
        mood = "dead";
        messageStatus = "Critical failure. Culture collapsed.";
        alertStatus = "Extinction detected.";
    } else if (stress >= 3) {
        mood = "critical";
        messageStatus = "Severe physiological stress.";
        alertStatus = "High mortality risk.";
    } else if (stress >= 1) {
        mood = "stressed";
        messageStatus = "Suboptimal conditions.";
        alertStatus = "Reduced growth.";
    } else {
        mood = "healthy";
        messageStatus = "Culture thriving.";
        alertStatus = "No risk detected.";
    }
}

function randomInterval() {
    return Math.random() * 4000 + 4000;
}

function systemTick() {
    if (!lifeBegins || isPaused) return;

    temperature += Math.random() > 0.5 ? 1 : -1;
    humidity += Math.random() > 0.5 ? 1 : -1;

    evaluateHealth();

    if (mood === "healthy" && food > 0.2) {
        createBacteria();
        food -= 0.3;
    }

    if (mood === "critical") removeBacteria(2);
    if (mood === "dead") clearAllBacteria();

    if (food < 0) food = 0;

    updateUI();
    systemTimer = setTimeout(systemTick, randomInterval());
}

onButton.onclick = () => {
    if (lifeBegins) return;

    lifeBegins = true;
    isPaused = false;

    realNames();
    clearAllBacteria();

    for (let i = 0; i < 10; i++) createBacteria();

    evaluateHealth();
    updateUI();

    moveBacteria();
    systemTick();
};

pauseButton.onclick = () => {
    if (!lifeBegins) return;
    isPaused = !isPaused;
    alertStatus = isPaused ? "System paused." : "System resumed.";
    updateUI();
};

offButton.onclick = () => {
    lifeBegins = false;
    isPaused = false;
    clearTimeout(systemTimer);

    temperature = 18;
    humidity = 50;
    food = 1;
    mood = "neutral";
    messageStatus = "";
    alertStatus = "";

    clearAllBacteria();
    resetLabels();
};

moreTempButton.onclick = () => {
    if (!lifeBegins) return;
    temperature++;
    evaluateHealth();
    updateUI();
};

lessTempButton.onclick = () => {
    if (!lifeBegins) return;
    temperature--;
    evaluateHealth();
    updateUI();
};

moreHumidButton.onclick = () => {
    if (!lifeBegins) return;
    humidity++;
    evaluateHealth();
    updateUI();
};

lessHumidButton.onclick = () => {
    if (!lifeBegins) return;
    humidity--;
    evaluateHealth();
    updateUI();
};

moreFoodButton.onclick = () => {
    if (!lifeBegins) return;
    food += 0.5;
    evaluateHealth();
    updateUI();
};

lessFoodButton.onclick = () => {
    if (!lifeBegins) return;
    food = Math.max(0, food - 0.5);
    evaluateHealth();
    updateUI();
};

const themes = ["theme-original", "theme-lab", "theme-coquette"];
let currentThemeIndex = 0;
document.body.classList.add(themes[currentThemeIndex]);

themeButton.onclick = () => {
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);
};

function fieldBounds() {
    return {
        width: field.clientWidth - 12,
        height: field.clientHeight - 12
    };
}

function createBacteria() {
    const { width, height } = fieldBounds();
    const el = document.createElement("div");

    el.className = "bacteria " + mood;
    field.appendChild(el);

    bacteria.push({
        el,
        x: Math.random() * width,
        y: Math.random() * height,
        dx: Math.random() * 1.2 - 0.6,
        dy: Math.random() * 1.2 - 0.6
    });
}

function removeBacteria(n = 1) {
    for (let i = 0; i < n && bacteria.length; i++) {
        bacteria.shift().el.remove();
    }
}

function clearAllBacteria() {
    bacteria.forEach(b => b.el.remove());
    bacteria = [];
}

function updateBacteriaState() {
    bacteria.forEach(b => {
        b.el.className = "bacteria " + mood;
    });
}

function moveBacteria() {
    const { width, height } = fieldBounds();

    bacteria.forEach(b => {
        b.x += b.dx;
        b.y += b.dy;

        if (b.x <= 0 || b.x >= width) b.dx *= -1;
        if (b.y <= 0 || b.y >= height) b.dy *= -1;

        b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    });

    requestAnimationFrame(moveBacteria);
}

setInterval(updateBacteriaState, 1000);

resetLabels();