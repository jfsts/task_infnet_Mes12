import { View, StyleSheet, Animated } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { useTheme } from "../context/ThemeContext";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useRef } from "react";

export default function TaskCard({ task, onToggle, onDelete }) {
  const { theme, isDarkTheme } = useTheme();
  let swipeableRef = null;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animateOut = (callback) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [-20, 0, 0],
    });
    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <View
        style={[
          styles.leftAction,
          {
            backgroundColor: theme.colors.error,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 20,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              opacity,
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Apagar
        </Animated.Text>
      </View>
    );
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 0, 0],
    });
    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const text = task.completed ? "Desfazer concluir" : "Concluir";

    return (
      <View
        style={[
          styles.rightAction,
          {
            backgroundColor: "#4CAF50",
            justifyContent: "center",

            paddingRight: -20,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.actionText,
            {
              opacity,
              transform: [{ translateX: trans }],
            },
          ]}
        >
          {text}
        </Animated.Text>
      </View>
    );
  };

  const handleDelete = () => {
    animateOut(() => onDelete(task.id));
  };

  const handleTogglePress = () => {
    console.log("Toggle button pressed for task:", task.id);
    animateOut(() => onToggle(task.id));
  };

  const handleSwipeToggle = () => {
    console.log("Swipe toggle for task:", task.id);
    if (swipeableRef) {
      swipeableRef.close();
    }
    animateOut(() => onToggle(task.id));
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <GestureHandlerRootView>
        <Swipeable
          ref={(ref) => (swipeableRef = ref)}
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
          onSwipeableLeftOpen={handleDelete}
          onSwipeableRightOpen={handleSwipeToggle}
          overshootLeft={false}
          overshootRight={false}
          friction={2}
          leftThreshold={80}
          rightThreshold={80}
        >
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
                      textDecorationLine: task.completed
                        ? "line-through"
                        : "none",
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
                  onPress={handleTogglePress}
                  style={styles.iconButton}
                  accessibilityLabel={
                    task.completed ? "Desfazer conclusão" : "Concluir"
                  }
                />
                <IconButton
                  icon="delete"
                  iconColor={theme.colors.error}
                  size={24}
                  onPress={handleDelete}
                />
              </View>
            </Card.Content>
          </Card>
        </Swipeable>
      </GestureHandlerRootView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    paddingHorizontal: 8,
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
  leftAction: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  rightAction: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  iconButton: {
    margin: 0,
    padding: 8,
  },
});
