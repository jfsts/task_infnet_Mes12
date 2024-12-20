import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskContext = createContext({});

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const addTask = async (title) => {
    try {
      const newTask = {
        id: Date.now().toString(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const updatedTasks = [...tasks, newTask];
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      return false;
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      );
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext); 