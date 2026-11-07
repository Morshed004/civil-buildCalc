
import { useEffect } from 'react';
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
  type Theme,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync().catch(() => {});

// Light Theme
const CustomLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF9900',
    background: '#F4F6FB',
    card: '#FFFFFF',
    text: '#0F172A',
    border: '#E2E8F0',
    notification: '#EF4444',
  },
};

// Dark Theme
const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#FFB52E',
    background: '#0B1120',
    card: '#111827',
    text: '#F1F5F9',
    border: '#1E293B',
    notification: '#F43F5E',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Hide splash screen after layout mounts
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider
      value={isDark ? CustomDarkTheme : CustomLightTheme}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: isDark
              ? CustomDarkTheme.colors.background
              : CustomLightTheme.colors.background,
          },
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}
