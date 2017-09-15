import React, { Component } from 'react'
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import Routes from './components/Routes'
import { authHeaderMiddleware } from './middleware'
import 'semantic-ui-css/semantic.min.css'
import './sass/App.css'

const wsClient = new SubscriptionClient(`wss://oauth-passport-graphql-benjaminadk.c9users.io:8081/graphql/subscriptions`, {
  reconnect: true
})

const networkInterface = createNetworkInterface({
  uri: 'https://oauth-passport-graphql-benjaminadk.c9users.io:8081/graphql'
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
)

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  dataIdFromObject: o => o.id
})

networkInterface.use([authHeaderMiddleware])

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Routes resetStore={client.resetStore}/>
      </ApolloProvider>
    );
  }
}

export default App;
