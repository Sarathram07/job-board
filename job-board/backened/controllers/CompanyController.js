import Company from "../models/CompanyModel.js";

// Function to get a single company by ID
export const getCompanyByID = async (id) => {
  return await Company.findOne({ id });
};
