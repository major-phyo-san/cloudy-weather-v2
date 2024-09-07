import { calculateDewpoint } from "./data-calculation-helpers";
import { convertToFriendlyDateTime, getCurrentDateTime, convertToFriendlyDate, getUtcOffset } from "./datetime-helpers";

export async function makeFormattedCurrentWeatherData(currentWeatherResposeData, uviResponseData, aqiResponseData, formatSettings = null)
{
    let dewPoint = await calculateDewpoint(currentWeatherResposeData.main.temp, currentWeatherResposeData.main.humidity);
    let uvIndex = uviResponseData.value;
    let aqIndex = aqiResponseData.list[0].main.aqi;
    switch(aqIndex){
        case 1: aqIndex = aqIndex + ` (Good)`; break;
        case 2: aqIndex = aqIndex + ` (Fair)`; break;
        case 3: aqIndex = aqIndex + ` (Moderate)`; break;
        case 4: aqIndex = aqIndex + ` (Poor)`; break;
        case 5: aqIndex = aqIndex + ` (Very Poor)`; break;
    }

    let offsetedUnixEpoch = parseInt(currentWeatherResposeData.dt) + parseInt(currentWeatherResposeData.timezone);

    let currentWeather = {
        city: currentWeatherResposeData.name,
        temperature: currentWeatherResposeData.main.temp + ' °C',
        temp_min: currentWeatherResposeData.main.temp_min + ' °',
        temp_max: currentWeatherResposeData.main.temp_max + ' °',
        main: currentWeatherResposeData.weather[0].main,
        description: currentWeatherResposeData.weather[0].description,
        feels_like: currentWeatherResposeData.main.feels_like + ' °C',
        updated_on: convertToFriendlyDateTime(getCurrentDateTime(offsetedUnixEpoch * 1000)),
        details: {
            atmosphere: {
                'Real Feel': currentWeatherResposeData.main.feels_like + ' °C',
                'Humidity': currentWeatherResposeData.main.humidity + ' %',
                'Dew Point': dewPoint + ' °C',
                'Cloud Cover': currentWeatherResposeData.clouds.all + ' %',
                'Pressure': currentWeatherResposeData.main.grnd_level + ' hPa',
                'Pressure (Sea level)': currentWeatherResposeData.main.sea_level + ' hPa',                                
            },

            environment: {
                'Visibility': currentWeatherResposeData.visibility + ' m',                
                'Air Quality Index': aqIndex,
                'UV Index': uvIndex,
            },                          
            
            wind: {
                'Speed': currentWeatherResposeData.wind.speed + ' m/s',
                'Direction': degToText(currentWeatherResposeData.wind.deg),
                // 'Gust': currentWeatherResposeData.wind.gust + ' m/s',                                
            },
        }
    };

    if(currentWeatherResposeData.wind.gust){
        currentWeather.details.wind['Gust'] = currentWeatherResposeData.wind.gust + ' m/s';
    }

    if(getDayOrNight(offsetedUnixEpoch * 1000) == 'night'){
        delete currentWeather.details.environment['UV Index'];
    }

    if(currentWeatherResposeData.rain){
        currentWeather.details.rain = {};

        if(currentWeatherResposeData.rain['1h']){
            currentWeather.details.rain['Expected rain volume in 1 hour'] = currentWeatherResposeData.rain['1h'] + ' mm';
        }

        if(currentWeatherResposeData.rain['3h']){
            currentWeather.details.rain['Expected rain volume in 3 hour'] = currentWeatherResposeData.rain['3h'] + ' mm';
        }
    }

    if(currentWeatherResposeData.sow){
        currentWeather.details.snow = {};

        if(currentWeatherResposeData.snow['1h']){
            currentWeather.details.snow['Expected snow volume in 1 hour'] = currentWeatherResposeData.snow['1h'] + ' mm';
        }

        if(currentWeatherResposeData.snow['3h']){
            currentWeather.details.snow['Expected snow volume in 3 hour'] = currentWeatherResposeData.snow['3h'] + ' mm';
        }
    }

    currentWeather.wind_gust_icon = 'measurements/wind-' + getDayOrNight(offsetedUnixEpoch * 1000) + '.svg';
    currentWeather.main_icon = getMainWeatherIcon(offsetedUnixEpoch * 1000, currentWeatherResposeData.weather[0].id, currentWeatherResposeData.clouds.all);
    currentWeather.feels_like_icon = getFeelsLikeIcon(currentWeatherResposeData.main.feels_like);
    currentWeather.wind_direction_icon = directionToWindDirectionIcon(degToText(currentWeatherResposeData.wind.deg));   

    // console.log(currentWeather);
    return currentWeather;
}

