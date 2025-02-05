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

// weather forecast elements
const weatherForecast = document.querySelector(".weather-forecast");
const forecastContainer = document.querySelector(".forecast-container");
// const forecastTitle = document.querySelector("#forecast-title");
const forecastDescription = document.querySelectorAll(".forecast-desc");
const forecastIcons = document.querySelectorAll(".forecast-icon");
const forecastTemps = document.querySelectorAll(".forecast-temp");
const forecastDates = document.querySelectorAll(".forecast-date");
const forecastDays = document.querySelectorAll(".day");

const API_KEY = "f0e679ae70d6f36147e8d6d8563b4f62";
const BASE_URL2 = "https://api.openweathermap.org/data/2.5/forecast?";

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
        cityName.textContent = data.city.name;
        temperature.textContent = `${data.list[0].main.temp}°C`;
        weatherDescription.textContent = data.list[0].weather[0].description;
        weatherIcon.style.display = "flex";
        weatherIcon.src = `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
        cityInput.value = "";
        errorText.textContent = "";

        // Update forecast UI
        // forecastTitle.textContent = `5-Day Forecast for ${data.city.name}`;
        forecastContainer.style.display = "flex";
        

        for (let i = 1; i <= 4; i++) {
            forecastDays[0].style.display = "none";
            const forecastIndexes = i * 8;
            forecastDescription[i].textContent = data.list[forecastIndexes].weather[0].description;
            forecastIcons[i].src = `http://openweathermap.org/img/w/${data.list[forecastIndexes].weather[0].icon}.png`;
            forecastTemps[i].textContent = `${data.list[forecastIndexes].main.temp}°C`;
            // forecastDays[i].textContent = data.list[forecastIndexes].dt_txt.split(" ")[0];
            forecastDates[i].textContent = new Date(data.list[forecastIndexes].dt_txt).toLocaleDateString("en-US", { weekday: "long" });
        }
    } catch (error) {
        console.error(error.message);
        errorText.textContent = error.message;
    }
};

// Function to Get Weather Data Based on User Input or Location
const showWeather = async () => {
    let query;
    
    if (cityInput.value.trim() !== "") {
        query = `${BASE_URL2}q=${cityInput.value}&appid=${API_KEY}&units=metric`;
        await getWeather(query);
    } else if (geolocation) {
        geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            query = `${BASE_URL2}lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            await getWeather(query);
        }, (error) => {
            console.error(error.message);
            let errorMessage = "Unable to retrieve your location"; 
            if (error.code === 1) {
                errorMessage = "";
            } else if (error.code === 2) {
                errorMessage = "Location unavailable";
            } else if (error.code === 3) {
                errorMessage = "Location retrieval timeout";
            }
            errorText.textContent = errorMessage;
        });
    } else {
        errorText.textContent = "Location services not available";
    }
};

// Event Listener   
submitBtn.addEventListener("click", showWeather);
cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") showWeather();
}
);
// Fetch Weather on Page Load Using Geolocation
if (geolocation) {
    geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude:", latitude, "Longitude:", longitude);
        const query = `${BASE_URL2}lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        await getWeather(query);
    }, (error) => {
        console.error(error.message);
        let errorMessage = "Unable to retrieve your location"; 
        if (error.code === 1) {
            errorMessage = "";
        } else if (error.code === 2) {
            errorMessage = "Location unavailable";
        } else if (error.code === 3) {
            errorMessage = "Location retrieval timeout";
        }
        errorText.textContent = errorMessage;
    });
}


