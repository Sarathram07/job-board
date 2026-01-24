import JobModel from "../models/JobModel.js";

export async function getJobs() {
  return await JobModel.find({});
}
