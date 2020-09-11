import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { colors } from './colors';
import Details from './components/Details';
import Units from './components/Units';
import Info from './components/Info';
import Icons from './components/Icons';
import * as Location from 'expo-location';

const API_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?';
const API_KEY = 'e2f03f0c201856c6281e31ebcaa49b22'

export default function App() {

  const [errMessage, setErrMessage] = useState('');
  const [currentWeather, setCurrentWeather] = useState('');
  const [units, setUnits] = useState('metric');

  useEffect(() => {
    loadingLocation()
  }, [])

  async function loadingLocation() {
    try {
      let { status } = await Location.requestPermissionsAsync()
      if (status != 'granted') {
        setErrMessage('Necesitas activar tu localizacion para que funcione la app')
        return
      }
      const location = await Location.getCurrentPositionAsync()
      const { latitude, longitude } = location.coords
      const weatherURL = `${API_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`
      const res = await fetch(weatherURL);
      const result = await res.json()

      if (res.ok) {
        setCurrentWeather(result)
      } else {
        setErrMessage(result.message)
      }
    } catch (err) {
      setErrMessage(err.message);
    }
  }
  if (currentWeather) {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <Units units={Units} setUnits={setUnits} />
          <Icons load={loadingLocation} />
          <Info currentWeather={currentWeather} />
        </View>
        <Details currentWeather={currentWeather} units={units} />
      </View>
    );
  } else if (errorMessage) {
    return (
      <View style={styles.container}>
        <Icons load={loadingLocation} />
        <Text style={{ textAlign: 'center' }}>{errMessage}</Text>
        <StatusBar style="auto" />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
        <StatusBar style="auto" />
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main: {
    justifyContent: 'center',
    flex: 1,
  },
})