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

const {geolocation} = navigator;


const getWeather = async (query) => {
    try {
        console.log(`Fetching weather for: ${query}`);
        const response = await fetch(query);
        if (!response.ok) throw new Error("City not found!");
        const data = await response.json();
        console.log("Weather Data:", data);
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

const showWeather = async () => {
        let query;
        if (cityInput.value.trim() !== "") {
            query = `${BASE_URL}q=${cityInput.value}&appid=${API_KEY}&units=metric`;
        } else if (geolocation) {
            geolocation.getCurrentPosition(async (position) => {
                query = `${BASE_URL}lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric`;
                await getWeather(query);
            }, (error) => {
                errorText.textContent = "Geolocation error: " + error.message;
            });
            return;
        } else {
            errorText.textContent = "Enter a city name or enable location services.";
            return;
        }
        await getWeather(query);
    };
    

    geolocation.getCurrentPosition(async (position) => {
        const {latitude, longitude} = position.coords;
        const data = await getWeather(latitude, longitude);
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
    }, (error) => {
        console.error(error.message);
        let errorMessage = "Unable to retrieve your location"; 
        if (error.code === 1) {
            errorMessage = "Please enable location services";
        } else if (error.code === 2) {
            errorMessage = "location unavailable";
        } else if (error.code === 3) {
            errorMessage = "Request timeout";
        }
        errorText.textContent = errorMessage  
    });


submitBtn.addEventListener('click', showWeather);
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        showWeather();
    }
});

// const getWeather = async (city) => {
//     try {
//         console.log(`Fetching weather for: ${city}`);
//         const response = await fetch(`${BASE_URL}q=${city}&appid=${API_KEY}&units=metric`);
//         if (!response.ok) throw new Error("City not found!");
//         const data = await response.json();
//         console.log("Weather Data:", data);
//         return data;
//     } catch (error) {
//         console.error(error.message);
//         errorText.textContent = error.message;
//     }
// };

// const showWeather = async () => {
//     const city = cityInput.value.trim();
    
//     if (!city) {
//         errorText.textContent = "Please enter a city name!";
//         return;
//     }

//     const data = await getWeather(city);
    
//     if (!data || data.cod !== 200) return;

//     console.log(data);
//     cityName.textContent = data.name;
//     temperature.textContent = `${data.main.temp}°C`;
//     // weatherType.textContent = data.weather[0].main;
//     weatherDescription.textContent = data.weather[0].description;
//     weatherIcon.style = "display: flex";
//     weatherIcon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
//     // weatherImage.src = `images/${data.weather[0].main}.jpg`;
//     cityInput.value = "";
//     errorText.textContent = "";

// };

// submitBtn.addEventListener('click', showWeather);
// cityInput.addEventListener("keypress", (event) => {
//     if (event.key === "Enter") {
//         showWeather();
//     }
// });



