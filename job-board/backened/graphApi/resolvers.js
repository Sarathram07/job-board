import { PubSub } from "graphql-subscriptions";
import {
  companyLoader,
  getCompanyByID,
} from "../controllers/CompanyController.js";
import {
  createJob,
  deleteJobByID,
  getAllJobById,
  getJobById,
  getJobs,
  getTotalJobCount,
  updateJobByID,
} from "../controllers/JobController.js";
import {
  createMessage,
  getAllMessages,
} from "../controllers/MessageController.js";
import { extractDate } from "../utils/convertion.js";
import {
  handleAuthError,
  handleCompanyError,
  handleJobError,
} from "../utils/errorHandler.js";

// PubSub- publisher-subscriber
// pattern is a messaging pattern where senders of messages, called publishers,
//  do not program the messages to be sent directly to specific receivers, called subscribers.
// Instead, published messages are categorized into classes without knowledge of which subscribers there may be.
// Subscribers express interest in one or more classes and only receive messages that are of interest,
// without knowledge of which publishers there are.
const pubSub = new PubSub();

export const resolvers = {
  Job: {
    date: (job) => extractDate(job.createdAt),
    //company: (job) => getCompanyByID(job.companyId),
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
  },

  Company: {
    jobs: (comp) => getAllJobById(comp.id),
  },

  Query: {
    // jobs: () => {
    //   const jobs = getJobs();
    //   return jobs;
    // },
    jobs: (_root, args) => {
      const { limit, offset } = args;
      const totalPagesCount = getTotalJobCount();
      const allJobs = getJobs(limit, offset);
      return { items: allJobs, totalCount: totalPagesCount };
    },
    job: async (_root, args) => {
      const id = args.id;
      const jobFromDB = await getJobById(id);
      if (!jobFromDB) {
        handleJobError(jobFromDB, id);
      }
      return jobFromDB;
    },

    company: async (_root, { id }) => {
      const companyFromDB = await getCompanyByID(id);
      if (!companyFromDB) {
        handleCompanyError(companyFromDB, id);
      }
      return companyFromDB;
    },

    messages: async (_root, _args, context) => {
      const user = requireAuth(context);
      return getAllMessages();
    },
  },

  Mutation: {
    createJob: (_root, args, context) => {
      const user = requireAuth(context);
      const { title, description } = args.input;
      const companyId = user.companyId;
      return createJob({ companyId, title, description });
    },

    addMessage: async (_root, { text }, { user }) => {
      if (!user) throw unauthorizedError();
      const message = await createMessage(user, text);
      pubSub.publish("NEW_MESSAGE_ADDED", { messageAdded: message });
      return message;
    },

    deleteJob: (_root, args, context) => {
      const user = requireAuth(context);
      const { id } = args;
      return deleteJobByID(id, user.companyId);
    },

    updateJob: (_root, args, context) => {
      const user = requireAuth(context);
      const { id, title, description } = args.input;
      return updateJobByID(id, user.companyId, title, description);
    },
  },

  Subscription: {
    messageAdded: {
      // Subscription provide subscribe method which return
      // #AsyncIterator(protocol defined by JS language for objects that generate multiple values over time) to server
      // which listen to the event and send data to client when event is emitted.
      subscribe: (_root, _args, context) => {
        const user = requireAuth(context);
        return pubSub.asyncIterableIterator("NEW_MESSAGE_ADDED");
      },
    },
  },
};

const requireAuth = (context) => {
  if (!context?.user) {
    handleAuthError("Un-authorized Access");
  }
  return context.user;
};
