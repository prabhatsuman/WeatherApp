import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import * as Location from "expo-location";
import {
  API_KEY,
  getGeneralizedCategory,
  getBackgroundColor
} from "../constants/constants"; // Import the necessary functions

const HomePage = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [location, setLocation] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [minTemperature, setMinTemperature] = useState(null);
  const [maxTemperature, setMaxTemperature] = useState(null);
  const [condition, setCondition] = useState(null);
  const [generalizedCondition, setGeneralizedCondition] = useState(null);
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [errorMsg, setErrorMsg] = useState(null);

  // Function to get current day in 3-letter format
  const getCurrentDay = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[new Date().getDay()];
  };

  // Fetch user's current location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      // Fetch city, country name, temperature, and min/max temperatures from the latitude and longitude
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${loc.coords.latitude},${loc.coords.longitude}&days=1`
      );
      const data = await response.json();
      setSelectedCity({
        name: data.location.name,
        country: data.location.country,
      });
      setTemperature(Math.floor(data.current.temp_c)); // Set temperature in Celsius and floor the value
      setCondition(data.current.condition.text);

      const category = getGeneralizedCategory(data.current.condition.code);
      setGeneralizedCondition(category);
      setBgColor(getBackgroundColor(category, data.current.is_day === 1));

      setMinTemperature(Math.floor(data.forecast.forecastday[0].day.mintemp_c));
      setMaxTemperature(Math.floor(data.forecast.forecastday[0].day.maxtemp_c));
    })();
  }, []);

  const handleSearch = useCallback(
    _.debounce(async (searchQuery) => {
      if (searchQuery) {
        const response = await fetch(
          `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${searchQuery}`
        );
        const results = await response.json();
        setFilteredCities(results);
      } else {
        setFilteredCities([]);
      }
    }, 300),
    []
  );

  const handleQueryChange = (text) => {
    setQuery(text);
    handleSearch(text);
  };

  const handleSelectCity = async (city) => {
    setSelectedCity(city);
    setQuery("");
    setFilteredCities([]);
    setIsSearching(false);

    // Fetch temperature and min/max temperatures for the selected city
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city.name}&days=1`
    );
    const data = await response.json();
    setTemperature(Math.floor(data.current.temp_c)); // Set temperature in Celsius and floor the value
    setCondition(data.current.condition.text);

    const category = getGeneralizedCategory(data.current.condition.code);
    setGeneralizedCondition(category);
    setBgColor(getBackgroundColor(category, data.current.is_day === 1));

    setMinTemperature(Math.floor(data.forecast.forecastday[0].day.mintemp_c));
    setMaxTemperature(Math.floor(data.forecast.forecastday[0].day.maxtemp_c));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: bgColor, paddingTop: 16, paddingHorizontal: 16 }}>
      <View className="flex-1 top-16">
        <View style={{ height: "7%" }} className="z-50">
          <View
            className={`flex-row justify-end items-center mb-4 rounded-full ${
              isSearching ? "bg-white" : "transparent"
            }`}
          >
            {isSearching && (
              <TextInput
                className={`flex-1 p-2 pl-6 bg-white rounded-full`}
                placeholder="Type city name"
                value={query}
                onChangeText={handleQueryChange}
              />
            )}
            <TouchableOpacity
              onPress={() => setIsSearching(!isSearching)}
              className="rounded-full p-2 bg-slate-200"
            >
              <FontAwesomeIcon icon={faSearch} size={24} className="text-black" />
            </TouchableOpacity>
          </View>
          {isSearching && query.length > 1 && (
            <View className="absolute w-full top-12 bg-white rounded-3xl">
              {filteredCities.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    handleSelectCity({ name: item.name, country: item.country })
                  }
                  className="p-2 border-b border-gray-200"
                >
                  <Text className="text-lg">
                    {item.name}, {item.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {selectedCity && (
          <View className="pl-4 flex-1">
            <View className="mt-6">
              <Text className="text-4xl text-white font-bold">
                {selectedCity.name}
              </Text>
              <Text className="text-lg text-white font-semibold">
                {selectedCity.country}
              </Text>
            </View>
            {temperature !== null && (
              <View className="top-32 ">
                <View className="flex-row items-center">
                  <Text className="text-8xl text-white">{temperature}</Text>
                  <View className="flex-col pl-1">
                    <Text className="text-7xl pt-1 text-white">{"\u00B0"}</Text>
                    <View className="bottom-7">
                      {condition && (
                        <Text className={`text-2xl text-white`}>{generalizedCondition}</Text>
                      )}
                    </View>
                  </View>
                </View>
                <View className="flex-row bottom-6">
                  <Text className="text-lg text-white">{getCurrentDay()}&nbsp;</Text>
                  {minTemperature !== null && maxTemperature !== null && (
                    <View className="flex-row justify-between w-32">
                      <Text className="text-lg text-white">
                        {maxTemperature}°/{minTemperature}°
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
        {errorMsg && (
          <View className="mt-6 p-4">
            <Text className="text-lg text-red-500">{errorMsg}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default HomePage;
