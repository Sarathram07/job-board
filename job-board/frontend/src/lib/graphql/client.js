import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWsClient } from "graphql-ws";
import { Kind, OperationTypeNode } from "graphql";
import { getMainDefinition } from "@apollo/client/utilities";

import { getAccessToken } from "../auth";

// -----------------------------------------------------GRAPHQL_CLIENT_SETUP------------------------------------------------

// import { GraphQLClient } from "graphql-request";
// const endPoint =
//   import.meta.env.VITE_SERVER_URL || "http://localhost:9000/graphql";

// const optionConfig = {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       return {
//         Authorization: `Bearer ${accessToken}`,
//       };
//     }
//     return {};
//   },
// };
// const client = new GraphQLClient(endPoint, optionConfig);
// const { jobs } = await client.request(GET_ALL_JOBS);
// return jobs;

// ----------------------------------------------------APOLLO_SETUP----------------------------------------------------

const link = import.meta.env.VITE_SERVER_URL || "http://localhost:9000/graphql";
console.log(link);

// terminating link - this case HTTP link
const httpLink = new HttpLink({ uri: link });

// custom middleware link to add auth token to headers
// operation - object represents a GraphQL operation details (query/mutation)
const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    // context - set of metadata(properties) for the operation ; object where we can put properties to be used for the request
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

const newHttpLink = ApolloLink.from([authLink, httpLink]); // order of links is important

// -----------------------------------------------WEBSOCKET_SETUP------------------------------------------------------------------

// create a link using createHttpLink from apollo/client &
// set the uri to the GraphQL server endpoint to support WebsocketLink for subscriptions,
//const httpLink = createHttpLink({ uri: link });

const wsClient = createWsClient({
  url: import.meta.env.VITE_SERVER_WS_URL,
  connectionParams: () => ({ accessToken: getAccessToken() }),
});
const wsLink = new GraphQLWsLink(wsClient);

// -------------------------------------------APOLLO_CLIENT_SETUP------------------------------------------------------------------
export const apolloClient = new ApolloClient({
  // uri: "http://localhost:9000/graphql" -  using link instead of uri
  // split - function to split traffic between http and websocket link based on operation type
  link: ApolloLink.split(isSubscription, wsLink, newHttpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
  // defaultOptions: {
  //   query: { fetchPolicy: "network-only" },
  //   watchQuery: { fetchPolicy: "network-only" },
  // },
});

function isSubscription(operation) {
  const defn = getMainDefinition(operation.query);
  //operation.query.definitions.some((def) => def.kind === "OperationDefinition" && def.operation === "subscription");
  const boolean =
    defn.kind === Kind.OPERATION_DEFINITION &&
    defn.operation === OperationTypeNode.SUBSCRIPTION;

  return boolean;
}
