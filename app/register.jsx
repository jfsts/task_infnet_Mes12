import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  const { theme } = useTheme();

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      if (!email || !password || !confirmPassword) {
        setError("Preencha todos os campos");
        return;
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem");
        return;
      }

      const result = await register(email, password);

      if (result.success) {
        alert("Cadastro realizado com sucesso!");
        router.replace("/");
      } else {
        setError(result.message || "Erro ao cadastrar");
      }
    } catch (error) {
      setError("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Cadastro</Text>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        disabled={loading}
      />

      <Input
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        disabled={loading}
      />

      <Input
        label="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        disabled={loading}
      />

      {error ? (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}

      <Button onPress={handleRegister} loading={loading} disabled={loading}>
        Cadastrar
      </Button>

      <Button mode="text" onPress={() => router.back()} disabled={loading}>
        Voltar para Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    marginBottom: 10,
    textAlign: "center",
  },
});
