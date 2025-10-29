// Global variables for storing uploaded images
let uploadedImages = {
    profilePhoto: null,
    portfolioImage1: null,
    portfolioImage2: null
};

// Global variable for storing selected logos
let selectedLogos = [];

// Persist plain text form fields in localStorage
const FORM_STORAGE_KEY = 'resumeMaker.formData.v1';

// Error handling functions
function clearAllErrors() {
    // Remove all existing error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    // Remove error styling from inputs
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
        const input = group.querySelector('input, textarea, select');
        if (input) {
            input.classList.remove('error-input');
        }
    });
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formGroup = field.closest('.form-group');
    if (!formGroup) return;

    // Remove existing error message for this field
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Add error styling
    formGroup.classList.add('has-error');
    field.classList.add('error-input');

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    // Insert error message after the input field
    formGroup.appendChild(errorElement);
}

function scrollToFirstError() {
    const firstError = document.querySelector('.has-error');
    if (firstError) {
        firstError.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        // Focus on the input field if it exists
        const input = firstError.querySelector('input, textarea, select');
        if (input) {
            input.focus();
        }
    }
}


function debounce(fn, delay) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
}

// File upload handlers
document.getElementById('profilePhoto').addEventListener('change', function (e) {
    handleFileUpload(e, 'profilePhoto');
});

document.getElementById('portfolioImage1').addEventListener('change', function (e) {
    handleFileUpload(e, 'portfolioImage1');
});

document.getElementById('portfolioImage2').addEventListener('change', function (e) {
    handleFileUpload(e, 'portfolioImage2');
});

// Logo selection handlers will be attached in the main DOMContentLoaded event

function handleFileUpload(event, imageType) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImages[imageType] = e.target.result;
            // Images are not persisted - they will be lost on page refresh
        };
        reader.readAsDataURL(file);
    }
}

function handleLogoSelection(event) {
    const checkbox = event.target;
    const logoValue = checkbox.value;

    if (checkbox.checked) {
        // Add logo to selection if not already present and limit to 4
        if (selectedLogos.length < 4 && !selectedLogos.includes(logoValue)) {
            selectedLogos.push(logoValue);
        } else if (selectedLogos.length >= 4) {
            // Uncheck the checkbox if we already have 4 logos
            checkbox.checked = false;
            alert('You can select a maximum of 4 logos.');
        }
    } else {
        // Remove logo from selection
        const index = selectedLogos.indexOf(logoValue);
        if (index > -1) {
            selectedLogos.splice(index, 1);
        }
    }

    // Clear logo error if we have enough logos selected
    if (selectedLogos.length >= 4) {
        const logoError = document.querySelector('.logo-error');
        if (logoError) {
            logoError.remove();
        }
    }

    // Update visual feedback
    updateLogoSelectionUI();
}

function updateLogoSelectionUI() {
    const logoCheckboxes = document.querySelectorAll('input[name="selectedLogos"]');
    logoCheckboxes.forEach(checkbox => {
        const logoValue = checkbox.value;
        const isSelected = selectedLogos.includes(logoValue);

        if (isSelected && !checkbox.checked) {
            checkbox.checked = true;
        } else if (!isSelected && checkbox.checked) {
            checkbox.checked = false;
        }
    });
}

// Handle achievement/certification link checkbox toggle
function handleAchievementLinkToggle(event) {
    const checkbox = event.target;
    const isAchievement = checkbox.id.includes('achievementLinkCheck');
    const number = checkbox.id.replace(/.*?(achievementLinkCheck|certLinkCheck)(\d+).*/, '$2');
    const linkGroupId = isAchievement ? `achievementLinkGroup${number}` : `certLinkGroup${number}`;
    const linkInputId = isAchievement ? `achievementLink${number}` : `certLink${number}`;
    const linkGroup = document.getElementById(linkGroupId);
    const linkInput = document.getElementById(linkInputId);

    if (checkbox.checked) {
        linkGroup.style.display = 'block';
        linkInput.required = false; // Make it optional
    } else {
        linkGroup.style.display = 'none';
        linkInput.value = ''; // Clear the input when unchecked
        linkInput.required = false;
    }
}

// Handle link checkbox state changes to restore/clear link fields from localStorage
function handleLinkCheckboxChange(event) {
    const checkbox = event.target;
    const isAchievement = checkbox.id.includes('achievementLinkCheck');
    const number = checkbox.id.replace(/.*?(achievementLinkCheck|certLinkCheck)(\d+).*/, '$2');
    const linkFieldId = isAchievement ? `achievementLink${number}` : `certLink${number}`;
    const linkInput = document.getElementById(linkFieldId);

    if (checkbox.checked) {
        // Restore link field value from localStorage if available
        try {
            const raw = localStorage.getItem(FORM_STORAGE_KEY);
            if (raw) {
                const data = JSON.parse(raw);
                if (data[linkFieldId]) {
                    linkInput.value = data[linkFieldId];
                }
            }
        } catch (_) { }
    } else {
        // Clear link field when unchecked
        linkInput.value = '';
    }
}

