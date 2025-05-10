const API_KEY = '75a6634d84c1d92832fd880280b383f5'; 
    // Weather condition to emoji mapping
    const weatherIcons = {
      "Clear": "☀",
      "Clouds": "☁",
      "Rain": "🌧",
      "Drizzle": "🌧",
      "Thunderstorm": "⛈",
      "Snow": "❄",
      "Mist": "🌫",
      "Fog": "🌫",
      "Haze": "🌫"
    };

    // Load favourites from localStorage
    let favourites = JSON.parse(localStorage.getItem('favouriteCities')) || [];

    // DOM Elements
    const city1Select = document.getElementById('city1');
    const city2Select = document.getElementById('city2');
    const compareBtn = document.getElementById('compareBtn');
    console.log(compareBtn);
    const weatherDisplay = document.getElementById('weatherDisplay');
    const favouriteCitiesSelect = document.getElementById('favouriteCities');
    const showFavouriteWeatherBtn = document.getElementById('showFavouriteWeather');
    const favouriteWeatherDisplay = document.getElementById('favouriteWeatherDisplay');

    // Fetch weather data from OpenWeatherMap
    async function fetchWeather(city) {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error('City not found or API error');
        }
        const data = await response.json();
        return {
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          condition: data.weather[0].main
        };
      } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
      }
    }

    // Display weather for selected cities
    async function displayWeather() {
      const city1 = city1Select.value;
      const city2 = city2Select.value;
      if (!city1 || !city2 || city1 === city2) {
        weatherDisplay.innerHTML = '<p class="error-message"><b>Please select two different cities</b>.</p>';
        return;
      }

      weatherDisplay.innerHTML = '<p>Loading...</p>';

      const weather1 = await fetchWeather(city1);
      const weather2 = await fetchWeather(city2);

      if (!weather1 || !weather2) {
        weatherDisplay.innerHTML = '<p class="error-message"><b>Failed to fetch weather data. Please check your API key or try again later.</b></p>';
        return;
      }

      weatherDisplay.innerHTML = `
        <div class="weather-card">
          <h1>${city1}</h1>
          <p class="weather-icon">${weatherIcons[weather1.condition] || '🌍'}</p>
          <p class="temp">${weather1.temp}°C</p>
          <p class="condition">${weather1.condition}</p>
          <p class="humidity">Humidity: ${weather1.humidity}%</p>
          <button onclick="saveFavourite('${city1}')">Save to Favourites</button>
        </div>
        <div class="weather-card">
          <h1>${city2}</h1>
          <p class="weather-icon">${weatherIcons[weather2.condition] || '🌍'}</p>
          <p class="temp">${weather2.temp}°C</p>
          <p class="condition">${weather2.condition}</p>
          <p class="humidity">Humidity: ${weather2.humidity}%</p>
          <button onclick="saveFavourite('${city2}')">Save to Favourites</button>
        </div>
      `;
    }

    // Update favourite cities dropdown
    function updateFavouriteCitiesDropdown() {
      favouriteCitiesSelect.innerHTML = '<option value="" disabled selected>Select a favourite city</option>';
      favourites.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        favouriteCitiesSelect.appendChild(option);
      });
    }

    // Save city to favourites
    window.saveFavourite = function(city) {
      if (!favourites.includes(city)) {
        favourites.push(city);
        localStorage.setItem('favouriteCities', JSON.stringify(favourites));
        updateFavouriteCitiesDropdown();
      }
    };

    // Remove city from favourites
    window.removeFavourite = function(city) {
      favourites = favourites.filter(fav => fav !== city);
      localStorage.setItem('favouriteCities', JSON.stringify(favourites));
      updateFavouriteCitiesDropdown();
      favouriteWeatherDisplay.innerHTML = '';
    };

    // Display weather for a favourite city
    async function displayFavouriteWeather() {
      const selectedCity = favouriteCitiesSelect.value;
      if (!selectedCity) {
        favouriteWeatherDisplay.innerHTML = '<p class="error-message">Please select a favourite city.</p>';
        return;
      }

      favouriteWeatherDisplay.innerHTML = '<p>Loading...</p>';

      const weather = await fetchWeather(selectedCity);
      if (!weather) {
        favouriteWeatherDisplay.innerHTML = '<p class="error-message"><b>Failed to fetch weather data. Please check your API key or try again later.</b></p>';
        return;
      }

      favouriteWeatherDisplay.innerHTML = `
        <div class="weather-card">
          <h3>${selectedCity}</h3>
          <p class="weather-icon">${weatherIcons[weather.condition] || '🌍'}</p>
          <p class="temp">${weather.temp}°C</p>
          <p class="condition">${weather.condition}</p>
          <p class="humidity">Humidity: ${weather.humidity}%</p>
          <button class="remove" onclick="removeFavourite('${selectedCity}')">Remove from Favourites</button>
        </div>
      `;
    }

    // Event Listeners
    compareBtn.addEventListener('click', displayWeather);
    showFavouriteWeatherBtn.addEventListener('click', displayFavouriteWeather);

    // Initial load
    updateFavouriteCitiesDropdown();