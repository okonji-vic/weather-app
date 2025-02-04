console.log("Weather.js script loaded!"); 

const cityName = document.querySelector('#city-name');
const temperature = document.querySelector('#temp');
const weatherType = document.querySelector('#weather');
const submitBtn = document.querySelector('#submit');
const cityInput = document.querySelector('#city');
const weatherIcon = document.querySelector('#icon');
const weatherImage = document.querySelector('#weather-image');
const weatherDescription = document.querySelector('#desc');
const errorText = document.querySelector('#error');

const API_KEY = 'f0e679ae70d6f36147e8d6d8563b4f62';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?';

const getWeather = async (city) => {
    try {
        console.log(`Fetching weather for: ${city}`);
        const response = await fetch(`${BASE_URL}q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) throw new Error("City not found!");
        const data = await response.json();
        console.log("Weather Data:", data);
        return data;
    } catch (error) {
        console.error(error.message);
        errorText.textContent = error.message;
    }
};

const showWeather = async () => {
    const city = cityInput.value.trim();
    
    if (!city) {
        errorText.textContent = "Please enter a city name!";
        return;
    }

    const data = await getWeather(city);
    
    if (!data || data.cod !== 200) return;

    console.log(data);
    cityName.textContent = data.name;
    temperature.textContent = `${data.main.temp}°C`;
    // weatherType.textContent = data.weather[0].main;
    weatherDescription.textContent = data.weather[0].description;
    weatherIcon.style = "display: flex";
    weatherIcon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    // weatherImage.src = `images/${data.weather[0].main}.jpg`;
    cityInput.value = "";
    errorText.textContent = "";

};

submitBtn.addEventListener('click', showWeather);
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        showWeather();
    }
});
