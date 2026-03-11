// DOM Elements
const monthSelect = document.getElementById('month-select');
const dateSelect = document.getElementById('date-select');
const districtSelect = document.getElementById('district-select');

// Main Content Sections
const mainContent = document.getElementById('main-content');
const nextPrayerNameEl = document.getElementById('next-prayer-name');
const countdownEl = document.getElementById('countdown');
const dateDisplayEl = document.getElementById('date-display');

// Settings Elements
const settingsModal = document.getElementById('settings-modal');
const openSettingsBtn = document.getElementById('open-settings');
const closeSettingsBtn = document.getElementById('close-settings');
const saveSettingsBtn = document.getElementById('save-settings');

// State
let selectedMonth = null;
let selectedDate = null;
let selectedDistrict = null;
let currentLocation = null; // Will be set from district selection
let currentDayTimes = null; // Store today's times for alert

// Zone Coordinates - Strictly from PDF Zones 01-13
const SRI_LANKA_ZONES = {
    zone01: { lat: 6.9271, lng: 79.8612, name: "Colombo / Gampaha / Kalutara" },
    zone02: { lat: 9.6615, lng: 80.0255, name: "Jaffna / Nallur" },
    zone03: { lat: 9.2671, lng: 80.8142, name: "Mullaitivu / Kilinochchi / Vavuniya" },
    zone04: { lat: 8.9810, lng: 79.9044, name: "Mannar / Puttalam" },
    zone05: { lat: 8.3114, lng: 80.4037, name: "Anuradhapura / Polonnaruwa" },
    zone06: { lat: 7.4818, lng: 80.3609, name: "Kurunegala" },
    zone07: { lat: 7.2906, lng: 80.6337, name: "Kandy / Matale / Nuwara Eliya" },
    zone08: { lat: 7.7310, lng: 81.6747, name: "Batticaloa / Ampara" },
    zone09: { lat: 8.5874, lng: 81.2152, name: "Trincomalee" },
    zone10: { lat: 6.9934, lng: 81.0550, name: "Badulla / Monaragala" },
    zone11: { lat: 6.6939, lng: 80.3982, name: "Ratnapura / Kegalle" },
    zone12: { lat: 6.0535, lng: 80.2210, name: "Galle / Matara" },
    zone13: { lat: 6.1429, lng: 81.1212, name: "Hambantota" }
};

// Static Data Cache
let STATIC_DATA_BY_ZONE = {
    zone01: {},
    zone02: {},
    zone03: {},
    zone04: {},
    zone05: {},
    zone06: {},
    zone07: {},
    zone08: {},
    zone09: {},
    zone10: {},
    zone11: {},
    zone12: {},
    zone13: {}
};

