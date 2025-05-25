 const weatherApiKey = '49f563be3c6d910987f8faaaddb6010f';
    const rapidApiKey = 'bdd3874361msh2e1e187f9decf48p10fc47jsnf7a437c26bf9';

    const cityInput = document.getElementById('city-put');
    const datalist = document.getElementById('city-options');
    let timeInterval = null;

    cityInput.addEventListener('input', async () => {
      const query = cityInput.value.trim();
      datalist.innerHTML = '';

      if (query.length < 2) return;

      try {
        const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=5&namePrefix=${query}`, {
          headers: {
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          },
        });

        const data = await res.json();
        data.data.forEach(city => {
          const option = document.createElement('option');
          option.value = `${city.city}, ${city.countryCode}`;
          datalist.appendChild(option);
        });
      } catch (err) {
        console.error('Lỗi khi lấy gợi ý thành phố:', err);
      }
    });

    document.getElementById('get-weather').addEventListener('click', async () => {
      const city = cityInput.value.trim();
      if (!city) return alert('Vui lòng nhập tên thành phố');

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric&lang=vi`
        );

        if (!res.ok) throw new Error('Không tìm thấy thành phố');

        const data = await res.json();

        document.getElementById('city-name').textContent = data.name;
        document.getElementById('temp').textContent = Math.round(data.main.temp);
        document.getElementById('desc').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = data.main.humidity;

        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const weatherIcon = document.getElementById('weather-icon');
        weatherIcon.src = iconUrl;
        weatherIcon.style.display = 'block';

        const effectBox = document.getElementById('weather-effect');
        const mainWeather = data.weather[0].main.toLowerCase();
        effectBox.className = '';

        const body = document.body;
        if (mainWeather.includes('rain')) {
          effectBox.classList.add('rain');
          body.style.backgroundImage = "url('img/rain.jpg')";
        } else if (mainWeather.includes('snow')) {
          effectBox.classList.add('snow');
          body.style.backgroundImage = "url('img/snow.jpg')";
        } else if (mainWeather.includes('clear')) {
          effectBox.classList.add('sun');
          body.style.backgroundImage = "url('img/sunny.jpg')";
        } else if (mainWeather.includes('cloud')) {
          body.style.backgroundImage = "url('img/cloud.jpg')";
        } else {
          body.style.backgroundImage = "url('img/fog.jpg')";
        }

        const resultBox = document.getElementById('weather-result');
        resultBox.style.opacity = 0;
        setTimeout(() => {
          resultBox.style.opacity = 1;
        }, 100);

        const timezoneOffset = data.timezone;
        clearInterval(timeInterval);
        updateLocalTime(timezoneOffset);
        timeInterval = setInterval(() => updateLocalTime(timezoneOffset), 1000);
      } catch (err) {
        alert(err.message);
      }
    });

    function updateLocalTime(timezoneOffset) {
      const nowUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
      const localTime = new Date(nowUTC.getTime() + timezoneOffset * 1000);
      const formattedTime = localTime.toLocaleTimeString('vi-VN');
      document.getElementById('local-time').textContent = formattedTime;
    }