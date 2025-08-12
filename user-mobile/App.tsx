import React from "react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "styled-components/native";

import AppNavigator from "./App/Navigation/AppNavigator";
import lightTheme from "./App/Styles/Theme/LightTheme"; // default export
import store from "./App/Store";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={lightTheme}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}