function parseStaticData() {
    if (typeof RAW_PRAYER_DATA !== 'undefined') {
        const lines = RAW_PRAYER_DATA.split(/\r?\n/);
        let currentMonth = null;

        // Map month names to index (0-11)
        const monthMap = {
            'January': 0, 'Jan': 0,
            'February': 1, 'Feb': 1,
            'March': 2, 'Mar': 2,
            'April': 3, 'Apr': 3,
            'May': 4,
            'June': 5, 'Jun': 5,
            'July': 6, 'Jul': 6,
            'August': 7, 'Aug': 7,
            'September': 8, 'Sep': 8, 'Sept': 8,
            'October': 9, 'Oct': 9,
            'November': 10, 'Nov': 10,
            'December': 11, 'Dec': 11
        };

        lines.forEach(line => {
            line = line.trim();
            if (!line) return;

            // Detect Month Headers
            for (const m of Object.keys(monthMap)) {
                if (line.toUpperCase() === m.toUpperCase()) {
                    currentMonth = monthMap[m];
                    if (!STATIC_DATA_BY_ZONE.zone01[currentMonth]) STATIC_DATA_BY_ZONE.zone01[currentMonth] = {};
                    return;
                }
            }

            // Parse Data Rows: "1-Jan 4:54 AM..."
            // Regex: Date Time Time Time Time Time Time
            const match = line.match(/^(\d+)-([A-Za-z]+)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)/);

            if (match) {
                const day = parseInt(match[1]);
                const monthStr = match[2];
                let rowMonthIndex = monthMap[monthStr];
                if (rowMonthIndex === undefined) rowMonthIndex = currentMonth;

                if (rowMonthIndex !== null && rowMonthIndex !== undefined) {
                    if (!STATIC_DATA_BY_ZONE.zone01[rowMonthIndex]) STATIC_DATA_BY_ZONE.zone01[rowMonthIndex] = {};

                    STATIC_DATA_BY_ZONE.zone01[rowMonthIndex][day] = {
                        fajr: match[3],
                        sunrise: match[4],
                        luhr: match[5],
                        asr: match[6],
                        magrib: match[7],
                        isha: match[8]
                    };
                }
            }
        });
    }

    if (typeof KANDY_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone07 = KANDY_PRAYER_DATA;
    }
    
    if (typeof KURUNEGALA_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone06 = KURUNEGALA_PRAYER_DATA;
    }

    if (typeof BATTICALOA_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone08 = BATTICALOA_PRAYER_DATA;
    }
    
    if (typeof MANNAR_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone04 = MANNAR_PRAYER_DATA;
    }
    
    if (typeof ANURADHAPURA_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone05 = ANURADHAPURA_PRAYER_DATA;
    }
    
    if (typeof BADULLA_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone10 = BADULLA_PRAYER_DATA;
    }
    
    if (typeof RATNAPURA_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone11 = RATNAPURA_PRAYER_DATA;
    }
    
    if (typeof TRINCOMALEE_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone09 = TRINCOMALEE_PRAYER_DATA;
    }

    if (typeof HAMBANTOTA_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone13 = HAMBANTOTA_PRAYER_DATA;
    }

    if (typeof GALLE_MATARA_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone12 = GALLE_MATARA_PRAYER_DATA;
    }

    if (typeof JAFFNA_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone02 = JAFFNA_PRAYER_DATA;
    }

    if (typeof ZONE03_PRAYER_DATA !== 'undefined') {
        STATIC_DATA_BY_ZONE.zone03 = ZONE03_PRAYER_DATA;
    }

    console.log("Static Data Parsed:", STATIC_DATA_BY_ZONE);
}

// Initialization
function init() {
    // Parse the PDF data first
    parseStaticData();

    populateMonths();
    populateDistricts();

    // Add Event Listeners
    monthSelect.addEventListener('change', onMonthChange);
    dateSelect.addEventListener('change', onDateChange);
    districtSelect.addEventListener('change', onDistrictChange);

    // Default visibility
    mainContent.style.display = 'none';

    // Settings Modal Listeners
    const slInput = document.getElementById('manual-sl-hijri');
    const makkahInput = document.getElementById('manual-makkah-hijri');
    if (slInput) slInput.value = localStorage.getItem('manualSLHijri') || '';
    if (makkahInput) makkahInput.value = localStorage.getItem('manualMakkahHijri') || '';

    if (openSettingsBtn) openSettingsBtn.addEventListener('click', () => settingsModal.classList.add('open'));
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('open'));
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', () => {
        if (slInput) localStorage.setItem('manualSLHijri', slInput.value);
        if (makkahInput) localStorage.setItem('manualMakkahHijri', makkahInput.value);
        settingsModal.classList.remove('open');
        updatePrayerTimes();
    });

    // Auto-select defaults
    const today = new Date();
    const currentMonthIndex = today.getMonth(); // 0-11

    // Default to February (1) if not in Feb or Mar (2)
    let targetMonth = 1;
    if (currentMonthIndex === 1 || currentMonthIndex === 2) {
        targetMonth = currentMonthIndex;
    }

    // Set Month
    monthSelect.value = targetMonth;
    onMonthChange(); // Trigger date population

    // Set Date
    if (currentMonthIndex === targetMonth) {
        dateSelect.value = today.getDate();
    } else {
        dateSelect.value = 1; // Default to 1st if not current month
    }
    onDateChange(); // Enable district

    // Set District (Fixed to Zone 01)
    districtSelect.value = "zone01";
    onDistrictChange(); // Show data
}

