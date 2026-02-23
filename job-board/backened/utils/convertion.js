export const extractDate = (data) => {
  const createdAt = data.toISOString();
  const [date, time] = createdAt.split("T");
  return date;
};

//export const formatToISOString = (date) => date.toISOString();
