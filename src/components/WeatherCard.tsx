import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface WeatherCardProps {
  data: {
    city: string;
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  onClose: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, onClose }) => {
  useEffect(() => {}, []);
  if (!data || !data.temperature) return null;

  return (
    <div className="weather-card">
      <button className="close-btn" onClick={onClose}>
        <FaTimes />
      </button>
      <h2 className="city">{data.city}</h2>
      <p className="temperature">{data.temperature}°C</p>
      <p className="windspeed">Wind: {data.windspeed} km/h</p>
    </div>
  );
};

export default WeatherCard;
