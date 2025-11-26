import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
<<<<<<< HEAD
import MainTabNavigator from "./navigation/MainTabNavigator";
import ProfileScreen from "./screens/ProfileScreen";

import { ThemeProvider } from "./context/ThemeContext";
=======
import Dashboard from "./screens/Dashboard";
import HomeScreen from "./screens/HomeScreen";
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 👇 This ensures every time the app starts, user is logged out
    auth.signOut();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  return (
<<<<<<< HEAD
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // hides white header globally
          }}
        >
          {/* Always start with Login first */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="MainTab" component={MainTabNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
=======
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // hides white header globally
        }}
      >
        {/* Always start with Login first */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
>>>>>>> 85b724112f9d32666a0cdaf94b3243d105cfaa02
