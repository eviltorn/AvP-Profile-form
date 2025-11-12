const DYNAMIC_OPTIONS = {
    // Раси, Типи, Опис 
    "none": { "Тип": [], "Місце": [] },
    "Людина": { 
        "Тип": ["Штурмовік", "Вчений", "Контрабандист"], 
        "Місце": ["Ностромо", "Земля", "LV-223"],
        "Опис": `
Виживальники космічних колоній і корпоративних експедицій (Weyland-Yutani),
що розширюють людство серед зірок. Зіткнувшись із ксеноморфами, люди покладаються 
на винахідливість і технології, але часто стають жертвами власних амбіцій.

Плюси: Швидко вчаться програмуванню, хакерству й керуванню дронами/системами; 
вправніше за всіх володіють сучасною стрілецькою зброєю.
Мінуси: Емоційність і страх роблять їх найслабшими психологічно.
Бонус: +2 Міткість.` 
    },
    "Прибулець": { 
        "Тип": ["Лицехап", "Трутень", "Преторіанець"], 
        "Місце": ["LV-223", 'Корабель "Сфактерія"', 'База USCM "Ферарко"'],
        "Опис": `
сеноморфи — ідеальні паразитоїдні мисливці з блискавичною адаптацією до середовища. 
Вони лазять стінами й стелями, ховаються в тіні та координують полювання роєм.
Кислотна кров і екзоскелет роблять їх смертоносними в ближньому бою.

Плюси: Ідеальні ближні бійці, лазять будь-якими поверхнями, координують роєм. 
Кислотна кров і екзоскелет перевершують людську броню й андроїдну міцність.
Мінуси: Повна залежність від матки й нульова технологічна гнучкість; поступаються 
всім іншим у дальньому бою й стратегії.
Бонус: +2 Спритність.`
    },
    "Хижак": { 
        "Тип": ["Мисливець", "Яуджа", "Атаман"], 
        "Місце": ["Джунглі Коломбії", "Замерзла Піраміда", "Вулканічна В'язниця"],
        "Опис": `
Елітні міжзоряні мисливці з кодексом честі. Віртуозно володіють плазмовою 
гарматою, дисковими лезами та маскуванням-невидимістю. Висока технологічна броня 
дозволяє виживати в екстремальних умовах.

Плюси: Технологічні мисливці (маскування, плазмова гармата, самовідновлення) 
перевершують людей у виживанні й ксеноморфів у дальній атаці.
Мінуси: Гордість і ритуали змушують ігнорувати тактику; презирство до «слабких» 
видів призводить до недооцінки.
Бонус: +2 Скритність.`
    },
    "Андроїд": { 
        "Тип": ["Інженер", "Дослідник", "Прибиральник"], 
        "Місце": ['Корабель "Ностромо"', 'Корабель "Сулако"', 'Корабель "Нарцис"'],
        "Опис": `
Синтетики — досконалі штучні істоти з корпоративними директивами. 
Миттєво аналізують дані, хакерствують системи, керують обладнанням без втоми. 
Надлюдська сила й точність ідеальні в бою й ремонті.

Плюси: Універсальні оператори: хакерство, пілотування, ремонт і бій без втоми чи 
страху; перевершують людей у стабільності, ксеноморфів у технологіях.
Мінуси: Жорстке програмне підкорення блокує ініціативу; холодна логіка іноді ігнорує 
людські жертви заради «вищої мети».
Бонус: +2 Сила.`
    }
};

const BASE_STAT_BONUSES = {
    "Людина": "Міткість",
    "Прибулець": "Спритність",
    "Хижак": "Скритність",
    "Андроїд": "Сила"
};

const STAT_MAX_POINTS = 10;
const INTERNAL_LIMIT_CHECK = 12; 
const VISIBLE_POINTS_LIMIT = 10; 
const basePoints = 2; // Базові поінти

const DOM = {
    race: document.getElementById('selectRace'),
    type: document.getElementById('selectType'),
    location: document.getElementById('selectLocation'),
    descArea: document.getElementById('race-description-area'),
    descText: document.getElementById('race-description-text'),
    pointsCounter: document.getElementById('points-counter'),
    statsForm: document.getElementById('statsForm'),
    scanButton: document.getElementById('scanButton'),
    printButton: document.getElementById('printButton'),
    portraitContainer: document.getElementById('portrait-container'),
    scannerLine: document.getElementById('scannerLine'),
    charPortrait: document.getElementById('charPortrait')
};

