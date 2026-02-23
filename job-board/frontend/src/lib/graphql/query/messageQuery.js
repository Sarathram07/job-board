import { gql } from "@apollo/client";

export const GET_ALL_MESSAGES = gql`
  query getAllMessages {
    messages {
      id
      user
      text
    }
  }
`;

export const CREATE_NEW_MESSAGE = gql`
  mutation newMessage($text: String!) {
    message: addMessage(text: $text) {
      id
      user
      text
    }
  }
`;

// ------------------------------------------------------SUBSCRIPTION----------------------------------------------------------------

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription msgAdded {
    message: messageAdded {
      id
      user
      text
    }
  }
`;
