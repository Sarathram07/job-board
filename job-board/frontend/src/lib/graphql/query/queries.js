import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";

import { CREATE_NEW_JOB, GET_ALL_JOBS, GET_JOB_BY_ID } from "./jobQuery.js";
import { GET_COMPANY_BY_ID } from "./companyQuery.js";
import { getAccessToken } from "../../auth.js";

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
//const { jobs } = await client.request(GET_ALL_JOBS);
// return jobs;

// ------------------------------------------------------APOLLO_CLIENT_SETUP------------------------------------------------

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

export const apolloClient = new ApolloClient({
  // uri: "http://localhost:9000/graphql" -  using link instead of uri
  link: ApolloLink.from([authLink, httpLink]), // order of links is important
  cache: new InMemoryCache(),
  connectToDevTools: true,
  // defaultOptions: {
  //   query: { fetchPolicy: "network-only" },
  //   watchQuery: { fetchPolicy: "network-only" },
  // },
});

// const jobDetailFragment = gql`
//   fragment JobDetail on Job {
//     id
//     date
//     title
//     company {
//       id
//       name
//     }
//     description
//   }
// `;

// export const companyByIdQuery = gql`
//   query CompanyById($id: ID!) {
//     company(id: $id) {
//       id
//       name
//       description
//       jobs {
//         id
//         date
//         title
//       }
//     }
//   }
// `;

// export const jobByIdQuery = gql`
//   query JobById($id: ID!) {
//     job(id: $id) {
//       ...JobDetail
//     }
//   }
//   ${jobDetailFragment}
// `;

// export const jobsQuery = gql`
//   query Jobs($limit: Int, $offset: Int) {
//     jobs(limit: $limit, offset: $offset) {
//       items {
//         id
//         date
//         title
//         company {
//           id
//           name
//         }
//       }
//       totalCount
//     }
//   }
// `;

// export const createJobMutation = gql`
//   mutation CreateJob($input: CreateJobInput!) {
//     job: createJob(input: $input) {
//       ...JobDetail
//     }
//   }
//   ${jobDetailFragment}
// `;

// ------------------------------------------------------JOB_REQUEST----------------------------------------------------------------

// fetchPolicy: "cache-first" (default) - checks cache first, if not found then makes network request

export async function getAllJobs() {
  const result = await apolloClient.query({
    query: GET_ALL_JOBS,
    fetchPolicy: "network-only",
  });
  return result.data.jobs;
}

export async function getJobBasedID(id) {
  const { data } = await apolloClient.query({
    query: GET_JOB_BY_ID,
    variables: { id },
  });
  return data.job;
}

export async function createNewJob(contents) {
  const { title, description } = contents;
  const body = {
    data: { title, description },
  };

  const {
    data: { job: newJob },
  } = await apolloClient.mutate({
    mutation: CREATE_NEW_JOB,
    variables: body,
    //context: { headers: { Authorization: `Bearer ${getAccessToken()}` } },
    update: (cache, { data }) => {
      // cache -  instance used for modify apollo cache directly
      //console.log(data.job);
      cache.writeQuery({
        query: GET_JOB_BY_ID,
        variables: { id: data.job.id },
        data,
      });
    },
  });

  return newJob;
}

// ------------------------------------------------------COMPANY_REQUEST----------------------------------------------------------------

export async function getCompanyByID(id) {
  const { data } = await apolloClient.query({
    query: GET_COMPANY_BY_ID,
    variables: { id },
  });
  return data.company;
}

// ------------------------------------------------------USER_REQUEST----------------------------------------------------------------
