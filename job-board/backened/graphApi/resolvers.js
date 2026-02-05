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
import { extractDate } from "../utils/convertion.js";
import {
  handleAuthError,
  handleCompanyError,
  handleJobError,
} from "../utils/errorHandler.js";

export const resolvers = {
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
  },

  Job: {
    date: (job) => extractDate(job.createdAt),
    //company: (job) => getCompanyByID(job.companyId),
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
  },

  Company: {
    jobs: (comp) => getAllJobById(comp.id),
  },

  Mutation: {
    createJob: (_root, args, context) => {
      const user = requireAuth(context);
      const { title, description } = args.input;
      const companyId = user.companyId;
      return createJob({ companyId, title, description });
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
};

const requireAuth = (context) => {
  if (!context?.user) {
    handleAuthError("Un-authorized Access");
  }
  return context.user;
};
