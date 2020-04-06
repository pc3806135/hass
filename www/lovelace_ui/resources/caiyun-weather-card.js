class CaiyunWeatherCard extends HTMLElement {

  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = '/local/lovelace_ui/resources/caiyun-weather-card.css';
      card.appendChild(link);
      this.content = document.createElement('div');
      this.content.className = 'card';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const forecast_aqi = function (aqi) {
      var aqi = Math.round(aqi)
      if (aqi < 51){
        aqi = '优 '+ aqi
      } else if ((aqi > 50 && aqi < 101)){
        aqi = '良 '+ aqi
      } else if ((aqi > 100 && aqi < 151)){
        aqi = '轻污染 '+ aqi
      } else if ((aqi > 150 && aqi < 201)){
        aqi = '中污染 '+ aqi
      } else if ((aqi > 200 && aqi < 301)){
        aqi = '重污染 '+ aqi
      } else if ((aqi > 300)){
        aqi = '严重污染 '+ aqi
      }
      return aqi;
    }

    const forecast_azt = function (azt) {
      if (azt < 51){
        var azt='border: .1em solid #27d427;'
      } else if ((azt > 50 && azt < 101)){
        var azt='border: .1em solid #f3c129;'
      } else if ((azt > 100 && azt < 151)){
        var azt='border: .1em solid #ff7200;'
      } else if ((azt > 150 && azt < 201)){
        var azt='border: .1em solid #e30c0c;'
      } else if ((azt > 200 && azt < 301)){
        var azt='background:#d020c2;color:#eee'
      } else if ((azt > 300)){
        var azt='background:#c81f1f;color:#eee'
      }
      return azt;
    }

    const forecast_wash = {
      '适宜': 'border: .1em solid #27d427;',
      '较适宜': 'border: .1em solid #f3c129;',
      '较不适宜': 'border: .1em solid #ff7200;',
      '不适应': 'background:#d020c2;color:#eee',
    }

    const style_state = {
      '晴天': 'border: .1em solid #27d427;',
      '晴夜': 'border: .1em solid #27d427;',
      '日间多云': 'border: .1em solid #f3c129;',
      '夜间多云': 'border: .1em solid #f3c129;',
      '阴': 'border: .1em solid #ff7200;',
      '雨': 'border: .1em solid #e30c0c;',
      '雪': 'background:#d020c2;color:#eee',
      '风': 'border: .1em solid #f3c129;',
      '霾': 'background:#c81f1f;color:#eee',
    }

    const transformDayNight = {
      "below_horizon": "night",
      "above_horizon": "day",
    }

    const sunLocation = transformDayNight[hass.states[this.config.entity_sun].state]

    const weatherIcons = {
      '晴天': 'day',
      '晴夜': 'night',
      '日间多云': 'cloudy-day-3',
      '夜间多云': 'cloudy-night-3',
      '阴': 'cloudy',
      '雨': 'rainy-6',
      '雪': 'snowy-6',
      '风': 'cloudy',
      '霾': 'cloudy',
      '未知': '!!',
    }

    const skyconIcons = {
      'CLEAR_DAY': 'day',
      'CLEAR_NIGHT': 'night',
      'PARTLY_CLOUDY_DAY': 'cloudy-day-3',
      'PARTLY_CLOUDY_NIGHT': 'cloudy-night-3',
      'CLOUDY': 'cloudy',
      'RAIN': 'rainy-6',
      'SNOW': 'snowy-6',
      'WIND': 'cloudy',
      'HAZE': 'cloudy',
    }

    const windDirections = [
      '北风',
      '东北偏北风',
      '东北风',
      '东北偏东风',
      '东风',
      '东南偏东风',
      '东南风',
      '东南偏南风',
      '南风',
      '西南偏南风',
      '西南风',
      '西南偏西风',
      '西风',
      '西北偏西风',
      '西北风',
      '西北偏北风',
      '北风'
    ];

    var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var d = new Date();
    if(d.getDay() == 3){
      var t1=d.getDay()+1;
      var t2=d.getDay()+2;
      var t3=d.getDay()+3;
      var t4=d.getDay()-3;
    }else if(d.getDay() == 4){
      var t1=d.getDay()+1;
      var t2=d.getDay()+2;
      var t3=d.getDay()-4;
      var t4=d.getDay()-3;
    }else if(d.getDay() == 5){
      var t1=d.getDay()+1;
      var t2=d.getDay()-5;
      var t3=d.getDay()-4;
      var t4=d.getDay()-3;
    }else if(d.getDay() == 6){
      var t1=d.getDay()-6;
      var t2=d.getDay()-5;
      var t3=d.getDay()-4;
      var t4=d.getDay()-3;
    }else{
      var t1=d.getDay()+1;
      var t2=d.getDay()+2;
      var t3=d.getDay()+3;
      var t4=d.getDay()+4;
    }

    var forecastDate1 = weekday[t1];
    var forecastDate2 = weekday[t2];
    var forecastDate3 = weekday[t3];
    var forecastDate4 = weekday[t4];

    const title = this.config.title;
    const location = this.config.location;
    const sunObj = hass.states[this.config.entity_sun];
    const currentCondition = hass.states[this.config.entity_current_conditions].state;
    const humidity = hass.states[this.config.entity_humidity].state;
    const pressure = Math.round((hass.states[this.config.entity_pressure].state / 1000) / 100) * 100;
    const precipitation = Math.round(hass.states[this.config.entity_precipitation].state);
    const temperature = Math.round(hass.states[this.config.entity_temperature].state);
    const visibility = hass.states[this.config.entity_visibility].state;
    const windBearing = windDirections[(Math.round((hass.states[this.config.entity_wind_bearing].state / 360) * 16))];
    const windSpeed = Math.round(hass.states[this.config.entity_wind_speed].state);
    const pm25 = hass.states[this.config.entity_now_aqipm25].state;
    const currentAqi = hass.states[this.config.entity_now_air_aqi].state;
    const carWash = hass.states[this.config.entity_carwash].state;
    const tempHigh = Math.round(hass.states[this.config.entity_now_temphigh].state);
    const tempLow = Math.round(hass.states[this.config.entity_now_templow].state);
    var hourly_summary = hass.states[this.config.entity_hourly_summary].state;
    var minutely_summary = hass.states[this.config.entity_minutely_summary].state;
    const forecast1 = { date: forecastDate1,
    				   condition: this.config.entity_forecast_skycon_1,
    				   temphigh: this.config.entity_forecast_temphigh_1,
    				   templow: this.config.entity_forecast_templow_1,
               forecastaqi: this.config.entity_forecast_aqi_1,
               carwash: this.config.entity_forecast_carwash_1,
               precipitation: this.config.entity_forecast_precipitation_1 };
    const forecast2 = { date: forecastDate2,
    				   condition: this.config.entity_forecast_skycon_2,
    				   temphigh: this.config.entity_forecast_temphigh_2,
    				   templow: this.config.entity_forecast_templow_2,
               forecastaqi: this.config.entity_forecast_aqi_2,
               carwash: this.config.entity_forecast_carwash_2,
               precipitation: this.config.entity_forecast_precipitation_2 };
    const forecast3 = { date: forecastDate3,
    				   condition: this.config.entity_forecast_skycon_3,
    				   temphigh: this.config.entity_forecast_temphigh_3,
    				   templow: this.config.entity_forecast_templow_3,
               forecastaqi: this.config.entity_forecast_aqi_3,
               carwash: this.config.entity_forecast_carwash_3,
               precipitation: this.config.entity_forecast_precipitation_3 };
    const forecast4 = { date: forecastDate4,
    				   condition: this.config.entity_forecast_skycon_4,
    				   temphigh: this.config.entity_forecast_temphigh_4,
    				   templow: this.config.entity_forecast_templow_4,
               forecastaqi: this.config.entity_forecast_aqi_4,
               carwash: this.config.entity_forecast_carwash_4,
               precipitation: this.config.entity_forecast_precipitation_4 };

    const forecast_caiyun = [forecast1,forecast2,forecast3,forecast4];

    const sunriseTime = function(time) {
      const sunrise_date = new Date(time);
      return sunrise_date.toLocaleTimeString([],
        { hour:'2-digit', minute:'2-digit' }
      );
    }

    var sunrise_up = (new Date(sunObj.attributes.next_rising)).toTimeString().substring(0,5);
    var sunrise_down = (new Date(sunObj.attributes.next_setting)).toTimeString().substring(0,5);
    var sunrise_day = d.toTimeString().substring(0,5);
    const sunrise_upIcon = function (sunrise) {
      // if (sunrise_day >= sunrise_up && sunrise_day <= sunrise_down){
      //   sunrise = '1'
      // } else if (sunrise_day >= sunrise_down && sunrise_day <= sunrise_up){
      //   sunrise = '2'
      // }
      // return sunrise;
      if (sunrise_day >= sunrise_up){
        sunrise = '明天 '
      } else{
        sunrise = '今天 '
      }
      return sunrise;
    }
    const sunrise_downIcon = function (sunrise) {
      if (sunrise_day >= sunrise_down){
        sunrise = '明天 '
      } else{
        sunrise = '今天 '
      }
      return sunrise;
    }

    var hourly_summary1 = hourly_summary.match(/[^，。]+/);
    var minutely_summary1 = minutely_summary.match(/[^，]+/);
    if (hourly_summary1){
      hourly_summary = hourly_summary1;
    }
    if (minutely_summary1){
      minutely_summary = minutely_summary1
    }

    this.content.innerHTML = `
  <ha-card header="${title}" class="ha-card">
    <div class="card">
          <div class="icon bigger" style="background: none, url(/local/lovelace_ui/images/weather_animated_icons/${weatherIcons[currentCondition]}.svg) no-repeat; background-size: contain;"></div>
          <div class="te">
            <li class="temp">${temperature}<span class="aunit">&#176;</span></li>
            <li class="nowState">${minutely_summary}</li>
            <li>
            <span class="pm25" style='${style_state[currentCondition]}'>${currentCondition} ${tempLow}&#176;~${tempHigh}&#176;</span>
            <span class="pm25" style='${forecast_azt(currentAqi)}'>${forecast_aqi(currentAqi)}</span>
            </li>
              <span class="sunset" style=''>
                  ${sunrise_upIcon()}${sunriseTime(sunObj.attributes.next_rising)}
                  <iron-icon icon="mdi:weather-sunset"></iron-icon>
                  ${sunrise_downIcon()}${sunriseTime(sunObj.attributes.next_setting)}</span>
          </div>
          <div class="variations">
             <iron-icon icon="mdi:compass"></iron-icon>${location}
             <li class="xi1"><iron-icon icon="mdi:periscope"></iron-icon>${pressure} kPa</li>
             <li class="xi0"><iron-icon icon="mdi:blur-radial"></iron-icon>${visibility} km</li>
             <li class="xi0"><iron-icon icon="mdi:weather-windy"></iron-icon>${windSpeed} km/h</li>
          </div>
      <div class="clear">
      	<div class="xi">
          <div class="div-a">
            <iron-icon icon="mdi:progress-check"></iron-icon>${hourly_summary}
            <li><iron-icon icon="mdi:weather-rainy"></iron-icon>降水量：${precipitation}
            <span class="unit">mm/hr</span></li>
            <li><iron-icon icon="mdi:blur"></iron-icon>PM2.5：${pm25}
            <span class="unit">mg/m³</span></li>
          </div>
          <div class="div-b">
            <iron-icon icon="mdi:waves"></iron-icon>${windBearing}
            <li><iron-icon icon="mdi:water-percent"></iron-icon>湿度：${humidity}
            <span class="unit">%</span></li>
            <li><iron-icon icon="mdi:car-wash"></iron-icon>${carWash}</li>
          </div>
        </div>
        <div class="clear2">
            ${forecast_caiyun.map(daily => `
                <div class="day">
                    <span class="dayname">${daily.date}</span>
                    <br><i class="icon" style="background: none, url(/local/lovelace_ui/images/weather_animated_icons/${skyconIcons[hass.states[daily.condition].state]}.svg) no-repeat; background-size: contain;"></i>
                    <br><span class="highTemp">${Math.round(hass.states[daily.temphigh].state * 10) / 10}&#176;/${Math.round(hass.states[daily.templow].state * 10) / 10}&#176;</span>
                    <br><span class="pm25" style='${forecast_azt(hass.states[daily.forecastaqi].state)}'>${forecast_aqi(hass.states[daily.forecastaqi].state)}</span>
                    <br><iron-icon icon="mdi:weather-rainy"></iron-icon><span class="highTemp">${Math.round(hass.states[daily.precipitation].state * 10) / 10}</span><span class="unit">毫米</span>
                    <br><span class="carwash" style='${forecast_wash[hass.states[daily.carwash].state]}'>${hass.states[daily.carwash].state}洗车</span>
                </div>`).join('')}
        </div>
      </div>
    </div>
  </ha-card>
    `;
  }

  setConfig(config) {
    if (!config.entity_sun ||
        !config.entity_hourly_summary ||
        !config.entity_minutely_summary ||
        !config.entity_current_conditions ||
        !config.entity_humidity ||
        !config.entity_pressure ||
        !config.entity_precipitation ||
        !config.entity_temperature ||
        !config.entity_visibility ||
        !config.entity_wind_bearing ||
        !config.entity_wind_speed ||
        !config.entity_now_aqipm25 ||
        !config.entity_now_air_aqi ||
        !config.entity_now_temphigh ||
        !config.entity_now_templow ||
        !config.entity_carwash ) {
      throw new Error('Please define entities');
    }
    this.config = config;
  }

  getCardSize() {
    return 3;
  }

}

customElements.define('caiyun-weather-card', CaiyunWeatherCard);
