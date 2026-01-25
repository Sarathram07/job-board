import { getCompanyByID } from "../controllers/CompanyController.js";
import {
  getAllJobById,
  getJobById,
  getJobs,
} from "../controllers/JobController.js";
import { extractDate } from "../utils/convertion.js";
import { handleCompanyError, handleJobError } from "../utils/errorHandler.js";

export const resolvers = {
  Query: {
    jobs: () => {
      const jobs = getJobs();
      return jobs;
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
    company: (job) => getCompanyByID(job.companyId),
  },

  Company: {
    jobs: (comp) => getAllJobById(comp.id),
  },
};
