console.log('I am Carbon Fiber clockface!!');

import { FitFont } from 'fitfont';
import clock from "clock";
import * as document from "document";
import { today, goals } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me as appbit } from "appbit";
import { user } from "user-profile";
import {battery} from "power";
import * as newfile from "./newfile";
import { toFahrenheit } from "../common/utils";
import { units } from "user-settings";

// Update the clock every second
clock.granularity = "seconds";

// Update all elements every tick with the current time
clock.ontick = (evt) => {
  update_clock_date(evt);
  update_steps(evt);
  update_distance(evt);
  update_calories(evt);
  update_activezones(evt);
  update_elevation(evt);
}


const Hour = new FitFont({ 
	id:'Hour',
	font:'Zen_Dots_35',

	// Optional
	halign: 'end',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const TimeSeparator = new FitFont({ 
	id:'TimeSeparator',
	font:'Zen_Dots_35',

	// Optional
	halign: 'middle',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Minutes = new FitFont({ 
	id:'Minutes',
	font:'Zen_Dots_35',

	// Optional
	halign: 'end',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Seconds = new FitFont({ 
	id:'Seconds',
	font:'Zen_Dots_19',

	// Optional
	halign: 'start',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const DayWeek = new FitFont({ 
	id:'DayWeek',
	font:'Zen_Dots_15',

	// Optional
	halign: 'middle',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Day = new FitFont({ 
	id:'Day',
	font:'Zen_Dots_15',

	// Optional
	halign: 'middle',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Month = new FitFont({ 
	id:'Month',
	font:'Zen_Dots_15',

	// Optional
	halign: 'middle',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Year = new FitFont({ 
	id:'Year',
	font:'Zen_Dots_15',

	// Optional
	halign: 'middle',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Steps = new FitFont({ 
	id:'Steps',
	font:'Zen_Dots_19',

	// Optional
	halign: 'start',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Distance = new FitFont({ 
	id:'Distance',
	font:'Zen_Dots_19',

	// Optional
	halign: 'start',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Calories = new FitFont({ 
	id:'Calories',
	font:'Zen_Dots_19',

	// Optional
	halign: 'start',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const ActiveZones = new FitFont({ 
	id:'ActiveZones',
	font:'Zen_Dots_19',

	// Optional
	halign: 'start',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const Elevation = new FitFont({ 
	id:'Elevation',
	font:'Zen_Dots_19',

	// Optional
	halign: 'start',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const HRText = new FitFont({ 
	id:'HRText',
	font:'Zen_Dots_19',

	// Optional
	halign: 'start',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const BatteryText = new FitFont({ 
	id:'BatteryText',
	font:'Zen_Dots_19',

	// Optional
	halign: 'middle',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const WeatherTemp = new FitFont({ 
	id:'WeatherTemp',
	font:'Zen_Dots_19',

	// Optional
	halign: 'middle',            // horizontal alignment : start / middle / end
	valign: 'baseline',         // vertical alignment   : baseline / top / middle / bottom
	letterspacing: 0            // letterspacing...
})
const StepsProgress = document.getElementById("StepsProgress");
const DistanceProgress = document.getElementById("DistanceProgress");
const CaloriesProgress = document.getElementById("CaloriesProgress");
const ActiveZonesProgress = document.getElementById("ActiveZonesProgress");
const ElevationProgress = document.getElementById("ElevationProgress");
const HRrestBar = document.getElementById("HRrestBar");
const HRfatburnBar = document.getElementById("HRfatburnBar");
const HRcardioBar = document.getElementById("HRcardioBar");
const HRpeakBar = document.getElementById("HRpeakBar");
const body = new BodyPresenceSensor();
const heart_rate = new HeartRateSensor();
const BatteryGauge = document.getElementById("BatteryGauge");
const minHand = document.getElementById("minutes");
const minHandShadow = document.getElementById("minutesshadow");
const hourHand = document.getElementById("hours");
const hourHandShadow = document.getElementById("hoursshadow");
const secHand = document.getElementById("seconds");
const secHandShadow = document.getElementById("secondsshadow");
const WeatherIcon = document.getElementById("weathericon");

body.start();
body.addEventListener("reading", () => {
  if (appbit.permissions.granted("access_heart_rate")) {
    if (!body.present) {
      heart_rate.stop();
      no_heart_rate();
    } else {
      heart_rate.start();
    }
  }
  else {
    no_heart_rate();
  }
});

if (appbit.permissions.granted("access_heart_rate")) {
  if (!body.present) {
      heart_rate.stop();
      no_heart_rate();
    } 
  else {
      heart_rate.start();
    }
}
else {
  no_heart_rate();
}

heart_rate.addEventListener("reading", () => {
  update_heart_rate(heart_rate);
});

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

function update_clock_date(evt) {
	let date = new Date();
	let dayweek= date.toString().toUpperCase().slice(0,3);
	let month = date.toString().toUpperCase().slice(4,7);
	let day = date.toString().slice(8,10);
	let year = date.toString().slice(11,15);
	let hour = date.toString().slice(16,18);
	let minutes = date.toString().slice(19,21);
	let seconds = date.toString().slice(22,24);
	
	Hour.text = hour;
	TimeSeparator.text = ":";
	Minutes.text = minutes;
	Seconds.text = seconds;
	DayWeek.text = dayweek;
	Day.text = day;
	Month.text = month;
	Year.text = year;

	hourHand.groupTransform.rotate.angle = hoursToAngle(hour, minutes);
	hourHandShadow.groupTransform.rotate.angle = hoursToAngle(hour, minutes);
	minHand.groupTransform.rotate.angle = minutesToAngle(minutes);
	minHandShadow.groupTransform.rotate.angle = minutesToAngle(minutes);
	secHandShadow.groupTransform.rotate.angle = secondsToAngle(seconds);
	secHand.groupTransform.rotate.angle = secondsToAngle(seconds);

};

function update_steps(evt){
  Steps.text = today.adjusted.steps;
  if (today.adjusted.steps >= goals.steps) {
    StepsProgress.width = 107;
  } else {
    StepsProgress.width = Math.floor((107*today.adjusted.steps)/goals.steps);
  }
}

function update_distance(evt) {
  Distance.text = today.adjusted.distance;
  if (today.adjusted.distance >= goals.distance) {
    DistanceProgress.width = 107;
  } else {
    DistanceProgress.width = Math.floor((107*today.adjusted.distance)/goals.distance);
  }
}

function update_calories(evt) {
  Calories.text = today.adjusted.calories;
  if (today.adjusted.calories >= goals.calories) {
    CaloriesProgress.width = 107;
  } else {
    CaloriesProgress.width = Math.floor((107*today.adjusted.calories)/goals.calories);
  }
}

function update_activezones(evt) {
  ActiveZones.text = today.adjusted.activeZoneMinutes.total;
  if (today.adjusted.activeZoneMinutes.total >= goals.activeZoneMinutes.total) {
    ActiveZonesProgress.width = 107;
  } else {
    ActiveZonesProgress.width = Math.floor((107*today.adjusted.activeZoneMinutes.total)/goals.activeZoneMinutes.total);
  }
}

function update_elevation(evt) {
  Elevation.text = today.adjusted.elevationGain;
  if (today.adjusted.elevationGain >= goals.elevationGain) {
    ElevationProgress.width = 107;
  } else {
    ElevationProgress.width = Math.floor((107*today.adjusted.elevationGain)/goals.elevationGain);
  }
}

function update_heart_rate(heart_rate) {
  HRText.text = heart_rate.heartRate;
  if (user.heartRateZone(heart_rate.heartRate) == "out-of-range") { //resting
    HRrestBar.style.opacity = 1;
    HRfatburnBar.style.opacity = 0.4;
    HRcardioBar.style.opacity = 0.4;
    HRpeakBar.style.opacity = 0.4;
  }
  else if (user.heartRateZone(heart_rate.heartRate) == "fat-burn") { //fat burn
    HRrestBar.style.opacity = 1;
    HRfatburnBar.style.opacity = 1;
    HRcardioBar.style.opacity = 0.4;
    HRpeakBar.style.opacity = 0.4;
  }
  else if (user.heartRateZone(heart_rate.heartRate) == "cardio") { //cardio
    HRrestBar.style.opacity = 1;
    HRfatburnBar.style.opacity = 1;
    HRcardioBar.style.opacity = 1;
    HRpeakBar.style.opacity = 0.4;
  }
  else if (user.heartRateZone(heart_rate.heartRate) == "peak") { // peak
    HRrestBar.style.opacity = 1;
    HRfatburnBar.style.opacity = 1;
    HRcardioBar.style.opacity = 1;
    HRpeakBar.style.opacity = 1;
  }
}

function no_heart_rate() {
  HRText.text = "--";
  HRrestBar.style.opacity = 0.4;
  HRfatburnBar.style.opacity = 0.4;
  HRcardioBar.style.opacity = 0.4;
  HRpeakBar.style.opacity = 0.4;
}

battery.onchange = (charger, evt) => {
  BatteryText.text = `${battery.chargeLevel}`;
  BatteryGauge.width = Math.floor((21*battery.chargeLevel)/100);
  if (battery.chargeLevel <= 20) {
	BatteryText.text = `${battery.chargeLevel}!`;
  }
}

newfile.initialize(data => {
  // fresh weather file received

  // If the user-settings temperature == F and the result data.unit == Celsius then we convert to Fahrenheit
  // Use this only if you use getWeatherData() function without the optional parameter.
  data = units.temperature === "F" ? toFahrenheit(data): data;
  console.log(`It's ${data.temperature}\u00B0 ${data.unit} and ${data.condition} (${data.conditionCode}) in ${data.location}`);
  if (data.unit == "celsius") {
	  let unitshort = "C";
  }
  WeatherTemp.text = `${data.temperature}º${unitshort}`;
  WeatherIcon.href = `weather/${data.condition}.png`;
});