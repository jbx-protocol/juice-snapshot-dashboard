import { ApolloClient, InMemoryCache } from "@apollo/client";

const SNAPSHOT_BASE_URI = "https://hub.snapshot.org/graphql";

export default function createApolloClient() {
  return new ApolloClient({
    uri: SNAPSHOT_BASE_URI,
    cache: new InMemoryCache(),
  });
}
