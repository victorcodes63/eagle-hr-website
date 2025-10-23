'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JobApplicationForm from '@/components/ats/JobApplicationForm';
import { JobListing } from '@/types/ats';
import { useATS } from '@/lib/ats-api';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Building2, 
  Users,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function JobApplicationPage() {
  const params = useParams();
  const jobId = params.id as string;
  const [job, setJob] = useState<JobListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const { getJobById } = useATS();

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      
      setLoading(true);
      try {
        const jobData = await getJobById(jobId);
        setJob(jobData);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApplicationSuccess = (applicationId: string) => {
    setApplicationSubmitted(true);
    setShowApplicationForm(false);
  };

  const getJobIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'executive':
        return Users;
      case 'sales & marketing':
        return ArrowLeft;
      case 'education & training':
        return Users;
      case 'technology':
        return Users;
      default:
        return Users;
    }
  };

  const getJobColors = (category: string) => {
    const colorMap: Record<string, { color: string; bgColor: string }> = {
      'executive': { color: 'from-slate-600 to-slate-700', bgColor: 'from-slate-100 to-gray-200' },
      'sales & marketing': { color: 'from-blue-600 to-blue-700', bgColor: 'from-blue-100 to-sky-200' },
      'education & training': { color: 'from-indigo-600 to-indigo-700', bgColor: 'from-indigo-100 to-blue-200' },
      'technology': { color: 'from-indigo-600 to-indigo-700', bgColor: 'from-indigo-100 to-blue-200' },
    };
    return colorMap[category.toLowerCase()] || { color: 'from-slate-600 to-slate-700', bgColor: 'from-slate-100 to-gray-200' };
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-neutral-200 rounded mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-8"></div>
                <div className="bg-white rounded-xl p-8 border border-neutral-200">
                  <div className="h-6 bg-neutral-200 rounded mb-4"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-primary-900 mb-4">Job Not Found</h1>
              <p className="text-neutral-600 mb-8">
                The job you're looking for doesn't exist or has been removed.
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center px-6 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Job Board
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const Icon = getJobIcon(job.category);
  const colors = getJobColors(job.category);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Job Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/careers"
                className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium mb-6 transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Board
              </Link>
              
              <div className="bg-white rounded-xl p-8 border border-neutral-200 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 bg-gradient-to-br ${colors.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <div>
                      <h1 className="text-3xl font-bold text-primary-900 mb-2">{job.title}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-neutral-600">
                        <span className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          {job.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </span>
                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                          {job.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!applicationSubmitted && (
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="px-8 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
                
                {job.salary && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      Salary: {job.salary.currency} {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Job Description */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Job Description</h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {job.description}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start space-x-2"
                      >
                        <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{req}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
              
              {/* Right Column - Responsibilities & Benefits */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Key Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start space-x-2"
                      >
                        <CheckCircle className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{resp}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">Benefits</h3>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start space-x-2"
                      >
                        <Star className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral-700">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Success Message */}
      {applicationSubmitted && (
        <section className="py-12 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-xl p-8 border border-green-200 shadow-lg"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-primary-900 mb-4">Application Submitted Successfully!</h3>
                <p className="text-neutral-600 mb-6">
                  Thank you for applying to {job.title} at {job.company}. 
                  We'll review your application and get back to you soon.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/careers"
                    className="px-6 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300"
                  >
                    Browse More Jobs
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-3 border border-primary-900 text-primary-900 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-300"
                  >
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <JobApplicationForm
          job={job}
          onSuccess={handleApplicationSuccess}
          onClose={() => setShowApplicationForm(false)}
        />
      )}

      <Footer />
    </main>
  );
}