function populateMonths() {
    // Only February and March
    const allowedMonths = [
        { name: "January", value: 0 },
        { name: "February", value: 1 },
        { name: "March", value: 2 },
        { name: "April", value: 3 },
        { name: "May", value: 4 },
        { name: "June", value: 5 },
        { name: "July", value: 6 },
        { name: "August", value: 7 },
        { name: "September", value: 8 },
        { name: "October", value: 9 },
        { name: "November", value: 10 },
        { name: "December", value: 11 }
    ];

    monthSelect.innerHTML = ''; // Clear default
    allowedMonths.forEach(m => {
        const option = document.createElement('option');
        option.value = m.value;
        option.textContent = m.name;
        monthSelect.appendChild(option);
    });
}

function populateDistricts() {
    districtSelect.innerHTML = ''; // Clear default
    // Supported Zones
    const supportedZones = ["zone01", "zone02", "zone03", "zone04", "zone05", "zone06", "zone07", "zone08", "zone09", "zone10", "zone11", "zone12", "zone13"];
    supportedZones.forEach(zoneKey => {
        const data = SRI_LANKA_ZONES[zoneKey];
        if (data) {
            const option = document.createElement('option');
            option.value = zoneKey;
            option.textContent = data.name;
            districtSelect.appendChild(option);
        }
    });
}

function onMonthChange() {
    selectedMonth = parseInt(monthSelect.value);

    // Reset subsequent selections
    dateSelect.innerHTML = '<option value="" disabled selected>Select Date</option>';
    dateSelect.disabled = false;
    districtSelect.value = "";
    districtSelect.disabled = true;
    mainContent.style.display = 'none';

    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        dateSelect.appendChild(option);
    }
}

function onDateChange() {
    selectedDate = parseInt(dateSelect.value);
    districtSelect.disabled = false;

    // If district was already selected (re-selection scenario), update times
    if (districtSelect.value) {
        onDistrictChange();
    }
}

function onDistrictChange() {
    const zoneKey = districtSelect.value;
    if (!zoneKey) return;

    selectedDistrict = zoneKey;
    currentLocation = SRI_LANKA_ZONES[zoneKey];

    updatePrayerTimes();
    mainContent.style.display = 'block';
    
    // Update header subtitle
    const subtitleEl = document.getElementById('dynamic-district-subtitle');
    if (subtitleEl) {
        subtitleEl.textContent = `${currentLocation.name} District Prayer Times`;
    }
}

function updatePrayerTimes() {
    if (typeof adhan === 'undefined') {
        console.error("Adhan library not loaded");
        return;
    }

    const year = new Date().getFullYear();
    const date = new Date(year, selectedMonth, selectedDate);

    // Calculate fallback times
    let params = adhan.CalculationMethod.Karachi();
    params.madhab = adhan.Madhab.Shafi;
    const coordinates = new adhan.Coordinates(currentLocation.lat, currentLocation.lng);
    const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

    // Update DOM
    const listDateEl = document.getElementById('list-date-display');
    const dateOptionsList = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    if (listDateEl) listDateEl.textContent = date.toLocaleDateString('en-GB', dateOptionsList);

    // Check Static Data first
    let times = null;
    const currentZoneStaticData = STATIC_DATA_BY_ZONE[selectedDistrict];

    if (currentZoneStaticData && currentZoneStaticData[selectedMonth] && currentZoneStaticData[selectedMonth][selectedDate]) {
        times = currentZoneStaticData[selectedMonth][selectedDate];
        // console.log("Using Static Data for", date);
    } else {
        // Fallback to calculation
        // console.log("Using Calculation (No Static Data)");
        times = {
            fajr: formatTime(prayerTimes.fajr),
            sunrise: formatTime(prayerTimes.sunrise),
            luhr: formatTime(prayerTimes.dhuhr),
            asr: formatTime(prayerTimes.asr),
            magrib: formatTime(prayerTimes.maghrib),
            isha: formatTime(prayerTimes.isha)
        };
    }

    // Update Global State for Azan Check
    const today = new Date();
    const isToday = (today.getDate() === selectedDate && today.getMonth() === selectedMonth && today.getFullYear() === year);
    if (isToday) {
        currentDayTimes = times;
    } else {
        currentDayTimes = null;
    }

    updatePrayerCard('Fajr', times.fajr);
    updatePrayerCard('Sunrise', times.sunrise);
    updatePrayerCard('Luhr', times.luhr);
    updatePrayerCard('Asr', times.asr);
    updatePrayerCard('Magrib', times.magrib);
    updatePrayerCard('Isha', times.isha);

    // Date Display
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplayEl.textContent = date.toLocaleDateString('en-GB', dateOptions);

    // Hijri Display
    const hijriContainer = document.getElementById('hijri-display');
    if (hijriContainer) {
        hijriContainer.innerHTML = getHijriHTML(date);
    }

    // Next Prayer / Countdown
    if (isToday && times) {
        // Use Static Data for Next Prayer
        const nextPrayer = getNextPrayerStatic(times, date);

        if (nextPrayer) {
            nextPrayerNameEl.textContent = nextPrayer.name;
            startCountdown(nextPrayer.time);
        } else {
            nextPrayerNameEl.textContent = "Isha Done";
            countdownEl.textContent = "--:--:--";
            stopCountdown();
        }
    } else {
        // Not today or no data
        nextPrayerNameEl.textContent = isToday ? "Loading..." : "Future/Past Date";
        countdownEl.textContent = "";
        stopCountdown();
    }
}

