/*
 * REST API + JQUERY DEMONSTRATION
 * Open-Meteo is a real public REST API. It supports CORS and needs no API key.
 * The live campus forecast helps members plan travel to in-person club events.
 */
(function ($) {
  "use strict";

  const endpoint = "https://api.open-meteo.com/v1/forecast";
  const weatherLabels = {
    0: ["Clear", "bi-sun"], 1: ["Mainly clear", "bi-sun"], 2: ["Partly cloudy", "bi-cloud-sun"],
    3: ["Overcast", "bi-clouds"], 45: ["Fog", "bi-cloud-fog"], 48: ["Rime fog", "bi-cloud-fog2"],
    51: ["Light drizzle", "bi-cloud-drizzle"], 53: ["Drizzle", "bi-cloud-drizzle"], 55: ["Heavy drizzle", "bi-cloud-rain"],
    61: ["Light rain", "bi-cloud-rain"], 63: ["Rain", "bi-cloud-rain-heavy"], 65: ["Heavy rain", "bi-cloud-rain-heavy"],
    80: ["Rain showers", "bi-cloud-rain-heavy"], 81: ["Rain showers", "bi-cloud-rain-heavy"], 82: ["Heavy showers", "bi-cloud-lightning-rain"],
    95: ["Thunderstorm", "bi-cloud-lightning"], 96: ["Storm with hail", "bi-cloud-lightning-rain"], 99: ["Storm with hail", "bi-cloud-lightning-rain"]
  };

  function labelFor(code) { return weatherLabels[code] || ["Mixed conditions", "bi-cloud"] ; }

  function renderWeather(data, widget) {
    const currentLabel = labelFor(data.current.weather_code);
    const current = $("<div>", { class: "weather-current" }).append(
      $("<div>", { class: "d-flex justify-content-between align-items-center gap-3" }).append(
        $("<div>").append(
          $("<span>", { class: "eyebrow mb-2", text: "Live campus conditions" }),
          $("<div>", { class: "weather-temp", text: `${Math.round(data.current.temperature_2m)}°C` }),
          $("<div>", { class: "text-muted-custom", text: `${currentLabel[0]} · Wind ${Math.round(data.current.wind_speed_10m)} km/h` })
        ),
        $("<i>", { class: `bi ${currentLabel[1]} display-3 text-cyan`, "aria-hidden": "true" })
      )
    );

    const forecast = $("<div>", { class: "forecast-grid" });
    data.daily.time.forEach(function (date, index) {
      const itemLabel = labelFor(data.daily.weather_code[index]);
      const day = new Intl.DateTimeFormat("en-MY", { weekday: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`));
      forecast.append(
        $("<div>", { class: "forecast-day" }).append(
          $("<strong>", { class: "d-block", text: day }),
          $("<i>", { class: `bi ${itemLabel[1]} fs-3 text-cyan d-block my-2`, "aria-hidden": "true" }),
          $("<span>", { class: "small text-muted-custom d-block", text: itemLabel[0] }),
          $("<span>", { class: "small", text: `${Math.round(data.daily.temperature_2m_min[index])}–${Math.round(data.daily.temperature_2m_max[index])}°C · ${data.daily.precipitation_probability_max[index]}% rain` })
        )
      );
    });
    const attribution = $("<p>", { class: "small text-muted-custom px-3 pt-3" }).append(
      document.createTextNode("Live data: "),
      $("<a>", { href: "https://open-meteo.com/", target: "_blank", rel: "noopener", text: "Open-Meteo" }),
      document.createTextNode(" · UTAR Kampar area · Updated on page load")
    );
    widget.empty().append(current, forecast, attribution);
  }

  function loadCampusWeather() {
    $("[data-weather-widget]").each(function () {
      const widget = $(this);
      $.ajax({
        url: endpoint,
        method: "GET",
        dataType: "json",
        timeout: 10000,
        data: {
          latitude: 4.3342,
          longitude: 101.1422,
          current: "temperature_2m,weather_code,wind_speed_10m",
          daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
          timezone: "Asia/Kuala_Lumpur",
          forecast_days: 3
        }
      }).done(function (data) {
        renderWeather(data, widget);
      }).fail(function () {
        widget.html('<div class="p-4"><i class="bi bi-wifi-off fs-2 text-coral" aria-hidden="true"></i><h3 class="mt-3">Live forecast unavailable</h3><p class="text-muted-custom mb-0">Check your internet connection and refresh. No sample weather is substituted for the API response.</p></div>');
      });
    });
  }

  $(loadCampusWeather);
})(jQuery);