// Save text inputs to localStorage
const saveFormToStorage = debounce(function () {
    try {
        const form = document.getElementById('resumeForm');
        const fields = Array.from(form.querySelectorAll('input[type="text"], input[type="email"], input[type="url"], input[type="tel"], textarea, select'));
        const data = {};
        fields.forEach(el => { data[el.id] = el.value; });
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
    } catch (_) { }
}, 200);

function restoreFormFromStorage() {
    try {
        const raw = localStorage.getItem(FORM_STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
                // Check if this is a link field that should only be filled if checkbox is checked
                if (id.includes('achievementLink') || id.includes('certLink')) {
                    const linkNumber = id.replace(/.*?(achievementLink|certLink)(\d+).*/, '$2');
                    const checkboxId = id.includes('achievementLink') ?
                        `achievementLinkCheck${linkNumber}` :
                        `certLinkCheck${linkNumber}`;
                    const checkbox = document.getElementById(checkboxId);

                    // Only fill link field if checkbox exists and is checked
                    if (checkbox && checkbox.checked) {
                        el.value = data[id];
                    }
                } else {
                    el.value = data[id];
                }
            }
        });
    } catch (_) { }
}

function attachPersistenceHandlers() {
    const form = document.getElementById('resumeForm');
    const fields = Array.from(form.querySelectorAll('input[type="text"], input[type="email"], input[type="url"], input[type="tel"], textarea, select'));
    fields.forEach(el => {
        el.addEventListener('input', saveFormToStorage);
        el.addEventListener('change', saveFormToStorage);

        // Clear error when user starts typing
        el.addEventListener('input', function () {
            clearFieldError(el);
        });
        el.addEventListener('change', function () {
            clearFieldError(el);
        });
    });

    // Clear errors for file inputs when files are selected
    const fileInputs = Array.from(form.querySelectorAll('input[type="file"]'));
    fileInputs.forEach(el => {
        el.addEventListener('change', function () {
            clearFieldError(el);
        });
    });
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error');
        field.classList.remove('error-input');

        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}


// Initialize technical skills options handlers
function initTechnicalSkillsOptions() {
    // Restore selected skills from localStorage
    restoreSelectedSkills();

    // Initialize all option skill clicks
    document.querySelectorAll('.option-skill').forEach(option => {
        option.addEventListener('click', function () {
            option.classList.toggle('selected');
            updateSkillsHiddenField(option.closest('.form-group'));
        });
    });
}

// Restore selected skills from localStorage
function restoreSelectedSkills() {
    try {
        const raw = localStorage.getItem(FORM_STORAGE_KEY);
        if (!raw) return;

        const data = JSON.parse(raw);

        // Get all skills fields
        const skillFields = ['programmingLanguages', 'webTechnologies', 'databaseTechnologies', 'toolsPlatforms', 'others'];

        skillFields.forEach(fieldName => {
            const skillValue = data[fieldName];
            if (!skillValue) return;

            // Find the hidden input
            const hiddenInput = document.getElementById(fieldName);
            if (!hiddenInput) return;

            // Get the container
            const container = hiddenInput.previousElementSibling;
            if (!container || !container.classList.contains('options-container')) return;

            // Split the value into individual skills
            const skills = skillValue.split(',').map(s => s.trim());

            // Select matching option skills
            const options = container.querySelectorAll('.option-skill');
            options.forEach(option => {
                if (skills.includes(option.textContent.trim())) {
                    option.classList.add('selected');
                }
            });

            // Update the hidden field value
            hiddenInput.value = skillValue;
        });
    } catch (err) {
        console.error('Error restoring skills:', err);
    }
}

// Update the hidden field with selected skills
function updateSkillsHiddenField(formGroup) {
    const container = formGroup.querySelector('.options-container');
    const hiddenInput = formGroup.querySelector('input[type="hidden"]');

    if (!container || !hiddenInput) return;

    const selected = Array.from(container.querySelectorAll('.option-skill.selected'))
        .map(skill => skill.textContent.trim())
        .join(', ');

    hiddenInput.value = selected;

    // Trigger save to localStorage
    saveFormToStorage();
}