function getNextPrayerStatic(times, dateBase) {
    const now = new Date();
    const prayerOrder = ['fajr', 'sunrise', 'luhr', 'asr', 'magrib', 'isha'];
    const displayNames = {
        'fajr': 'Fajr', 'sunrise': 'Sunrise', 'luhr': 'Luhr',
        'asr': 'Asr', 'magrib': 'Magrib', 'isha': 'Isha'
    };

    for (const p of prayerOrder) {
        const timeStr = times[p];
        if (!timeStr) continue;

        const pDate = parseTimeString(timeStr, dateBase);
        if (pDate > now) {
            return { name: displayNames[p], time: pDate };
        }
    }

    // If all passed, get tomorrow's Fajr
    const tomorrow = new Date(dateBase);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let nextFajrTimeStr = null;
    let nextFajrDate = null;
    
    const tmrwMonth = tomorrow.getMonth();
    const tmrwDate = tomorrow.getDate();
    const zoneData = STATIC_DATA_BY_ZONE[selectedDistrict];

    if (zoneData && zoneData[tmrwMonth] && zoneData[tmrwMonth][tmrwDate]) {
        nextFajrTimeStr = zoneData[tmrwMonth][tmrwDate].fajr;
        nextFajrDate = parseTimeString(nextFajrTimeStr, tomorrow);
    } else {
        // Fallback calculation for tomorrow
        let params = adhan.CalculationMethod.Karachi();
        params.madhab = adhan.Madhab.Shafi;
        const coordinates = new adhan.Coordinates(currentLocation.lat, currentLocation.lng);
        const tp = new adhan.PrayerTimes(coordinates, tomorrow, params);
        nextFajrDate = tp.fajr;
    }

    return { name: 'Fajr', time: nextFajrDate };
}

function parseTimeString(timeStr, dateBase) {
    // Expects "5:10 AM"
    const parts = timeStr.match(/(\d+):(\d+)\s+([AP]M)/);
    if (!parts) return new Date(dateBase.getTime()); // Fallback

    let hours = parseInt(parts[1]);
    const minutes = parseInt(parts[2]);
    const period = parts[3];

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const d = new Date(dateBase);
    d.setHours(hours, minutes, 0, 0);
    return d;
}

function updatePrayerCard(name, time) {
    // Helper to find card by name text
    const cards = document.querySelectorAll('.prayer-card');
    cards.forEach(card => {
        const titleEl = card.querySelector('.prayer-name');
        if (titleEl && titleEl.textContent === name) {
            // Time can be string (Static) or Date object (Calc)
            let displayTime = time;
            if (time instanceof Date) {
                displayTime = formatTime(time);
            }
            card.querySelector('.prayer-time').textContent = displayTime;
        }
    });
}


