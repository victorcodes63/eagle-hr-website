'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { JobListing } from '@/types/ats';
import { useATS } from '@/lib/ats-api';

interface JobApplicationFormProps {
  job: JobListing;
  onSuccess?: (applicationId: string) => void;
  onClose?: () => void;
}

const JobApplicationForm = ({ job, onSuccess, onClose }: JobApplicationFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    coverLetter: '',
    experience: '',
    education: '',
    skills: '',
  });
  
  const [resume, setResume] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const { submitApplication, uploadResume, createCandidate } = useATS();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        resume: 'Please upload a PDF or Word document'
      }));
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        resume: 'File size must be less than 5MB'
      }));
      return;
    }

    setResume(file);
    setErrors(prev => ({
      ...prev,
      resume: ''
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!resume) newErrors.resume = 'Resume is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Upload resume first
      let uploadedResumeUrl = resumeUrl;
      if (resume && !uploadedResumeUrl) {
        uploadedResumeUrl = await uploadResume(resume);
        if (!uploadedResumeUrl) {
          setErrors(prev => ({
            ...prev,
            resume: 'Failed to upload resume. Please try again.'
          }));
          setLoading(false);
          return;
        }
      }

      // Create candidate profile
      const candidate = await createCandidate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experience: parseInt(formData.experience) || 0,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        resumeUrl: uploadedResumeUrl,
      });

      if (!candidate) {
        setErrors(prev => ({
          ...prev,
          general: 'Failed to create candidate profile. Please try again.'
        }));
        setLoading(false);
        return;
      }

      // Submit application
      const application = await submitApplication({
        jobId: job.id,
        candidateId: candidate.id,
        coverLetter: formData.coverLetter,
        resumeUrl: uploadedResumeUrl,
      });

      if (application) {
        onSuccess?.(application.id);
        setStep(3); // Success step
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'Failed to submit application. Please try again.'
        }));
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors(prev => ({
        ...prev,
        general: 'An error occurred. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-primary-900 mb-2">Apply for {job.title}</h3>
        <p className="text-neutral-600">at {job.company}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.firstName ? 'border-red-300' : 'border-neutral-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.lastName ? 'border-red-300' : 'border-neutral-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.email ? 'border-red-300' : 'border-neutral-300'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.phone ? 'border-red-300' : 'border-neutral-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.location ? 'border-red-300' : 'border-neutral-300'
            }`}
            placeholder="Enter your location"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.location}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-6 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300"
        >
          Next Step
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-primary-900 mb-2">Professional Information</h3>
        <p className="text-neutral-600">Tell us about your background and experience</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Years of Experience
        </label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter years of experience"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Education
        </label>
        <input
          type="text"
          name="education"
          value={formData.education}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Enter your education background"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="e.g., JavaScript, React, Project Management"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Resume *
        </label>
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors duration-300">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm text-neutral-600 mb-1">
              {resume ? resume.name : 'Click to upload resume'}
            </p>
            <p className="text-xs text-neutral-500">PDF, DOC, DOCX (Max 5MB)</p>
          </label>
        </div>
        {errors.resume && (
          <p className="text-red-500 text-sm mt-1 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.resume}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Cover Letter
        </label>
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Tell us why you're interested in this position..."
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-colors duration-300"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setStep(3)}
          className="px-6 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300"
        >
          Review & Submit
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-primary-900 mb-2">Review Your Application</h3>
        <p className="text-neutral-600">Please review your information before submitting</p>
      </div>

      <div className="bg-neutral-50 rounded-lg p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-neutral-900 mb-2">Personal Information</h4>
            <p className="text-sm text-neutral-600">{formData.firstName} {formData.lastName}</p>
            <p className="text-sm text-neutral-600">{formData.email}</p>
            <p className="text-sm text-neutral-600">{formData.phone}</p>
            <p className="text-sm text-neutral-600">{formData.location}</p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-900 mb-2">Professional Information</h4>
            <p className="text-sm text-neutral-600">{formData.experience} years experience</p>
            <p className="text-sm text-neutral-600">{formData.education}</p>
            <p className="text-sm text-neutral-600">Skills: {formData.skills}</p>
            {resume && (
              <p className="text-sm text-neutral-600">Resume: {resume.name}</p>
            )}
          </div>
        </div>
        
        {formData.coverLetter && (
          <div>
            <h4 className="font-semibold text-neutral-900 mb-2">Cover Letter</h4>
            <p className="text-sm text-neutral-600">{formData.coverLetter}</p>
          </div>
        )}
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.general}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-colors duration-300"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold text-primary-900 mb-2">Application Submitted!</h3>
      <p className="text-neutral-600 mb-6">
        Thank you for applying to {job.title} at {job.company}. 
        We'll review your application and get back to you soon.
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onClose}
          className="px-6 py-3 bg-primary-900 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors duration-300"
        >
          Close
        </button>
        <a
          href="/careers"
          className="px-6 py-3 border border-primary-900 text-primary-900 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-300"
        >
          Browse More Jobs
        </a>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderSuccess()}
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default JobApplicationForm;
