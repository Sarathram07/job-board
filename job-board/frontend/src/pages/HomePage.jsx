import { useState } from "react";
import JobList from "../components/JobList";
import PaginationBar from "../components/PaginationBar";
import { useAllJobs } from "../lib/graphql/hooks/hook.js";

const JOBS_PER_PAGE = 5;

function HomePage() {
  // const [jobs, setJobs] = useState([]);
  // useEffect(() => {
  //   getAllJobs().then((job) => setJobs(job));
  // }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const { jobs, loading, error } = useAllJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE,
  );
  const totalPages = jobs ? Math.ceil(jobs.totalCount / JOBS_PER_PAGE) : 0;

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  return (
    <div>
      <h1 className="title">Job Board</h1>
      <JobList jobs={jobs.items} />

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* <div>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>{`${currentPage} of ${totalPages}`} </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
    </div>
  );
}

export default HomePage;
