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

import { GraphQLClient } from "graphql-request";
import { CREATE_NEW_JOB, GET_ALL_JOBS, GET_JOB_BY_ID } from "./jobQuery.js";
import { GET_COMPANY_BY_ID } from "./companyQuery.js";
import { getAccessToken } from "../../auth.js";

const endPoint =
  import.meta.env.VITE_SERVER_URL || "http://localhost:9000/graphql";

const optionConfig = {
  headers: () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return {};
  },
};
const client = new GraphQLClient(endPoint, optionConfig);

// ------------------------------------------------------JOB_REQUEST----------------------------------------------------------------
export async function getAllJobs() {
  const { jobs } = await client.request(GET_ALL_JOBS);
  return jobs;
}
export async function getJobBasedID(id) {
  const { job } = await client.request(GET_JOB_BY_ID, { id });
  return job;
}

export async function createNewJob(contents) {
  const { title, description } = contents;
  const body = {
    data: { title, description },
  };
  const { job: newJob } = await client.request(CREATE_NEW_JOB, body);
  return newJob;
}

// ------------------------------------------------------COMPANY_REQUEST----------------------------------------------------------------

export async function getCompanyByID(id) {
  const { company } = await client.request(GET_COMPANY_BY_ID, { id });
  return company;
}

// ------------------------------------------------------USER_REQUEST----------------------------------------------------------------
