import { useMutation, useQuery, useSubscription } from "@apollo/client/react";

import { GET_COMPANY_BY_ID } from "../query/companyQuery.js";
import {
  CREATE_NEW_JOB,
  GET_ALL_JOBS,
  GET_JOB_BY_ID,
} from "../query/jobQuery.js";
import {
  CREATE_NEW_MESSAGE,
  GET_ALL_MESSAGES,
  MESSAGE_ADDED_SUBSCRIPTION,
} from "../query/messageQuery.js";

// ------------------------------------------------------COMPANY_HOOK-------------------------------------------------------------
function useCompany(companyId) {
  const { data, loading, error } = useQuery(GET_COMPANY_BY_ID, {
    variables: { id: companyId },
  });

  return {
    company: data?.company,
    loading,
    error: Boolean(error),
  };
}

// ------------------------------------------------------JOB_HOOK----------------------------------------------------------------
function useJob(jobId) {
  const { data, loading, error } = useQuery(GET_JOB_BY_ID, {
    variables: { id: jobId },
  });

  return {
    job: data?.job,
    loading,
    error: Boolean(error),
  };
}

function useAllJobs(limit, offset) {
  const { data, loading, error } = useQuery(GET_ALL_JOBS, {
    variables: { limit, offset },
    fetchPolicy: "network-only",
  });
  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  };
}

function useCreateJob() {
  // const [fn, result] = useMutation(CREATE_NEW_JOB);
  const [createJobMutation, result] = useMutation(CREATE_NEW_JOB);
  const { loading, error } = result;

  const createNewJob = async (contents) => {
    const { title, description } = contents;
    const body = {
      data: { title, description },
    };

    const {
      data: { job: newJob },
    } = await createJobMutation({
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
  };
  return {
    createNewJob,
    loading,
    error,
  };
}

// ------------------------------------------------------MESSAGE_HOOK------------------------------------------------------------

function useMessages() {
  //const { data } = useQuery(GET_ALL_MESSAGES, { fetchPolicy: "network-only" });
  const { data } = useQuery(GET_ALL_MESSAGES);
  useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    onData: (obj) => {
      const { client, result } = obj;
      const newMessage = result.data?.message;
      client.cache.updateQuery({ query: GET_ALL_MESSAGES }, (oldData) => {
        return { messages: [...oldData.messages, newMessage] };
      });
    },
  });
  return {
    messages: data?.messages ?? [],
  };
}

function useAddMessage() {
  const [newMessageMutation] = useMutation(CREATE_NEW_MESSAGE);

  const addMessage = async (text) => {
    const {
      data: { message },
    } = await newMessageMutation({
      variables: { text },
      // update: (cache, { data }) => {
      //   const msg = data.message;
      //   cache.updateQuery({ query: GET_ALL_MESSAGES }, (oldData) => {
      //     return { messages: [...oldData.messages, msg] };
      //   });
      // },
    });
    return message;
  };

  return { addMessage };
}

export {
  useCompany,
  useJob,
  useAllJobs,
  useCreateJob,
  useMessages,
  useAddMessage,
};
