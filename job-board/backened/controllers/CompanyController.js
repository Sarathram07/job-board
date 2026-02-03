import DataLoader from "dataloader";
import Company from "../models/CompanyModel.js";

// Function to get a single company by ID
export const getCompanyByID = async (id) => {
  return await Company.findOne({ id });
};

// return order is important i.e should match the keys(input args) order
// function to batch load companies by their IDs
export const companyLoader = new DataLoader(async (ids) => {
  //console.log("company loader ids: ", ids);
  // const company = ids.map((id) => getCompanyByID(id));
  //return Promise.all(company);

  const companies = await Company.find({
    id: { $in: ids },
  });

  // Map by id for fast lookup
  const companyMap = new Map(companies.map((company) => [company.id, company]));

  // Return in the same order as ids
  return ids.map((id) => companyMap.get(id) || null);
});

export function createCompanyLoader() {
  return new DataLoader(async (ids) => {
    const companies = await Company.find({
      id: { $in: ids },
    });
    const companyMap = new Map(
      companies.map((company) => [company.id, company]),
    );
    return ids.map((id) => companyMap.get(id) || null);
  });
}
