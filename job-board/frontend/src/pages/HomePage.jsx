//import { useState , useEffect } from "react";
import JobList from "../components/JobList";
//import PaginationBar from "../components/PaginationBar";
import { useAllJobs } from "../lib/graphql/hooks/hook.js";

const JOBS_PER_PAGE = 7;

function HomePage() {
  // const [currentPage, setCurrentPage] = useState(1);
  // const { jobs, loading, error } = useJobs(
  //   JOBS_PER_PAGE,
  //   (currentPage - 1) * JOBS_PER_PAGE,
  // );

  // console.log("[HomePage]", { jobs, loading, error });

  // const totalPages = Math.ceil(jobs.totalCount / JOBS_PER_PAGE);

  // const dataFromDb = async () => {
  //   const dbdata = await getAllJobs();
  //   console.log(dbdata);
  // };
  //dataFromDb();

  // const [jobs, setJobs] = useState([]);

  // useEffect(() => {
  //   getAllJobs().then((job) => setJobs(job));
  // }, []);

  const { jobs, loading, error } = useAllJobs();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      {/* <PaginationBar currentPage={currentPage} totalPages={totalPages}
        onPageChange={setCurrentPage}
      /> */}
      {/* <JobList jobs={jobs.items} />  */}
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
