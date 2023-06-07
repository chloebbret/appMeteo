import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = '289d081e6aad70dcf4f5ba28d18f1f45';

const WeatherApp = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (latitude && longitude) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setWeatherData(response.data);
        } catch (error) {
          console.log('Erreur lors de la récupération des données météorologiques:', error);
        }
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  useEffect(() => {
    const fetchForecastData = async () => {
      if (latitude && longitude) {
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setForecastData(response.data.list.slice(0, 5));
        } catch (error) {
          console.log('Erreur lors de la récupération des données de prévision météorologique:', error);
        }
      }
    };

    fetchForecastData();
  }, [latitude, longitude]);

  let content = null;
  if (weatherData) {
    const { name, main } = weatherData;
    const temperature = main.temp;
    content = (
      <View style={styles.content}>
        <View style={styles.topContainer}>
          <Text style={styles.text}>Vous êtes à {name}</Text>
          <Text style={styles.text}>Température actuelle: {temperature}°C</Text>
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.text}>Prévision pour les 5 prochains jours:</Text>
          {forecastData.map((data, index) => (
            <Text key={index} style={[styles.day, styles.text]}>
              Jour {index + 1}: {data.main.temp}°C
            </Text>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#1c628d',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: 'white',
    fontSize: 20,
    marginBottom: 5
  },

  day: {
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#0f3952',
    marginBottom: 10,
  },

  temperatureContainer: {
    flexDirection: 'row',
  },

  topContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 120
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 120
  },
});

export default WeatherApp;