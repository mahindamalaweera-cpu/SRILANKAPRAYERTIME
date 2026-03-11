const adhan = require('./adhan.js');

const coordinates = new adhan.Coordinates(6.9271, 79.8612); // Colombo
const date = new Date(2025, 0, 1); // Jan 1st 2025 (Use 2025 or 2024 to check, user said 1-Jan)
const params = adhan.CalculationMethod.Karachi();
params.madhab = adhan.Madhab.Shafi;
// params.fajrAngle = 18;
// params.ishaAngle = 18;

const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

function format(t) {
    return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Colombo' });
}

console.log('Fajr:', format(prayerTimes.fajr));
console.log('Sunrise:', format(prayerTimes.sunrise));
console.log('Dhuhr:', format(prayerTimes.dhuhr));
console.log('Asr:', format(prayerTimes.asr));
console.log('Maghrib:', format(prayerTimes.maghrib));
console.log('Isha:', format(prayerTimes.isha));
