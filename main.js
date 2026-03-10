// Sample Data: Mock scores from the user's assessment
const userAssessmentResults = {
    science: 90,
    math: 85,
    business: 40,
    arts: 75,
    technology: 95
};

/**
 * Logic to calculate strand compatibility based on subject scores.
 * You can integrate your AI backend or specific algorithm here.
 */
function calculateStrandMatches(scores) {
    return {
        stem: Math.round((scores.science + scores.math + scores.technology) / 3),
        abm: Math.round((scores.business + scores.math) / 2),
        humss: Math.round((scores.arts + scores.science) / 2.2), // Example weight
        tvl: Math.round((scores.technology + scores.math) / 2.1),
        gas: Math.round((scores.science + scores.math + scores.business + scores.arts) / 4)
    };
}

/**
 * Dynamically updates the HTML cards with the calculated match scores.
 * Enhanced with modern styling and animations.
 */
function updateUIWithMatches() {
    const matches = calculateStrandMatches(userAssessmentResults);

    // Loop through the strands and inject the match badges
    Object.keys(matches).forEach(strand => {
        const card = document.querySelector(`.strand-card.${strand}`);
        if (card) {
            // Remove existing badge if it exists
            const oldBadge = card.querySelector('.match-badge');
            if (oldBadge) oldBadge.remove();

            // Create and append the new Match Badge
            const badge = document.createElement('span');
            badge.className = 'match-badge';
            const matchPercentage = matches[strand];
            badge.innerText = `${matchPercentage}% Match`;
            
            // Determine badge color based on match score intensity
            if (matchPercentage >= 85) {
                badge.style.setProperty('--badge-color', '#10b981'); // High match (Green)
            } else if (matchPercentage >= 70) {
                badge.style.setProperty('--badge-color', '#f59e0b'); // Medium match (Amber)
            } else if (matchPercentage >= 50) {
                badge.style.setProperty('--badge-color', '#6b7280'); // Low-medium match (Gray)
            } else {
                badge.style.setProperty('--badge-color', '#9ca3af'); // Low match (Light Gray)
            }
            
            // Add animation by appending and triggering reflow
            card.querySelector('.card-image').appendChild(badge);
            
            // Trigger animation
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = 'slideIn 0.4s ease-out';
            }, 10);
        }
    });
}

// Initialize the UI update
document.addEventListener('DOMContentLoaded', updateUIWithMatches);

// --- Tab Navigation with Enhanced Features ---
function switchTab(evt, tabName) {
    // Prevent default if it's an anchor tag
    if (evt && evt.preventDefault) {
        evt.preventDefault();
    }

    // Hide all tab contents
    const contents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
    }

    // Remove active class from all tabs
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
        tabs[i].setAttribute('aria-selected', 'false');
    }

    // Show the selected tab content
    const selectedContent = document.getElementById(tabName);
    if (selectedContent) {
        selectedContent.classList.add('active');
    }

    // Mark the clicked tab as active
    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
        evt.currentTarget.setAttribute('aria-selected', 'true');
    }
}

// Mock user data with expanded strands
const mockUser = {
    name: 'Alex',
    progress: 25, // percent
    strands: [
        { id: 'stem', title: 'STEM', desc: 'Science, technology, engineering, and math focus.', image: 'images/stem.jpg' },
        { id: 'abm', title: 'ABM', desc: 'Business, accounting, and management basics.', image: 'images/abm.jpg' },
        { id: 'humss', title: 'HUMSS', desc: 'Humanities and social sciences pathway.', image: 'images/humss.jpg' },
        { id: 'gas', title: 'GAS', desc: 'General Academic Strand for flexible interests.', image: 'images/gas.jpg' },
        { id: 'tvl', title: 'TVL', desc: 'Technical-Vocational-Livelihood skills and training.', image: 'images/tvl.jpg' }
    ]
};

/**
 * Render home page with personalized content and progress tracking
 */
