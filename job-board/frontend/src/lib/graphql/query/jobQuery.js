import { gql } from "@apollo/client";

export const GET_JOB_BY_ID = gql`
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

export const GET_ALL_JOBS = gql`
  query getAllJobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      totalCount
      items {
        id
        title
        company {
          id
          name
        }
        date
      }
    }
  }
`;

export const CREATE_NEW_JOB = gql`
  mutation newJob($data: CreateJobInput!) {
    job: createJob(input: $data) {
      id
      title
      date
      description
      company {
        id
        name
      }
    }
  }
`;
