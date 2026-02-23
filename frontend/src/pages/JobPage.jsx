import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters.js";
//import { useState, useEffect } from "react";

import { useJob } from "../lib/graphql/hooks/hook.js";

function JobPage() {
  //const job = JobList.find((job) => job.id === jobId);

  // const [job, setJob] = useState();
  // useEffect(() => {
  //   getJobBasedID(jobId).then((data) => setJob(data));
  // }, [jobId]);

  // if (!job) {
  //   return <div> Loading... </div>;
  // }

  const { jobId } = useParams();
  const { job, loading, error } = useJob(jobId);
  console.log("[JobPage]", { job, loading, error });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div className="has-text-danger">Data unavailable</div>;
  }

  return (
    <div>
      <h1 className="title is-2">{job.title}</h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job.date, "long")}
        </div>
        <p className="block">{job.description}</p>
      </div>
    </div>
  );
}

export default JobPage;