function getHijriHTML(date) {
    // Anchor: Feb 19, 2026
    // SL: Feb 19 = Ramadan 1
    // Makkah: Feb 19 = Ramadan 2

    // Create anchor date (Feb 19, 2026) at midnight
    const anchor = new Date(2026, 1, 19); // Month is 0-indexed (1 = Feb)
    anchor.setHours(0, 0, 0, 0);

    // Clone input date to avoid mutation and set to midnight
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    // Manual Hijri Date configuration for March 21, 2026 onwards (After March 20)
    const manualStart = new Date(2026, 2, 21); // Month is 0-indexed (2 = March)
    manualStart.setHours(0, 0, 0, 0);

    if (target >= manualStart) {
        const manualSL = localStorage.getItem('manualSLHijri');
        const manualMakkah = localStorage.getItem('manualMakkahHijri');
        
        // If they enter nothing, just leave it blank/space
        const slDisplay = manualSL ? manualSL : '&nbsp;';
        const makkahDisplay = manualMakkah ? manualMakkah : '&nbsp;';

        return `
            <div class="hijri-row">
                <span class="hijri-icon">🇱🇰</span>
                <span class="hijri-text">${slDisplay}</span>
            </div>
            <div class="hijri-row">
                <span class="hijri-icon">🕋</span>
                <span class="hijri-text">${makkahDisplay}</span>
            </div>
        `;
    }

    // valid calculation?
    const diffTime = target - anchor;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const slDay = 1 + diffDays;
    const makkahDay = 2 + diffDays;

    return `
        <div class="hijri-row">
            <span class="hijri-icon">🇱🇰</span>
            <span class="hijri-text">${formatHijriText(slDay)}</span>
        </div>
        <div class="hijri-row">
            <span class="hijri-icon">🕋</span>
            <span class="hijri-text">${formatHijriText(makkahDay)}</span>
        </div>
    `;
}

function formatHijriText(day) {
    if (day > 0 && day <= 30) {
        return `Ramadan ${day}`;
    } else if (day <= 0) {
        // Simple fallback for pre-Ramadan
        return `Shaban ${30 + day}`;
    } else {
        // Post Ramadan
        return `Shawwal ${day - 30}`;
    }
}


function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

let countdownInterval;

function startCountdown(targetTime) {
    stopCountdown();

    function tick() {
        const now = new Date();
        const diff = targetTime - now;

        if (diff <= 0) {
            stopCountdown();
            // In a real app, we'd trigger a refresh or 'Now It's Time'
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    tick();
    countdownInterval = setInterval(tick, 1000);
}

function stopCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
}


// Azan Checker Loop
setInterval(() => {
    const marqueeContainer = document.getElementById('azan-marquee-container');
    const marqueeText = document.getElementById('azan-marquee-text');
    if (!currentDayTimes || !marqueeContainer || !marqueeText) return;

    const now = new Date();
    const currentFormatted = formatTime(now); // "05:10 AM"

    // Check all prayers
    const prayers = ['fajr', 'sunrise', 'luhr', 'asr', 'magrib', 'isha'];
    let isAzanTime = false;
    let azanName = "";

    for (const p of prayers) {
        const pTime = currentDayTimes[p]; // e.g., "5:10 AM"
        if (!pTime) continue;

        if (normalizeTime(pTime) === normalizeTime(currentFormatted)) {
            isAzanTime = true;
            azanName = p.charAt(0).toUpperCase() + p.slice(1);
            break;
        }
    }

    if (isAzanTime) {
        marqueeContainer.style.display = 'block';
        marqueeText.textContent = `It is now time for ${azanName}. Prepare for Victory.`;
    } else {
        marqueeContainer.style.display = 'none';
    }
}, 1000);

function normalizeTime(t) {
    // Converts "05:10 AM" -> "5:10 AM", "5:10 AM" -> "5:10 AM"
    // Just remove leading zero from hour if present
    return t.replace(/^0/, '');
}


// Start
init();
