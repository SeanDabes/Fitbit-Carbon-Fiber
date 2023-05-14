import * as cbor from "cbor";
import { me as companion } from "companion";
import { outbox } from "file-transfer";
import { weather, WeatherCondition } from "weather";
import { dataFile, wakeTime } from "../common/constants";
import { findWeatherConditionName } from "../common/utils";

function refreshData() {
  weather
    .getWeatherData()
    .then((data) => {
       if (data.locations.length > 0) {
        sendData({
          temperature: Math.floor(data.locations[0].currentWeather.temperature),
          condition: findWeatherConditionName(WeatherCondition, data.locations[0].currentWeather.weatherCondition),
          conditionCode: data.locations[0].currentWeather.weatherCondition,
          location: data.locations[0].name,
          unit: data.temperatureUnit
        });
		// console.log(`Temperature: ${temperature}, Condition:${condition}(${conditionCode}), Location: ${location}`);
      } else {
        console.warn("No data for this location.")
      }
    })
    .catch((ex) => {
      console.error(ex);
    });
}

function sendData(data) {
  outbox.enqueue(dataFile, cbor.encode(data)).then(ft => {console.log(`Transfer of '${dataFile}' successfully queued.`);
  }).catch(err => {
    throw new Error(`Failed to queue '${dataFile}'. Error: ${err}`);
  }).catch(err => {
  console.error(`Failure: ${err}`);
});
}

if (companion.permissions.granted("access_location")) {
  // Refresh on companion launch
  refreshData();

  // Schedule a refresh every 30 minutes
  companion.wakeInterval = wakeTime;
  companion.addEventListener("wakeinterval", refreshData);

} else {
  console.error("This app requires the access_location permission.");
}