export async function makeFormattedWeatherForecastData(forecastResponseData, formatSettings = null)
{
    let forecastWeather = groupForecastsByDate(forecastResponseData.list);
    let offsetSeconds = forecastResponseData.city.timezone;
    forecastWeather[0].date = 'Today';
    forecastWeather[1].date = 'Tomorrow';
    forecastWeather[2].date = convertToFriendlyDate(forecastWeather[2].date);
    forecastWeather[3].date = convertToFriendlyDate(forecastWeather[3].date);
    forecastWeather[4].date = convertToFriendlyDate(forecastWeather[4].date);
    forecastWeather[5].date = convertToFriendlyDate(forecastWeather[5].date);

    forecastWeather.forEach(dayForecasts => {        
        dayForecasts.forecasts.forEach(forecast => {
            let offsetedUnixEpoch = parseInt(forecast.dt) + parseInt(offsetSeconds);

            forecast.time = convertToFriendlyDateTime(getCurrentDateTime(offsetedUnixEpoch * 1000));
            forecast.wind_gust_icon = 'measurements/wind-' + getDayOrNight(offsetedUnixEpoch * 1000) + '.svg';
            forecast.main_icon = getMainWeatherIcon(offsetedUnixEpoch * 1000, forecast.weather[0].id, forecast.clouds.all);
            forecast.feels_like_icon = getFeelsLikeIcon(forecast.main.feels_like);
            forecast.wind_direction_icon = directionToWindDirectionIcon(degToText(forecast.wind.deg));

            forecast.main_text = forecast.weather[0].main;
            forecast.description = forecast.weather[0].description;
            forecast.temperature = forecast.main.temp + ' °C';
            forecast.details = {
                'Feels Like': forecast.main.feels_like + ' °C',
                'Humidity': forecast.main.humidity + ' %',
                'Dew Point': calculateDewpoint(forecast.main.temp, forecast.main.humidity) + ' °C',
                'Cloud Cover': forecast.clouds.all + ' %',
                'Pressure': forecast.main.grnd_level + ' hPa',
                'Pressure (Sea level)': forecast.main.sea_level + ' hPa',
                'Visibility': forecast.visibility + ' m',
                'Wind Speed': forecast.wind.speed + ' m/s',                
                'Gust': forecast.wind.gust + ' m/s',                 
            };

            if(forecast.rain){
                if(forecast.rain['1h']){                    
                    forecast.details['Rain (1Hr vol)'] = forecast.rain['1h'] + ' mm';                    
                }
                if(forecast.rain['3h']){
                    forecast.details['Rain (3Hr vol)'] = forecast.rain['3h'] + ' mm';                    
                }
            }

            if(forecast.snow){
                if(forecast.snow['1h']){                    
                    forecast.details['Snow (1Hr vol)'] = forecast.snow['1h'] + ' mm';                    
                }
                if(forecast.snow['3h']){
                    forecast.details['Snow (3Hr vol)'] = forecast.snow['3h'] + ' mm';                    
                }
            }

            if(forecast.pop){
                forecast.details['Chance of Rain'] = Math.round((forecast.pop * 100) * 100)/100 + ' %';
                forecast.chance_of_rain_icon = 'measurements/umbrella.svg';
            }
        }); 
    });
    return forecastWeather;
}

// Function to group forecasts by date
function groupForecastsByDate(forecasts) {
    const groupedForecasts = [];

    forecasts.forEach(forecast => {
        // Extract the date part from dt_txt
        const date = forecast.dt_txt.split(' ')[0]; // "2024-09-04"

        // Check if there's already a group for this date
        let group = groupedForecasts.find(group => group.date === date);

        if (!group) {
            // Create a new group for this date if it doesn't exist
            group = { date: date, forecasts: [] };
            groupedForecasts.push(group);
        }

        // Add the forecast to the group's forecasts array
        group.forecasts.push(forecast);
    });

    return groupedForecasts;
}

function degToText(deg) {
    if (deg >= 0 && deg <= 22)
        return "North";
    if (deg >= 23 && deg <= 75)
        return "North East";
    if (deg >= 76 && deg <= 112)
        return "East";
    if (deg >= 113 && deg <= 157)
        return "South East";
    if (deg >= 158 && deg <= 201)
        return "South";
    if (deg >= 202 && deg <= 247)
        return "South West";
    if (deg >= 248 && deg <= 292)
        return "West";
    if (deg >= 293 && deg <= 337)
        return "North West";
    if (deg >= 338)
        return "North";
}

function directionToWindDirectionIcon(direction){
    switch(direction){
        case "North": return "wind-directions/wind-north.svg";
        case "East": return "wind-directions/wind-east.svg";
        case "South": return "wind-directions/wind-south.svg";
        case "West": return "wind-directions/wind-west.svg";

        case "North East": return "wind-directions/wind-north-east.svg";
        case "North West": return "wind-directions/wind-north-west.svg";
        case "South East": return "wind-directions/wind-south-east.svg";
        case "South West": return "wind-directions/wind-south-west.svg";

    }
}

