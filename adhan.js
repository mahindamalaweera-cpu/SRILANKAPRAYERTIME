(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.adhan = {}));
}(this, (function (exports) {
    'use strict';

    var Coordinates = /** @class */ (function () {
        function Coordinates(latitude, longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }
        return Coordinates;
    }());

    var round = Math.round;
    var floor = Math.floor;
    var ceil = Math.ceil;
    var abs = Math.abs;
    var sin = Math.sin;
    var cos = Math.cos;
    var tan = Math.tan;
    var acos = Math.acos;
    var asin = Math.asin;
    var atan = Math.atan;
    var atan2 = Math.atan2;
    var sqrt = Math.sqrt;
    var degrees = function (radians) {
        return (radians * 180.0) / Math.PI;
    };
    var radians = function (degrees) {
        return (degrees * Math.PI) / 180.0;
    };
    var unwindAngle = function (angle) {
        var normalize = angle % 360.0;
        if (normalize < 0) {
            return 360.0 + normalize;
        }
        return normalize;
    };
    var normalizeToScale = function (num, max) {
        return num - max * floor(num / max);
    };
    var timeComponents = function (time) {
        return {
            hours: floor(time),
            minutes: floor((time - floor(time)) * 60)
        };
    };
    var Astronomical = {
        approximateTransit: function (L, theta0, alpha_o) {
            var Lsw = -1 * radians(L);
            return (alpha_o - theta0 - Lsw) / (2 * Math.PI);
        },
        correctedTransit: function (m0, L, theta0, alpha_o, n, dAlpha) {
            var Lsw = -1 * radians(L);
            var theta = unwindAngle(theta0 + 360.985647 * m0);
            var alpha = unwindAngle(alpha_o + n * m0 + dAlpha * m0); // approx: alpha_o + n * m0
            var H = unwindAngle(theta - Lsw - alpha);
            var dH = H;
            if (H > 180.0) {
                dH = H - 360.0;
            }
            return m0 - dH / 360.0;
        },
        correctedHourAngle: function (m0, h0, coordinates, afterTransit, delta, dDelta, theta0, alpha_o, n, dAlpha) {
            var L = coordinates.latitude;
            var Lsw = -1 * radians(coordinates.longitude);
            var theta = unwindAngle(theta0 + 360.985647 * m0);
            var alpha = unwindAngle(alpha_o + n * m0 + dAlpha * m0); // approx: alpha_o + n * m0
            var H = unwindAngle(theta - Lsw - alpha);
            var dH = H - h0;
            if (!afterTransit && dH > 180.0) {
                dH = dH - 360.0;
            }
            else if (afterTransit && dH < -180.0) {
                dH = dH + 360.0;
            }
            return m0 - dH / 360.0;
        },
        interpolate: function (y2, y1, y3, n) {
            var a = y2 - y1;
            var b = y3 - y2;
            var c = b - a;
            return y2 + (n / 2) * (a + b + n * c);
        },
        interpolateAngles: function (y2, y1, y3, n) {
            var a = unwindAngle(y2 - y1);
            var b = unwindAngle(y3 - y2);
            var c = b - a;
            return y2 + (n / 2) * (a + b + n * c);
        },
        meanSiderealTime: function (julianDay) {
            var T = (julianDay - 2451545.0) / 36525.0;
            return 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + T * T * 0.000387933 - T * T * T / 38710000;
        },
        apparentSiderealTime: function (julianDay, nutationLongitude, epsilon) {
            var theta0 = this.meanSiderealTime(julianDay);
            return unwindAngle(theta0 + nutationLongitude * cos(epsilon));
        },
        solarCoordinates: function (julianDay) {
            var T = (julianDay - 2451545.0) / 36525.0;
            var L0 = unwindAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
            var M = unwindAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
            var e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
            var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(radians(M)) + (0.019993 - 0.000101 * T) * sin(radians(2 * M)) + 0.000289 * sin(radians(3 * M));
            var theta = L0 + C; // true longitude
            var nu = M + C; // true anomaly
            var R = (1.000001018 * (1 - e * e)) / (1 + e * cos(radians(nu)));
            var O = 125.04 - 1934.136 * T;
            var app_L0 = theta - 0.00569 - 0.00478 * sin(radians(O));
            var epsilon0 = 23 + (26 + 21.448 / 60) / 60 - (46.815 / 3600) * T - (0.00059 / 3600) * T * T + (0.001813 / 3600) * T * T * T;
            var epsilon = epsilon0 + 0.00256 * cos(radians(O));
            var rightAscension = degrees(atan2(cos(radians(epsilon)) * sin(radians(app_L0)), cos(radians(app_L0))));
            var declination = degrees(asin(sin(radians(epsilon)) * sin(radians(app_L0))));
            return {
                declination: declination,
                rightAscension: unwindAngle(rightAscension),
                apparentSiderealTime: this.apparentSiderealTime(julianDay, 0.00478 * sin(radians(O)), radians(epsilon))
            };
        },
        altitudeOfSun: function (coordinates, val, julianDay) {
            var solar = this.solarCoordinates(julianDay);
            var declination = radians(solar.declination);
            var rightAscension = radians(solar.rightAscension);
            var L = radians(coordinates.latitude);
            var Lsw = radians(-1 * coordinates.longitude);
            var theta0 = radians(solar.apparentSiderealTime);
            var H = unwindAngle(degrees(theta0 - Lsw - rightAscension));
            var h = radians(H);
            var term1 = sin(L) * sin(declination);
            var term2 = cos(L) * cos(declination) * cos(h);
            return degrees(asin(term1 + term2));
        },
        julianDay: function (year, month, day, hours) {
            if (hours === void 0) { hours = 0; }
            var Y = year;
            var M = month;
            var D = day;
            if (M <= 2) {
                Y -= 1;
                M += 12;
            }
            var A = floor(Y / 100);
            var B = 2 - A + floor(A / 4);
            return floor(365.25 * (Y + 4716)) + floor(30.6001 * (M + 1)) + D + B - 1524.5 + hours / 24;
        },
        julianCentury: function (val) {
            return (val - 2451545.0) / 36525.0;
        },
        seasonAdjustedMorningTwilight: function (latitude, day, year, sunrise) {
            var a = 75 + ((28.65 / 55.0) * abs(latitude));
            var b = 75 + ((19.44 / 55.0) * abs(latitude));
            var c = 75 + ((32.74 / 55.0) * abs(latitude));
            var d = 75 + ((48.10 / 55.0) * abs(latitude));
            var adjustment = 0;
            var dyy = this.daysSinceSolstice(day, year, latitude);
            if (dyy < 91) {
                adjustment = a + (b - a) / 91.0 * dyy;
            }
            else if (dyy < 137) {
                adjustment = b + (c - b) / 46.0 * (dyy - 91);
            }
            else if (dyy < 183) {
                adjustment = c + (d - c) / 46.0 * (dyy - 137);
            }
            else if (dyy < 229) {
                adjustment = d + (c - d) / 46.0 * (dyy - 183);
            }
            else if (dyy < 275) {
                adjustment = c + (b - c) / 46.0 * (dyy - 229);
            }
            else {
                adjustment = b + (a - b) / 91.0 * (dyy - 275);
            }
            return sunrise + (-adjustment * 60.0);
        },
        seasonAdjustedEveningTwilight: function (latitude, day, year, sunset, shawoq) {
            var a = 75 + ((25.60 / 55.0) * abs(latitude));
            var b = 75 + ((2.050 / 55.0) * abs(latitude));
            var c = 75 - ((9.210 / 55.0) * abs(latitude));
            var d = 75 + ((6.140 / 55.0) * abs(latitude));
            var adjustment = 0;
            var dyy = this.daysSinceSolstice(day, year, latitude);
            if (dyy < 91) {
                adjustment = a + (b - a) / 91.0 * dyy;
            }
            else if (dyy < 137) {
                adjustment = b + (c - b) / 46.0 * (dyy - 91);
            }
            else if (dyy < 183) {
                adjustment = c + (d - c) / 46.0 * (dyy - 137);
            }
            else if (dyy < 229) {
                adjustment = d + (c - d) / 46.0 * (dyy - 183);
            }
            else if (dyy < 275) {
                adjustment = c + (b - c) / 46.0 * (dyy - 229);
            }
            else {
                adjustment = b + (a - b) / 91.0 * (dyy - 275);
            }
            if (shawoq === true) {
                adjustment = 0;
            }
            return sunset + (adjustment * 60.0);
        },
        daysSinceSolstice: function (dayOfYear, year, latitude) {
            var daysSinceSolistice = 0;
            var northernOffset = 10;
            var southernOffset = 192; // 172;
            var daysInYear = this.isLeapYear(year) ? 366 : 365;
            if (latitude >= 0) {
                daysSinceSolistice = dayOfYear + northernOffset;
                if (daysSinceSolistice >= daysInYear) {
                    daysSinceSolistice = daysSinceSolistice - daysInYear;
                }
            }
            else {
                daysSinceSolistice = dayOfYear + southernOffset;
                if (daysSinceSolistice >= daysInYear) {
                    daysSinceSolistice = daysSinceSolistice - daysInYear;
                }
            }
            return daysSinceSolistice;
        },
        isLeapYear: function (year) {
            return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        }
    };

    var CalculationMethod = {
        // Muslim World League
        MuslimWorldLeague: function () {
            var params = new CalculationParameters(18, 17);
            params.method = "MuslimWorldLeague";
            return params;
        },
        // Egyptian General Authority of Survey
        Egyptian: function () {
            var params = new CalculationParameters(19.5, 17.5);
            params.method = "Egyptian";
            return params;
        },
        // University of Islamic Sciences, Karachi
        Karachi: function () {
            var params = new CalculationParameters(18, 18);
            params.method = "Karachi";
            return params;
        },
        // Umm al-Qura University, Makkah
        UmmAlQura: function () {
            var params = new CalculationParameters(18.5, 90);
            params.method = "UmmAlQura";
            return params;
        },
        // The Gulf Region
        Dubai: function () {
            var params = new CalculationParameters(18.2, 18.2);
            params.method = "Dubai";
            return params;
        },
        // Moonsighting Committee
        MoonsightingCommittee: function () {
            var params = new CalculationParameters(18, 18);
            params.method = "MoonsightingCommittee";
            return params;
        },
        // North America (ISNA)
        NorthAmerica: function () {
            var params = new CalculationParameters(15, 15);
            params.method = "NorthAmerica";
            return params;
        },
        // Kuwait
        Kuwait: function () {
            var params = new CalculationParameters(18, 17.5);
            params.method = "Kuwait";
            return params;
        },
        // Qatar
        Qatar: function () {
            var params = new CalculationParameters(18, 90);
            params.method = "Qatar";
            return params;
        },
        // Singapore
        Singapore: function () {
            var params = new CalculationParameters(20, 18);
            params.method = "Singapore";
            return params;
        },
        // Institute of Geophysics, University of Tehran
        Tehran: function () {
            var params = new CalculationParameters(17.7, 14);
            params.method = "Tehran";
            return params;
        },
        // Dianet
        Turkey: function () {
            var params = new CalculationParameters(18, 17);
            params.method = "Turkey";
            return params;
        },
        // Other
        Other: function () {
            var params = new CalculationParameters(0, 0);
            params.method = "Other";
            return params;
        }
    };
    // Aliases
    CalculationMethod.IslamicSocietyOfNorthAmerica = CalculationMethod.NorthAmerica;

    var CalculationParameters = /** @class */ (function () {
        function CalculationParameters(fajrAngle, ishaAngle, ishaInterval, method) {
            if (fajrAngle === void 0) { fajrAngle = null; }
            if (ishaAngle === void 0) { ishaAngle = null; }
            if (ishaInterval === void 0) { ishaInterval = 0; }
            if (method === void 0) { method = "Other"; }
            this.method = "Other";
            this.fajrAngle = fajrAngle || 18;
            this.ishaAngle = ishaAngle || 18;
            this.ishaInterval = ishaInterval;
            this.madhab = Madhab.Shafi;
            this.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
            this.adjustments = { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
            this.method = method;
        }
        CalculationParameters.prototype.nightPortions = function () {
            switch (this.highLatitudeRule) {
                case HighLatitudeRule.MiddleOfTheNight:
                    return { fajr: 1 / 2, isha: 1 / 2 };
                case HighLatitudeRule.SeventhOfTheNight:
                    return { fajr: 1 / 7, isha: 1 / 7 };
                case HighLatitudeRule.TwilightAngle:
                    return { fajr: this.fajrAngle / 60, isha: this.ishaAngle / 60 };
                default:
                    throw new Error("Invalid high latitude rule");
            }
        };
        return CalculationParameters;
    }());

    var HighLatitudeRule;
    (function (HighLatitudeRule) {
        HighLatitudeRule[HighLatitudeRule["MiddleOfTheNight"] = 1] = "MiddleOfTheNight";
        HighLatitudeRule[HighLatitudeRule["SeventhOfTheNight"] = 2] = "SeventhOfTheNight";
        HighLatitudeRule[HighLatitudeRule["TwilightAngle"] = 3] = "TwilightAngle";
    })(HighLatitudeRule || (HighLatitudeRule = {}));

    var Madhab;
    (function (Madhab) {
        Madhab[Madhab["Shafi"] = 1] = "Shafi";
        Madhab[Madhab["Hanafi"] = 2] = "Hanafi";
    })(Madhab || (Madhab = {}));

    var PolarCircleResolution;
    (function (PolarCircleResolution) {
        PolarCircleResolution[PolarCircleResolution["AqrabBalad"] = 1] = "AqrabBalad";
        PolarCircleResolution[PolarCircleResolution["AqrabYaum"] = 2] = "AqrabYaum";
        PolarCircleResolution[PolarCircleResolution["Unresolved"] = 3] = "Unresolved";
    })(PolarCircleResolution || (PolarCircleResolution = {}));

    var Prayer = {
        Fajr: "fajr",
        Sunrise: "sunrise",
        Dhuhr: "dhuhr",
        Asr: "asr",
        Maghrib: "maghrib",
        Isha: "isha",
        None: "none"
    };

    var PrayerTimes = /** @class */ (function () {
        function PrayerTimes(coordinates, date, calculationParameters) {
            this.coordinates = coordinates;
            this.date = date;
            this.calculationParameters = calculationParameters;
            this.fajr = new Date(NaN);
            this.sunrise = new Date(NaN);
            this.dhuhr = new Date(NaN);
            this.asr = new Date(NaN);
            this.maghrib = new Date(NaN);
            this.isha = new Date(NaN);
            var solar = Astronomical.solarCoordinates(this.julianDate(date));
            var transit = Astronomical.correctedTransit(solar.apparentSiderealTime, coordinates.longitude, solar.apparentSiderealTime, solar.rightAscension, 1, 0);
            var sunrise = Astronomical.correctedHourAngle(transit, -0.8333, coordinates, false, solar.declination, 0, solar.apparentSiderealTime, solar.rightAscension, 1, 0);
            var sunset = Astronomical.correctedHourAngle(transit, -0.8333, coordinates, true, solar.declination, 0, solar.apparentSiderealTime, solar.rightAscension, 1, 0);
            var asr = this.afternoon(transit, 1, solar.declination, 0, solar.apparentSiderealTime, solar.rightAscension, 1, 0);
            var fajr = Astronomical.correctedHourAngle(transit, -1 * calculationParameters.fajrAngle, coordinates, false, solar.declination, 0, solar.apparentSiderealTime, solar.rightAscension, 1, 0);
            var isha = Astronomical.correctedHourAngle(transit, -1 * calculationParameters.ishaAngle, coordinates, true, solar.declination, 0, solar.apparentSiderealTime, solar.rightAscension, 1, 0);
            var midnight = this.sunPosition(transit + 0.5, 0, solar.apparentSiderealTime, solar.rightAscension, 1, 0);
            this.fajr = this.dateFromJulian(fajr);
            this.sunrise = this.dateFromJulian(sunrise);
            this.dhuhr = this.dateFromJulian(transit + (this.coordinates.longitude / 360));
            this.asr = this.dateFromJulian(asr);
            this.maghrib = this.dateFromJulian(sunset);
            this.isha = this.dateFromJulian(isha);
            if (calculationParameters.ishaInterval > 0) {
                this.isha = new Date(this.maghrib.getTime() + calculationParameters.ishaInterval * 60000);
            }
            // Adjustments
            this.fajr = this.adjustTime(this.fajr, calculationParameters.adjustments.fajr);
            this.sunrise = this.adjustTime(this.sunrise, calculationParameters.adjustments.sunrise);
            this.dhuhr = this.adjustTime(this.dhuhr, calculationParameters.adjustments.dhuhr);
            this.asr = this.adjustTime(this.asr, calculationParameters.adjustments.asr);
            this.maghrib = this.adjustTime(this.maghrib, calculationParameters.adjustments.maghrib);
            this.isha = this.adjustTime(this.isha, calculationParameters.adjustments.isha);
        }
        PrayerTimes.prototype.dateFromJulian = function (julian) {
            var date = new Date(this.date);
            date.setUTCHours(0, 0, 0, 0);
            var hours = (julian + 0.5 - floor(julian + 0.5)) * 24;
            date.setUTCHours(floor(hours), floor((hours - floor(hours)) * 60), floor((hours * 60 - floor(hours * 60)) * 60));
            return date;
        };
        PrayerTimes.prototype.julianDate = function (date) {
            return Astronomical.julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours() + date.getMinutes() / 60);
        };
        PrayerTimes.prototype.adjustTime = function (date, minutes) {
            return new Date(date.getTime() + minutes * 60000);
        };
        PrayerTimes.prototype.afternoon = function (transit, shadowLength, declination, dDelta, theta0, alpha_o, n, dAlpha) {
            var phi = radians(this.coordinates.latitude);
            var delta = radians(declination);
            var H = this.acot(shadowLength + tan(abs(phi - delta)));
            return Astronomical.correctedHourAngle(transit, degrees(H), this.coordinates, true, declination, dDelta, theta0, alpha_o, n, dAlpha);
        };
        PrayerTimes.prototype.sunPosition = function (julian, dDelta, theta0, alpha_o, n, dAlpha) {
            var solar = Astronomical.solarCoordinates(julian);
            var transit = Astronomical.correctedTransit(solar.apparentSiderealTime, this.coordinates.longitude, solar.apparentSiderealTime, solar.rightAscension, 1, 0);
            return transit;
        };
        PrayerTimes.prototype.acot = function (x) {
            return atan(1.0 / x);
        };
        PrayerTimes.prototype.timeForPrayer = function (prayer) {
            if (prayer === Prayer.Fajr) {
                return this.fajr;
            }
            else if (prayer === Prayer.Sunrise) {
                return this.sunrise;
            }
            else if (prayer === Prayer.Dhuhr) {
                return this.dhuhr;
            }
            else if (prayer === Prayer.Asr) {
                return this.asr;
            }
            else if (prayer === Prayer.Maghrib) {
                return this.maghrib;
            }
            else if (prayer === Prayer.Isha) {
                return this.isha;
            }
            else {
                return null;
            }
        };
        PrayerTimes.prototype.nextPrayer = function (date) {
            if (date === void 0) { date = new Date(); }
            if (date.getTime() < this.fajr.getTime()) {
                return Prayer.Fajr;
            }
            else if (date.getTime() < this.sunrise.getTime()) {
                return Prayer.Sunrise;
            }
            else if (date.getTime() < this.dhuhr.getTime()) {
                return Prayer.Dhuhr;
            }
            else if (date.getTime() < this.asr.getTime()) {
                return Prayer.Asr;
            }
            else if (date.getTime() < this.maghrib.getTime()) {
                return Prayer.Maghrib;
            }
            else if (date.getTime() < this.isha.getTime()) {
                return Prayer.Isha;
            }
            else {
                return Prayer.Fajr;
            }
        };
        return PrayerTimes;
    }());

    var SunnahTimes = /** @class */ (function () {
        function SunnahTimes(prayerTimes) {
            var date = prayerTimes.date;
            var nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            var nextDayPrayerTimes = new PrayerTimes(prayerTimes.coordinates, nextDay, prayerTimes.calculationParameters);
            var nightDuration = (nextDayPrayerTimes.fajr.getTime() - prayerTimes.maghrib.getTime()) / 1000;
            this.middleOfTheNight = new Date(prayerTimes.maghrib.getTime() + (nightDuration / 2) * 1000);
            this.lastThirdOfTheNight = new Date(prayerTimes.maghrib.getTime() + (nightDuration * (2 / 3)) * 1000);
        }
        return SunnahTimes;
    }());

    var Qibla = /** @class */ (function () {
        function Qibla(coordinates) {
            this.direction = Qibla.calculate(coordinates);
        }
        Qibla.calculate = function (coordinates) {
            var makkah = new Coordinates(21.4225, 39.8262);
            var term1 = sin(radians(makkah.longitude) - radians(coordinates.longitude));
            var term2 = cos(radians(coordinates.latitude)) * tan(radians(makkah.latitude)) - sin(radians(coordinates.latitude)) * cos(radians(makkah.longitude) - radians(coordinates.longitude));
            var angle = degrees(atan2(term1, term2));
            return unwindAngle(angle);
        };
        return Qibla;
    }());

    exports.Coordinates = Coordinates;
    exports.CalculationMethod = CalculationMethod;
    exports.CalculationParameters = CalculationParameters;
    exports.HighLatitudeRule = HighLatitudeRule;
    exports.Madhab = Madhab;
    exports.PolarCircleResolution = PolarCircleResolution;
    exports.Prayer = Prayer;
    exports.PrayerTimes = PrayerTimes;
    exports.SunnahTimes = SunnahTimes;
    exports.Qibla = Qibla;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