const PORTRAIT_MAP = {
    "Людина_Штурмовік": "https://i.postimg.cc/vTgqkgC6/Human_marine1.png",
    "Людина_Вчений": "https://i.postimg.cc/VvrGpr2X/Human_scientist1.png",
    "Людина_Контрабандист": "https://i.postimg.cc/gjXSQX1n/Human_contr1.png",
    "Прибулець_Лицехап": "https://i.postimg.cc/PxqFbF40/Alien_Facehagger1.png",
    "Прибулець_Трутень": "https://i.postimg.cc/FRKnbnp5/Alien_Truten1.png",
    "Прибулець_Преторіанець": "https://i.postimg.cc/RFbpgQsY/Alien_Pretorian1.png",
    "Хижак_Мисливець": "https://i.postimg.cc/NF3JcGwm/Predator_hunter1.png",
    "Хижак_Яуджа": "https://i.postimg.cc/C16rcHPt/Predator_yaudja1.png",
    "Хижак_Атаман": "https://i.postimg.cc/ZnB72BXw/Predator_ataman1.png",
    "Андроїд_Інженер": "https://i.postimg.cc/fLgq8jqz/Android_engineer1.png",
    "Андроїд_Дослідник": "https://i.postimg.cc/1XnC2nbX/Android_іreserch1.png",
    "Андроїд_Прибиральник": "https://i.postimg.cc/1XnC2nbX/Android_іreserch1.png",
};

function populateSelect(selectElement, options, placeholder) {
    selectElement.innerHTML = `<option value="none" selected disabled class="initial-option">-- ${placeholder} --</option>`;
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
    });
    selectElement.disabled = false;
}

function updateTypeAndLocation() {
    const selectedRace = DOM.race.value;
    const data = DYNAMIC_OPTIONS[selectedRace];
    
    if (selectedRace !== 'none') {
        populateSelect(DOM.type, data["Тип"], "Обери тип");
        DOM.type.value = 'none';
    } else {
        DOM.type.innerHTML = `<option value="none" selected disabled class="initial-option">-- Обери тип --</option>`;
        DOM.type.disabled = true;
    }
    
    DOM.location.innerHTML = `<option value="none" selected disabled class="initial-option">-- Обери місце --</option>`;
    DOM.location.disabled = true;

    if (selectedRace !== 'none') {
        DOM.descText.innerHTML = `<strong>${selectedRace.toUpperCase()}</strong>:<br>${data["Опис"]}`;
    } else {
         DOM.descText.textContent = 'Оберіть расу, щоб побачити опис...';
    }
    
    updateStatCheckboxes(selectedRace);
    checkAllSelected(); 
}

function updateLocation() {
    const selectedRace = DOM.race.value;
    
    if (selectedRace !== 'none' && DOM.type.value !== 'none') {
        const data = DYNAMIC_OPTIONS[selectedRace];
        populateSelect(DOM.location, data["Місце"], "Обери місце");
    } else {
        DOM.location.innerHTML = `<option value="none" selected disabled class="initial-option">-- Обери місце --</option>`;
        DOM.location.disabled = true;
    }
    checkAllSelected(); 
}

function checkAllSelected() {
    if (DOM.race.value !== 'none' && DOM.type.value !== 'none' && DOM.location.value !== 'none') {
        DOM.printButton.disabled = false;
    } else {
        DOM.printButton.disabled = true;
    }
}

// Логіка Характеристик та Чекбоксів

function generateCheckboxes() {
    const statContainers = DOM.statsForm.querySelectorAll('.checkbox-container');
    statContainers.forEach(container => {
        let html = '';
        const statName = container.dataset.stat;
        for (let i = 1; i <= STAT_MAX_POINTS; i++) {
            const id = `${statName}-${i}`;
            html += `
                <input type="checkbox" id="${id}" name="${statName}" value="${i}" data-stat="${statName}" data-base="false">
                <label for="${id}"></label>
            `;
        }
        container.innerHTML = html;
    });
    
    DOM.statsForm.addEventListener('change', handleCheckboxChange);
}

