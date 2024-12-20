import { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, SegmentedButtons, FAB, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTasks } from "../context/TaskContext";
import Input from "../components/Input";
import Button from "../components/Button";
import TaskCard from "../components/TaskCard";

export default function Dashboard() {
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("pending");
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, isDarkTheme, toggleTheme } = useTheme();
  const { tasks, addTask, toggleTask, deleteTask } = useTasks();

  const userName = user?.email.split("@")[0];

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const success = await addTask(newTask.trim());
      if (success) {
        setNewTask("");
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "completed" ? task.completed : !task.completed
  );

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
        />
      </View>

      <View style={styles.header}>
        <Text style={[styles.welcome, { color: theme.colors.text }]}>
          Olá, {userName}
        </Text>
        <Button mode="text" onPress={handleLogout}>
          Sair
        </Button>
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>Tarefas</Text>
      <View style={styles.inputContainer}>
        <Input
          label="Nova Tarefa"
          value={newTask}
          onChangeText={setNewTask}
          style={{ flex: 1, marginRight: 10 }}
        />
        <Button onPress={handleAddTask}>Adicionar</Button>
      </View>

      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: "pending", label: "Não Concluídas" },
          { value: "completed", label: "Concluídas" },
        ]}
        style={styles.filterButtons}
      />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="account"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleProfile}
        color={theme.colors.surface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  themeButtonContainer: {
    position: "absolute",
    right: 20,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  welcome: {
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filterButtons: {
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