// Initialize persistence on load
window.addEventListener('DOMContentLoaded', function () {
    restoreFormFromStorage();
    attachPersistenceHandlers();
    initProjectDescriptionCounters();
    initTechnicalSkillsOptions();

    // Attach logo selection handlers
    const logoCheckboxes = document.querySelectorAll('input[name="selectedLogos"]');
    logoCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleLogoSelection);
    });

    // Add event listeners for achievement link checkboxes
    document.querySelectorAll('.link-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleAchievementLinkToggle);
    });

    // Add event listeners for checkbox state changes to restore/clear link fields
    document.querySelectorAll('.link-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleLinkCheckboxChange);
    });
    // Add dynamic project add button
    const addBtn = document.getElementById('addProjectBtn');
    const extraContainer = document.getElementById('extraProjectsContainer');
    let extraProjectCount = 0; // allows up to 2 extras (Projects 4 and 5) - total 5 projects (3 required + 2 optional)
    function createProjectGroup(index) {
        const group = document.createElement('div');
        group.className = 'project-group';
        group.dataset.index = String(index);
        group.innerHTML = `
            <h3>Project ${index}</h3>
            <div class="form-row">
                <div class="form-group">
                    <label for="projectTitle${index}">Project Title</label>
                    <input type="text" id="projectTitle${index}" name="projectTitle${index}">
                </div>
                <div class="form-group">
                    <label for="projectTech${index}">Technologies Used</label>
                    <input type="text" id="projectTech${index}" name="projectTech${index}" placeholder="e.g., Python, OpenCV, Flask">
                </div>
            </div>
            <div class="form-group">
                <label for="projectDescription${index}">Project Description (10-30 words)</label>
                <textarea id="projectDescription${index}" name="projectDescription${index}" rows="3"></textarea>
                <div class="char-counter" id="pd${index}Counter">0/30 words</div>
            </div>
            <div class="form-actions" style="justify-content:flex-start; margin-top: 6px; border-top:none; padding-top:0;">
                <button type="button" class="btn-remove-project preview-btn" data-remove-index="${index}" style="min-width:auto;background:linear-gradient(135deg,#ef4444 0%,#b91c1c 100%);"><ion-icon name="trash"></ion-icon> Remove project</button>
            </div>
        `;
        return group;
    }
    function updateAddButtonState() {
        if (!addBtn) return;
        const remaining = 2 - extraProjectCount; // 2 slots: 4 and 5
        if (remaining <= 0) {
            addBtn.disabled = true;
            addBtn.textContent = 'Max 5 projects reached';
        } else {
            addBtn.disabled = false;
            addBtn.textContent = `+ Add another project (${remaining} left)`;
        }
    }

    if (addBtn && extraContainer) {
        updateAddButtonState();
        addBtn.addEventListener('click', function () {
            if (extraProjectCount >= 2) return; // cap at 5 total
            extraProjectCount += 1;
            const index = 2 + extraProjectCount + 1; // start from 4 if only 2 mandatory
            const group = createProjectGroup(index);
            extraContainer.appendChild(group);
            // attach counter for new textarea
            const el = group.querySelector(`#projectDescription${index}`);
            const c = group.querySelector(`#pd${index}Counter`);
            if (el && c) {
                const max = 30;
                const min = 10;
                const update = () => {
                    const val = el.value || '';
                    const words = val.trim().split(/\s+/).filter(word => word.length > 0);
                    const wordCount = words.length;

                    // If word count exceeds limit, truncate to the last valid word
                    if (wordCount > max) {
                        const truncatedWords = words.slice(0, max);
                        el.value = truncatedWords.join(' ');
                        const finalWordCount = truncatedWords.length;
                        c.textContent = `${finalWordCount}/${max} words`;
                        c.style.color = finalWordCount < min ? '#ef4444' : '#000000';
                    } else {
                        c.textContent = `${wordCount}/${max} words`;
                        c.style.color = wordCount < min ? '#ef4444' : '#000000';
                    }
                };
                el.addEventListener('input', update);
                el.addEventListener('change', update);
                update();
            }
            // wire remove button
            const removeBtn = group.querySelector('.btn-remove-project');
            if (removeBtn) {
                removeBtn.addEventListener('click', function () {
                    group.remove();
                    extraProjectCount = Math.max(0, extraProjectCount - 1);
                    updateAddButtonState();
                });
            }
            updateAddButtonState();
        });
    }

    // Form submission handler
    const form = document.getElementById('resumeForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            saveFormToStorage();
            generateResume();
        });

        // Direct click handler for the submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.addEventListener('click', function (e) {
                e.preventDefault();
                saveFormToStorage();
                generateResume();
            });
        }
    }
});

function generateResume() {
    const formData = getFormData();
    if (!validateForm(formData)) {
        return;
    }

    // Store form data and images in sessionStorage for preview page
    const resumeData = {
        formData: formData,
        uploadedImages: uploadedImages,
        selectedLogos: selectedLogos,
        resumeHTML: generateResumeHTML(formData, uploadedImages, selectedLogos)
    };

    sessionStorage.setItem('resumeData', JSON.stringify(resumeData));

    // Open preview page in new tab
    window.open('/preview', '_blank');
}