function getMainWeatherIcon(unixTimestamp, weatherCode, cloudPercent){
    let dayNight = getDayOrNight(unixTimestamp);
    let weatherIconUrl = ``;
    if(weatherCode>=200 && weatherCode<=232){
        if(weatherCode <= 212){
            weatherIconUrl = "thunderstorm/thunderstorm.svg";
        }
        else if(weatherCode >=212 && weatherCode <230 ){
            weatherIconUrl = `thunderstorm/isolated-scattered-tstorms-${dayNight}.svg`;
        }
        else{
            weatherIconUrl = "thunderstorm/thunderstorm-rain.svg";
        }
    }

    if(weatherCode>=300 && weatherCode<=321){        
        if(weatherCode == 312 || weatherCode == 321){
            weatherIconUrl = "drizzle/drizzle-heavy.svg";
        }
        else{
            weatherIconUrl = "drizzle/drizzle-rain.svg";
        }
    }
    if(weatherCode>=500 && weatherCode<=531){
        if(weatherCode <= 501 ){
            weatherIconUrl = "rain/light-rain.svg";
        }else if((weatherCode > 501 && weatherCode <= 504) || weatherCode == 522){
            weatherIconUrl = "rain/heavy-rain.svg";
        }else if(weatherCode == 511){
            weatherIconUrl = "rain/freezing-rain.svg";
        }else if(weatherCode > 511 && weatherCode <= 521){
            weatherIconUrl = `rain/showers-${dayNight}.svg`;
        }
    }
    if(weatherCode>=600 && weatherCode<=622){
        if(weatherCode == 600){
            weatherIconUrl = `snow/snow.svg`;
        }else if(weatherCode == 601){
            weatherIconUrl = `snow/snow.svg`;
        }else if(weatherCode == 602){
            weatherIconUrl = `snow/heavy-snow.svg`;
        }else if(weatherCode == 611){
            weatherIconUrl = `snow/sleet.svg`;
        }else if(weatherCode == 612){
            weatherIconUrl = `snow/sleet-hail.svg`;
        }else if(weatherCode == 613){
            weatherIconUrl = `snow/sleet-hail.svg`;
        }else if(weatherCode == 615){
            weatherIconUrl = `snow/rain-snow.svg`;
        }else if(weatherCode == 616){
            weatherIconUrl = `snow/rain-snow.svg`;
        }else if(weatherCode == 620){
            weatherIconUrl = `snow/showers-snow.svg`;
        }else if(weatherCode == 621){
            weatherIconUrl = `snow/showers-snow.svg`;
        }else if(weatherCode == 622){
            weatherIconUrl = `snow/showers-snow.svg`;
        }else{

        }
    }
    if(weatherCode>=701 && weatherCode<=781){
        if(weatherCode == 701){
            weatherIconUrl = `misc/mist.svg`;
        }else if(weatherCode == 711){
            weatherIconUrl = `snow/smoke.svg`;
        }else if(weatherCode == 721){
            weatherIconUrl = `misc/haze.svg`;
        }else if(weatherCode == 731){
            weatherIconUrl = `misc/whirl.svg`;
        }else if(weatherCode == 741){
            weatherIconUrl = `misc/fog.svg`;
        }else if(weatherCode == 751){
            weatherIconUrl = `misc/whirl.svg`;
        }else if(weatherCode == 761){
            weatherIconUrl = `misc/dust.svg`;
        }else if(weatherCode == 762){
            weatherIconUrl = `misc/volcano.svg`;
        }else if(weatherCode == 771){
            weatherIconUrl = `misc/mist.svg`;
        }else if(weatherCode == 781){
            weatherIconUrl = `misc/tornado-${dayNight}.svg`;
        }else{

        }
    }
    if(weatherCode == 800){
        weatherIconUrl = `clear/clear-${dayNight}.svg`;
    }
    if(weatherCode>=801 && weatherCode<=804){
        if(weatherCode == 801){
            weatherIconUrl = `clear/mostly-clear-${dayNight}.svg`;
        }else if(weatherCode == 802){
            weatherIconUrl = `cloudy/partly-cloudy-${dayNight}.svg`;
        }else if(weatherCode == 803){
            weatherIconUrl = `cloudy/mostly-cloudy-${dayNight}-1.svg`;
        }else{

        }
    }
    if(weatherCode==804){
        if(cloudPercent<=60)
            weatherIconUrl = "cloudy/overcast-clouds-1.svg";
        if(cloudPercent>60 && cloudPercent<=80)
            weatherIconUrl = "cloudy/overcast-clouds-1.svg";
        if(cloudPercent>80)
            weatherIconUrl = "cloudy/overcast-clouds-1.svg";        
    }

    return weatherIconUrl;
}

function getFeelsLikeIcon(tempC){
    if(tempC <= 20)
        return "measurements/temp-cold.svg";
    if(tempC > 20 && tempC <= 34)
        return "measurements/temp-moderate.svg";
    if(tempC > 34)
        return "measurements/temp-hot.svg";
}

function getDayOrNight(unixTimestamp) {
    const date = new Date(unixTimestamp - (6 * 3600 * 1000)); // Convert Unix timestamp to milliseconds
    const hours = date.getHours(); // Get the hour (0-23)
    
    if (hours >= 6 && hours < 18) {
        return 'day';
    } 
    else {
        return 'night';
    }
}