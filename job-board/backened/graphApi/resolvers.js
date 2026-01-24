import { getJobs } from "../controllers/JobController.js";

export const resolvers = {
  Query: {
    jobs: () => {
      const jobs = getJobs();
      return jobs;
    },
  },
};
