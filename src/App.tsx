import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loader from "./components/Loader/Loader";
import "./index.css";

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [background, setBackground] = useState<string>("/images/sunny.jpeg");
  const [loading, setLoading] = useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const getBackgroundImage = (weatherCode: number) => {
    // Map weather codes to your downloaded images
    switch (weatherCode) {
      case 0: // Clear sky
      case 1: // Mainly clear
        return "/images/sunny.jpeg";
      case 2: // Partly cloudy
      case 3: // Overcast
        return "/images/cloudy.jpeg";
      case 61: // Rain
        return "/images/rainy.jpeg";
      case 71: // Snow
        return "/images/snowy.jpeg";
      default:
        return "/images/sunny.jpeg"; // fallback image
    }
  };

  const fetchCoordinates = async (city: string) => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude,
      };
    }
    throw new Error("City not found");
  };

  const handleSearch = async (city: string) => {
    setLoading(true);
    setWeatherData(null);
    setError(null); // reset previous errors

    setTimeout(async () => {
      try {
        const { latitude, longitude } = await fetchCoordinates(city);
        console.log(latitude, "latitude");

        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        );
        const data = await response.json();

        if (data.current_weather) {
          setWeatherData({
            city,
            ...data.current_weather,
          });

          const bg = getBackgroundImage(data.current_weather.weathercode);
          setBackground(bg);
        } else {
          setWeatherData(null);
          setError("City not found. Please try again.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
        console.error(err);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleCloseCard = () => {
    setWeatherData(null);
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <div className="overlay app-container">
        <div className="content search-container">
          <SearchBar onSearch={handleSearch} />
        </div>
        {loading && (
          // <div className="loader">
          <Loader />
          // </div>
        )}
        {weatherData?.temperature !== undefined && !loading && (
          <WeatherCard data={weatherData} onClose={handleCloseCard} />
        )}
        {error && (
          <div className="error-card">
            <p>{error}</p>
            <button onClick={() => setError(null)}>✖️</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
