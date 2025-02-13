import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, IconButton } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/Button";

export default function Profile() {
  const { user, logout } = useAuth();
  const [image, setImage] = useState(null);
  const router = useRouter();
  const { theme, isDarkTheme, toggleTheme } = useTheme();

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem("@profile_image");
      if (savedImage) {
        setImage(savedImage);
      }
    } catch (error) {
      console.error("Erro ao carregar imagem:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setImage(imageUri);
        await AsyncStorage.setItem("@profile_image", imageUri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.themeButtonContainer}>
        <IconButton
          icon={isDarkTheme ? "white-balance-sunny" : "moon-waning-crescent"}
          size={24}
          onPress={toggleTheme}
          iconColor={theme.colors.text}
          style={styles.themeButton}
        />
      </View>

      <View style={styles.content}>
        <Avatar.Image
          size={120}
          source={
            image ? { uri: image } : require("../assets/default-avatar.png")
          }
          style={styles.avatar}
        />

        <Button
          mode="text"
          onPress={pickImage}
          style={styles.changePhotoButton}
        >
          Alterar foto
        </Button>

        <View style={styles.infoContainer}>
          <Text style={[styles.email, { color: theme.colors.text }]}>
            {user?.email}
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          Sair
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeButtonContainer: {
    position: "absolute",
    right: 20,
    zIndex: 1,
  },
  themeButton: {
    margin: 0,
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    marginTop: 50,
    marginBottom: 10,
  },
  changePhotoButton: {
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  email: {
    fontSize: 18,
    marginBottom: 5,
  },
  logoutButton: {
    width: "80%",
    marginTop: 20,
  },
});
