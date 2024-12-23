import { ApolloClient, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getServerUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Para dispositivo físico Android ou emulador
      return 'http://192.168.1.2:4000/graphql';
    }
    // Para iOS
    return 'http://localhost:4000/graphql';
  }
  // URL de produção (quando publicar o app)
  return 'https://seu-servidor-producao.com/graphql';
};

const client = new ApolloClient({
  uri: getServerUrl(),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});

export default client;
