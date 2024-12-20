import { useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Text, SegmentedButtons } from "react-native-paper";
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
  const { theme } = useTheme();
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

  const filteredTasks = tasks.filter((task) =>
    filter === "completed" ? task.completed : !task.completed
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
});
