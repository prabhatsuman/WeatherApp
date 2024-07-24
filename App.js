import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import React from 'react';
import HomePage from './src/components/HomePage';



export default function App() {
  return (
    <View className='flex-1 '>
      <HomePage />
    </View>
  );
}

