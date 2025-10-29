/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFormData, type FormData } from "@/hooks/useFormData";
import { useAutoSave } from "@/hooks/useAutoSave";
import AnimatedBackground from "@/components/AnimatedBackground";
import FormSection from "@/components/FormSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, GraduationCap, Code, Briefcase, Award, Star, Image as ImageIcon, CheckCircle, Rocket, School } from "lucide-react";
import SkillChip from "@/components/SkillChip";
import "./ResumeForm.css";

interface UploadedImages {
  profilePhoto: string | null;
  portfolioImage1: string | null;
  portfolioImage2: string | null;
}

interface LogoOption {
  label: string;
  file: string;
  path: string;
  isCustom?: boolean;
}

const ResumeForm = () => {
  const { toast } = useToast();
  const { formData, setFormData } = useFormData();
  useAutoSave(formData);
  
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({
    profilePhoto: null,
    portfolioImage1: null,
    portfolioImage2: null,
  });

  // Refs for scrolling to empty fields
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const skillOptions = useCallback(() => ({
    programmingLanguages: ["C", "C++","C#", "Java", "Python", "JavaScript", "TypeScript", "Go", "Rust", "Kotlin", "Swift", "PHP", "Ruby", "Other"],
    webTechnologies: ["HTML", "CSS", "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask","Next.js", "Vite.js", "Tailwind CSS", "Bootstrap", "jQuery", "Sass", "Other"],
    databaseTechnologies: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Supabase", "Oracle", "SQL Server", "SQLite", "Other"],
    toolsPlatform: ["Git", "Docker", "Kubernetes", "Jenkins", "VS Code", "Postman", "Figma", "Framer", "Adobe XD", "Other"],
  }), []);

  // State to track custom "Other" input values for each category
  const [customOtherSkills, setCustomOtherSkills] = useState<Record<string, string>>({
    programmingLanguages: "",
    webTechnologies: "",
    databaseTechnologies: "",
    toolsPlatform: "",
  });

  // Initialize customOtherSkills when formData changes (e.g., when loaded from localStorage)
  useEffect(() => {
    const newCustomSkills: Record<string, string> = {
      programmingLanguages: "",
      webTechnologies: "",
      databaseTechnologies: "",
      toolsPlatform: "",
    };

    const skillOptionsObj = skillOptions();
    // Extract custom values from formData skills arrays
    Object.keys(skillOptionsObj).forEach(category => {
      const skills = formData[category as keyof typeof skillOptionsObj] as string[];
      if (skills && Array.isArray(skills)) {
        const customSkill = skills.find(skill => skill.startsWith("Custom: "));
        if (customSkill) {
          newCustomSkills[category] = customSkill.replace("Custom: ", "");
        }
      }
    });

    setCustomOtherSkills(newCustomSkills);
  }, [formData, skillOptions]);

  const logoOptions: LogoOption[] = [
    { label: "LeetCode", file: "leetcode.png", path: "/images/leetcode-logo.png" },
    { label: "HackerRank", file: "hackerrank.png", path: "/images/hackerrank-logo.png" },
    { label: "NPTEL", file: "nptel.png", path: "/images/nptel.png" },
    { label: "Coursera", file: "Coursera.png", path: "/images/Coursera.png" },
    { label: "Oracle", file: "oracle.png", path: "/images/oracle.png" },
    { label: "LinkedIn", file: "linkedin.png", path: "/images/linkedin-logo.png" },
    { label: "Others", file: "others.png", path: "/images/others.png", isCustom: true }
  ];

  // B.Tech Branch options
  const btechBranchOptions = [
    "Select Branch",
    "B.Tech Computer Science Engineering"
  ];

  // B.Tech Specialization options
  const specializationOptions = [
    "Select Specialization",
    "Cloud Computing",
    "Cyber Security",
    "Data Analytics",
    "AI/ML",
    "B.Tech AI/ML",
    "Blockchain",
    "Internet of Things"
  ];

  // Board options for 10th Grade (Secondary Education Boards)
  const tenthBoardOptions = [
    "Select Board",
    "Central Board of Secondary Education (CBSE)",
    "Board of Secondary Education, Andhra Pradesh",
    "Directorate of School Education, Arunachal Pradesh",
    "Board of Secondary Education, Assam",
    "Bihar School Examination Board",
    "Chhattisgarh Board of Secondary Education",
    "Delhi Board of Secondary Education",
    "Goa Board of Secondary and Higher Secondary Education",
    "Gujarat Secondary and Higher Secondary Education Board",
    "Board of School Education, Haryana",
    "Himachal Pradesh Board of School Education",
    "Jharkhand Academic Council",
    "Karnataka Secondary Education Examination Board",
    "Kerala Board of Public Examinations",
    "Madhya Pradesh Board of Secondary Education",
    "Maharashtra State Board of Secondary and Higher Secondary Education",
    "Board of Secondary Education, Manipur",
    "Meghalaya Board of School Education",
    "Mizoram Board of School Education",
    "Nagaland Board of School Education",
    "Board of Secondary Education, Odisha",
    "Punjab School Education Board",
    "Board of Secondary Education, Rajasthan",
    "Sikkim Board of Secondary Education",
    "Tamil Nadu Directorate of Government Examinations",
    "Telangana State Board of Secondary Education",
    "Tripura Board of Secondary Education",
    "Board of High School and Intermediate Education, Uttar Pradesh",
    "Uttarakhand Board of School Education",
    "West Bengal Board of Secondary Education",
    "Jammu and Kashmir Board of School Education"

  ];

  // Board options for 12th Grade (Higher Secondary Education Boards)
  const twelfthBoardOptions = [
    "Select Board",
    "Central Board of Secondary Education (CBSE)",
    "Council for the Indian School Certificate Examinations (CISCE)",
    "Board of Intermediate Education, Andhra Pradesh",
    "Assam Higher Secondary Education Council",
    "Bihar School Examination Board",
    "Chhattisgarh Board of Secondary Education",
    "Delhi Board of Senior Secondary Education",
    "Goa Board of Secondary and Higher Secondary Education",
    "Gujarat Secondary and Higher Secondary Education Board",
    "Board of School Education, Haryana",
    "Himachal Pradesh Board of School Education",
    "Jharkhand Academic Council",
    "Department of Pre-University Education, Karnataka",
    "Directorate of Higher Secondary Education, Kerala",
    "Madhya Pradesh Board of Secondary Education",
    "Maharashtra State Board of Secondary and Higher Secondary Education",
    "Council of Higher Secondary Education, Manipur",
    "Meghalaya Board of School Education",
    "Mizoram Board of School Education",
    "Nagaland Board of School Education",
    "Council of Higher Secondary Education, Odisha",
    "Punjab School Education Board",
    "Board of Secondary Education, Rajasthan",
    "Sikkim Board of Secondary Education",
    "Tamil Nadu Directorate of Government Examinations",
    "Telangana State Board of Intermediate Education",
    "Tripura Board of Secondary Education",
    "Board of High School and Intermediate Education, Uttar Pradesh",
    "Uttarakhand Board of School Education",
    "West Bengal Council of Higher Secondary Education",
    "Jammu and Kashmir Board of School Education"
  ];

  const toggleSkill = (category: keyof ReturnType<typeof skillOptions>, skill: string) => {
    const current = formData[category] as string[];
    if (current.includes(skill)) {
      // Unselect: Remove skill and any custom values
      const updated = current.filter((s) => s !== skill && !s.startsWith("Custom: "));
    setFormData({ ...formData, [category]: updated });
      
      // Clear custom input when "Other" is unselected
      if (skill === "Other") {
        setCustomOtherSkills({ ...customOtherSkills, [category]: "" });
      }
    } else {
      // Select: Add skill
      setFormData({ ...formData, [category]: [...current, skill] });
    }
  };

  const toggleLogo = (logoFile: string) => {
    const current = formData.selectedLogos;
    const isSelected = current.includes(logoFile);
    
    if (isSelected) {
      // Unselect: Remove from array
      const newLogos = current.filter((l) => l !== logoFile);
      setFormData({ ...formData, selectedLogos: newLogos });
      
      // If unselecting "Others", clear custom logos
      if (logoFile === "others.png") {
        setFormData({ ...formData, selectedLogos: newLogos, customLogos: [] });
      }
      
      toast({
        title: "Logo unselected",
        description: `${logoOptions.find(l => l.file === logoFile)?.label} removed`,
      });
    } else {
      // Select: Add to array (allow unlimited selections from predefined, as custom will fill remaining)
      const logoOption = logoOptions.find(l => l.file === logoFile);
      if (logoOption && logoOption.isCustom) {
        // For "Others", just mark it as selected
        setFormData({ ...formData, selectedLogos: [...current, logoFile] });
        toast({
          title: "Custom logos enabled",
          description: "Upload your custom logos below",
        });
      } else {
        // Regular logo selection
        setFormData({ ...formData, selectedLogos: [...current, logoFile] });
        
        const totalLogos = current.length + 1 + formData.customLogos.length;
        const remaining = 4 - totalLogos;
        
        if (remaining > 0) {
          toast({
            title: "Logo selected",
            description: `Select ${remaining} more logo${remaining > 1 ? 's' : ''} or upload custom ones`,
          });
        } else if (remaining === 0) {
          toast({
            title: "All logos selected!",
            description: "You can unselect and reselect if needed",
          });
        }
      }
    }
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const currentCustomLogos = [...formData.customLogos];
      // Ensure array has enough elements
      while (currentCustomLogos.length <= index) {
        currentCustomLogos.push(null as any);
      }
      currentCustomLogos[index] = file;
      setFormData({ ...formData, customLogos: currentCustomLogos });
    }
  };

  const removeCustomLogo = (index: number) => {
    const currentCustomLogos = [...formData.customLogos];
    currentCustomLogos[index] = null as any;
    // Clean up trailing nulls but keep array structure intact
    while (currentCustomLogos.length > 0 && currentCustomLogos[currentCustomLogos.length - 1] === null) {
      currentCustomLogos.pop();
    }
    setFormData({ ...formData, customLogos: currentCustomLogos });
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const convertImageUrlToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return imageUrl; // Return original URL if conversion fails
    }
  };

  const generateResumeHTML = (data: typeof formData, images: UploadedImages, customLogoBase64: string[] = [], logoBase64Map?: Record<string, string>, staticImages?: Record<string, string>) => {
    // Map skills to comma-separated strings
    const skills = {
      programmingLanguages: data.programmingLanguages
        .filter(s => s !== "Other")
        .map(s => s.startsWith("Custom: ") ? s.replace("Custom: ", "") : s)
        .join(", "),
      webTechnologies: data.webTechnologies
        .filter(s => s !== "Other")
        .map(s => s.startsWith("Custom: ") ? s.replace("Custom: ", "") : s)
        .join(", "),
      databaseTechnologies: data.databaseTechnologies
        .filter(s => s !== "Other")
        .map(s => s.startsWith("Custom: ") ? s.replace("Custom: ", "") : s)
        .join(", "),
      toolsPlatforms: data.toolsPlatform
        .filter(s => s !== "Other")
        .map(s => s.startsWith("Custom: ") ? s.replace("Custom: ", "") : s)
        .join(", "),
      others: data.others || "",
    };

    // Helper function to get the correct logo path or base64
    const getLogoPath = (logoFile: string) => {
      // If base64 exists, use it
      if (logoBase64Map && logoBase64Map[logoFile]) {
        return logoBase64Map[logoFile];
      }
      const logoOption = logoOptions.find(l => l.file === logoFile);
      return logoOption?.path || `./images/${logoFile}`;
    };
    
    // Get all logo images (predefined + custom)
    const allLogos: string[] = [];
    
    // Add predefined logos
    for (const logoFile of data.selectedLogos.filter(l => l !== "others.png")) {
      allLogos.push(getLogoPath(logoFile));
    }
    
    // Add custom logos
    allLogos.push(...customLogoBase64);

    return `
    <div class="resume-container" id="resume-content">
        <!-- Header -->
        <div class="header-container">
            <div class="header">
                <img src="${staticImages?.logo || './images/logo.png'}" alt="logo" class="logo-au">
            </div>
            <div class="logo-container">
                ${allLogos.map((logo, index) => `<img src="${logo}" alt="logo${index + 1}" class="hackerrank-logo">`).join('')}
            </div>
        </div>
        
        <!-- Profile Section -->
        <div class="profile-section">
            <div class="profile-left">
                <div class="profile-photo-bg" style="background-image: url('${images.profilePhoto}');"></div>
                <div class="student-name">${data.fullName.toUpperCase()}</div>
            </div>
            <div class="profile-right">
                <div class="contact-info">
                    <div class="contact-item">
                        <img src="${staticImages?.email || './images/email.png'}" alt="Email" class="contact-icon">
                        <div class="email-container">
                            <div class="email-item">
                                <span class="email-label">P:</span>
                                <a class="email-link" href="mailto:${data.personalEmail}">${data.personalEmail}</a>
                            </div>
                            <div class="email-item">
                                <span class="email-label">O:</span>
                                <a class="email-link" href="mailto:${data.officialEmail}">${data.officialEmail}</a>
                            </div>
                        </div>
                    </div>
                    <div class="contact-item">
                        <img src="${staticImages?.phone || './images/phone.png'}" alt="Phone" class="contact-icon">
                        <a href="tel:${data.phone}">${data.phone}</a>
                    </div>
                    ${data.linkedin ? `<div class="contact-item">
                        <img src="${staticImages?.linkedin || './images/linkedin.png'}" alt="LinkedIn" class="contact-icon">
                        <a href="${data.linkedin}" target="_blank">${data.linkedin}</a>
                    </div>` : ''}
                    ${data.github ? `<div class="contact-item">
                        <img src="${staticImages?.github || './images/github.png'}" alt="GitHub" class="contact-icon">
                        <a href="${data.github}" target="_blank">${data.github}</a>
                    </div>` : ''}
                    ${data.leetcode ? `<div class="contact-item">
                        <img src="${staticImages?.leetcode || './images/leetcode.png'}" alt="Leetcode" class="contact-icon">
                        <a href="${data.leetcode}" target="_blank">${data.leetcode}</a>
                    </div>` : ''}
                    ${data.hackerrank ? `<div class="contact-item">
                        <img src="${staticImages?.hackerrank || './images/hackerrank.png'}" alt="HackerRank" class="contact-icon">
                        <a href="${data.hackerrank}" target="_blank">${data.hackerrank}</a>
                    </div>` : ''}
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Left Column -->
            <div class="left-column">
                <!-- Education -->
                <div class="section">
                    <h2 class="section-title">Education</h2>
                    <div class="section-content">
                        <div class="education-item">
                            <div class="edu-header">
                                <div class="degree-line"><div class="degree">${data.btechBranch || 'B.Tech Computer Science and Engineering'}</div>${data.btechSpecialization ? `<div class="specialization">(${data.btechSpecialization})</div>` : ''}</div>
                            </div>
                            <div class="year-gpa">
                                <span>Year of Graduation: ${data.btechYear}</span>
                                <span> | </span>
                                <span>CGPA: ${data.btechGPA}</span>
                            </div>
                        </div>
                        ${data.twelfthBoard || data.twelfthYear || data.twelfthPercentage ? `
                        <div class="education-item">
                            <div class="edu-header">
                                <div class="degree-12">12th Grade</div>
                                <div class="education-details">
                                    ${data.twelfthBoard ? `${data.twelfthBoard} | ` : ''}${data.twelfthSchool ? `${data.twelfthSchool} | ` : ''}Year: ${data.twelfthYear || ''} | Percentage: ${data.twelfthPercentage ? (data.twelfthPercentage.includes('%') ? data.twelfthPercentage : data.twelfthPercentage + '%') : ''}
                            </div>
                            </div>
                        </div>
                        ` : ''}
                        ${data.tenthBoard || data.tenthYear || data.tenthPercentage ? `
                        <div class="education-item">
                            <div class="edu-header">
                                <div class="degree">10th Grade</div>
                                <div class="education-details">
                                    ${data.tenthBoard ? `${data.tenthBoard} | ` : ''}${data.tenthSchool ? `${data.tenthSchool} | ` : ''}Year: ${data.tenthYear || ''} | Percentage: ${data.tenthPercentage ? (data.tenthPercentage.includes('%') ? data.tenthPercentage : data.tenthPercentage + '%') : ''}
                            </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Technical Skills -->
                <div class="section">
                    <h2 class="section-title">Technical Skills</h2>
                    <div class="section-content">
                        <div class="skills-list">
                            <div class="skill-item"><span><b class="bold-title"> 1. Programming Languages:</b></span> ${skills.programmingLanguages}</div>
                            <div class="skill-item"><span><b class="bold-title"> 2. Web Technologies:</b></span> ${skills.webTechnologies}</div>
                            <div class="skill-item"><span><b class="bold-title"> 3. Database Technologies:</b></span> ${skills.databaseTechnologies}</div>
                            <div class="skill-item"><span><b class="bold-title"> 4. Tools/Platforms:</b></span> ${skills.toolsPlatforms}</div>
                            <div class="skill-item"><span><b class="bold-title"> 5. Others:</b></span> ${skills.others}</div>
                        </div>
                    </div>
                </div>

                <!-- Projects -->
                <div class="section">
                    <h2 class="section-title">Academic Projects</h2>
                    <div class="section-content">
                        ${data.projects.filter(p => p.title || p.tech || p.description).map((project, idx) => `
                        <div class="project-item">
                            <div class="project-header">
                                <div class="project-title">${idx + 1}.${project.title}</div>
                                <span class="project-sep">-</span>
                                <span class="project-tech"><b>${project.tech}</b></span>
                            </div>
                            <div class="project-description">${project.description}</div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="right-column">
                <!-- Internships -->
                ${data.internship.jobTitle ? `
                <div class="section">
                    <h2 class="section-title">INTERNSHIPS/TRAINING</h2>
                    <div class="section-content">
                        <div class="experience-item">
                            <div class="job-title">${data.internship.jobTitle}</div>
                            <div class="company">
                                <b>${data.internship.company}</b>
                                <div class="duration"><b>${data.internship.duration}</b></div>
                            </div>
                            <div class="job-description">${data.internship.description}</div>
                        </div>
                    </div>
                </div>
                ` : ''}

                <!-- Certifications -->
                <div class="section">
                    <h2 class="section-title">Certifications</h2>
                    <div class="section-content">
                        ${data.certifications.filter(c => c.name).map((cert, idx) => `
                        <div class="cert-item">
                            <div class="cert-combined"><b>${idx + 1}.</b>${cert.name}${cert.hasLink && cert.link ? ` <a href="${cert.link}" target="_blank" class="cert-link">Link</a>` : ''}</div>
                        </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Achievements -->
                <div class="section">
                    <h2 class="section-title">Achievements & Participations</h2>
                    <div class="section-content">
                        <ul class="achievements-list" style="list-style: none;">
                            ${data.achievements.filter(a => a.title).map((achievement, idx) => `
                            <li><b>${idx + 1}.</b> ${achievement.title}${achievement.hasLink && achievement.link ? ` <a href="${achievement.link}" target="_blank" class="achievement-link">Link</a>` : ''}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                ${images.portfolioImage1 && images.portfolioImage2 ? `
                <div class="section">
                    <h2 class="section-title">PORTFOLIO & VIDEO RESUME</h2>
                    <div class="section-content">
                        <ul class="achievements-img">
                            <img src="${images.portfolioImage1}" alt="qr" class="qr">
                            <img src="${images.portfolioImage2}" alt="qr" class="qr">
                        </ul>
                <div class="duration-list">
                    <p>~1 min</p>
                    <p>~3 min</p>
                </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div class="footer-bold">Alliance School of Advanced Computing </div>
                <div class="footer-bold" style="font-size: 12px;"><b>Faculty of Engineering and Technology</b></div>
                <div style="font-size: 12px;"><b>Alliance University - Central Campus, Chikkahadage Cross Chandapura-Anekal, Main Road, Bengaluru,
                    Karnataka 562106</b></div>
                <div style="font-size: 12px;"><b>www.alliance.edu.in</b></div>
            </div>
        </div>
    </div>
    `;
  };

  const scrollToField = (fieldName: string) => {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const field = fieldRefs.current[fieldName];
      if (field) {
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Try to focus the field if it's focusable
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement || field instanceof HTMLButtonElement) {
          field.focus();
        } else {
          // For wrapper divs, try to find and focus the first focusable child
          const focusableElement = field.querySelector('input, select, textarea, button');
          if (focusableElement instanceof HTMLElement && focusableElement.focus) {
            focusableElement.focus();
          }
        }
      } else {
        // Fallback: try to find by id
        const fallbackField = document.getElementById(fieldName);
        if (fallbackField) {
          fallbackField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Focus the field if it's focusable
          if (fallbackField instanceof HTMLInputElement || fallbackField instanceof HTMLTextAreaElement || fallbackField instanceof HTMLSelectElement || fallbackField instanceof HTMLButtonElement) {
            fallbackField.focus();
          }
        }
      }
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Personal Information Validation
    if (!formData.fullName) {
      toast({
        title: "Missing Full Name",
        description: "Please enter your full name",
        variant: "destructive",
      });
      scrollToField('fullName');
      return;
    }

    if (!formData.profilePhoto) {
      toast({
        title: "Missing Profile Photo",
        description: "Please upload a profile photo with white background",
        variant: "destructive",
      });
      scrollToField('profilePhoto');
      return;
    }

    // Contact Information Validation
    if (!formData.personalEmail) {
      toast({
        title: "Missing Personal Email",
        description: "Please enter your personal email address",
        variant: "destructive",
      });
      scrollToField('personalEmail');
      return;
    }

    if (!formData.officialEmail) {
      toast({
        title: "Missing Official Email",
        description: "Please enter your official email address",
        variant: "destructive",
      });
      scrollToField('officialEmail');
      return;
    }

    if (!formData.phone) {
      toast({
        title: "Missing Phone Number",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      scrollToField('phone');
      return;
    }

    // Education Validation
    if (!formData.btechBranch || formData.btechBranch === "Select Branch") {
      toast({
        title: "Missing B.Tech Branch",
        description: "Please select your B.Tech branch",
        variant: "destructive",
      });
      scrollToField('btechBranch');
      return;
    }

    if (!formData.btechSpecialization || formData.btechSpecialization === "Select Specialization") {
      toast({
        title: "Missing B.Tech Specialization",
        description: "Please select your B.Tech specialization",
        variant: "destructive",
      });
      scrollToField('btechSpecialization');
      return;
    }

    if (!formData.btechYear) {
      toast({
        title: "Missing B.Tech Year",
        description: "Please enter your B.Tech year",
        variant: "destructive",
      });
      scrollToField('btechYear');
      return;
    }

    if (!formData.btechGPA) {
      toast({
        title: "Missing B.Tech GPA",
        description: "Please enter your B.Tech GPA",
        variant: "destructive",
      });
      scrollToField('btechGPA');
      return;
    }

    // 12th Grade Validation
    if (!formData.twelfthBoard || formData.twelfthBoard === "Select Board") {
      toast({
        title: "Missing 12th Grade Board",
        description: "Please select your 12th grade board",
        variant: "destructive",
      });
      scrollToField('twelfthBoard');
      return;
    }

    if (!formData.twelfthYear) {
      toast({
        title: "Missing 12th Grade Year",
        description: "Please enter your 12th grade year",
        variant: "destructive",
      });
      scrollToField('twelfthYear');
      return;
    }

    if (!formData.twelfthPercentage) {
      toast({
        title: "Missing 12th Grade Percentage",
        description: "Please enter your 12th grade percentage",
        variant: "destructive",
      });
      scrollToField('twelfthPercentage');
      return;
    }

    if (!formData.twelfthSchool) {
      toast({
        title: "Missing 12th Grade School/College",
        description: "Please enter your 12th grade school/college name",
        variant: "destructive",
      });
      scrollToField('twelfthSchool');
      return;
    }

    // 10th Grade Validation
    if (!formData.tenthBoard || formData.tenthBoard === "Select Board") {
      toast({
        title: "Missing 10th Grade Board",
        description: "Please select your 10th grade board",
        variant: "destructive",
      });
      scrollToField('tenthBoard');
      return;
    }

    if (!formData.tenthYear) {
      toast({
        title: "Missing 10th Grade Year",
        description: "Please enter your 10th grade year",
        variant: "destructive",
      });
      scrollToField('tenthYear');
      return;
    }

    if (!formData.tenthPercentage) {
      toast({
        title: "Missing 10th Grade Percentage",
        description: "Please enter your 10th grade percentage",
        variant: "destructive",
      });
      scrollToField('tenthPercentage');
      return;
    }

    if (!formData.tenthSchool) {
      toast({
        title: "Missing 10th Grade School",
        description: "Please enter your 10th grade school name",
        variant: "destructive",
      });
      scrollToField('tenthSchool');
      return;
    }

    // Projects Validation (first 3 are required)
    for (let i = 0; i < 3; i++) {
      const project = formData.projects[i];
      if (!project) {
        toast({
          title: `Missing Project ${i + 1}`,
          description: `Please add Project ${i + 1} details`,
          variant: "destructive",
        });
        scrollToField('project1Title');
        return;
      }
      if (!project.title) {
        toast({
          title: `Project ${i + 1} Incomplete`,
          description: `Please enter the title for Project ${i + 1}`,
          variant: "destructive",
        });
        scrollToField(`project${i + 1}Title`);
        return;
      }
      if (!project.tech) {
        toast({
          title: `Project ${i + 1} Incomplete`,
          description: `Please enter the technologies for Project ${i + 1}`,
          variant: "destructive",
        });
        scrollToField(`project${i + 1}Tech`);
        return;
      }
      if (!project.description) {
        toast({
          title: `Project ${i + 1} Incomplete`,
          description: `Please enter the description for Project ${i + 1}`,
          variant: "destructive",
        });
        scrollToField(`project${i + 1}Description`);
        return;
      }
      const wordCount = countWords(project.description);
      if (wordCount < 10 || wordCount > 30) {
        toast({
          title: `Project ${i + 1} Description Invalid`,
          description: `Description must be between 10-30 words (currently ${wordCount})`,
          variant: "destructive",
        });
        scrollToField(`project${i + 1}Description`);
        return;
      }
    }

    // Certifications Validation (first 3 are required)
    for (let i = 0; i < 3; i++) {
      const cert = formData.certifications[i];
      if (!cert || !cert.name) {
        toast({
          title: `Missing Certification ${i + 1}`,
          description: `Please enter Certification ${i + 1}`,
          variant: "destructive",
        });
        scrollToField(`certification${i + 1}`);
        return;
      }
      if (cert.hasLink && !cert.link) {
        toast({
          title: `Certification ${i + 1} Link Missing`,
          description: `Please provide a link for Certification ${i + 1} or uncheck the link option`,
          variant: "destructive",
        });
        scrollToField(`certification${i + 1}Link`);
        return;
      }
      if (cert.hasLink && cert.link && !cert.link.startsWith("https://")) {
        toast({
          title: `Certification ${i + 1} Invalid Link`,
          description: `Link must start with https://`,
          variant: "destructive",
        });
        scrollToField(`certification${i + 1}Link`);
        return;
      }
    }

    // Achievements Validation (first 3 are required)
    for (let i = 0; i < 3; i++) {
      const achievement = formData.achievements[i];
      if (!achievement || !achievement.title) {
        toast({
          title: `Missing Achievement ${i + 1}`,
          description: `Please enter Achievement ${i + 1}`,
          variant: "destructive",
        });
        scrollToField(`achievement${i + 1}`);
        return;
      }
      if (achievement.hasLink && !achievement.link) {
        toast({
          title: `Achievement ${i + 1} Link Missing`,
          description: `Please provide a link for Achievement ${i + 1} or uncheck the link option`,
          variant: "destructive",
        });
        scrollToField(`achievement${i + 1}Link`);
        return;
      }
      if (achievement.hasLink && achievement.link && !achievement.link.startsWith("https://")) {
        toast({
          title: `Achievement ${i + 1} Invalid Link`,
          description: `Link must start with https://`,
          variant: "destructive",
        });
        scrollToField(`achievement${i + 1}Link`);
        return;
      }
    }

    // Logo Selection Validation
    const predefinedCount = formData.selectedLogos.filter(l => l !== "others.png").length;
    const customCount = formData.customLogos.filter(logo => logo !== null).length;
    const totalLogoCount = predefinedCount + customCount;
    
    if (totalLogoCount !== 4) {
      toast({
        title: "Logo Selection Incomplete",
        description: `Please select exactly 4 logos (currently ${totalLogoCount}: ${predefinedCount} predefined + ${customCount} custom)`,
        variant: "destructive",
      });
      scrollToField('selectedLogos');
      return;
    }
    
    // Validate custom logos if "Others" is selected
    if (formData.selectedLogos.includes("others.png")) {
      const requiredCustom = 4 - predefinedCount;
      const actualCustomCount = formData.customLogos.filter(logo => logo !== null).length;
      if (actualCustomCount !== requiredCustom) {
        toast({
          title: "Custom Logos Incomplete",
          description: `Please upload exactly ${requiredCustom} custom logo(s) (currently ${actualCustomCount})`,
          variant: "destructive",
        });
        scrollToField('selectedLogos');
        return;
      }
    }

    // Technical Skills Validation
    if (!formData.programmingLanguages || formData.programmingLanguages.length === 0 || 
        (formData.programmingLanguages.length === 1 && formData.programmingLanguages[0] === "Other")) {
    toast({
        title: "Programming Languages Required",
        description: "Please select at least one programming language",
        variant: "destructive",
      });
      scrollToField('programmingLanguages');
      return;
    }

    if (!formData.webTechnologies || formData.webTechnologies.length === 0 ||
        (formData.webTechnologies.length === 1 && formData.webTechnologies[0] === "Other")) {
      toast({
        title: "Web Technologies Required",
        description: "Please select at least one web technology",
        variant: "destructive",
      });
      scrollToField('webTechnologies');
      return;
    }

    if (!formData.databaseTechnologies || formData.databaseTechnologies.length === 0 ||
        (formData.databaseTechnologies.length === 1 && formData.databaseTechnologies[0] === "Other")) {
      toast({
        title: "Database Technologies Required",
        description: "Please select at least one database technology",
        variant: "destructive",
      });
      scrollToField('databaseTechnologies');
      return;
    }

    if (!formData.toolsPlatform || formData.toolsPlatform.length === 0 ||
        (formData.toolsPlatform.length === 1 && formData.toolsPlatform[0] === "Other")) {
      toast({
        title: "Tools/Platform Required",
        description: "Please select at least one tool",
        variant: "destructive",
      });
      scrollToField('toolsPlatform');
      return;
    }

    // Others field validation
    if (!formData.others || formData.others.trim() === "") {
      toast({
        title: "Others Required",
        description: "Please enter other skills (e.g., AWS, Figma)",
        variant: "destructive",
      });
      scrollToField('others');
      return;
    }

    // Portfolio QR validation
    if (!formData.portfolioQR || !formData.videoResumeQR) {
      toast({
        title: "Missing QR Codes",
        description: "Please upload both portfolio and video resume QR codes",
        variant: "destructive",
      });
      scrollToField('portfolioQR');
      return;
    }

    // Generate resume
    (async () => {
      try {
        // Convert files to base64 (use uploadedImages if already converted, otherwise convert now)
        const images: UploadedImages = {
          profilePhoto: uploadedImages.profilePhoto || null,
          portfolioImage1: uploadedImages.portfolioImage1 || null,
          portfolioImage2: uploadedImages.portfolioImage2 || null,
        };
        
        // If any images are missing from uploadedImages, convert them now
        if (!images.profilePhoto && formData.profilePhoto && formData.profilePhoto instanceof File) {
          images.profilePhoto = await convertFileToBase64(formData.profilePhoto);
        }
        if (!images.portfolioImage1 && formData.portfolioQR && formData.portfolioQR instanceof File) {
          images.portfolioImage1 = await convertFileToBase64(formData.portfolioQR);
        }
        if (!images.portfolioImage2 && formData.videoResumeQR && formData.videoResumeQR instanceof File) {
          images.portfolioImage2 = await convertFileToBase64(formData.videoResumeQR);
        }

        // Convert static images to base64 for PDF generation
        const logoBase64Map: Record<string, string> = {};
        for (const logoFile of formData.selectedLogos.filter(l => l !== "others.png")) {
          const logoOption = logoOptions.find(l => l.file === logoFile);
          if (logoOption) {
            try {
              logoBase64Map[logoFile] = await convertImageUrlToBase64(logoOption.path);
            } catch (error) {
              console.error(`Failed to convert logo ${logoFile} to base64:`, error);
              // Fallback to using the path directly
              logoBase64Map[logoFile] = logoOption.path;
            }
          } else {
            console.error(`Logo option not found for ${logoFile}`);
          }
        }
        
        // Convert custom logos to base64
        const customLogosBase64: string[] = [];
        for (let i = 0; i < formData.customLogos.length; i++) {
          const customLogo = formData.customLogos[i];
          if (customLogo) {
            const base64 = await convertFileToBase64(customLogo);
            customLogosBase64.push(base64);
          }
        }

        // Convert other static images (logo, email, phone, etc.)
        const staticImages: Record<string, string> = {};
        try {
          staticImages['logo'] = await convertImageUrlToBase64('/images/logo.png');
          staticImages['email'] = await convertImageUrlToBase64('/images/email.png');
          staticImages['phone'] = await convertImageUrlToBase64('/images/phone.png');
          staticImages['linkedin'] = await convertImageUrlToBase64('/images/linkedin.png');
          staticImages['github'] = await convertImageUrlToBase64('/images/github.png');
          staticImages['leetcode'] = await convertImageUrlToBase64('/images/leetcode.png');
          staticImages['hackerrank'] = await convertImageUrlToBase64('/images/hackerrank.png');
        } catch (error) {
          console.error('Error converting static images:', error);
        }

        // Generate HTML
        const resumeHTML = generateResumeHTML(formData, images, customLogosBase64, logoBase64Map, staticImages);

        // Store in sessionStorage
        const resumeData = {
          formData,
          uploadedImages: images,
          selectedLogos: formData.selectedLogos,
          customLogos: customLogosBase64,
          logoBase64Map,
          resumeHTML,
        };

        sessionStorage.setItem('resumeData', JSON.stringify(resumeData));

        toast({
          title: "Resume Generated!",
          description: "Opening preview in new tab...",
        });

        // Open preview page
        window.open('/preview', '_blank');
      } catch (error) {
        console.error('Error generating resume:', error);
        toast({
          title: "Generation Failed",
          description: "An error occurred while generating your resume",
          variant: "destructive",
        });
      }
    })();
  };

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gradient mb-4">
              Alliance University Resume Builder
            </h1>
            <p className="text-muted-foreground text-lg">
              Create your professional resume with ease
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <FormSection title="Personal Information" icon={<User />}>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-foreground">Full Name *</Label>
                    <Input
                      id="fullName"
                      ref={(el) => { fieldRefs.current['fullName'] = el; }}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profilePhoto" className="text-foreground">Profile Photo (White Background) *</Label>
                    <Input
                      id="profilePhoto"
                      type="file"
                      ref={(el) => { if (el) fieldRefs.current['profilePhoto'] = el; }}
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                        setFormData({ ...formData, profilePhoto: file });
                          try {
                            const base64 = await convertFileToBase64(file);
                            setUploadedImages({ ...uploadedImages, profilePhoto: base64 });
                          } catch (error) {
                            console.error('Error uploading image:', error);
                          }
                        }
                      }}
                      className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                      required
                    />
                    {(formData.profilePhoto instanceof File || uploadedImages.profilePhoto) && (
                      <div className="mt-4 flex justify-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-secondary shadow-glow">
                          <img
                            src={uploadedImages.profilePhoto || URL.createObjectURL(formData.profilePhoto as File)}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Contact Info */}
            <FormSection title="Contact Information" icon={<Phone />}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="personalEmail" className="text-foreground">Personal Email *</Label>
                  <Input
                    id="personalEmail"
                    type="email"
                    ref={(el) => { fieldRefs.current['personalEmail'] = el; }}
                    value={formData.personalEmail}
                    onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                    className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="officialEmail" className="text-foreground">Official Email *</Label>
                  <Input
                    id="officialEmail"
                    type="email"
                    ref={(el) => { fieldRefs.current['officialEmail'] = el; }}
                    value={formData.officialEmail}
                    onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                    className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-foreground">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    ref={(el) => { fieldRefs.current['phone'] = el; }}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin" className="text-foreground">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="github" className="text-foreground">GitHub</Label>
                  <Input
                    id="github"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="leetcode" className="text-foreground">LeetCode</Label>
                  <Input
                    id="leetcode"
                    value={formData.leetcode}
                    onChange={(e) => setFormData({ ...formData, leetcode: e.target.value })}
                    className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                  />
                </div>
                <div>
                  <Label htmlFor="hackerrank" className="text-foreground">HackerRank</Label>
                  <Input
                    id="hackerrank"
                    value={formData.hackerrank}
                    onChange={(e) => setFormData({ ...formData, hackerrank: e.target.value })}
                    className="glass mt-2 border-white/20 focus:border-secondary focus:ring-secondary"
                  />
                </div>
              </div>
            </FormSection>

            {/* Education */}
            <FormSection title="Education" icon={<GraduationCap />}>
              <div className="space-y-6">
                <div className="glass rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">B.Tech *</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div ref={(el) => { if (el) fieldRefs.current['btechBranch'] = el; }}>
                      <Label className="text-foreground">Branch *</Label>
                      <Select
                        value={formData.btechBranch}
                        onValueChange={(value) => setFormData({ ...formData, btechBranch: value })}
                        required
                      >
                        <SelectTrigger id="btechBranch" className="glass mt-2 border-white/20">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/20">
                          {btechBranchOptions.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div ref={(el) => { if (el) fieldRefs.current['btechSpecialization'] = el; }}>
                      <Label className="text-foreground">Specialization *</Label>
                      <Select
                        value={formData.btechSpecialization}
                        onValueChange={(value) => setFormData({ ...formData, btechSpecialization: value })}
                        required
                      >
                        <SelectTrigger id="btechSpecialization" className="glass mt-2 border-white/20">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/20">
                          {specializationOptions.map((specialization) => (
                            <SelectItem key={specialization} value={specialization}>
                              {specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground">Year *</Label>
                      <Input
                        id="btechYear"
                        ref={(el) => { if (el) fieldRefs.current['btechYear'] = el; }}
                        value={formData.btechYear}
                        onChange={(e) => setFormData({ ...formData, btechYear: e.target.value })}
                        className="glass mt-2 border-white/20"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-foreground">CGPA *</Label>
                      <Input
                        id="btechGPA"
                        ref={(el) => { if (el) fieldRefs.current['btechGPA'] = el; }}
                        value={formData.btechGPA}
                        onChange={(e) => setFormData({ ...formData, btechGPA: e.target.value })}
                        className="glass mt-2 border-white/20"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="glass rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">12th Grade *</h3>
                    <div className="space-y-3">
                      <div ref={(el) => { if (el) fieldRefs.current['twelfthBoard'] = el; }}>
                        <Select
                        value={formData.twelfthBoard}
                          onValueChange={(value) => setFormData({ ...formData, twelfthBoard: value })}
                          required
                        >
                          <SelectTrigger id="twelfthBoard" className="glass border-white/20">
                            <SelectValue placeholder="Select Board" />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/20">
                            {twelfthBoardOptions.map((board) => (
                              <SelectItem key={board} value={board}>
                                {board}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        id="twelfthYear"
                        ref={(el) => { if (el) fieldRefs.current['twelfthYear'] = el; }}
                        placeholder="Year *"
                        value={formData.twelfthYear}
                        onChange={(e) => setFormData({ ...formData, twelfthYear: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                      <Input
                        id="twelfthPercentage"
                        ref={(el) => { if (el) fieldRefs.current['twelfthPercentage'] = el; }}
                        placeholder="Percentage *"
                        value={formData.twelfthPercentage}
                        onChange={(e) => setFormData({ ...formData, twelfthPercentage: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                      <Input
                        id="twelfthSchool"
                        ref={(el) => { if (el) fieldRefs.current['twelfthSchool'] = el; }}
                        placeholder="School/College *"
                        value={formData.twelfthSchool}
                        onChange={(e) => setFormData({ ...formData, twelfthSchool: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="glass rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4">10th Grade *</h3>
                    <div className="space-y-3">
                      <div ref={(el) => { if (el) fieldRefs.current['tenthBoard'] = el; }}>
                        <Select
                        value={formData.tenthBoard}
                          onValueChange={(value) => setFormData({ ...formData, tenthBoard: value })}
                          required
                        >
                          <SelectTrigger id="tenthBoard" className="glass border-white/20">
                            <SelectValue placeholder="Select Board" />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/20">
                            {tenthBoardOptions.map((board) => (
                              <SelectItem key={board} value={board}>
                                {board}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        id="tenthYear"
                        ref={(el) => { if (el) fieldRefs.current['tenthYear'] = el; }}
                        placeholder="Year *"
                        value={formData.tenthYear}
                        onChange={(e) => setFormData({ ...formData, tenthYear: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                      <Input
                        id="tenthPercentage"
                        ref={(el) => { if (el) fieldRefs.current['tenthPercentage'] = el; }}
                        placeholder="Percentage *"
                        value={formData.tenthPercentage}
                        onChange={(e) => setFormData({ ...formData, tenthPercentage: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                      <Input
                        id="tenthSchool"
                        ref={(el) => { if (el) fieldRefs.current['tenthSchool'] = el; }}
                        placeholder="School *"
                        value={formData.tenthSchool}
                        onChange={(e) => setFormData({ ...formData, tenthSchool: e.target.value })}
                        className="glass border-white/20"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Technical Skills */}
            <FormSection title="Technical Skills *" icon={<Code />}>
              <div className="space-y-6">
                {Object.entries(skillOptions()).map(([category, skills]) => {
                  const displayNames: Record<string, string> = {
                    programmingLanguages: "1. Programming Languages",
                    webTechnologies: "2. Web Technologies",
                    databaseTechnologies: "3. Database Technologies",
                    toolsPlatform: "4. Tools/Platform",
                  };
                  const isOtherSelected = formData[category as keyof ReturnType<typeof skillOptions>].includes("Other");
                  
                  return (
                    <div key={category} ref={(el) => { if (el) fieldRefs.current[category] = el; }}>
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        {displayNames[category] || category} *
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {skills.map((skill) => (
                          <SkillChip
                            key={skill}
                            label={skill}
                            selected={formData[category as keyof ReturnType<typeof skillOptions>].includes(skill)}
                            onClick={() => toggleSkill(category as keyof ReturnType<typeof skillOptions>, skill)}
                          />
                        ))}
                      </div>
                      {isOtherSelected && (
                        <div className="mt-3">
                          <Input
                            placeholder={`Enter custom ${displayNames[category]?.replace(/^\d+\.\s*/, '').toLowerCase() || category}`}
                            value={customOtherSkills[category]}
                            onChange={(e) => {
                              setCustomOtherSkills({
                                ...customOtherSkills,
                                [category]: e.target.value
                              });
                              // Update the custom value in form data
                              const currentSkills = formData[category as keyof ReturnType<typeof skillOptions>] as string[];
                              const keepSkills = currentSkills.filter(s => !s.startsWith("Custom: "));
                              const customValue = e.target.value.trim();
                              if (customValue) {
                                setFormData({
                                  ...formData,
                                  [category]: [...keepSkills, `Custom: ${customValue}`]
                                });
                              } else {
                                // If custom value is empty, remove all custom entries but keep selected skills
                                setFormData({
                                  ...formData,
                                  [category]: keepSkills
                                });
                              }
                            }}
                            className="glass border-white/20 mt-2"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* 5th Category: Others */}
                <div ref={(el) => { if (el) fieldRefs.current['others'] = el; }}>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    5. Others *
                  </h3>
                  <Input
                    id="others"
                    value={formData.others}
                    onChange={(e) => setFormData({ ...formData, others: e.target.value })}
                    className="glass mt-2 border-white/20"
                    placeholder="e.g., AWS, Figma"
                    required
                  />
                </div>
              </div>
            </FormSection>

            {/* Projects */}
            <FormSection title="Academic Projects" icon={<Briefcase />}>
              <div className="space-y-4">
                {formData.projects.slice(0, 3).map((project, index) => (
                  <div key={index} className="glass rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-secondary mb-3">
                      Project {index + 1} {index < 2 ? '*' : ''}
                    </h3>
                    <div className="space-y-3">
                      <Input
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => {
                          const updated = [...formData.projects];
                          updated[index].title = e.target.value;
                          setFormData({ ...formData, projects: updated });
                        }}
                        className="glass border-white/20"
                        required={index < 2}
                      />
                      <Input
                        placeholder="Technologies Used"
                        value={project.tech}
                        onChange={(e) => {
                          const updated = [...formData.projects];
                          updated[index].tech = e.target.value;
                          setFormData({ ...formData, projects: updated });
                        }}
                        className="glass border-white/20"
                        required={index < 2}
                      />
                      <div>
                        <Textarea
                          placeholder="Description (10-30 words)"
                          value={project.description}
                          onChange={(e) => {
                            const updated = [...formData.projects];
                            updated[index].description = e.target.value;
                            setFormData({ ...formData, projects: updated });
                          }}
                          className="glass border-white/20 h-[120px] resize-none"
                          required={index < 2}
                        />
                        <p className={`text-sm mt-1 ${
                          countWords(project.description) < 10 || countWords(project.description) > 30
                            ? "text-destructive"
                            : "text-success"
                        }`}>
                          Word count: {countWords(project.description)} / 10-30
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FormSection>

            {/* Internship */}
            <FormSection title="Internship/Training" icon={<Briefcase />}>
              <div className="space-y-4">
                <Input
                  placeholder="Job Title"
                  value={formData.internship.jobTitle}
                  onChange={(e) => setFormData({
                    ...formData,
                    internship: { ...formData.internship, jobTitle: e.target.value }
                  })}
                  className="glass border-white/20"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Company"
                    value={formData.internship.company}
                    onChange={(e) => setFormData({
                      ...formData,
                      internship: { ...formData.internship, company: e.target.value }
                    })}
                    className="glass border-white/20"
                  />
                  <Input
                    placeholder="Duration"
                    value={formData.internship.duration}
                    onChange={(e) => setFormData({
                      ...formData,
                      internship: { ...formData.internship, duration: e.target.value }
                    })}
                    className="glass border-white/20"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Description (10-40 words)"
                    value={formData.internship.description}
                    onChange={(e) => setFormData({
                      ...formData,
                      internship: { ...formData.internship, description: e.target.value }
                    })}
                    className="glass border-white/20 h-[120px] resize-none"
                  />
                  <p className={`text-sm mt-1 ${
                    countWords(formData.internship.description) < 10 || countWords(formData.internship.description) > 40
                      ? "text-destructive"
                      : "text-success"
                  }`}>
                    Word count: {countWords(formData.internship.description)} / 10-40
                  </p>
                </div>
              </div>
            </FormSection>

            {/* Certifications */}
            <FormSection title="Certifications" icon={<Award />}>
              <div className="space-y-4">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="glass rounded-lg p-4">
                    <div className="space-y-3">
                      <Input
                        placeholder={`Certification ${index + 1}${index < 3 ? " *" : ""}`}
                        value={cert.name}
                        onChange={(e) => {
                          const updated = [...formData.certifications];
                          updated[index].name = e.target.value;
                          setFormData({ ...formData, certifications: updated });
                        }}
                        className="glass border-white/20"
                        required={index < 3}
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`cert-link-${index}`}
                          checked={cert.hasLink}
                          onChange={(e) => {
                            const updated = [...formData.certifications];
                            updated[index].hasLink = e.target.checked;
                            setFormData({ ...formData, certifications: updated });
                          }}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`cert-link-${index}`} className="text-foreground">
                          Add Link
                        </Label>
                      </div>
                      {cert.hasLink && (
                        <Input
                          placeholder="https://"
                          value={cert.link}
                          onChange={(e) => {
                            const updated = [...formData.certifications];
                            updated[index].link = e.target.value;
                            setFormData({ ...formData, certifications: updated });
                          }}
                          className="glass border-white/20"
                          pattern="https://.*"
                        />
                      )}
                    </div>
                  </div>
                ))}
                {formData.certifications.length < 5 && (
                  <Button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      certifications: [...formData.certifications, { name: "", hasLink: false, link: "" }]
                    })}
                    variant="outline"
                    className="w-full glass border-secondary text-secondary hover:bg-secondary/10"
                  >
                    Add Another Certification
                  </Button>
                )}
              </div>
            </FormSection>

            {/* Achievements */}
            <FormSection title="Achievements/Participations" icon={<Star />}>
              <div className="space-y-4">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="glass rounded-lg p-4">
                    <div className="space-y-3">
                      <Input
                        placeholder={`Achievement ${index + 1}${index < 3 ? " *" : ""}`}
                        value={achievement.title}
                        onChange={(e) => {
                          const updated = [...formData.achievements];
                          updated[index].title = e.target.value;
                          setFormData({ ...formData, achievements: updated });
                        }}
                        className="glass border-white/20"
                        required={index < 3}
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`achievement-link-${index}`}
                          checked={achievement.hasLink}
                          onChange={(e) => {
                            const updated = [...formData.achievements];
                            updated[index].hasLink = e.target.checked;
                            setFormData({ ...formData, achievements: updated });
                          }}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={`achievement-link-${index}`} className="text-foreground">
                          Add Link
                        </Label>
                      </div>
                      {achievement.hasLink && (
                        <Input
                          placeholder="https://"
                          value={achievement.link}
                          onChange={(e) => {
                            const updated = [...formData.achievements];
                            updated[index].link = e.target.value;
                            setFormData({ ...formData, achievements: updated });
                          }}
                          className="glass border-white/20"
                          pattern="https://.*"
                        />
                      )}
                    </div>
                  </div>
                ))}
                {formData.achievements.length < 5 && (
                  <Button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      achievements: [...formData.achievements, { title: "", hasLink: false, link: "" }]
                    })}
                    variant="outline"
                    className="w-full glass border-secondary text-secondary hover:bg-secondary/10"
                  >
                    Add Another Achievement
                  </Button>
                )}
              </div>
            </FormSection>

            {/* Portfolio & Video Resume */}
            <FormSection title="Portfolio & Video Resume" icon={<ImageIcon />}>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="portfolioQR" className="text-foreground">Portfolio QR Code *</Label>
                  <Input
                    id="portfolioQR"
                    ref={(el) => { if (el) fieldRefs.current['portfolioQR'] = el; }}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, portfolioQR: file });
                      if (file) {
                        try {
                          const base64 = await convertFileToBase64(file);
                          setUploadedImages({ ...uploadedImages, portfolioImage1: base64 });
                        } catch (error) {
                          console.error('Error uploading image:', error);
                        }
                      }
                    }}
                    className="glass mt-2 border-white/20"
                    required
                  />
                  {(formData.portfolioQR instanceof File || uploadedImages.portfolioImage1) && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative w-38 h-38 rounded-lg overflow-hidden border-2 border-secondary shadow-glow">
                        <img
                          src={uploadedImages.portfolioImage1 || URL.createObjectURL(formData.portfolioQR as File)}
                          alt="Portfolio QR Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="videoResumeQR" className="text-foreground">Video Resume QR Code *</Label>
                  <Input
                    id="videoResumeQR"
                    ref={(el) => { if (el) fieldRefs.current['videoResumeQR'] = el; }}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, videoResumeQR: file });
                      if (file) {
                        try {
                          const base64 = await convertFileToBase64(file);
                          setUploadedImages({ ...uploadedImages, portfolioImage2: base64 });
                        } catch (error) {
                          console.error('Error uploading image:', error);
                        }
                      }
                    }}
                    className="glass mt-2 border-white/20"
                    required
                  />
                  {(formData.videoResumeQR instanceof File || uploadedImages.portfolioImage2) && (
                    <div className="mt-4 flex justify-center">
                      <div className="relative w-38 h-38 rounded-lg overflow-hidden border-2 border-secondary shadow-glow">
                        <img
                          src={uploadedImages.portfolioImage2 || URL.createObjectURL(formData.videoResumeQR as File)}
                          alt="Video Resume QR Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            {/* Logo Selection */}
            <FormSection title="Logo Selection" icon={<CheckCircle />}>
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground">Select exactly 4 logos *</p>
                {formData.selectedLogos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, selectedLogos: [], customLogos: [] });
                      toast({
                        title: "Logos cleared",
                        description: "All logos unselected",
                      });
                    }}
                    className="text-sm text-destructive hover:text-destructive/80 underline"
                  >
                    Clear all ({formData.selectedLogos.length})
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {logoOptions.map((logo) => {
                  // Skip rendering the custom option as it's handled separately
                  if (logo.isCustom) return null;
                  
                  return (
                    <button
                      key={logo.label}
                      type="button"
                      onClick={() => toggleLogo(logo.file)}
                      className={`glass rounded-lg p-3 text-center transition-all duration-200 relative overflow-hidden h-auto cursor-pointer group ${
                        formData.selectedLogos.includes(logo.file)
                          ? "border-2 border-secondary bg-gradient-to-br from-secondary/20 to-secondary/5 ring-2 ring-secondary/30 hover:border-secondary/70"
                          : "border border-white/10 hover:border-white/30 hover:shadow-lg"
                      }`}
                      title={formData.selectedLogos.includes(logo.file) 
                        ? "Click to unselect" 
                        : "Click to select"}
                    >
                      <div className="flex flex-col items-center justify-center h-full min-h-[80px]">
                        <div className={`relative mb-2 ${formData.selectedLogos.includes(logo.file) ? 'scale-110' : ''} transition-transform duration-200`}>
                          <img 
                            src={logo.path} 
                            alt={logo.label}
                            className="w-16 h-16 object-contain filter brightness-0 invert opacity-90"
                            loading="lazy"
                          />
                        </div>
                        <p className={`text-foreground font-medium text-xs ${formData.selectedLogos.includes(logo.file) ? 'text-secondary font-bold' : ''}`}>
                          {logo.label}
                        </p>
                        {formData.selectedLogos.includes(logo.file) && (
                          <>
                            <div className="absolute top-1 right-1 bg-secondary rounded-full p-1 shadow-lg animate-pulse">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-transparent rounded-lg"></div>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Others button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => toggleLogo("others.png")}
                  className={`glass rounded-lg p-3 w-full text-center transition-all duration-200 relative overflow-hidden cursor-pointer ${
                    formData.selectedLogos.includes("others.png")
                      ? "border-2 border-secondary bg-gradient-to-br from-secondary/20 to-secondary/5 ring-2 ring-secondary/30"
                      : "border border-white/10 hover:border-white/30 hover:shadow-lg"
                  }`}
                >
                  <p className={`text-foreground font-medium ${formData.selectedLogos.includes("others.png") ? 'text-secondary font-bold' : ''}`}>
                    Others (Upload Custom Logos)
                  </p>
                  {formData.selectedLogos.includes("others.png") && (
                    <div className="absolute top-1 right-1 bg-secondary rounded-full p-1 shadow-lg">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>

              {/* Custom Logo Upload Section */}
              {formData.selectedLogos.includes("others.png") && (
                <div className="mt-4 glass rounded-lg p-4 border border-secondary/30">
                  <p className="text-sm text-secondary font-semibold mb-3">
                    Upload Custom Logos ({4 - formData.selectedLogos.filter(l => l !== "others.png").length} required)
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 - formData.selectedLogos.filter(l => l !== "others.png").length }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCustomLogoUpload(e, index)}
                          className="glass border-white/20"
                        />
                        {formData.customLogos[index] && (
                          <div className="relative">
                            <div className="w-full h-32 rounded-lg overflow-hidden border-2 border-secondary">
                              <img
                                src={URL.createObjectURL(formData.customLogos[index])}
                                alt={`Custom logo ${index + 1}`}
                                className="w-full h-full object-contain bg-white/5"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCustomLogo(index)}
                              className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-2">
                Selected: {formData.selectedLogos.filter(l => l !== "others.png").length} predefined + {formData.customLogos.filter(logo => logo !== null).length} custom = {(formData.selectedLogos.filter(l => l !== "others.png").length + formData.customLogos.filter(logo => logo !== null).length)} / 4
              </p>
              
              {/* Debug Info */}
              {formData.selectedLogos.filter(l => l !== "others.png").length > 0 && (
                <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/30">
                  <p className="text-sm text-secondary font-semibold mb-1">Selected Predefined Logos:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedLogos.filter(l => l !== "others.png").map((logoFile, idx) => {
                      const logoOption = logoOptions.find(l => l.file === logoFile);
                      return (
                        <span key={idx} className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                          {logoOption?.label || logoFile}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </FormSection>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                className="bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white px-12 py-6 text-lg font-semibold rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300"
              >
                <Rocket className="w-6 h-6 mr-2" />
                Generate Resume
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResumeForm;

