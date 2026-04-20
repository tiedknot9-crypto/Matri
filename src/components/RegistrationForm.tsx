import React, { useState } from 'react';
import { User, Users, GraduationCap, Upload, Shield, CheckCircle, PlusCircle, Trash2, Briefcase, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { UserProfile, AdminSettings, EducationDetail, JobDetail, InternshipDetail, DEFAULT_PREFERENCES } from '../types';

export const Input = ({ label, type = 'text', placeholder, onChange, value }: { label: string, type?: string, placeholder?: string, onChange: (v: string) => void, value?: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      value={value}
      className="w-full p-3 border border-gray-200 rounded-xl bg-ivory/20 text-sm focus:ring-1 focus:ring-gold outline-none"
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export const Select = ({ label, options, onChange, value }: { label: string, options: string[], onChange: (v: string) => void, value?: string }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
    <select 
      className="w-full p-3 border border-gray-200 rounded-xl bg-ivory/20 text-sm focus:ring-1 focus:ring-gold outline-none"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select {label}</option>
      {options && options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

export const DocUpload = ({ label }: { label: string }) => (
  <div className="border-2 border-dashed border-gold/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gold/5 transition-all cursor-pointer">
    <Upload size={20} className="text-gold" />
    <span className="text-[10px] font-bold text-gray-600 uppercase text-center">{label}</span>
  </div>
);

export const RegistrationForm = ({ settings, isPublic = false }: { settings: AdminSettings, isPublic?: boolean }) => {
  const { addProfile } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    education: [],
    jobs: [],
    internships: [],
    educationDetails: [],
    jobDetails: [],
    internshipDetails: [],
    documents: { photo: '', aadhaar: '', pan: '', dl: '', passport: '' },
    approvalStatus: 'Pending',
    loginReady: false,
    gender: 'Male', // Default
    location: '',
    tier: 'Standard',
  });

  const [lookingFor, setLookingFor] = useState<'Bride' | 'Groom'>('Bride');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const totalSteps = 5;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    addProfile({ 
      ...formData as UserProfile, 
      id, 
      age: 25, 
      registeredAt: new Date().toISOString(),
      preferences: DEFAULT_PREFERENCES
    });
    alert('Registration successful! Profile submitted for admin approval.');
    if (isPublic) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const steps = [
    { id: 1, title: 'Identity', icon: <User size={18} /> },
    { id: 2, title: 'Birth', icon: <span>🪐</span> },
    { id: 3, title: 'Career', icon: <GraduationCap size={18} /> },
    { id: 4, title: 'Family', icon: <Users size={18} /> },
    { id: 5, title: 'Documents', icon: <Upload size={18} /> },
  ];

  return (
    <div className={`mx-auto space-y-6 md:space-y-8 ${isPublic ? 'max-w-5xl' : 'max-w-4xl'} px-4 md:px-0`}>
      <div className={`border-b border-gold/20 pb-4 md:pb-6 ${isPublic ? 'text-center' : ''}`}>
        <h1 className={`${isPublic ? 'text-2xl md:text-4xl' : 'text-xl md:text-3xl'} font-serif font-bold text-vermilion`}>
          {isPublic ? 'Begin Your Auspicious Journey' : 'Register New Profile'}
        </h1>
        <p className="text-xs md:text-sm text-gray-500 mt-2">
          {isPublic ? 'Join thousands of families finding their ideal match' : 'Complete formal matrimonial onboarding'}
        </p>

        {/* Stepper UI */}
        <div className="mt-8 md:mt-10 flex items-center justify-start md:justify-center gap-4 md:gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div 
                className={`flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group`}
                onClick={() => currentStep > step.id && setCurrentStep(step.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 
                  ${currentStep === step.id ? 'bg-vermilion text-white border-vermilion shadow-lg scale-110' : 
                    currentStep > step.id ? 'bg-green-500 text-white border-green-500' : 'bg-ivory text-vermilion/40 border-gold/20'}`}
                >
                  {currentStep > step.id ? <CheckCircle size={20} /> : step.icon}
                </div>
                <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-center ${currentStep === step.id ? 'text-vermilion' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-0.5 min-w-[20px] md:w-16 ${currentStep > step.id ? 'bg-green-500' : 'bg-gold/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-12 rounded-2xl md:rounded-[2rem] shadow-traditional border border-gold/10 relative">
        <div className="min-h-[300px] md:min-h-[400px]">
          {currentStep === 1 && (
            <motion.section 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-ivory pb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-vermilion/5 rounded-full flex items-center justify-center">
                  <User size={16} md:size={20} className="text-vermilion" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-vermilion">Step 1: Personal Identity</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select label="Plan Type" options={['Standard', 'Premium', 'Elite']} value={formData.tier} onChange={v => setFormData({...formData, tier: v as any})} />
                <Input label="Set Portal Password" type="password" value={formData.password} onChange={v => setFormData({...formData, password: v})} />
                <Input label="Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} />
                <Input label="Surname" value={formData.surname} onChange={v => setFormData({...formData, surname: v})} />
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Photo</label>
                  <div className="flex items-center gap-6 p-4 border border-gray-200 rounded-xl bg-ivory/20">
                    <div className="w-20 h-24 bg-ivory rounded-lg border flex-shrink-0 overflow-hidden">
                      {formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <User size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] text-gray-500 italic">Clear photos increase matching chances by 3x.</p>
                      <label className="inline-flex items-center gap-2 bg-gold text-vermilion px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-gold/80 transition-all">
                        <Upload size={14} /> Upload Photo
                        <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                      </label>
                      <div className="text-[9px] text-gray-400">OR enter URL:</div>
                      <input 
                        type="text" 
                        placeholder="https://example.com/photo.jpg" 
                        value={formData.photoUrl || ''}
                        className="w-full p-2 border border-gray-200 rounded-lg bg-white/50 text-[11px] outline-none"
                        onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Select label="I am searching for a" value={lookingFor} options={['Bride', 'Groom']} onChange={v => setLookingFor(v as any)} />
                <Select label="My Gender" value={formData.gender} options={['Male', 'Female', 'Other']} onChange={v => setFormData({...formData, gender: v as any})} />
                <Select label="State/Location" value={formData.location} options={settings.states} onChange={v => setFormData({...formData, location: v})} />
                <Select label="Religion" value={formData.religion} options={settings.religions} onChange={v => setFormData({...formData, religion: v})} />
                <Select label="Caste" value={formData.caste} options={settings.castes} onChange={v => setFormData({...formData, caste: v})} />
                <Select label="Gotra" value={formData.gotra} options={settings.gotras} onChange={v => setFormData({...formData, gotra: v})} />
                <Input label="Phone" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                <Input label="Email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                <Select 
                  label="Profile Created By" 
                  value={formData.createdBy}
                  options={['Self', 'Parent', 'Sibling', 'Relative', 'Friend']} 
                  onChange={v => setFormData({...formData, createdBy: v})} 
                />
              </div>
            </motion.section>
          )}

          {currentStep === 2 && (
            <motion.section 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-ivory pb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gold/5 rounded-full flex items-center justify-center">
                  <span className="text-lg md:text-xl">🪐</span>
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-vermilion">Step 2: Birth & Astrology</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <Input label="Date of Birth" type="date" value={formData.dob} onChange={v => setFormData({...formData, dob: v})} />
                <Input label="Birth Time" type="time" value={formData.birthTime} onChange={v => setFormData({...formData, birthTime: v})} />
                <Input label="Birth Place" value={formData.birthPlace} onChange={v => setFormData({...formData, birthPlace: v})} />
              </div>
              <div className="p-4 bg-orange-50 border border-saffron/30 rounded-xl text-xs text-saffron-dark font-medium leading-relaxed italic">
                Our AI astrologers will use these details to generate your Kundli and find matches with optimal Guna Milan scores.
              </div>
            </motion.section>
          )}

          {currentStep === 3 && (
            <motion.section 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 md:space-y-10"
            >
              <div className="flex items-center gap-3 border-b border-ivory pb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-peacock/5 rounded-full flex items-center justify-center">
                  <GraduationCap size={16} md:size={20} className="text-peacock" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-vermilion">Step 3: Career & Lifestyle</h3>
              </div>

              {/* Education Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Educational Qualifications</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({
                      ...formData, 
                      educationDetails: [...(formData.educationDetails || []), { degree: '', institution: '', year: '' }]
                    })}
                    className="text-vermilion text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    <PlusCircle size={14} /> Add Degree
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.educationDetails || []).map((edu, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-ivory/10 p-4 rounded-2xl border border-ivory relative group">
                      <Select label="Degree/Level" value={edu.degree} options={settings.qualifications} onChange={v => {
                        const newEdu = [...(formData.educationDetails || [])];
                        newEdu[idx].degree = v;
                        setFormData({...formData, educationDetails: newEdu});
                      }} />
                      <Input label="Institution/University" value={edu.institution} onChange={v => {
                        const newEdu = [...(formData.educationDetails || [])];
                        newEdu[idx].institution = v;
                        setFormData({...formData, educationDetails: newEdu});
                      }} />
                      <Input label="Year of Completion" value={edu.year} onChange={v => {
                        const newEdu = [...(formData.educationDetails || [])];
                        newEdu[idx].year = v;
                        setFormData({...formData, educationDetails: newEdu});
                      }} />
                      <button 
                        type="button"
                        onClick={() => {
                          const newEdu = (formData.educationDetails || []).filter((_, i) => i !== idx);
                          setFormData({...formData, educationDetails: newEdu});
                        }}
                        className="absolute -top-2 -right-2 bg-white text-vermilion p-1.5 rounded-full shadow-sm border border-ivory opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {(formData.educationDetails || []).length === 0 && (
                    <p className="text-xs text-gray-400 italic text-center py-4 border-2 border-dashed border-ivory rounded-2xl">No education details added yet.</p>
                  )}
                </div>
              </div>

              {/* Jobs Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Professional History</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({
                      ...formData, 
                      jobDetails: [...(formData.jobDetails || []), { title: '', company: '', duration: '' }]
                    })}
                    className="text-peacock text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    <PlusCircle size={14} /> Add Experience
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.jobDetails || []).map((job, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-peacock/5 p-4 rounded-2xl border border-peacock/10 relative group">
                      <Select label="Profession" value={job.title} options={settings.jobs} onChange={v => {
                        const newJobs = [...(formData.jobDetails || [])];
                        newJobs[idx].title = v;
                        setFormData({...formData, jobDetails: newJobs});
                      }} />
                      <Input label="Company Name" value={job.company} onChange={v => {
                        const newJobs = [...(formData.jobDetails || [])];
                        newJobs[idx].company = v;
                        setFormData({...formData, jobDetails: newJobs});
                      }} />
                      <Input label="Duration" placeholder="e.g. 2 years" value={job.duration} onChange={v => {
                        const newJobs = [...(formData.jobDetails || [])];
                        newJobs[idx].duration = v;
                        setFormData({...formData, jobDetails: newJobs});
                      }} />
                      <button 
                        type="button"
                        onClick={() => {
                          const newJobs = (formData.jobDetails || []).filter((_, i) => i !== idx);
                          setFormData({...formData, jobDetails: newJobs});
                        }}
                        className="absolute -top-2 -right-2 bg-white text-vermilion p-1.5 rounded-full shadow-sm border border-ivory opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {(formData.jobDetails || []).length === 0 && (
                    <p className="text-xs text-gray-400 italic text-center py-4 border-2 border-dashed border-ivory rounded-2xl">No professional details added yet.</p>
                  )}
                </div>
              </div>

              {/* Internships Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Internships</label>
                  <button 
                    type="button"
                    onClick={() => setFormData({
                      ...formData, 
                      internshipDetails: [...(formData.internshipDetails || []), { role: '', organization: '', duration: '' }]
                    })}
                    className="text-gold text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    <PlusCircle size={14} /> Add Internship
                  </button>
                </div>
                <div className="space-y-3">
                  {(formData.internshipDetails || []).map((intern, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gold/5 p-4 rounded-2xl border border-gold/10 relative group">
                      <Input label="Role" value={intern.role} onChange={v => {
                        const newInterns = [...(formData.internshipDetails || [])];
                        newInterns[idx].role = v;
                        setFormData({...formData, internshipDetails: newInterns});
                      }} />
                      <Input label="Organization" value={intern.organization} onChange={v => {
                        const newInterns = [...(formData.internshipDetails || [])];
                        newInterns[idx].organization = v;
                        setFormData({...formData, internshipDetails: newInterns});
                      }} />
                      <Input label="Duration" placeholder="e.g. 6 months" value={intern.duration} onChange={v => {
                        const newInterns = [...(formData.internshipDetails || [])];
                        newInterns[idx].duration = v;
                        setFormData({...formData, internshipDetails: newInterns});
                      }} />
                      <button 
                        type="button"
                        onClick={() => {
                          const newInterns = (formData.internshipDetails || []).filter((_, i) => i !== idx);
                          setFormData({...formData, internshipDetails: newInterns});
                        }}
                        className="absolute -top-2 -right-2 bg-white text-vermilion p-1.5 rounded-full shadow-sm border border-ivory opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {(formData.internshipDetails || []).length === 0 && (
                    <p className="text-xs text-gray-400 italic text-center py-4 border-2 border-dashed border-ivory rounded-2xl">No internships added yet.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-ivory">
                <Select label="Primary Income Range" value={formData.income} options={settings.incomeRanges} onChange={v => setFormData({...formData, income: v})} />
                <Select label="Net Worth Estimate" value={formData.netWorth} options={settings.netWorthRanges} onChange={v => setFormData({...formData, netWorth: v})} />
                <Input label="Disability Status" value={formData.hasDisability} placeholder="e.g. None" onChange={v => setFormData({...formData, hasDisability: v})} />
              </div>
            </motion.section>
          )}

          {currentStep === 4 && (
            <motion.section 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-ivory pb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-vermilion/5 rounded-full flex items-center justify-center">
                  <Users size={16} md:size={20} className="text-vermilion" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-vermilion">Step 4: Family Context</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <Input label="Father's Job" value={formData.fatherJob} onChange={v => setFormData({...formData, fatherJob: v})} />
                <Input label="Mother's Job" value={formData.motherJob} onChange={v => setFormData({...formData, motherJob: v})} />
                <Input label="Siblings" value={formData.siblings} onChange={v => setFormData({...formData, siblings: v})} />
                <textarea 
                  className="sm:col-span-2 w-full p-4 border border-gray-200 rounded-xl md:rounded-2xl bg-ivory/20 text-sm focus:ring-1 focus:ring-gold outline-none min-h-[100px] md:min-h-[120px]" 
                  placeholder="Tell us about your family background and value system..."
                  value={formData.familyBackground}
                  onChange={e => setFormData({...formData, familyBackground: e.target.value})}
                />
              </div>
            </motion.section>
          )}

          {currentStep === 5 && (
            <motion.section 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-ivory pb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gold/5 rounded-full flex items-center justify-center">
                  <Upload size={16} md:size={20} className="text-gold" />
                </div>
                <h3 className="text-lg md:text-xl font-serif font-bold text-vermilion">Step 5: Document Verification</h3>
              </div>
              <p className="text-sm text-gray-500">
                Uploading verification documents increases your profile trust score by 40% and speeds up the manual approval process.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <DocUpload label="Photo" />
                <DocUpload label="Aadhaar Card" />
                <DocUpload label="PAN Card" />
                <DocUpload label="Driving License" />
                <DocUpload label="Passport" />
              </div>
            </motion.section>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 md:mt-10 p-4 bg-red-50/20 rounded-2xl border border-red-100/50 mb-6">
          <p className="text-[10px] text-gray-500 font-serif leading-relaxed italic text-center">
            <strong>Mandatory Notice:</strong> By submitted, you agree that Digital Communique Private limited is not responsible for the authenticity of user declarations. Please verify all facts and partner credentials independently.
          </p>
        </div>

        <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-ivory pt-6 md:pt-8">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button 
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition-all border-2 
                ${currentStep === 1 ? 'opacity-0 cursor-default pointer-events-none' : 'text-vermilion border-vermilion hover:bg-vermilion/5'}`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button 
                type="button"
                onClick={nextStep}
                className="flex-1 md:flex-none bg-vermilion text-white px-8 md:px-10 py-2.5 md:py-3 rounded-full font-bold shadow-xl hover:bg-vermilion-light transition-all flex items-center justify-center gap-2"
              >
                Next Step
              </button>
            ) : (
              <button 
                type="submit"
                className="flex-1 md:flex-none bg-green-600 text-white px-8 md:px-10 py-2.5 md:py-3 rounded-full font-bold shadow-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> Complete
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
