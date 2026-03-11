import pypdf
import re
import json

try:
    reader = pypdf.PdfReader('prayer_times.pdf')
    
    # Ratnapura / Kegalle is Zone 11
    target_pages = []
    for page in reader.pages:
        text = str(page.extract_text() or '')
        if 'RATNAPURA' in text.upper() or 'KEGALLE' in text.upper() or 'ZONE: 11' in text.upper() or 'ZONE:11' in text.upper():
            target_pages.append(text)

    monthMap = {
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
    }

    zone_data = {}

    for text in target_pages:
        lines = text.split('\n')
        currentMonth = None
        
        for line in lines:
            line = line.strip()
            if not line: continue
            
            # Detect month
            for m_name, m_idx in monthMap.items():
                if line.upper() == m_name.upper():
                    currentMonth = m_idx
                    if currentMonth not in zone_data:
                        zone_data[currentMonth] = {}
                    break
            
            # Match data row
            # Format: 1-Aug 4:39 AM 6:01 AM 12:15 PM 3:36 PM 6:28 PM...
            match = re.match(r'^(\d+)-([a-zA-Z]+)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)\s+([\d:]+\s+[AP]M)', line)
            if match:
                day = int(match.group(1))
                m_str = match.group(2)
                m_idx = monthMap.get(m_str, currentMonth)
                
                if m_idx is not None:
                    if m_idx not in zone_data:
                        zone_data[m_idx] = {}
                    zone_data[m_idx][day] = {
                        'fajr': match.group(3),
                        'sunrise': match.group(4),
                        'luhr': match.group(5),
                        'asr': match.group(6),
                        'magrib': match.group(7),
                        'isha': match.group(8)
                    }

    # Format output as JS
    with open('ratnapura_prayer_data.js', 'w') as f:
        f.write('const RATNAPURA_PRAYER_DATA = ')
        json.dump(zone_data, f, indent=2)
        f.write(';\n')

    print("Parsed data saved to ratnapura_prayer_data.js")

except Exception as e:
    print("Error:", e)
