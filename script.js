const key = '4c28ebcdb9f39cd71385868851834310';

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    const phrase = document.querySelector('input[type="text"]').value.trim();
    if (!phrase) return;

    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=1&appid=${key}`);
    const data = await response.json();

    if (data.length === 0) {
        alert('City not found.');
        return;
    }

    const { lat, lon, name } = data[0];

    showWeather(lat, lon, name);

    // Optional: clear suggestions list
    document.querySelector('form ul').innerHTML = '';
});


async function search() {
    const phrase = document.querySelector('input[type="text"]').value;
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${phrase}&limit=5&appid=${key}`);
    const data = await response.json();

    const ul = document.querySelector('form ul');
    ul.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const { name, lat, lon, country } = data[i];
        ul.innerHTML += `<li data-lat="${lat}" data-lon="${lon}" data-name="${name}">
            ${name} <span>${country}</span></li>`;
    }
}

const debouncedSearch = _.debounce(() => { search(); }, 600);

async function showWeather(lat, lon, name) {
    if (!lat || !lon) return;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`);
    const data = await response.json();

    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const icon = data.weather[0].icon;



    document.getElementById('city').innerHTML = name;
    document.getElementById('degree').innerHTML = temp + '&#8451;';
    document.getElementById('feelslikevalue').innerHTML = feelsLike + '<span>&#8451;</span>';
    document.getElementById('windvalue').innerHTML = wind + '<span>km/h</span>';
    document.getElementById('humidityvalue').innerHTML = humidity + '<span>%</span>';
    document.getElementById('icon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    document.getElementById('weather').style.display = 'block';
    document.querySelector('form').style.display = 'none';

    // Save to localStorage
    localStorage.setItem('lat', lat);
    localStorage.setItem('lon', lon);
    localStorage.setItem('name', name);
}

document.querySelector('input[type="text"]').addEventListener('keyup', debouncedSearch);

document.body.addEventListener('click', ev => {
    const li = ev.target.closest('li');
    if (!li) return;

    const { lat, lon, name } = li.dataset;
    if (!lat) return;

    showWeather(lat, lon, name);
});

document.getElementById('change').addEventListener('click', () => {
    document.getElementById('weather').style.display = 'none';
    document.querySelector('form').style.display = 'block';

    // Clear the input box
    document.querySelector('input[type="text"]').value = '';

    // Clear the suggestions list
    document.querySelector('form ul').innerHTML = '';
});


window.onload = () => {
    const lat = localStorage.getItem('lat');
    const lon = localStorage.getItem('lon');
    const name = localStorage.getItem('name');
    if (lat && lon && name) {
        showWeather(lat, lon, name);
    }
};
