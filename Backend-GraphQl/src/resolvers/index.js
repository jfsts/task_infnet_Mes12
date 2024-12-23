const Task = require('../models/Task');

const resolvers = {
  Query: {
    tasks: async () => {
      return await Task.findAll();
    },
    task: async (_, { id }) => {
      return await Task.findByPk(id);
    }
  },
  Mutation: {
    createTask: async (_, { description, date }) => {
      return await Task.create({ description, date });
    },
    updateTask: async (_, { id, description, completed }) => {
      const task = await Task.findByPk(id);
      if (!task) return null;
      
      const updates = {};
      if (description !== undefined) updates.description = description;
      if (completed !== undefined) updates.completed = completed;
      
      await task.update(updates);
      return task;
    },
    deleteTask: async (_, { id }) => {
      const task = await Task.findByPk(id);
      if (!task) return false;
      await task.destroy();
      return true;
    }
  }
};

module.exports = resolvers;