// Live word counters for project descriptions and internship description
function initProjectDescriptionCounters() {
    const inputs = [
        { id: 'projectDescription1', counter: 'pd1Counter', max: 30, min: 10 },
        { id: 'projectDescription2', counter: 'pd2Counter', max: 30, min: 10 },
        { id: 'projectDescription3', counter: 'pd3Counter', max: 30, min: 10 },
        { id: 'jobDescription', counter: 'jobDescriptionCounter', max: 40, min: 10 }
    ];
    inputs.forEach(({ id, counter, max, min }) => {
        const el = document.getElementById(id);
        const c = document.getElementById(counter);
        if (!el || !c) return;
        const update = () => {
            const val = el.value || '';
            const words = val.trim().split(/\s+/).filter(word => word.length > 0);
            const wordCount = words.length;

            // If word count exceeds limit, truncate to the last valid word
            if (wordCount > max) {
                const truncatedWords = words.slice(0, max);
                el.value = truncatedWords.join(' ');
                const finalWordCount = truncatedWords.length;
                c.textContent = `${finalWordCount}/${max} words`;
                c.style.color = finalWordCount < min ? '#ef4444' : '#000000';
            } else {
                c.textContent = `${wordCount}/${max} words`;
                c.style.color = wordCount < min ? '#ef4444' : '#000000';
            }
        };
        el.addEventListener('input', update);
        el.addEventListener('change', update);
        update();
    });
}


function getFormData() {
    const base = {
        studentName: document.getElementById('studentName').value,
        personalEmail: document.getElementById('personalEmail').value,
        officialEmail: document.getElementById('officialEmail').value,
        phone: document.getElementById('phone').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        leetcode: document.getElementById('leetcode').value,
        hackerrank: document.getElementById('hackerrank').value,

        // Education
        degree1: document.getElementById('degree1').value,
        specialization1: document.getElementById('specialization1') ? document.getElementById('specialization1').value : '',
        year1: document.getElementById('year1').value,
        gpa1: document.getElementById('gpa1').value,
        degree2: document.getElementById('degree2').value,
        board_of_education1: document.getElementById('university2').value,
        year2: document.getElementById('year2').value,
        gpa2: document.getElementById('gpa2').value,
        degree3: document.getElementById('degree3').value,
        coll_city2: document.getElementById('coll-city2').value,
        coll_city3: document.getElementById('coll-city3').value,
        board_of_education2: document.getElementById('university3').value,
        year3: document.getElementById('year3').value,
        gpa3: document.getElementById('gpa3').value,

        // Skills
        programmingLanguages: document.getElementById('programmingLanguages').value,
        webTechnologies: document.getElementById('webTechnologies').value,
        databaseTechnologies: document.getElementById('databaseTechnologies').value,
        toolsPlatforms: document.getElementById('toolsPlatforms').value,
        others: document.getElementById('others').value,

        // Projects
        projectTitle1: document.getElementById('projectTitle1').value,
        projectTech1: document.getElementById('projectTech1').value,
        projectDescription1: document.getElementById('projectDescription1').value,
        projectTitle2: document.getElementById('projectTitle2').value,
        projectTech2: document.getElementById('projectTech2').value,
        projectDescription2: document.getElementById('projectDescription2').value,
        projectTitle3: document.getElementById('projectTitle3').value,
        projectTech3: document.getElementById('projectTech3').value,
        projectDescription3: document.getElementById('projectDescription3').value,
        // Additional projects will be read dynamically below

        // Experience
        jobTitle: document.getElementById('jobTitle').value,
        company: document.getElementById('company').value,
        duration: document.getElementById('duration').value,
        jobDescription: document.getElementById('jobDescription').value,

        // Certifications
        certName1: document.getElementById('certName1').value,
        certPlatform1: document.getElementById('certPlatform1').value,
        certLink1: document.getElementById('certLink1').value,
        certName2: document.getElementById('certName2').value,
        certPlatform2: document.getElementById('certPlatform2').value,
        certLink2: document.getElementById('certLink2').value,
        certName3: document.getElementById('certName3').value,
        certPlatform3: document.getElementById('certPlatform3').value,
        certLink3: document.getElementById('certLink3').value,

        // Dynamic Certifications (4 and 5)
        certName4: document.getElementById('certName4')?.value || '',
        certPlatform4: document.getElementById('certPlatform4')?.value || '',
        certLink4: document.getElementById('certLink4')?.value || '',
        certName5: document.getElementById('certName5')?.value || '',
        certPlatform5: document.getElementById('certPlatform5')?.value || '',
        certLink5: document.getElementById('certLink5')?.value || '',

        // Achievements
        achievement1: document.getElementById('achievement1').value,
        achievementLink1: document.getElementById('achievementLink1').value,
        achievement2: document.getElementById('achievement2').value,
        achievementLink2: document.getElementById('achievementLink2').value,
        achievement3: document.getElementById('achievement3').value,
        achievementLink3: document.getElementById('achievementLink3').value,
        achievement4: document.getElementById('achievement4').value,
        achievementLink4: document.getElementById('achievementLink4').value,
        achievement5: document.getElementById('achievement5').value,
        achievementLink5: document.getElementById('achievementLink5').value,

        // Portfolio (durations are static in template)
    };
    // Collect dynamic extra projects (4 and 5 only)
    const extras = [];
    for (let idx = 4; idx <= 5; idx++) {
        const t = document.getElementById(`projectTitle${idx}`);
        const tech = document.getElementById(`projectTech${idx}`);
        const desc = document.getElementById(`projectDescription${idx}`);
        if (!t && !tech && !desc) continue;
        const title = t ? t.value : '';
        const techVal = tech ? tech.value : '';
        const descVal = desc ? desc.value : '';
        if (title || techVal || descVal) {
            extras.push({ title, tech: techVal, description: descVal, idx });
        }
    }
    return { ...base, extraProjects: extras };
}