function renderHome() {
    // Personalized welcome message
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeSub = document.getElementById('welcome-sub');
    if (welcomeTitle) {
        welcomeTitle.textContent = `Welcome, ${mockUser.name}!`;
    }
    if (welcomeSub) {
        welcomeSub.textContent = `Discover SHS strands perfectly matched to your strengths and interests.`;
    }

    // Update progress bar and percentage
    const fill = document.getElementById('progress-fill');
    const percent = document.getElementById('progress-percent');
    
    if (fill) {
        // Animate progress bar
        setTimeout(() => {
            fill.style.width = mockUser.progress + '%';
        }, 100);
    }
    if (percent) {
        percent.textContent = mockUser.progress + '% complete';
    }
}

/**
 * Generate contextual tips based on user progress
 */
function generateTip(user) {
    const tips = [
        'Complete your assessment to receive tailored strand recommendations.',
        'Did you know? Students who match STEM have higher earning potential.',
        'Take your time—the right strand choice can shape your future!',
        'Explore all strands before deciding on your favorite.',
        'Your interests today are the foundation of your career tomorrow.'
    ];
    
    if (user.progress < 50) {
        return tips[0];
    } else if (user.progress < 75) {
        return tips[1];
    }
    return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Initiate the assessment process
 */
function startAssessment() {
    // Find and click the assessment tab
    const assessmentTab = document.querySelector('.tab[onclick*="assessment"]');
    if (assessmentTab) {
        switchTab({ currentTarget: assessmentTab }, 'assessment');
        initAssessment();
    }
}

// ====== ASSESSMENT PAGE FUNCTIONALITY ======

// Assessment Data Structure
const assessmentQuestions = [
    {
        id: 1,
        section: "Section 1: Initial Skill Evaluation",
        sectionDesc: "Complete the following questions to help us tailor your experience.",
        question: "Which of the following best describes your preference for logical problems?",
        options: ["Very strong preference", "Strong preference", "Moderate preference", "Weak preference"]
    },
    {
        id: 2,
        section: "Section 1: Initial Skill Evaluation",
        sectionDesc: "Complete the following questions to help us tailor your experience.",
        question: "Which of the following is NOT a primary color in the standard additive color model?",
        options: ["Red", "Blue", "Green", "Yellow"],
        correctAnswer: 3 // Index of the correct answer
    },
    {
        id: 3,
        section: "Section 1: Initial Skill Evaluation",
        sectionDesc: "Complete the following questions to help us tailor your experience.",
        question: "What is your primary interest in technology?",
        options: ["Software Development", "Hardware Design", "Data Analysis", "Network Administration"]
    },
    {
        id: 4,
        section: "Section 2: Technical Skills",
        sectionDesc: "Assess your existing technical knowledge and experience.",
        question: "Have you worked with programming before?",
        options: ["Yes, extensively", "Yes, some experience", "A little bit", "Never"]
    },
    {
        id: 5,
        section: "Section 2: Technical Skills",
        sectionDesc: "Assess your existing technical knowledge and experience.",
        question: "Which programming language are you most comfortable with?",
        options: ["Python", "Java", "JavaScript", "C++"]
    }
];

// Assessment State
let assessmentState = {
    currentQuestion: 1,
    totalQuestions: 25, // Total number of questions
    answers: {},
    flaggedQuestions: new Set(),
    timeRemaining: 2052, // 34:12 in seconds
    timerInterval: null
};

/**
 * Initialize Assessment Page
 */
function initAssessment() {
    // Load current question
    loadQuestion(assessmentState.currentQuestion);
    
    // Start timer
    startTimer();
}

/**
 * Load and display a specific question
 */
function loadQuestion(questionNumber) {
    if (questionNumber < 1 || questionNumber > assessmentState.totalQuestions) return;
    
    assessmentState.currentQuestion = questionNumber;
    
    // Get question data (cycle through available questions or use defaults)
    const questionData = assessmentQuestions[(questionNumber - 1) % assessmentQuestions.length];
    
    // Update section header
    document.getElementById('section-title').textContent = questionData.section;
    document.getElementById('section-desc').textContent = questionData.sectionDesc;
    
    // Update question
    document.getElementById('q-number').textContent = questionNumber;
    document.getElementById('question-text').textContent = questionData.question;
    document.getElementById('current-q').textContent = questionNumber;
    
    // Clear and populate options
    const optionsGroup = document.querySelector('.options-group');
    optionsGroup.innerHTML = '';
    
    questionData.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const inputId = `opt${index + 1}`;
        const isChecked = assessmentState.answers[questionNumber] === index ? 'checked' : '';
        
        optionDiv.innerHTML = `
            <input type="radio" id="${inputId}" name="question" value="${index}" class="radio-input" ${isChecked}>
            <label for="${inputId}" class="radio-label">${option}</label>
        `;
        
        optionsGroup.appendChild(optionDiv);
        
        // Add event listener to save answer
        optionsGroup.querySelector(`#${inputId}`).addEventListener('change', () => {
            assessmentState.answers[questionNumber] = index;
        });
    });
    
    // Update flag checkbox
    const flagCheckbox = document.getElementById('flag-check');
    flagCheckbox.checked = assessmentState.flaggedQuestions.has(questionNumber);
    flagCheckbox.addEventListener('change', () => {
        if (flagCheckbox.checked) {
            assessmentState.flaggedQuestions.add(questionNumber);
        } else {
            assessmentState.flaggedQuestions.delete(questionNumber);
        }
    });
    
    // Update progress bar
    updateProgressBar();
    
    // Update button states
    updateNavigationButtons();
}

