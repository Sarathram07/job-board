import { v4 as uuidv4 } from "uuid";
import JobModel from "../models/JobModel.js";

export async function getJobs() {
  return await JobModel.find({});
}

export async function getJobById(id) {
  return await JobModel.findOne({ id: id });
}

export async function getJob(id, companyId) {
  return await JobModel.findOne({ id: id, companyId: companyId });
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

export async function deleteJobByID(id, companyId) {
  try {
    const job = await getJob(id, companyId);
    if (!job) {
      // In GraphQL, you can either return null or throw an error
      throw new Error("Job not found to delete: " + id);
    }

    await JobModel.deleteOne({ id: id });
    return job;
  } catch (err) {
    console.log(err.message);
    throw new Error("Server error");
  }
}

export async function updateJobByID(id, companyId, title, description) {
  try {
    const job = await getJob(id, companyId);
    if (!job) {
      // In GraphQL, you can either return null or throw an error
      throw new Error("Job not found to update: " + id);
    }

    const updatedFields = { title, description };
    const updatedJob = await JobModel.findOneAndUpdate(
      { id },
      { $set: updatedFields },
      { new: true, runValidators: true },
    );
    return updatedJob;
  } catch (err) {
    console.log(err.message);
    throw new Error("Server error");
  }
}
