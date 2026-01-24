import { getCompanyByID } from "../controllers/CompanyController.js";
import { getJobs } from "../controllers/JobController.js";
import { extractDate } from "../utils/convertion.js";

export const resolvers = {
  Query: {
    jobs: () => {
      const jobs = getJobs();
      return jobs;
    },
  },

  Job: {
    date: (job) => extractDate(job.createdAt),
    company: (job) => getCompanyByID(job.companyId),
  },
};
