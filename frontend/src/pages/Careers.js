import React, { useState, useEffect } from 'react';
import { getJobOpenings } from '../utils/api';

const Careers = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobOpenings = async () => {
      const data = await getJobOpenings();
      setJobs(data);
    };
    fetchJobOpenings();
  }, []);

  return (
    <div>
      <h1>Career Opportunities</h1>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <button>Apply</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Careers;