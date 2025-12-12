import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Briefcase, MapPin, Clock, Edit } from 'lucide-react'; // Import Edit icon
import { Link } from 'react-router-dom';

const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Jobs
  const fetchJobs = async () => {
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (!error && data) setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete Job
  const handleDelete = async (id: number) => {
    if(!window.confirm("Are you sure you want to remove this job?")) return;
    
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) {
      setJobs(jobs.filter(job => job.id !== id));
      alert("Job removed successfully!");
    } else {
      alert("Error deleting job.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Careers & Hiring</h1>
          <p className="text-gray-500">Manage open positions displayed on the website.</p>
        </div>
        <Link to="/admin/jobs/new" className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80">
          <Plus size={18} /> Post New Job
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No active job openings. Post one!</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Briefcase size={14}/> {job.department}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {job.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                  </div>
                </div>
                
                {/* --- ACTION BUTTONS --- */}
                <div className="flex items-center gap-2">
                  {/* Edit Button */}
                  <Link 
                    to={`/admin/jobs/edit/${job.id}`} 
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Job"
                  >
                    <Edit size={20} />
                  </Link>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Job"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsList;