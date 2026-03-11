[extract_mannar_structured.py](https://github.com/user-attachments/files/25899188/extract_mannar_structured.py)# SRILANKAPRAYERTIME
SRILANKAPRAYERTIME
[index.html](https://github.com/user-attachments/files/25899032/index.html)
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Prayer Times</title>
    <meta name="description" content="International Standard Prayer Times App">
    <meta name="theme-color" content="#0f172a">

    <!-- PWA Manifest -->
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icon-192.png">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">[Uploading extract_mannar_struc[extract_ratnapura_structured.py](https://github.com/user-attachments/files/25899189/extract_ratnapura_structured.py)[extract_kurunegala_structured.py](https://github.com/user-attachments/files/25899250/extract_kurunegala_structured.py)
[extract_kandy_structured.py](https://github.com/user-attachments/files/25899249/extract_kandy_structured.py)
[extract_kandy.py](https://github.com/user-attachments/files/25899248/extract_kandy.py)
[extract_jaffna_structured.py](https://github.com/user-attachments/files/25899225/extract_jaffna_structured.py)
[extract_hambantota_structured.py](https://github.com/user-attachments/files/25899224/extract_hambantota_structured.py)
[extract_batticaloa_structured.py](https://github.com/user-attachments/files/25899223/extract_batticaloa_structured.py)
[extract_badulla_structured.py](https://github.com/user-attachments/files/25899222/extract_badulla_structured.py)
[extract_anuradhapura_structured.py](https://github.com/user-attachments/files/25899221/extract_anuradhapura_structured.py)
[debug_times.js](https://github.com/user-attachments/files/25899219/debug_times.js)
[batticaloa_prayer_data.js](https://github.com/user-attachments/files/25899218/batticaloa_prayer_data.js)
[badulla_prayer_data.js](https://github.com/user-attachments/files/25899217/badulla_prayer_data.js)
[anuradhapura_prayer_data.js](https://github.com/user-attachments/files/25899215/anuradhapura_prayer_data.js)
[adhan.js](https://github.com/user-attachments/files/25899214/adhan.js)
[zone03_prayer_data.js](https://github.com/user-attachments/files/25899213/zone03_prayer_data.js)
[trincomalee_prayer_data.js](https://github.com/user-attachments/files/25899212/trincomalee_prayer_data.js)
[sw.js](https://github.com/user-attachments/files/25899211/sw.js)
[style.css](https://github.com/user-attachments/files/25899210/style.css)
[script.js](https://github.com/user-attachments/files/25899209/script.js)
[ratnapura_prayer_data.js](https://github.com/user-attachments/files/25899208/ratnapura_prayer_data.js)
[prayer_static_data.js](https://github.com/user-attachments/files/25899207/prayer_static_data.js)
[prayer_data.txt](https://github.com/user-attachments/files/25899206/prayer_data.txt)
[prayer_app_mobile.html](https://github.com/user-attachments/files/25899205/prayer_app_mobile.html)
[parse_data.js](https://github.com/user-attachments/files/25899204/parse_data.js)
[mannar_prayer_data.js](https://github.com/user-attachments/files/25899202/mannar_prayer_data.js)
[manifest.json](https://github.com/user-attachments/files/25899201/manifest.json)
[kurunegala_prayer_data.js](https://github.com/user-attachments/files/25899200/kurunegala_prayer_data.js)
[kandy_prayer_data.js](https://github.com/user-attachments/files/25899198/kandy_prayer_data.js)
[kandy_data.txt](https://github.com/user-attachments/files/25899197/kandy_data.txt)
[jaffna_prayer_data.js](https://github.com/user-attachments/files/25899196/jaffna_prayer_data.js)
[index.html](https://github.com/user-attachments/files/25899195/index.html)
[hambantota_prayer_data.js](https://github.com/user-attachments/files/25899194/hambantota_prayer_data.js)
[galle_matara_prayer_data.js](https://github.com/user-attachments/files/25899193/galle_matara_prayer_data.js)
[extract_zone03_structured.py](https://github.com/user-attachments/files/25899192/extract_zone03_structured.py)
[extract_trincomalee_structured.py](https://github.com/user-attachments/files/25899191/extract_trincomalee_structured.py)
tured.py…]()

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="style.css">

    <!-- Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
</head>

<body>

    <div class="app-container">

        <!-- App Header -->
        <header class="app-header">
            <h1 class="district-title">SRILANKA PRAYER TIMES <br> <span class="subtitle" id="dynamic-district-subtitle">District Prayer
                    Times</span></h1>
        </header>

        <!-- Marquee (Hidden initially) -->
        <div id="azan-marquee-container" style="display: none; background: #eab308; color: #000; padding: 10px 0; font-weight: bold; font-size: 1.2rem; text-align: center;">
            <marquee id="azan-marquee-text" scrollamount="8">Ready for Salaha. Prepare for Victory.</marquee>
        </div>

        <!-- Selection Bar -->
        <div class="selection-bar">
            <div class="select-group">
                <label for="month-select">Month</label>
                <select id="month-select" class="form-select">
                    <option value="" disabled selected>Select Month</option>
                    <!-- Populated by JS -->
                </select>
            </div>
            <div class="select-group">
                <label for="date-select">Date</label>
                <select id="date-select" class="form-select" disabled>
                    <option value="" disabled selected>Select Date</option>
                    <!-- Populated by JS -->
                </select>
            </div>
            <div class="select-group">
                <label for="district-select">District</label>
                <select id="district-select" class="form-select" disabled>
                    <option value="" disabled selected>Select District</option>
                    <!-- Populated by JS -->
                </select>
            </div>
        </div>

        <!-- Main Content (Hidden initially) -->
        <div id="main-content" style="display: none;">
            <!-- Hero Section (Visible for Countdown) -->
            <div class="hero-section">
                <div id="date-display" class="date-display">--</div>

                <!-- Dual Hijri Display -->
                <div id="hijri-display" class="hijri-date-container"></div>

                <div class="next-prayer-label">Next Prayer</div>
                <h1 class="next-prayer-name" id="next-prayer-name">--</h1>
                <div class="countdown-timer" id="countdown">--:--:--</div>
            </div>

            <!-- Prayer List -->
            <div class="prayer-list" id="prayer-list">
                <!-- Date Row -->
                <div class="prayer-card date-card">
                    <span class="prayer-name">Date</span>
                    <span class="prayer-time" id="list-date-display">--</span>
                </div>

                <!-- Items -->
                <div class="prayer-card">
                    <span class="prayer-name">Fajr</span>
                    <span class="prayer-time">--:--</span>
                </div>
                <div class="prayer-card">
                    <span class="prayer-name">Sunrise</span>
                    <span class="prayer-time">--:--</span>
                </div>
                <div class="prayer-card">
                    <span class="prayer-name">Luhr</span>
                    <span class="prayer-time">--:--</span>
                </div>
                <div class="prayer-card">
                    <span class="prayer-name">Asr</span>
                    <span class="prayer-time">--:--</span>
                </div>
                <div class="prayer-card">
                    <span class="prayer-name">Magrib</span>
                    <span class="prayer-time">--:--</span>
                </div>
                <div class="prayer-card">
                    <span class="prayer-name">Isha</span>
                    <span class="prayer-time">--:--</span>
                </div>
            </div>

            <!-- Footer Credit -->
            <div style="text-align: center; margin-top: 20px; padding-bottom: 20px; color: var(--text-color); font-size: 0.9rem; opacity: 0.8;">
                Developed and Designed by <strong>ARM INAS</strong>
            </div>

        </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal" id="settings-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Settings</h2>
                <button class="close-btn" id="close-settings">&times;</button>
            </div>

            <!-- Calculation Method hidden/fixed to Sri Lanka Standard -->
            <div class="form-group" style="display:none;">
                <label class="form-label" for="method-select">Calculation Method</label>
                <select id="method-select" class="form-select">
                    <option value="Karachi" selected>Sri Lanka Standard</option>
                </select>
            </div>

            <!-- Madhab hidden/fixed to Sri Lanka Standard (Shafi) -->

            <div class="form-group" style="margin-top: 15px;">
                <label class="form-label" for="manual-sl-hijri">SL Hijri Date (Manual after Mar 20)</label>
                <input type="text" id="manual-sl-hijri" style="background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: 8px; width: 100%; box-sizing: border-box;" placeholder="e.g. Shawwal 1">
            </div>
            <div class="form-group" style="margin-top: 15px; margin-bottom: 20px;">
                <label class="form-label" for="manual-makkah-hijri">Makkah Hijri Date (Manual after Mar 20)</label>
                <input type="text" id="manual-makkah-hijri" style="background: var(--bg-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 0.75rem; border-radius: 8px; width: 100%; box-sizing: border-box;" placeholder="e.g. Shawwal 2">
            </div>

            <button class="btn-primary" id="save-settings">Save Changes</button>
        </div>
    </div>

    <!-- Scripts -->
    <!-- Adhan Library -->
    <!-- Adhan Library -->
    <!-- Adhan Library -->
    <script src="adhan.js"></script>
    <!-- Static Data -->
    <script src="prayer_static_data.js"></script>
    <script src="kandy_prayer_data.js"></script>
    <script src="kurunegala_prayer_data.js"></script>
    <script src="batticaloa_prayer_data.js"></script>
    <script src="mannar_prayer_data.js"></script>
    <script src="anuradhapura_prayer_data.js"></script>
    <script src="badulla_prayer_data.js"></script>
    <script src="ratnapura_prayer_data.js"></script>
    <script src="hambantota_prayer_data.js"></script>
    <script src="galle_matara_prayer_data.js"></script>
    <script src="jaffna_prayer_data.js"></script>
    <script src="zone03_prayer_data.js"></script>
    <script src="trincomalee_prayer_data.js"></script>
    <!-- App Logic -->
    <script src="script.js"></script>
    <!-- App Logic -->
    <script src="script.js"></script>

    <script>
        // Init Icons
        lucide.createIcons();

        // PWA Registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('SW registered'))
                    .catch(err => console.log('SW failed', err));
            });
        }
    </script>
</body>

</html>
