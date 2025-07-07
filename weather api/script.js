const apiKey = "07204ab1ecca0cb526669efc1c25c72d";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");
const instruction = document.getElementById("instruction");

const message = "Please enter your city 🌍";
let index = 0;

function typeWriter() {
  if (index < message.length) {
    instruction.textContent += message.charAt(index);
    index++;
    setTimeout(typeWriter, 100);
  } else {
    setTimeout(() => {
      instruction.textContent = "";
      index = 0;
      typeWriter();
    }, 1500);
  }
}

typeWriter();

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p>${error.message}</p>`;
    document.body.style.backgroundImage = "url('assets/404.webp')";
    instruction.style.display = "none";
  }
}

function displayWeather(data) {
  const condition = data.weather[0].main;
  let backgroundImage = "";

  switch (condition) {
    case "Clear":
      backgroundImage = "assets/clear.jpg";
      break;
    case "Clouds":
      backgroundImage = "assets/cloud.jpg"; // ✅ Correct: separate clouds image!
      break;
    case "Rain":
      backgroundImage = "assets/rain.jpg";
      break;
    case "Snow":
      backgroundImage = "assets/snow.webp";
      break;
    case "Mist":
    case "Fog": // Some APIs return Fog
      backgroundImage = "assets/mist.webp";
      break;
    default:
      backgroundImage = "assets/clear.jpg";
      break;
  }

  document.body.style.backgroundImage = `url('${backgroundImage}')`;

  instruction.style.display = "none";

  weatherInfo.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p class="condition">${condition}</p>
    <p class="temperature">${Math.round(data.main.temp)}°C</p>
    <div class="extra-info">
      <p class="humidity">💧 ${data.main.humidity}%</p>
      <p class="wind">💨 ${data.wind.speed} m/s</p>
    </div>
  `;
}
