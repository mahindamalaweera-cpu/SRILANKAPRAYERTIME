const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'prayer_data.txt');
const outputFile = path.join(__dirname, 'prayer_static_data.js');

const rawText = fs.readFileSync(inputFile, 'utf8');
const lines = rawText.split(/\r?\n/);

const data = {};
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

    // Detect Month Headers (simple heuristic)
    const lower = line.toLowerCase();
    for (const m of Object.keys(monthMap)) {
        if (line.toUpperCase() === m.toUpperCase() && line.length > 2) {
            currentMonth = monthMap[m];
            if (!data[currentMonth]) data[currentMonth] = {};
        }
    }

    // Parse Data Rows: "1-Jan 4:54 AM 6:17 AM ..."
    // Regex for: Date Time Time Time Time Time Time
    const match = line.match(/^(\d+)-([A-Za-z]+)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)/);

    if (match) {
        const day = parseInt(match[1]);
        const monthStr = match[2];
        const monthIndex = monthMap[monthStr] !== undefined ? monthMap[monthStr] : currentMonth;

        // Ensure month bucket exists
        if (!data[monthIndex]) data[monthIndex] = {};

        data[monthIndex][day] = {
            fajr: match[3],
            sunrise: match[4],
            luhr: match[5],
            asr: match[6],
            magrib: match[7],
            isha: match[8]
        };
    }
});

const outputContent = `const STATIC_PRAYER_DATA = ${JSON.stringify(data, null, 2)};`;

fs.writeFileSync(outputFile, outputContent);
console.log('Parsed data written to prayer_static_data.js');