function validateForm(formData) {
    // Clear any existing errors first
    clearAllErrors();

    let hasErrors = false;
    const firstErrorField = [];

    // Field name mapping for better error messages
    const fieldNames = {
        'studentName': 'Full Name',
        'personalEmail': 'Personal Email',
        'officialEmail': 'Official Email',
        'phone': 'Phone Number',
        'linkedin': 'LinkedIn Profile',
        'github': 'GitHub Profile',
        'leetcode': 'LeetCode Profile',
        'hackerrank': 'HackerRank Profile',
        'degree1': 'Degree',
        'specialization1': 'Specialization',
        'board_of_education1': 'Board of Education 1',
        'board_of_education2': 'Board of Education 2',
        'year1': 'Year of Graduation',
        'gpa1': 'CGPA',
        'year2': 'Year',
        'gpa2': 'Percentage',
        'year3': 'Year',
        'gpa3': 'Percentage',
        'programmingLanguages': 'Programming Languages',
        'webTechnologies': 'Web Technologies',
        'databaseTechnologies': 'Database Technologies',
        'toolsPlatforms': 'Tools/Platforms',
        'others': 'Other Skills',
        'projectTitle1': 'Project 1 Title',
        'projectTech1': 'Project 1 Technologies',
        'projectDescription1': 'Project 1 Description',
        'projectTitle2': 'Project 2 Title',
        'projectTech2': 'Project 2 Technologies',
        'projectDescription2': 'Project 2 Description',
        'projectTitle3': 'Project 3 Title',
        'projectTech3': 'Project 3 Technologies',
        'projectDescription3': 'Project 3 Description',
        'jobTitle': 'Job Title',
        'company': 'Company Name',
        'duration': 'Duration',
        'jobDescription': 'Job Description',
        'certName1': 'Certification 1 Name',
        'certPlatform1': 'Certification 1 Platform',
        'certName2': 'Certification 2 Name',
        'certPlatform2': 'Certification 2 Platform',
        'certName3': 'Certification 3 Name',
        'certPlatform3': 'Certification 3 Platform',
        'certName4': 'Certification 4 Name',
        'certPlatform4': 'Certification 4 Platform',
        'certName5': 'Certification 5 Name',
        'certPlatform5': 'Certification 5 Platform',
        'achievement1': 'Achievement 1',
        'achievement2': 'Achievement 2',
        'achievement3': 'Achievement 3'
    };

    const requiredFields = [
        'studentName', 'personalEmail', 'officialEmail', 'phone', 'linkedin', 'github', 'leetcode', 'hackerrank',
        'degree1', 'specialization1', 'board_of_education1', 'board_of_education2', 'year1', 'gpa1', 'year2', 'gpa2', 'year3', 'gpa3',
        'programmingLanguages', 'webTechnologies', 'databaseTechnologies', 'toolsPlatforms', 'others',
        'projectTitle1', 'projectTech1', 'projectDescription1',
        'projectTitle2', 'projectTech2', 'projectDescription2',
        'projectTitle3', 'projectTech3', 'projectDescription3',
        'jobTitle', 'company', 'duration', 'jobDescription',
        'certName1', 'certPlatform1', 'certName2', 'certPlatform2', 'certName3', 'certPlatform3',
        'achievement1', 'achievement2', 'achievement3'
    ];

    // Map form data property names to actual DOM element IDs
    const fieldIdMapping = {
        'board_of_education1': 'university2',
        'board_of_education2': 'university3'
    };

    for (let field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            const fieldDisplayName = fieldNames[field] || field;
            const actualFieldId = fieldIdMapping[field] || field;
            showError(actualFieldId, `${fieldDisplayName} is required`);
            hasErrors = true;
            if (firstErrorField.length === 0) {
                firstErrorField.push(actualFieldId);
            }
        }
    }

    // URL validation for all URL fields
    const urlFields = [
        { field: 'linkedin', id: 'linkedin', name: 'LinkedIn Profile' },
        { field: 'github', id: 'github', name: 'GitHub Profile' },
        { field: 'leetcode', id: 'leetcode', name: 'LeetCode Profile' },
        { field: 'hackerrank', id: 'hackerrank', name: 'HackerRank Profile' },
        { field: 'certLink1', id: 'certLink1', name: 'Certification 1 Link' },
        { field: 'certLink2', id: 'certLink2', name: 'Certification 2 Link' },
        { field: 'certLink3', id: 'certLink3', name: 'Certification 3 Link' },
        { field: 'certLink4', id: 'certLink4', name: 'Certification 4 Link' },
        { field: 'certLink5', id: 'certLink5', name: 'Certification 5 Link' },
        { field: 'achievementLink1', id: 'achievementLink1', name: 'Achievement 1 Link' },
        { field: 'achievementLink2', id: 'achievementLink2', name: 'Achievement 2 Link' },
        { field: 'achievementLink3', id: 'achievementLink3', name: 'Achievement 3 Link' },
        { field: 'achievementLink4', id: 'achievementLink4', name: 'Achievement 4 Link' },
        { field: 'achievementLink5', id: 'achievementLink5', name: 'Achievement 5 Link' }
    ];

    for (let urlField of urlFields) {
        const value = formData[urlField.field];
        if (value && value.trim() !== '') {
            // Check if URL starts with https://
            if (!value.trim().toLowerCase().startsWith('https://')) {
                showError(urlField.id, `${urlField.name} must start with https://`);
                hasErrors = true;
                if (firstErrorField.length === 0) {
                    firstErrorField.push(urlField.id);
                }
            }
        }
    }

    // Check word count requirements for descriptions
    const descriptionFields = [
        { field: 'projectDescription1', name: 'Project 1 Description', max: 30 },
        { field: 'projectDescription2', name: 'Project 2 Description', max: 30 },
        { field: 'projectDescription3', name: 'Project 3 Description', max: 30 },
        { field: 'jobDescription', name: 'Internship Description', max: 40 }
    ];

    for (let { field, name, max } of descriptionFields) {
        if (formData[field]) {
            const words = formData[field].trim().split(/\s+/).filter(word => word.length > 0);
            if (words.length < 10) {
                showError(field, `${name} must have at least 10 words. Currently has ${words.length} words.`);
                hasErrors = true;
                if (firstErrorField.length === 0) {
                    firstErrorField.push(field);
                }
            }
            if (words.length > max) {
                showError(field, `${name} must not exceed ${max} words. Currently has ${words.length} words.`);
                hasErrors = true;
                if (firstErrorField.length === 0) {
                    firstErrorField.push(field);
                }
            }
        }
    }

    // Check if required images are uploaded
    const requiredImages = [
        { id: 'profilePhoto', name: 'Profile Photo' },
        { id: 'portfolioImage1', name: 'Portfolio Image 1' },
        { id: 'portfolioImage2', name: 'Portfolio Image 2' }
    ];

    for (let image of requiredImages) {
        if (!uploadedImages[image.id]) {
            // For file inputs, we need to show error on the form group
            const fileInput = document.getElementById(image.id);
            if (fileInput) {
                const formGroup = fileInput.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('has-error');
                    fileInput.classList.add('error-input');

                    // Remove existing error message
                    const existingError = formGroup.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }

                    // Create error message
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.textContent = `Please upload ${image.name}`;
                    formGroup.appendChild(errorElement);
                }
            }
            hasErrors = true;
            if (firstErrorField.length === 0) {
                firstErrorField.push(image.id);
            }
        }
    }

    // Check if at least 4 logos are selected
    if (selectedLogos.length < 4) {
        // Find the logo section and show error
        const logoSection = document.querySelector('.logo-selection');
        if (logoSection) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message logo-error';
            errorElement.textContent = `Please select at least 4 logos from the available options. Currently selected: ${selectedLogos.length}`;
            logoSection.appendChild(errorElement);
        }
        hasErrors = true;
    }

    // If there are errors, scroll to the first one
    if (hasErrors) {
        setTimeout(() => {
            scrollToFirstError();
        }, 100); // Small delay to ensure DOM updates are complete
        return false;
    }

    return true;
}

