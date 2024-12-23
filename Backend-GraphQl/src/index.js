const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors'); // Removi a duplicação
const typeDefs = require('./schemas/typeDefs');
const resolvers = require('./resolvers');
const db = require('./database/config');

async function startServer() {
  const app = express();
  

  app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS']
  }));

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ 
    app,
    cors: false
  });

  const PORT = process.env.PORT || 4000;
  
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}/graphql`);
    console.log(`📱 Para acessar de dispositivos externos use: http://SEU_IP:${PORT}/graphql`);
  });
}

db.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
    startServer();
  })
  .catch(err => console.error('Erro ao sincronizar banco:', err));