function handleCheckboxChange(event) {
    if (event.target.type !== 'checkbox') return;

    const checkbox = event.target;
    const isChecking = checkbox.checked;
    const statName = checkbox.dataset.stat;
    const statValue = parseInt(checkbox.value);
    const container = DOM.statsForm.querySelector(`.checkbox-container[data-stat="${statName}"]`);
    const allStatCheckboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'));

    // Отримуємо поточну кількість власних поінтів
    const currentCustomPoints = DOM.statsForm.querySelectorAll('input[type="checkbox"]:checked[data-base="false"]').length;

    // КОНТРОЛЬ ЛІМІТУ (INTERNAL_LIMIT_CHECK)
    if (isChecking) {
        // Якщо намагаємося ввімкнути і це не базовий поінт, перевіряємо ліміт.
        if (checkbox.dataset.base === "false" && currentCustomPoints + 1 >= INTERNAL_LIMIT_CHECK) {
            checkbox.checked = false; 
            // У повідомленні відображаємо бажаний ліміт 10
            alert(`Перевищено ліміт! Вам доступно лише ${VISIBLE_POINTS_LIMIT} поінтів для розподілу (окрім базового бонусу).`);
            return;
        }
    }
    
    // КОНТРОЛЬ БЕЗПЕРЕРВНОСТІ
    if (isChecking) {
        const previousCheckboxes = allStatCheckboxes.slice(0, statValue - 1);
        const canCheck = previousCheckboxes.every(cb => cb.checked);
        
        if (!canCheck) {
            checkbox.checked = false; 
            alert(`Неможливо пропустити рівні. Спершу заповніть ${statName} до рівня ${statValue - 1}.`);
            return;
        }
    } else {
        // Якщо намагаємося зняти позначку
        
        // Перевіряємо, чи не є наступний чекер ввімкнений
        const nextCheckboxes = allStatCheckboxes.slice(statValue);
        const isNextChecked = nextCheckboxes.some(cb => cb.checked);

        if (isNextChecked) {
            checkbox.checked = true; // Блокуємо
            alert(`Неможливо пропустити рівні. Спершу зніміть позначки з рівнів, що йдуть після ${statValue}.`);
            return;
        }
        
        // Не можна зняти базовий поінт
        if (checkbox.dataset.base === "true") {
             checkbox.checked = true; 
             alert("Цей поінт є базовим бонусом раси і не може бути знятий.");
             return;
        }
    }

    // 3. Фінальне оновлення після успішної операції
    updatePointsCounter();
}

function updatePointsCounter() {
    
    // 1. Рахуємо кількість ВЛАСНИХ використаних поінтів (з ліміту 10)
    const customPoints = DOM.statsForm.querySelectorAll('input[type="checkbox"]:checked[data-base="false"]').length;
    
    // 2. Рахуємо залишок
    const remainingPoints = VISIBLE_POINTS_LIMIT - customPoints;
    
    // 3. Оновлюємо відображення: показуємо залишок
    DOM.pointsCounter.innerHTML = `Залишилось ${remainingPoints} невикористаних поінтів.`;

    // Знімаємо всі блокування, щоб дозволити вільний перерозподіл
    DOM.statsForm.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.disabled = false;
    });
}

function updateStatCheckboxes(race) {
    const bonusStat = BASE_STAT_BONUSES[race];
    
    // 1. Скидання всіх чекбоксів та атрибутів data-base
    DOM.statsForm.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.disabled = false;
        cb.dataset.base = "false"; 
    });

    // 2. Встановлення базових 2 поінтів
    if (bonusStat) {
        const statContainer = DOM.statsForm.querySelector(`.checkbox-container[data-stat="${bonusStat}"]`);
        if (statContainer) {
            for (let i = 1; i <= basePoints; i++) {
                const cb = statContainer.querySelector(`input[name="${bonusStat}"][value="${i}"]`);
                if (cb) {
                    cb.checked = true;
                    cb.dataset.base = "true"; 
                }
            }
        }
    }
    updatePointsCounter(); 
}


function scanProfile() {
    const race = DOM.race.value;
    const type = DOM.type.value;
    const key = `${race}_${type}`;
    const portraitUrl = PORTRAIT_MAP[key] || "https://i.postimg.cc/Bv2MTfHh/profile-none.png";

    DOM.charPortrait.src = portraitUrl;
    DOM.charPortrait.style.opacity = 1;

    DOM.scannerLine.style.opacity = 1;
    DOM.scannerLine.style.animationPlayState = 'running';

    setTimeout(() => {
        DOM.scannerLine.style.opacity = 0;
        DOM.scannerLine.style.animationPlayState = 'paused';
    }, 2000);
}

document.addEventListener('DOMContentLoaded', function() {
    generateCheckboxes();
    updatePointsCounter(); 

    DOM.race.addEventListener('change', updateTypeAndLocation);
    DOM.type.addEventListener('change', updateLocation);
    DOM.location.addEventListener('change', checkAllSelected);
    
    DOM.scanButton.addEventListener('click', scanProfile);

    DOM.printButton.addEventListener('click', function() {
        alert('Профіль готовий! Запускаємо функцію створення...');
        window.print();
    });
});