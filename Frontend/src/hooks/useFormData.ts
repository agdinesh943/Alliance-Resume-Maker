import { useState, useEffect } from "react";

export interface Project {
  title: string;
  tech: string;
  description: string;
}

export interface Internship {
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
}

export interface Certification {
  name: string;
  hasLink: boolean;
  link: string;
}

export interface Achievement {
  title: string;
  hasLink: boolean;
  link: string;
}

export interface FormData {
  // Personal Info
  fullName: string;
  profilePhoto: File | null;
  
  // Contact Info
  personalEmail: string;
  officialEmail: string;
  phone: string;
  linkedin: string;
  github: string;
  leetcode: string;
  hackerrank: string;
  
  // Education
  btechBranch: string;
  btechSpecialization: string;
  btechYear: string;
  btechGPA: string;
  twelfthBoard: string;
  twelfthYear: string;
  twelfthPercentage: string;
  twelfthSchool: string;
  tenthBoard: string;
  tenthYear: string;
  tenthPercentage: string;
  tenthSchool: string;
  
  // Technical Skills
  programmingLanguages: string[];
  webTechnologies: string[];
  databaseTechnologies: string[];
  toolsPlatform: string[];
  others: string;
  
  // Projects
  projects: Project[];
  
  // Internship
  internship: Internship;
  
  // Certifications
  certifications: Certification[];
  
  // Achievements
  achievements: Achievement[];
  
  // Portfolio
  portfolioQR: File | null;
  videoResumeQR: File | null;
  
  // Logo Selection
  selectedLogos: string[];
  customLogos: (File | null)[];
}

const initialFormData: FormData = {
  fullName: "",
  profilePhoto: null,
  personalEmail: "",
  officialEmail: "",
  phone: "",
  linkedin: "",
  github: "",
  leetcode: "",
  hackerrank: "",
  btechBranch: "",
  btechSpecialization: "",
  btechYear: "",
  btechGPA: "",
  twelfthBoard: "",
  twelfthYear: "",
  twelfthPercentage: "",
  twelfthSchool: "",
  tenthBoard: "",
  tenthYear: "",
  tenthPercentage: "",
  tenthSchool: "",
  programmingLanguages: [],
  webTechnologies: [],
  databaseTechnologies: [],
  toolsPlatform: [],
  others: "",
  projects: [
    { title: "", tech: "", description: "" },
    { title: "", tech: "", description: "" },
    { title: "", tech: "", description: "" },
  ],
  internship: {
    jobTitle: "",
    company: "",
    duration: "",
    description: "",
  },
  certifications: [
    { name: "", hasLink: false, link: "" },
    { name: "", hasLink: false, link: "" },
    { name: "", hasLink: false, link: "" },
  ],
  achievements: [
    { title: "", hasLink: false, link: "" },
    { title: "", hasLink: false, link: "" },
    { title: "", hasLink: false, link: "" },
  ],
  portfolioQR: null,
  videoResumeQR: null,
  selectedLogos: [],
  customLogos: [],
};

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const savedData = localStorage.getItem("resumeFormData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({ ...initialFormData, ...parsed });
      } catch (error) {
        console.error("Failed to load saved form data:", error);
      }
    }
  }, []);

  return { formData, setFormData };
};
