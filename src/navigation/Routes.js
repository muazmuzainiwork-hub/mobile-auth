import React from "react";
import { ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../AuthContext";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import { colors } from "../theme/colors";
import { s } from "../styles/styles";

const Stack = createNativeStackNavigator();

export default function Routes() {
  const { user, ready } = useAuth();
  if (!ready)
    return (
      <SafeAreaView style={[s.safe, { justifyContent: "center" }]}>
        <ActivityIndicator
          size="large"
          color={colors.green}
          accessibilityLabel="Restoring session"
        />
      </SafeAreaView>
    );
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.cream },
        }}
      >
        {user ? (
          <Stack.Screen name="Home" component={Home} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