/**
 * Update progress bar based on current question
 */
function updateProgressBar() {
    const percentage = (assessmentState.currentQuestion / assessmentState.totalQuestions) * 100;
    const progressFill = document.getElementById('progress-assessment');
    progressFill.style.width = percentage + '%';
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
    const prevBtn = document.querySelector('.btn-secondary');
    const nextBtn = document.querySelector('.btn-primary');
    
    // Disable previous button on first question
    if (prevBtn) {
        prevBtn.disabled = assessmentState.currentQuestion === 1;
    }
    
    // Change next button text on last question
    if (nextBtn) {
        if (assessmentState.currentQuestion === assessmentState.totalQuestions) {
            nextBtn.textContent = 'Submit Assessment';
        } else {
            nextBtn.textContent = 'Next Question';
        }
    }
}

/**
 * Navigate to previous question
 */
function previousQuestion() {
    if (assessmentState.currentQuestion > 1) {
        loadQuestion(assessmentState.currentQuestion - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Navigate to next question or submit
 */
function nextQuestion() {
    if (assessmentState.currentQuestion < assessmentState.totalQuestions) {
        loadQuestion(assessmentState.currentQuestion + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        submitAssessment();
    }
}

/**
 * Submit Assessment
 */
function submitAssessment() {
    const confirmed = confirm('Are you sure you want to submit your assessment? You cannot go back to edit answers.');
    if (confirmed) {
        clearInterval(assessmentState.timerInterval);
        // Save assessment results
        console.log('Assessment submitted!', assessmentState.answers);
        alert('Assessment submitted successfully! Your results are being processed.');
        // Navigate to results page
        const resultsTab = document.querySelector('.tab[onclick*="results"]');
        if (resultsTab) {
            switchTab({ currentTarget: resultsTab }, 'results');
        }
    }
}

/**
 * Timer Functionality
 */
function startTimer() {
    const timerDisplay = document.getElementById('timer');
    
    assessmentState.timerInterval = setInterval(() => {
        assessmentState.timeRemaining--;
        
        // Format and display time
        const minutes = Math.floor(assessmentState.timeRemaining / 60);
        const seconds = assessmentState.timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (assessmentState.timeRemaining <= 300) { // 5 minutes
            timerDisplay.parentElement.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
            timerDisplay.parentElement.style.borderColor = '#fca5a5';
            timerDisplay.style.color = '#dc2626';
        }
        
        // Auto-submit when time runs out
        if (assessmentState.timeRemaining <= 0) {
            clearInterval(assessmentState.timerInterval);
            alert('Time\'s up! Your assessment has been auto-submitted.');
            submitAssessment();
        }
    }, 1000);
}

// Initialize assessment when page loads
document.addEventListener('DOMContentLoaded', () => {
    renderHome();
    updateUIWithMatches();
});

// ====== RESULTS PAGE FUNCTIONALITY ======

/**
 * Results Data Structure
 */
const resultsData = {
    finalScore: 18,
    totalQuestions: 25,
    percentage: 72,
    completionDate: 'March 2, 2026',
    assessmentName: 'Initial Skill Evaluation',
    skills: [
        { name: 'Logical-Mathematical', value: 100 },
        { name: 'Digital Literacy', value: 85 },
        { name: 'Linguistic', value: 95 },
        { name: 'Critical Thinking', value: 78 },
        { name: 'Creative Arts', value: 88 }
    ],
    strandResults: [
        { name: 'Creative Arts', score: 9, total: 10, percentage: 90, recommendation: 'Recommended (High Proficiency)', badge: 'badge-green' },
        { name: 'Logical-Mathematical', score: 4, total: 10, percentage: 40, recommendation: 'Focus Needed (Moderate)', badge: 'badge-yellow' },
        { name: 'Linguistic', score: 5, total: 5, percentage: 100, recommendation: 'Keep it Up!', badge: 'badge-blue' }
    ],
    questionReviews: [
        {
            id: 2,
            question: 'Which of the following is NOT a primary color in the standard additive color model?',
            status: 'incorrect',
            yourAnswer: 'Yellow',
            correctAnswer: 'Blue'
        },
        {
            id: 3,
            question: 'Which of the following is currently a ted greening a positive proml?',
            status: 'correct',
            yourAnswer: 'Correct',
            correctAnswer: ''
        },
        {
            id: 7,
            question: 'Which of the following is NOT a primary color in the standard additive color model?',
            status: 'incorrect',
            yourAnswer: '',
            correctAnswer: ''
        }
    ]
};

let radarChartInstance = null;

/**
 * Initialize Results Page
 */
function initResults() {
    renderRadarChart();
    initializeQuestionReview();
}

/**
 * Render Radar Chart
 */
function renderRadarChart() {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (radarChartInstance) {
        radarChartInstance.destroy();
    }

    // Create new radar chart
    radarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: resultsData.skills.map(skill => skill.name),
            datasets: [{
                label: 'Your Score',
                data: resultsData.skills.map(skill => skill.value),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#2563eb',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(31, 41, 55, 0.9)',
                    padding: 12,
                    borderRadius: 6,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.r + '%';
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    min: 0,
                    ticks: {
                        stepSize: 25,
                        font: { size: 12, color: '#6b7280' },
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(229, 231, 235, 0.5)',
                        drawBorder: false
                    },
                    pointLabels: {
                        font: { size: 13, weight: '500' },
                        color: '#1f2937',
                        padding: 12
                    }
                }
            }
        }
    });
}

/**
 * Initialize Question Review Toggle
 */
function initializeQuestionReview() {
    const reviewItems = document.querySelectorAll('.question-review-item');
    
    reviewItems.forEach(item => {
        const header = item.querySelector('.review-header');
        
        // First item is expanded by default
        if (item !== reviewItems[0]) {
            item.classList.add('collapsed');
            item.querySelector('.review-content').classList.remove('active');
        }
    });
}

/**
 * Toggle Review Item
 */
function toggleReview(headerElement) {
    const reviewItem = headerElement.closest('.question-review-item');
    const content = reviewItem.querySelector('.review-content');
    const isCollapsed = reviewItem.classList.contains('collapsed');
    
    if (isCollapsed) {
        // Expand
        reviewItem.classList.remove('collapsed');
        content.classList.add('active');
    } else {
        // Collapse
        reviewItem.classList.add('collapsed');
        content.classList.remove('active');
    }
}

/**
 * View Details for a strand
 */
function viewDetails(strandId) {
    console.log('Viewing details for:', strandId);
    alert('Detailed view for ' + strandId + ' would appear here.');
    // In a real app, this would show a modal or navigate to a detail page
}

/**
 * Explore Recommended Strands
 */
function exploreStrands() {
    const exploreTab = document.querySelector('.tab[onclick*="strands"]');
    if (exploreTab) {
        switchTab({ currentTarget: exploreTab }, 'strands');
    }
}

/**
 * Retake Assessment
 */
function retakeAssessment() {
    const confirmed = confirm('Are you sure you want to retake the assessment? Your previous results will not be saved.');
    if (confirmed) {
        // Reset assessment state
        assessmentState.currentQuestion = 1;
        assessmentState.answers = {};
        assessmentState.flaggedQuestions = new Set();
        assessmentState.timeRemaining = 2052;
        
        // Navigate to assessment tab
        const assessmentTab = document.querySelector('.tab[onclick*="assessment"]');
        if (assessmentTab) {
            switchTab({ currentTarget: assessmentTab }, 'assessment');
            setTimeout(() => {
                initAssessment();
            }, 100);
        }
    }
}

/**
 * Download Report
 */
function downloadReport() {
    // Generate report content
    const reportContent = generateReport();
    
    // Create a blob from the content
    const blob = new Blob([reportContent], { type: 'text/plain' });
    
    // Create a temporary download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StrandWise-Assessment-Report-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Also show a confirmation
    alert('Report downloaded successfully!');
}

/**
 * Generate Report Content
 */
function generateReport() {
    let report = '═══════════════════════════════════════════════════════════════\n';
    report += '                    STRANDWISE ASSESSMENT REPORT                    \n';
    report += '═══════════════════════════════════════════════════════════════\n\n';
    
    report += `Assessment: ${resultsData.assessmentName}\n`;
    report += `Completed: ${resultsData.completionDate}\n`;
    report += `Final Score: ${resultsData.finalScore}/${resultsData.totalQuestions} (${resultsData.percentage}%)\n\n`;
    
    report += '───────────────────────────────────────────────────────────────\n';
    report += 'SKILL ASSESSMENT\n';
    report += '───────────────────────────────────────────────────────────────\n\n';
    
    resultsData.skills.forEach(skill => {
        report += `${skill.name}: ${skill.value}%\n`;
    });
    
    report += '\n───────────────────────────────────────────────────────────────\n';
    report += 'STRAND RECOMMENDATIONS\n';
    report += '───────────────────────────────────────────────────────────────\n\n';
    
    resultsData.strandResults.forEach(strand => {
        report += `${strand.name}\n`;
        report += `Score: ${strand.score}/${strand.total} (${strand.percentage}%)\n`;
        report += `Recommendation: ${strand.recommendation}\n\n`;
    });
    
    report += '═══════════════════════════════════════════════════════════════\n';
    report += 'Thank you for using StrandWise!\n';
    report += '═══════════════════════════════════════════════════════════════\n';
    
    return report;
}

/**
 * Initialize Results when tab is switched
 */
function onResultsTabActive() {
    // Check if results page is active
    const resultsTab = document.getElementById('results');
    if (resultsTab && resultsTab.classList.contains('active')) {
        initResults();
    }
}

// Override switchTab to trigger results initialization
const originalSwitchTab = window.switchTab;
window.switchTab = function(evt, tabName) {
    originalSwitchTab(evt, tabName);
    
    if (tabName === 'results') {
        setTimeout(() => {
            initResults();
        }, 100);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderHome();
    updateUIWithMatches();
    
    // Initialize results if already visible
    if (document.getElementById('results')?.classList.contains('active')) {
        setTimeout(() => {
            initResults();
        }, 100);
    }
});