function generateResumeHTML(data, uploadedImages, selectedLogos) {
    return `
    <div class="resume-container" id="resume-content">
        <!-- Header -->
        <div class="header-container">
            <div class="header">
                <img src="./images/logo.png" alt="logo" class="logo-au">
            </div>
            <div class="logo-container">
                ${selectedLogos.map((logo, index) => `<img src="./images/${logo}" alt="logo${index + 1}" class="hackerrank-logo">`).join('')}
            </div>
        </div>
        
        <!-- Profile Section -->
        <div class="profile-section">
            <div class="profile-left">
                <div class="profile-photo-bg" style="background-image: url('${uploadedImages.profilePhoto}');"></div>
                <div class="student-name">${data.studentName.toUpperCase()}</div>
            </div>
            <div class="profile-right">
                <div class="contact-info">
                    <div class="contact-item">
                        <img src="./images/email.png" alt="Email" class="contact-icon">
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
                        <img src="./images/phone.png" alt="Phone" class="contact-icon">
                        <a href="tel:${data.phone}">${data.phone}</a>
                    </div>
                    <div class="contact-item">
                        <img src="./images/linkedin.png" alt="LinkedIn" class="contact-icon">
                        <a href="${data.linkedin}" target="_blank">${data.linkedin}</a>
                    </div>
                    <div class="contact-item">
                        <img src="./images/github.png" alt="GitHub" class="contact-icon">
                        <a href="${data.github}" target="_blank">${data.github}</a>
                    </div>
                    <div class="contact-item">
                        <img src="./images/leetcode.png" alt="Leetcode" class="contact-icon">
                        <a href="${data.leetcode}" target="_blank">${data.leetcode}</a>
                    </div>
                    <div class="contact-item">
                        <img src="./images/hackerrank.png" alt="HackerRank" class="contact-icon">
                        <a href="${data.hackerrank}" target="_blank">${data.hackerrank}</a>
                    </div>
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
                                <div class="degree-line"><div class="degree">${data.degree1}</div>${data.specialization1 ? `<div class="specialization">(${data.specialization1})</div>` : ''}</div>
                            </div>
                            <div class="year-gpa">
                                <span>Year of Graduation: ${data.year1}</span>
                                <span> | </span>
                                <span>CGPA: ${data.gpa1}</span>
                            </div>
                        </div>
                        ${data.degree2 ? `
                        <div class="education-item">
                            <div class="edu-header">
                                <div class="degree-12">${data.degree2}</div>
                                <div class="education-details">
                                    ${data.coll_city2 ? `${data.coll_city2} | ` : ''}${data.board_of_education1} | Year: ${data.year2} | Percentage: ${data.gpa2}%
                            </div>
                            </div>
                        </div>
                        ` : ''}
                        ${data.degree3 ? `
                        <div class="education-item">
                            <div class="edu-header">
                                <div class="degree">${data.degree3}</div>
                                <div class="education-details">
                                    ${data.coll_city3 ? `${data.coll_city3} | ` : ''}${data.board_of_education2} | Year: ${data.year3} | Percentage: ${data.gpa3}%
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
                            <div class="skill-item"><span><b class="bold-title"> 1. Programming Languages:</b></span> ${data.programmingLanguages}</div>
                            <div class="skill-item"><span><b class="bold-title"> 2. Web Technologies:</b></span> ${data.webTechnologies}</div>
                            <div class="skill-item"><span><b class="bold-title"> 3. Database Technologies:</b></span> ${data.databaseTechnologies}</div>
                            <div class="skill-item"><span><b class="bold-title"> 4. Tools/Platforms:</b></span> ${data.toolsPlatforms}</div>
                            <div class="skill-item"><span><b class="bold-title"> 5. Others:</b></span> ${data.others}</div>
                        </div>
                    </div>
                </div>

                <!-- Projects -->
                <div class="section">
                    <h2 class="section-title">Academic Projects</h2>
                    <div class="section-content">
                        <div class="project-item">
                            <div class="project-header">
                                <div class="project-title">1.${data.projectTitle1}</div>
                                <span class="project-sep">-</span>
                                <span class="project-tech"><b>${data.projectTech1}</b></span>
                            </div>
                            <div class="project-description">${data.projectDescription1}</div>
                        </div>
                        <div class="project-item">
                            <div class="project-header">
                                <div class="project-title">2.${data.projectTitle2}</div>
                                <span class="project-sep">-</span>
                                <span class="project-tech"><b>${data.projectTech2}</b></span>
                            </div>
                            <div class="project-description">${data.projectDescription2}</div>
                        </div>
                        ${data.projectTitle3 || data.projectTech3 || data.projectDescription3 ? `
                        <div class="project-item">
                            <div class="project-header">
                                <div class="project-title">3.${data.projectTitle3}</div>
                                <span class="project-sep">-</span>
                                <span class="project-tech"><b>${data.projectTech3}</b></span>
                            </div>
                            <div class="project-description">${data.projectDescription3}</div>
                        </div>` : ''}
                        ${Array.isArray(data.extraProjects) && data.extraProjects.length ? data.extraProjects.map((p, i) => `
                        <div class="project-item">
                            <div class="project-header">
                                <div class="project-title">${3 + i + 1}.${p.title || ''}</div>
                                <span class="project-sep">-</span>
                                <span class="project-tech"><b>${p.tech || ''}</b></span>
                            </div>
                            <div class="project-description">${p.description || ''}</div>
                        </div>
                        `).join('') : ''}
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="right-column">
                <!-- Internships -->
                <div class="section">
                    <h2 class="section-title">INTERNSHIPS/TRAINING</h2>
                    <div class="section-content">
                        <div class="experience-item">
                            <div class="job-title">${data.jobTitle}</div>
                            <div class="company">
                                <b>${data.company}</b>
                                <div class="duration"><b>${data.duration}</b></div>
                            </div>
                            <div class="job-description">${data.jobDescription}</div>
                        </div>
                    </div>
                </div>

                <!-- Certifications -->
                <div class="section">
                    <h2 class="section-title">Certifications</h2>
                    <div class="section-content">
                        <div class="cert-item">
                            <div class="cert-combined"><b>1.</b>${data.certName1} - ${data.certPlatform1}${data.certLink1 ? ` <a href="${data.certLink1}" target="_blank" class="cert-link">Link</a>` : ''}</div>
                        </div>
                        <div class="cert-item">
                            <div class="cert-combined"><b>2.</b>${data.certName2} - ${data.certPlatform2}${data.certLink2 ? ` <a href="${data.certLink2}" target="_blank" class="cert-link">Link</a>` : ''}</div>
                        </div>
                        <div class="cert-item">
                            <div class="cert-combined"><b>3.</b>${data.certName3} - ${data.certPlatform3}${data.certLink3 ? ` <a href="${data.certLink3}" target="_blank" class="cert-link">Link</a>` : ''}</div>
                        </div>
                        ${data.certName4 ? `<div class="cert-item">
                            <div class="cert-combined"><b>4.</b>${data.certName4} - ${data.certPlatform4}${data.certLink4 ? ` <a href="${data.certLink4}" target="_blank" class="cert-link">Link</a>` : ''}</div>
                        </div>` : ''}
                        ${data.certName5 ? `<div class="cert-item">
                            <div class="cert-combined"><b>5.</b>${data.certName5} - ${data.certPlatform5}${data.certLink5 ? ` <a href="${data.certLink5}" target="_blank" class="cert-link">Link</a>` : ''}</div>
                        </div>` : ''}
                    </div>
                </div>

                <!-- Achievements -->
                <div class="section">
                    <h2 class="section-title">Achievements & Participations</h2>
                    <div class="section-content">
                        <ul class="achievements-list" style="list-style: none;">
                            <li><b>1.</b> ${data.achievement1}${data.achievementLink1 ? ` <a href="${data.achievementLink1}" target="_blank" class="achievement-link">Link</a>` : ''}</li>
                            <li><b>2.</b> ${data.achievement2}${data.achievementLink2 ? ` <a href="${data.achievementLink2}" target="_blank" class="achievement-link">Link</a>` : ''}</li>
                            <li><b>3.</b> ${data.achievement3}${data.achievementLink3 ? ` <a href="${data.achievementLink3}" target="_blank" class="achievement-link">Link</a>` : ''}</li>
                            ${data.achievement4 ? `<li><b>4.</b> ${data.achievement4}${data.achievementLink4 ? ` <a href="${data.achievementLink4}" target="_blank" class="achievement-link">Link</a>` : ''}</li>` : ''}
                            ${data.achievement5 ? `<li><b>5.</b> ${data.achievement5}${data.achievementLink5 ? ` <a href="${data.achievementLink5}" target="_blank" class="achievement-link">Link</a>` : ''}</li>` : ''}
                        </ul>
                    </div>
                </div>

                <div class="section">
                    <h2 class="section-title">PORTFOLIO & VIDEO RESUME</h2>
                    <div class="section-content">
                        <ul class="achievements-img">
                            <img src="${uploadedImages.portfolioImage1}" alt="qr" class="qr">
                            <img src="${uploadedImages.portfolioImage2}" alt="qr" class="qr">
                        </ul>
                <div class="duration-list">
                    <p>~1 min</p>
                    <p>~3 min</p>
                </div>
                    </div>
                </div>
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
}

