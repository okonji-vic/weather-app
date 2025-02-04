console.log("Weather.js script loaded!");

// DOM Elements
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temp");
const weatherType = document.querySelector("#weather");
const submitBtn = document.querySelector("#submit");
const cityInput = document.querySelector("#city");
const weatherIcon = document.querySelector("#icon");
const weatherImage = document.querySelector("#weather-image");
const weatherDescription = document.querySelector("#desc");
const errorText = document.querySelector("#error");

const API_KEY = "f0e679ae70d6f36147e8d6d8563b4f62";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

const { geolocation } = navigator;

// Function to Fetch Weather Data
const getWeather = async (query) => {
    try {
        console.log(`Fetching weather for: ${query}`);
        const response = await fetch(query);
        if (!response.ok) throw new Error("City not found!");
        const data = await response.json();
        console.log("Weather Data:", data);

        // Update UI with weather data
        cityName.textContent = data.name;
        temperature.textContent = `${data.main.temp}°C`;
        weatherDescription.textContent = data.weather[0].description;
        weatherIcon.style.display = "flex";
        weatherIcon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        cityInput.value = "";
        errorText.textContent = "";
    } catch (error) {
        console.error(error.message);
        errorText.textContent = error.message;
    }
};

// Function to Get Weather Data Based on User Input or Location
const showWeather = async () => {
    let query;
    
    if (cityInput.value.trim() !== "") {
        query = `${BASE_URL}q=${cityInput.value}&appid=${API_KEY}&units=metric`;
        await getWeather(query);
    } else if (geolocation) {
        geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            query = `${BASE_URL}lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            await getWeather(query);
        }, (error) => {
            console.error(error.message);
            let errorMessage = "Unable to retrieve your location"; 
            if (error.code === 1) {
                errorMessage = "Please enable location services";
            } else if (error.code === 2) {
                errorMessage = "Location unavailable";
            } else if (error.code === 3) {
                errorMessage = "Request timeout";
            }
            errorText.textContent = errorMessage;
        });
    } else {
        errorText.textContent = "Enter a city name or enable location services.";
    }
};

// Fetch Weather on Page Load Using Geolocation
if (geolocation) {
    geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);
        const query = `${BASE_URL}lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        await getWeather(query);
    }, (error) => {
        console.error(error.message);
        let errorMessage = "Unable to retrieve your location"; 
        if (error.code === 1) {
            errorMessage = "Please enable location services";
        } else if (error.code === 2) {
            errorMessage = "Location unavailable";
        } else if (error.code === 3) {
            errorMessage = "Request timeout";
        }
        errorText.textContent = errorMessage;
    });
}

// Event Listeners
submitBtn.addEventListener("click", showWeather);
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        showWeather();
    }
});
