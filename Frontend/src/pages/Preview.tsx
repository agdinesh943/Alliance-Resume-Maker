import React, { useEffect, useRef, useState } from 'react';

// Single-file React component converted from the provided HTML.
// Usage: import ResumePreview from './ResumePreview'; then render <ResumePreview /> in your app.
// Notes:
// - This component reads `sessionStorage.resumeData` (same key as your original page).
// - resumeHTML is injected with `dangerouslySetInnerHTML` into the container with a ref.
// - PDF generation posts the inner HTML to the same backend endpoint used in the original script.
// - No external icon libraries are required; a simple inline SVG document icon is used.

export default function ResumePreview() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [resumeHTML, setResumeHTML] = useState('');
  const [resumeCode, setResumeCode] = useState<string | null>(null);
  const resumeContentRef = useRef(null);

  useEffect(() => {
    // Load data from sessionStorage on mount
    try {
      const storedData = sessionStorage.getItem('resumeData');
      if (!storedData) {
        // If you prefer a nicer UI behavior, replace alert/navigation with your router navigation
        alert('No resume data found. Please fill out the form first.');
        // Redirect to the form
        window.location.href = '/';
        return;
      }

      const parsed = JSON.parse(storedData);
      setResumeData(parsed);
      setFormData(parsed.formData || {});
      setResumeHTML(parsed.resumeHTML || '');
      
      // Load resume code if previously stored
      const storedCode = sessionStorage.getItem('lastResumeCode');
      if (storedCode) {
        setResumeCode(storedCode);
      }

      if (parsed.formData && parsed.formData.fullName) {
        document.title = `Resume - ${parsed.formData.fullName}`;
      }
    } catch (err) {
      console.error('Error loading resume data:', err);
      alert('Error loading resume data. Please try again.');
      window.location.href = '/';
    }
  }, []);

  async function handleDownload() {
    if (!resumeContentRef.current) return;
    const element = resumeContentRef.current;
    const username = (formData && (formData.fullName || formData.studentName))
      ? String(formData.fullName || formData.studentName).replace(/\s+/g, '_')
      : 'resume';

    setLoading(true);

    try {
      // Force production URL for testing
      const isProduction = true; // window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProduction
        ? 'https://resume-backend-kzg9.onrender.com'
        : 'http://localhost:5000';
      
      const pdfUrl = `${apiUrl}/generate-pdf`;

      const response = await fetch(pdfUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ html: element.innerHTML, username })
      });

      if (!response.ok) throw new Error('PDF generation failed');

      // Get the resume code from response headers FIRST
      const code = response.headers.get('X-Resume-Code');
      console.log('Resume code from server:', code);
      
      if (code) {
        setResumeCode(code);
        sessionStorage.setItem('lastResumeCode', code);
      }

      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength === 0) throw new Error('PDF response is empty');

      const uint8Array = new Uint8Array(arrayBuffer.slice(0, 4));
      const header = String.fromCharCode(...uint8Array);
      if (!header.startsWith('%PDF')) throw new Error('Invalid PDF format - not a PDF file');

      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${username}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('PDF generation failed. Please try again or use the browser print function.');
    } finally {
      setLoading(false);
    }
  }

  // Complete resume styles to prevent overlap and ensure perfect display
  const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  
  .download-container { 
    margin-bottom: 50px; 
    margin-top: 20px; 
    text-align: center; 
    width: 100%; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
  }
  
  .download-btn { 
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
    color: white; 
    border: none; 
    padding: 12px 24px; 
    font-size: 16px; 
    font-weight: bold; 
    border-radius: 8px; 
    cursor: pointer; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
    transition: all 0.3s ease; 
    display: inline-flex; 
    gap: 8px; 
    align-items: center; 
  }
  
  .download-btn:hover { 
    background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); 
    transform: translateY(-2px); 
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); 
  }
  
  .download-btn:disabled { 
    background: #6c757d; 
    cursor: not-allowed; 
  }
  
  .resume-container { 
    width: 210mm; 
    min-height: 297mm; 
    margin: 0 auto; 
    margin-top: 0; 
    margin-bottom: 0; 
    background: white; 
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); 
    padding: 0 6mm; 
    position: relative; 
    overflow: visible; 
    box-sizing: border-box; 
    border: 2px solid #ddd; 
    border-radius: 8px; 
  }
  
  .header-container { 
    display: flex; 
    align-items: center; 
    margin-top: 1mm; 
    position: relative; 
    z-index: 10; 
  }
  
  .header { 
    color: white; 
    margin: -6mm -6mm 0 -6mm; 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
  }
  
  .header .logo, .logo-au { 
    width: 650px; 
    height: 90px; 
    padding-left: 5px; 
    object-fit: contain; 
    margin-top: 5px; 
  }
  
  .logo-container { 
    margin-left: 60px; 
    height: 80px; 
    width: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: flex-end; 
    gap: 8px; 
    flex-wrap: nowrap; 
    overflow: hidden; 
  }
  
  .hackerrank-logo, .leetcode-logo { 
    width: 90px; 
    height: 50px; 
    object-fit: contain; 
    vertical-align: middle; 
    margin-bottom: 20px; 
    flex-shrink: 0; 
  }
  
  .profile-section { 
    display: flex; 
    // margin-bottom: 8px; 
    padding-bottom: 6px; 
  }
  
  .profile-left { 
    flex: 1; 
    width: 50%; 
    display: flex; 
    align-items: center; 
    text-align: center; 
    gap: 12px; 
    padding-right: 12px; 
  }
  
  .profile-photo-bg { 
    width: 140px; 
    height: 140px; 
    border-radius: 50%; 
    overflow: hidden; 
    background-size: cover; 
    background-position: center; 
    background-repeat: no-repeat; 
    display: block; 
    flex-shrink: 0; 
  }
  
  .student-name { 
    font-size: 20px; 
    font-weight: bold; 
    color: rgb(0, 67, 95); 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    line-height: 1.2; 
  }
  
  .profile-right { 
    flex: 1; 
    width: 50%; 
    padding-left: 12px; 
  }
  
  .contact-info { 
    display: flex; 
    flex-direction: column; 
  }
  
  .contact-item { 
    display: flex; 
    align-items: center; 
    font-size: 15px; 
    margin-bottom: 3px; 
    color: black; 
  }
  
  .contact-item a { 
    text-decoration: none; 
    color: black; 
    margin-left: 8px; 
  }
  
  .email-container { 
    margin-left: 8px; 
    color: black; 
  }
  
  .email-item { 
    display: flex; 
    align-items: center; 
    margin-bottom: 2px; 
  }
  
  .email-label { 
    font-weight: bold; 
    color: black; 
    min-width: 10px; 
  }
  
  .email-item { 
    color: black; 
  }
  
  .email-link { 
    color: black; 
    text-decoration: none; 
  }
  
  .contact-icon { 
    width: 20px; 
    height: 20px; 
    object-fit: contain; 
    flex-shrink: 0; 
  }
  
  .main-content { 
    display: flex; 
    gap: 12px; 
    margin-bottom: 15mm; 
  }
  
  .left-column { 
    flex: 1; 
  }
  
  .right-column { 
    flex: 1; 
  }
  
  .section { 
    margin-bottom: 10px; 
  }
  
  .section-title { 
    font-size: 18px; 
    font-weight: bold; 
    color: rgb(0, 67, 95); 
    text-transform: uppercase; 
    letter-spacing: 1px; 
  }
  
  .section-content { 
    font-size: 14px; 
    line-height: 1.3; 
    color: black; 
  }
  
  .education-item { 
    margin-bottom: 2px; 
    padding-bottom: 1px; 
  }
  
  .degree, .degree-12 { 
    font-weight: bold; 
    color: black; 
    font-size: 16px; 
    margin-bottom: 2px; 
  }
  
  .education-details { 
    font-size: 14px; 
    text-align: justify; 
    width: 98%; 
    color: black; 
    margin-top: 2px; 
    line-height: 1.4; 
  }
  
  .edu-header { 
    display: block; 
    align-items: baseline; 
    gap: 8px; 
  }
  
  .degree-line { 
    display: flex; 
    flex-wrap: wrap; 
    column-gap: 6px; 
    // row-gap: 2px; 
    align-items: baseline; 
  }
  
  .specialization { 
    font-weight: 600; 
    color: black; 
    font-size: 14px; 
  }
  
  .year-gpa { 
    white-space: nowrap; 
    font-size: 14px; 
    width: 100%; 
    color: black; 
  }
  
  .skills-list { 
    display: flex; 
    flex-direction: column; 
    gap: 1px; 
    width: 95%; 
  }
  
  .skill-item { 
    font-size: 14px; 
    line-height: 1.3; 
    color: black; 
    margin-bottom: 1px; 
    width: 95%; 
  }
  
  .bold-title { 
    font-weight: bold; 
    text-align: left;
  }
  
  .project-item { 
    margin-bottom: 8px; 
  }
  
  .project-header { 
    display: flex; 
    flex-wrap: wrap; 
    align-items: baseline; 
  }
  
  .project-title { 
    font-weight: bold; 
    color: black; 
    font-size: 15px; 
    margin-bottom: 1px; 
    text-align: left; 
  }
  
  .project-sep { 
    margin: 0 6px; 
    color: black; 
  }
  
  .project-tech { 
    color: black; 
    font-size: 14px; 
    margin: 0; 
    flex-shrink: 0; 
    white-space: nowrap; 
    text-align: left; 
  }
  
  .project-description { 
    font-size: 14px; 
    color: black; 
    margin-top: 0; 
    text-align: justify; 
    width: 95%; 
  }
  
  .experience-item { 
    margin-bottom: 6px; 
    padding-bottom: 4px; 
  }
  
  .job-title { 
    font-weight: bold; 
    color: black; 
    font-size: 15px; 
  }
  
  .company { 
    color: black; 
    font-size: 14px; 
    margin: 1px 0; 
    display: flex; 
    justify-content: space-between; 
  }
  
  .duration { 
    color: black; 
    font-size: 13px; 
    font-weight: 500; 
  }
  
  .job-description { 
    font-size: 14px; 
    color: black; 
    margin-top: 2px; 
    text-align: justify; 
    width: 98%; 
  }
  
  .cert-item { 
    margin-bottom: 5px; 
    padding-bottom: 3px; 
  }
  
  .cert-combined { 
    font-weight: normal; 
    color: black; 
    font-size: 14px; 
    line-height: 1.3; 
    text-align: justify; 
  }
  
  .cert-link, .achievement-link { 
    color: rgb(0, 67, 95); 
    cursor: pointer; 
    text-decoration: underline; 
    font-weight: normal; 
  }
  
  .cert-link:hover, .achievement-link:hover { 
    text-decoration: none; 
  }
  
  .achievements-list { 
    list-style: none; 
    padding: 0; 
  }
  
  .achievements-list li { 
    margin-bottom: 4px; 
    position: relative; 
    font-size: 14px; 
    color: black; 
    text-align: justify; 
  }
  
  .qr { 
    width: 120px; 
    height: 120px; 
  }
  
  .achievements-img { 
    display: flex; 
    justify-content: space-evenly; 
  }
  
  .duration-list { 
    display: flex; 
    justify-content: space-evenly; 
  }
  
  .footer { 
    position: absolute; 
    bottom: 1mm; 
    left: 6mm; 
    right: 6mm; 
    text-align: center; 
    padding-top: 8px; 
    z-index: 10; 
  }
  
  .footer-bold { 
    font-weight: 800 !important; 
  }
  
  .footer-content { 
    font-size: 14px; 
    color: black; 
    line-height: 1.2; 
  }
  
  .back-button { 
    position: fixed; 
    top: 20px; 
    left: 20px; 
    z-index: 1000; 
    background: #007bff; 
    color: white; 
    border: none; 
    border-radius: 50%; 
    width: 50px; 
    height: 50px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    cursor: pointer; 
    box-shadow: 0 4px 8px rgba(0,0,0,0.2); 
    transition: all 0.3s ease; 
    font-size: 20px; 
  }
  
  .back-button:hover { 
    background: #0056b3; 
    transform: translateY(-2px); 
    box-shadow: 0 6px 12px rgba(0,0,0,0.3); 
  }
  
  /* Print/PDF styles */
  @media print {
    * { 
      -webkit-print-color-adjust: exact !important; 
      print-color-adjust: exact !important; 
      color-adjust: exact !important; 
    }
    
    img { 
      image-rendering: -webkit-optimize-contrast; 
      image-rendering: crisp-edges; 
      max-width: 100%; 
      height: auto; 
    }
    
    html, body { 
      margin: 0 !important; 
      padding: 0 !important; 
    }
    
    .resume-container { 
      width: 210mm !important; 
      min-height: 297mm !important; 
      box-shadow: none !important; 
      margin: 0 auto !important; 
      padding: 0 6mm !important; 
      position: relative !important; 
    }
    
    .header-container { 
      margin-top: 0mm !important; 
      padding-top: 0 !important; 
      position: relative; 
      z-index: 10; 
    }
    
    .footer { 
      position: absolute !important; 
      bottom: 1mm !important; 
      left: 6mm !important; 
      right: 6mm !important; 
      margin: 0 !important; 
      padding: 6px 0 0 0 !important; 
      z-index: 10; 
    }
    
    .main-content { 
      margin-bottom: 15mm !important; 
      padding-bottom: 0 !important; 
    }
    
    .profile-section { 
      margin-top: 0 !important; 
      padding-top: 0 !important; 
    }
    
    .logo-au { 
      width: 650px !important; 
      height: 90px !important; 
      margin-left: 10px !important; 
      object-fit: contain !important; 
    }
    
    .logo-container { 
      height: 80px !important; 
      display: flex !important; 
      align-items: center !important; 
      justify-content: flex-end !important; 
      gap: 8px !important; 
      flex-wrap: nowrap !important; 
      overflow: hidden !important; 
      width: 100% !important; 
    }
    
    .hackerrank-logo, .leetcode-logo { 
      width: 90px !important; 
      height: 50px !important; 
      object-fit: contain !important; 
      vertical-align: middle !important; 
      margin-bottom: 20px !important; 
      flex-shrink: 0 !important; 
    }
    
    .profile-photo-bg { 
      width: 140px !important; 
      height: 140px !important; 
      border-radius: 50% !important; 
      background-size: cover !important; 
      background-position: center !important; 
      background-repeat: no-repeat !important; 
    }
    
    .project-title { 
      text-align: left !important; 
      word-spacing: normal !important; 
      letter-spacing: normal !important; 
    }
    
    .project-tech { 
      text-align: left !important; 
      word-spacing: normal !important; 
      letter-spacing: normal !important; 
    }
  }
  `;

  // small inline SVG for document icon (keeps the component self-contained)
  const DocumentIcon = ({ size = 18 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 17h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="resume-page-wrapper">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="download-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          {resumeCode && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontFamily: 'Monaco, Courier New, monospace',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}>
                Your Resume Code: {resumeCode}
              </div>
              <div style={{
                background: '#f8f9fa',
                color: '#495057',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '14px',
                textAlign: 'center',
                border: '1px solid #e9ecef',
                maxWidth: '400px',
                lineHeight: '1.4'
              }}>
                💾 <strong>Save this code!</strong> Use it when filling out Microsoft Forms later to track your resume submissions.
              </div>
            </div>
          )}
          <button
            className="download-btn"
            onClick={handleDownload}
            disabled={loading}
            title="Download PDF"
          >
            <DocumentIcon />
            {loading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="resume-wrapper" id="resumeWrapper">
        {/* This container will hold the server-backed resume HTML. Keep the id for compatibility. */}
        <div ref={resumeContentRef}  dangerouslySetInnerHTML={{ __html: resumeHTML }} />
      </div>
    </div>
  );
}
