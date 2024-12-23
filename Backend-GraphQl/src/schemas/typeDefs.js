const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Task {
    id: ID!
    description: String!
    date: String!
    completed: Boolean!
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
  }

  type Mutation {
    createTask(description: String!, date: String!): Task
    updateTask(id: ID!, description: String, completed: Boolean): Task
    deleteTask(id: ID!): Boolean
  }
`;

module.exports = typeDefs;