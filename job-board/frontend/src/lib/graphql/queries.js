import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  //gql,
  InMemoryCache,
} from "@apollo/client";
// import { getAccessToken } from "../auth";

const link = import.meta.env.VITE_SERVER_URL || "http://localhost:9000/graphql";
console.log(link);

const httpLink = createHttpLink({ uri: link });

const authLink = new ApolloLink((operation, forward) => {
  // const accessToken = getAccessToken();
  // if (accessToken) {
  //   operation.setContext({
  //     headers: { Authorization: `Bearer ${accessToken}` },
  //   });
  // }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
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

import { GraphQLClient, gql } from "graphql-request";

const endPoint =
  import.meta.env.VITE_SERVER_URL || "http://localhost:9000/graphql";

const client = new GraphQLClient(endPoint);

export async function getAllJobs() {
  const query = gql`
    query {
      jobs {
        id
        title
        company {
          id
          name
        }
        date
      }
    }
  `;

  const { jobs } = await client.request(query);
  return jobs;
}

export async function getJobBasedID(id) {
  const query = gql`
    query getJob($id: ID!) {
      job(id: $id) {
        id
        title
        date
        company {
          id
          name
        }
      }
    }
  `;

  const { job } = await client.request(query, { id });
  return job;
}

export async function getCompanyByID(id) {
  const query = gql`
    query getCompany($id: ID!) {
      company(id: $id) {
        id
        name
        jobs {
          id
          title
          date
        }
      }
    }
  `;

  const { company } = await client.request(query, { id });
  return company;
}
