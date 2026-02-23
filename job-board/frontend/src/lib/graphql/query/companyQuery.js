import { gql } from "@apollo/client";

export const GET_COMPANY_BY_ID = gql`
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
