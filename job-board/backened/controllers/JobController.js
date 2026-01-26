import { v4 as uuidv4 } from "uuid";
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

export async function createJob({ companyId, title, description }) {
  const newId = uuidv4().split("-")[0];
  const job = await JobModel.create({
    id: newId,
    companyId,
    title,
    description,
  });

  return job;
}

export async function deleteJobByID(id) {
  try {
    const job = await getJobById(id);
    if (!job) {
      // In GraphQL, you can either return null or throw an error
      throw new Error("Job not found: " + id);
    }

    await JobModel.deleteOne({ id: id });
    return job;
  } catch (err) {
    console.log(err.message);
    throw new Error("Server error");
  }
}

export async function updateJobByID(id, title, description) {
  try {
    const job = await getJobById(id);
    if (!job) {
      // In GraphQL, you can either return null or throw an error
      throw new Error("Job not found: " + id);
    }

    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;

    await job.save();
    return job;
  } catch (err) {
    console.log(err.message);
    throw new Error("Server error");
  }
}
