import { apolloClient } from "./client.js";

import { CREATE_NEW_JOB, GET_ALL_JOBS, GET_JOB_BY_ID } from "./jobQuery.js";
import { GET_COMPANY_BY_ID } from "./companyQuery.js";

//------------------------------------------------------JOB_REQUEST----------------------------------------------------------------

//fetchPolicy: "cache-first" (default) - checks cache first, if not found then makes network request

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

// -----------------------------------------------------QUERIES------------------------------------------------------------------

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
