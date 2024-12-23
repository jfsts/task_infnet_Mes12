import { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Alert } from 'react-native';

const TaskContext = createContext({});

const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      description
      date
      completed
    }
  }
`;

const CREATE_TASK = gql`
  mutation CreateTask($description: String!, $date: String!) {
    createTask(description: $description, date: $date) {
      id
      description
      date
      completed
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $completed: Boolean!) {
    updateTask(id: $id, completed: $completed) {
      id
      description
      date
      completed
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export function TaskProvider({ children }) {
  const { data, loading, error } = useQuery(GET_TASKS);
  const [createTaskMutation] = useMutation(CREATE_TASK);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);

  
  const safeParseDate = (dateString) => {
    try {
      
      if (!dateString) {
        return new Date().toISOString().split('T')[0];
      }

      
      if (typeof dateString === 'string') {
        return dateString.split('T')[0];
      }

      return new Date().toISOString().split('T')[0];
    } catch (error) {
      console.log('Erro ao processar data:', error);
      return new Date().toISOString().split('T')[0];
    }
  };


  const tasks = (data?.tasks || []).map(task => ({
    id: String(task.id),
    title: task.description || '',
    date: safeParseDate(task.date),
    completed: Boolean(task.completed)
  }));

  const addTask = async (title) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await createTaskMutation({
        variables: {
          description: title,
          date: today
        },
        refetchQueries: [{ query: GET_TASKS }]
      });
      return true;
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa');
      return false;
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      await updateTaskMutation({
        variables: {
          id: taskId,
          completed: !task.completed
        },
        refetchQueries: [{ query: GET_TASKS }]
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a tarefa');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteTaskMutation({
        variables: { id: taskId },
        refetchQueries: [{ query: GET_TASKS }]
      });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível deletar a tarefa');
    }
  };

  useEffect(() => {
    if (error) {
      console.log('Erro GraphQL:', error);
    }
  }, [error]);

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        toggleTask, 
        deleteTask, 
        loading 
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext); 