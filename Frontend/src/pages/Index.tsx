import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, XCircle, List, FileText, Image, Link2, Clock } from "lucide-react";
import "./LandingPage.css";

const Index = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (agreed) {
      // Navigate to resume form
      navigate("/resume-form");
    }
  };

  return (
    <div className="landing-page min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Alliance University</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/70" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-center">
            <div className="space-y-6 ml-12">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Powered by<span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent ml-1 animate-gradient">Job Master</span>
              </h1>
              <p className="text-2xl text-muted-foreground">Build your professional resume effortlessly</p>
              <p className="text-lg text-muted-foreground/80">
                Upload your details, follow the Do's and Don'ts, and generate a standout resume in minutes.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative bg-card border border-primary/20 rounded-2xl shadow-[0_0_40px_rgba(234,179,8,0.15)] overflow-hidden">
                  <img src="/images/jm-logo.jpg" alt="Job Master Logo" className="w-48 h-48 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines Section */}
      <section className="py-20 bg-gradient-to-b from-black/90 to-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <List className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">Guidelines & Requirements</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Do's Card */}
            <div className="bg-black/40 border border-success/20 rounded-2xl p-8 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-success" />
                <h3 className="text-2xl font-bold text-success">Do's</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Provide accurate and up-to-date information",
                  "Use professional email addresses",
                  "Include all required social profiles (LinkedIn, GitHub, LeetCode, HackerRank)",
                  "Upload a clear, professional profile photo",
                  "Write detailed project descriptions (max 300 characters each)",
                  "Include at least 3 academic projects",
                  "Add minimum 3 certifications with valid links",
                  "List at least 3 achievements",
                  "Select 3 logos from available options",
                  "Upload portfolio QR images in JPG/PNG format"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts Card */}
            <div className="bg-black/40 border border-destructive/20 rounded-2xl p-8 backdrop-blur-sm hover:shadow-[0_0_40px_rgba(239,68,68,0.1)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-destructive" />
                <h3 className="text-2xl font-bold text-destructive">Don'ts</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Don't use fake or placeholder information",
                  "Don't leave required fields empty",
                  "Don't use unprofessional email addresses",
                  "Don't upload blurry or inappropriate photos",
                  "Don't exceed character limits in descriptions",
                  "Don't submit without completing all mandatory sections",
                  "Don't use broken or invalid URLs for links",
                  "Don't skip the internship/training section",
                  "Don't upload unsupported file formats",
                  "Don't proceed without reading these guidelines"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground">
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-gradient-to-b from-black to-black/90">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-12">
            <FileText className="w-8 h-8 text-primary" />
            <h2 className="text-4xl font-bold text-foreground">Important Requirements</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FileText,
                title: "Form Completion",
                description: "All fields marked with * are mandatory and must be completed before generating your resume."
              },
              {
                icon: Image,
                title: "File Uploads",
                description: "Profile photo and portfolio QR images must be in JPG or PNG format. Maximum file size: 5MB per image."
              },
              {
                icon: Link2,
                title: "Valid Links",
                description: "All social media and certification links must be valid and accessible. Test your links before submitting."
              },
              {
                icon: Clock,
                title: "Time Investment",
                description: "Allow 15-20 minutes to complete the form thoroughly. Rushing may result in an incomplete resume."
              }
            ].map((req, index) => (
              <div key={index} className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <req.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">{req.title}</h4>
                    <p className="text-muted-foreground">{req.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agreement Section */}
      <section className="py-20 bg-gradient-to-b from-black/90 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-black/40 border border-primary/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(234,179,8,0.1)] backdrop-blur-sm">
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-black/20 rounded-xl">
                <Checkbox 
                  id="agreement" 
                  checked={agreed} 
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="mt-1"
                />
                <label 
                  htmlFor="agreement" 
                  className="text-foreground leading-relaxed cursor-pointer select-none"
                >
                  I have read and understood all the guidelines, requirements, and conditions mentioned above.
                  I agree to provide accurate information and complete all mandatory fields before generating my resume.
                </label>
              </div>

              <Button 
                onClick={handleProceed}
                disabled={!agreed}
                size="lg"
                className="w-full text-lg font-semibold bg-gradient-to-r from-primary to-amber-400 hover:from-amber-400 hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]"
              >
                Proceed to Resume Form
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-2">&copy; 2025 AU Resume Maker. All rights reserved.</p>
          <p className="text-muted-foreground/70">Designed for Alliance University students and graduates.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
