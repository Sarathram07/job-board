import Company from "../models/CompanyModel";

// Function to get a single company by ID
export const getCompany = async (id) => {
  return await Company.findById(id);
};
