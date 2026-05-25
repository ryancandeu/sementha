import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Home } from '../screens/Home';
import { Login } from '../screens/Login';
import { Register } from '../screens/Register';
import { ForgotPassword } from '../screens/ForgotPassword';
import { NewPlant } from '../screens/NewPlant';
import { MyPlants } from '../screens/MyPlants';
import { PlantDetails } from '../screens/PlantDetails';
import { EditPlant } from '../screens/EditPlant';
import { Tasks } from '../screens/Tasks';
import { Profile } from '../screens/Profile';

const Stack = createNativeStackNavigator();

export function AppRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="NewPlant" component={NewPlant} />
      <Stack.Screen name="MyPlants" component={MyPlants} />
      <Stack.Screen name="PlantDetails" component={PlantDetails} />
      <Stack.Screen name="EditPlant" component={EditPlant} />
      <Stack.Screen name="Tasks" component={Tasks} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
}