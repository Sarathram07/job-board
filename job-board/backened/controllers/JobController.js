import JobModel from "../models/JobModel.js";

export async function getJobs() {
  return await JobModel.find({});
}

export async function getJobById(id) {
  return await JobModel.findOne({ id: id });
}

export async function getAllJobById(id) {
  return await JobModel.find({ companyId: id });
}
