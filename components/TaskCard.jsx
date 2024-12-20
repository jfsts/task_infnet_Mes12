import { View, StyleSheet } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";

export default function TaskCard({ task, onToggle, onDelete }) {
  const { theme, isDarkTheme } = useTheme();

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: isDarkTheme ? "#333333" : "#ffffff",
          borderColor: theme.colors.primary,
        },
      ]}
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.taskInfo}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                textDecorationLine: task.completed ? "line-through" : "none",
              },
            ]}
          >
            {task.title}
          </Text>
          <Text style={[styles.date, { color: theme.colors.text }]}>
            {new Date(task.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon={task.completed ? "check-circle" : "circle-outline"}
            iconColor={theme.colors.primary}
            size={24}
            onPress={() => onToggle(task.id)}
          />
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            size={24}
            onPress={() => onDelete(task.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    opacity: 0.7,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
