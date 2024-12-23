import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { TaskProvider } from "../context/TaskContext";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo";

function StackNavigator() {
  const { theme, isDarkTheme } = useTheme();

  return (
    <>
      <StatusBar style={isDarkTheme ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            title: "Cadastro",
            headerBackTitle: "Voltar",
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: "Perfil",
          }}
        />
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <PaperProvider>
          <SafeAreaProvider>
            <AuthProvider>
              <TaskProvider>
                <StackNavigator />
              </TaskProvider>
            </AuthProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
