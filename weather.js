async function fetchWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (!city) {
        alert('Please enter a city name');
        return;
    }
    
    try {
        // First, geocode the city name to get coordinates
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            alert('City not found. Please try another city.');
            return;
        }
        
        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;
        const cityName = location.name;
        const country = location.country || '';
        
        // Now fetch weather data for those coordinates
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        
        // Display the data
        displayWeatherData(weatherData, cityName, country);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Error fetching weather data. Please try again.');
    }
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
}

function displayWeatherData(data, cityName, country) {
    const placeholder = document.querySelector('#weather .api-placeholder');
    const current = data.current;
    const daily = data.daily;
    
    const currentWeather = getWeatherDescription(current.weather_code);
    
    let forecastHtml = '<div class="forecast-grid">';
    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        const maxTemp = daily.temperature_2m_max[i];
        const minTemp = daily.temperature_2m_min[i];
        const date = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const weather = getWeatherDescription(daily.weather_code[i]);
        
        forecastHtml += `
            <div class="forecast-day">
                <div class="forecast-date">${date}</div>
                <div class="forecast-temp">${maxTemp}°C / ${minTemp}°C</div>
                <div class="forecast-condition">${weather}</div>
            </div>
        `;
    }
    forecastHtml += '</div>';
    
    placeholder.innerHTML = `
        <div class="weather-display">
            <div class="current-weather">
                <h2>${cityName}, ${country}</h2>
                <div class="current-temp">${current.temperature_2m}°C</div>
                <div class="current-condition">${currentWeather}</div>
                <div class="weather-details">
                    <div class="detail">
                        <span class="label">Humidity</span>
                        <span class="value">${current.relative_humidity_2m}%</span>
                    </div>
                    <div class="detail">
                        <span class="label">Wind Speed</span>
                        <span class="value">${current.wind_speed_10m} km/h</span>
                    </div>
                </div>
            </div>
            <h3 style="margin-top: 2rem; margin-bottom: 1rem;">5-Day Forecast</h3>
            ${forecastHtml}
        </div>
    `;
}