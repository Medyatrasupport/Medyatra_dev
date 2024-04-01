// Function to open a modal
function openModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'block';
  }
}

// Function to close a modal
function closeModal(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
  }
}

// Sample data
const doctors = {
    "General Practice/Internal Medicine": [
        { name: "Dr. John Doe", experience: 10, location: "New York" },
        { name: "Dr. Jane Smith", experience: 8, location: "Los Angeles" },
        { name: "Dr. Robert Johnson", experience: 12, location: "Chicago" },
        { name: "Dr. Sarah Davis", experience: 9, location: "Houston" },
        { name: "Dr. Michael Brown", experience: 11, location: "Philadelphia" },
    ],
    Cardiology: [
        { name: "Dr. Michael Johnson", experience: 15, location: "Chicago" },
        { name: "Dr. Emily Davis", experience: 12, location: "Houston" },
        { name: "Dr. William Anderson", experience: 14, location: "New York" },
        { name: "Dr. Olivia Martinez", experience: 13, location: "Los Angeles" },
        { name: "Dr. James Wilson", experience: 16, location: "Boston" },
    ],
    Neurology: [
        { name: "Dr. David Lee", experience: 13, location: "San Francisco" },
        { name: "Dr. Sophia Patel", experience: 11, location: "Washington, D.C." },
        { name: "Dr. Daniel Kim", experience: 14, location: "Seattle" },
        { name: "Dr. Megan Nguyen", experience: 12, location: "Dallas" },
        { name: "Dr. Andrew Chen", experience: 15, location: "Miami" },
    ],
    // ... (add more specialties and doctors)
};

const hospitals = [
    { name: "ABC Hospital", location: "New York", hasEmergency: true, hasScanner: true },
    { name: "XYZ Medical Center", location: "Los Angeles", hasEmergency: true, hasScanner: false },
    { name: "City General Hospital", location: "Chicago", hasEmergency: true, hasScanner: true },
    { name: "Sunrise Hospital", location: "Houston", hasEmergency: true, hasScanner: true },
    { name: "Mercy Hospital", location: "Philadelphia", hasEmergency: true, hasScanner: false },
    // ... (add more hospitals)
];

const clinics = [
    { name: "City Clinic", location: "Chicago", specialties: ["General Practice", "Pediatrics"] },
    { name: "Family Health Clinic", location: "Houston", specialties: ["General Practice", "Gynecology"] },
    { name: "Downtown Medical Clinic", location: "New York", specialties: ["General Practice", "Cardiology"] },
    { name: "Westside Clinic", location: "Los Angeles", specialties: ["Pediatrics", "Neurology"] },
    { name: "Northside Clinic", location: "Seattle", specialties: ["General Practice", "Dermatology"] },
    // ... (add more clinics)
];

const labs = [
    { name: "ABC Diagnostics", location: "New York", homeTest: true, pricing: "$$" },
    { name: "XYZ Labs", location: "Los Angeles", homeTest: false, pricing: "$" },
    { name: "City Laboratories", location: "Chicago", homeTest: true, pricing: "$$$" },
    { name: "Precise Diagnostics", location: "Houston", homeTest: true, pricing: "$$" },
    { name: "Accurate Labs", location: "Philadelphia", homeTest: false, pricing: "$" },
    // ... (add more labs)
];

const specialties = [
    "General Practice/Internal Medicine",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "Dermatology",
    "Orthopedics",
    "Psychiatry",
    "Oncology",
    "Ophthalmology",
    // ... (add more specialties)
];

const symptoms = {
    "Headache, Fever, Cold": {
        doctor: "General Practice/Internal Medicine",
        hospital: true,
        clinic: true
    },
    "Chest Pain, Shortness of Breath": {
        doctor: "Cardiology",
        hospital: true,
        clinic: false
    },
    "Severe Headache, Dizziness, Numbness": {
        doctor: "Neurology",
        hospital: true,
        clinic: true
    },
    "Rash, Itching, Skin Irritation": {
        doctor: "Dermatology",
        hospital: false,
        clinic: true
    },
    "Joint Pain, Swelling, Stiffness": {
        doctor: "Orthopedics",
        hospital: false,
        clinic: true
    },
    // ... (add more symptom combinations and recommendations)
};


// ... (existing code remains the same)

let recognition;
let spokenText = '';

// ... (existing code remains the same)

document.getElementById('start-btn').addEventListener('click', function() {
    if (recognition) {
        recognition.stop();
        const micIcon = document.getElementById('mic-icon');
        micIcon.src = 'mic-icon.png'; // Replace with the path to your microphone icon image
    } else {
        const selectedLanguage = document.getElementById('language-select').value;
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = selectedLanguage;
        recognition.continuous = true;
        recognition.start();
        
        const micIcon = document.getElementById('mic-icon');
        micIcon.src = 'stop-icon.png'; // Replace with the path to your stop icon image
        
        recognition.onresult = async function(event) {
            const text = event.results[event.resultIndex][0].transcript;
            spokenText += ' ' + text;
            if (selectedLanguage !== 'en') {
                const translatedText = await translateText(spokenText, 'en');
                document.getElementById('symptom-input').value = translatedText;
                identifySymptoms(translatedText);
            } else {
                document.getElementById('symptom-input').value = spokenText;
                identifySymptoms(spokenText);
            }
            spokenText = '';
        };
        
        recognition.onend = function() {
            const micIcon = document.getElementById('mic-icon');
            micIcon.src = 'mic-icon.png'; // Replace with the path to your microphone icon image
        };
    }
});

// ... (remaining code remains the same)
// ... (existing code remains the same)

document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const fileType = file.type;
        const fileData = new Uint8Array(this.result);

        if (fileType === 'application/pdf') {
            // Handle PDF files
            pdfjsLib.getDocument(fileData).promise.then(pdf => {
                // Process each page of the PDF
                const numPages = pdf.numPages;
                let recognizedText = '';

                const processNextPage = pageNum => {
                    if (pageNum > numPages) {
                        // All pages processed, identify symptoms
                        identifySymptoms(recognizedText);
                        return;
                    }

                    pdf.getPage(pageNum).then(page => {
                        page.getTextContent().then(textContent => {
                            recognizedText += textContent.items.map(item => item.str).join(' ');
                            processNextPage(pageNum + 1);
                        });
                    });
                };

                processNextPage(1);
            });
        } else {
            // Handle image files
            Tesseract.recognize(fileData)
                .then(result => {
                    const recognizedText = result.data.text;
                    identifySymptoms(recognizedText);
                })
                .catch(error => {
                    console.error('Error recognizing image:', error);
                });
        }
    };

    reader.readAsArrayBuffer(file);
});

// ... (existing code remains the same)

const cameraPreview = document.getElementById('camera-preview');
const captureBtn = document.getElementById('capture-btn');

// Function to start the camera preview
function startCameraPreview() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            cameraPreview.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
        });
}

// Function to capture the current frame from the camera preview
function captureFrame() {
    const canvas = document.createElement('canvas');
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    return imageData;
}

// Event listener for the capture button
captureBtn.addEventListener('click', function() {
    const capturedImage = captureFrame();
    Tesseract.recognize(capturedImage)
        .then(result => {
            const recognizedText = result.data.text;
            document.getElementById('symptom-input').value = recognizedText;
            identifySymptoms(recognizedText);
        })
        .catch(error => {
            console.error('Error recognizing image:', error);
        });
});

// Start the camera preview when the page loads
window.addEventListener('load', startCameraPreview);


document.getElementById('search-btn').addEventListener('click', function() {
    const typedText = document.getElementById('symptom-input').value;
    const selectedLanguage = document.getElementById('language-select').value;
    if (selectedLanguage !== 'en') {
        translateText(typedText, 'en').then(translatedText => {
            identifySymptoms(translatedText);
        });
    } else {
        identifySymptoms(typedText);
    }
    
    if (recognition) {
        recognition.stop();
        const micIcon = document.getElementById('mic-icon');
        micIcon.src = 'mic-icon.png'; // Replace with the path to your microphone icon image
    }
});

async function translateText(text, targetLanguage) {
    const apiKey = 'AIzaSyD5h-n5qUflAEsCihoaUvgP9OjND0Y_Ygc';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    const data = {
        q: text,
        target: targetLanguage
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        return result.data.translations[0].translatedText;
    } catch (error) {
        console.error('Error translating text:', error);
        return text;
    }
}

// ... (remaining code remains the same)

// ... (existing code remains the same)

// Improved Symptom Identification
async function identifySymptoms(text) {
    const words = text.toLowerCase().split(/,|\s/).filter(Boolean); // Split by commas and spaces, and remove empty strings
    const identifiedSymptoms = Object.keys(symptoms).filter(symptom =>
        words.some(word => symptom.toLowerCase().includes(word))
    );

    displayRecommendations(identifiedSymptoms, words);
}

// Dynamic Recommendations Based on Selection
function displayRecommendations(identifiedSymptoms, words) {
    const selectedOption = document.querySelector('.search-options .option.active').id.split('-')[0]; // e.g., 'doctors'
    const recommendationListDiv = document.getElementById("recommendation-list");
    const searchResultsDiv = document.getElementById("search-results");

    // Clear previous content
    recommendationListDiv.innerHTML = "";
    searchResultsDiv.innerHTML = "";

    if (identifiedSymptoms.length === 0) {
        // If no symptoms are identified, call displayNoRecommendation
        displayNoRecommendation();
        return; // Exit the function early since there are no symptoms to process
    }

    identifiedSymptoms.forEach(symptom => {
        const recommendation = symptoms[symptom];
        let foundRecommendation = false; // Flag to track if any recommendation was found for this symptom

        // Recommend Doctors
        if ((selectedOption === 'suggest' || selectedOption === 'doctors') && recommendation.doctor) {
            const doctorSpecialty = recommendation.doctor;
            const doctorList = doctors[doctorSpecialty];

            if (doctorList && doctorList.length > 0) {
                const matchingDoctors = doctorList.filter(doctor =>
                    words.some(word => doctor.name.toLowerCase().includes(word) || doctor.location.toLowerCase().includes(word))
                );

                if (matchingDoctors.length > 0) {
                    matchingDoctors.forEach(doctor => {
                        recommendationListDiv.innerHTML += `
                            <div class="recommendation-item">
                                <h3>Recommended Doctor for ${symptom}:</h3>
                                <p>Name: ${doctor.name}</p>
                                <p>Experience: ${doctor.experience} years</p>
                                <p>Location: ${doctor.location}</p>
                                <button class="book-appointment" data-symptom="${symptom}" data-specialization="${doctorSpecialty}">Book Appointment</button>
                            </div>
                        `;
                    });
                    foundRecommendation = true;
                }
            }
        }

        // Recommend Hospitals
        if ((selectedOption === 'suggest' || selectedOption === 'hospitals') && recommendation.hospital) {
            const matchingHospitals = hospitals.filter(hospital =>
                words.some(word => hospital.name.toLowerCase().includes(word) || hospital.location.toLowerCase().includes(word))
            );

            if (matchingHospitals.length > 0) {
                matchingHospitals.forEach(hospital => {
                    recommendationListDiv.innerHTML += `
                        <div class="recommendation-item">
                            <h3>Recommended Hospital for ${symptom}:</h3>
                            <p>Name: ${hospital.name}</p>
                            <p>Location: ${hospital.location}</p>
                            <p>Emergency Services: ${hospital.hasEmergency ? 'Available' : 'Not Available'}</p>
                            <p>Scanning Facility: ${hospital.hasScanner ? 'Available' : 'Not Available'}</p>
                            <button class="book-hospital" data-symptom="${symptom}">Book Hospital</button>
                        </div>
                    `;
                });
                foundRecommendation = true;
            }
        }

        // Recommend Clinics
        if ((selectedOption === 'suggest' || selectedOption === 'clinics') && recommendation.clinic) {
            const matchingClinics = clinics.filter(clinic =>
                words.some(word => clinic.name.toLowerCase().includes(word) || clinic.location.toLowerCase().includes(word) || clinic.specialties.some(specialty => specialty.toLowerCase().includes(word)))
            );

            if (matchingClinics.length > 0) {
                matchingClinics.forEach(clinic => {
                    recommendationListDiv.innerHTML += `
                        <div class="recommendation-item">
                            <h3>Recommended Clinic for ${symptom}:</h3>
                            <p>Name: ${clinic.name}</p>
                            <p>Location: ${clinic.location}</p>
                            <p>Specialties: ${clinic.specialties.join(", ")}</p>
                            <button class="book-clinic" data-symptom="${symptom}">Book Clinic</button>
                        </div>
                    `;
                });
                foundRecommendation = true;
            }
        }

        // Recommend Labs (You'll need to adjust according to your 'symptoms' data structure if labs are included)
        if ((selectedOption === 'suggest' || selectedOption === 'labs') && recommendation.lab) {
            const matchingLabs = labs.filter(lab =>
                words.some(word => lab.name.toLowerCase().includes(word) || lab.location.toLowerCase().includes(word))
            );

            if (matchingLabs.length > 0) {
                matchingLabs.forEach(lab => {
                    recommendationListDiv.innerHTML += `
                        <div class="recommendation-item">
                            <h3>Recommended Lab for ${symptom}:</h3>
                            <p>Name: ${lab.name}</p>
                            <p>Location: ${lab.location}</p>
                            <p>Home Test: ${lab.homeTest ? 'Available' : 'Not Available'}</p>
                            <p>Pricing: ${lab.pricing}</p>
                        </div>
                    `;
                });
                foundRecommendation = true;
            }
        }

        // Update search results section if any recommendation was found
        if (foundRecommendation) {
            searchResultsDiv.innerHTML += `<p>See recommendations for ${symptom} in the sections above.</p>`;
        }
    });

    // If no recommendations were found after processing all symptoms, show no recommendation message
    if (recommendationListDiv.innerHTML === "" && searchResultsDiv.innerHTML === "") {
        displayNoRecommendation();
    }
}

// ... (remaining code remains the same)
function displayNoRecommendation() {
    const recommendationListDiv = document.getElementById("recommendation-list");
    const searchResultsDiv = document.getElementById("search-results");

    const noRecMessage = "<p>No specific recommendation found for the given symptoms.</p>";
    recommendationListDiv.innerHTML = noRecMessage; // Display message in recommendation list section
    searchResultsDiv.innerHTML = noRecMessage; // Also display message in search results section
}

// Event listener for book appointment, hospital, and clinic button clicks
const recommendationListDiv = document.getElementById("recommendation-list");
recommendationListDiv.addEventListener("click", event => {
    if (event.target.classList.contains("book-appointment")) {
        const symptom = event.target.getAttribute("data-symptom");
        const specialization = event.target.getAttribute("data-specialization");
        const doctorCount = doctors[specialization].length;
        alert(`Booking appointment for ${symptom} with a ${specialization} doctor (${doctorCount} doctors available).`);
    } else if (event.target.classList.contains("book-hospital")) {
        const symptom = event.target.getAttribute("data-symptom");
        alert(`Booking hospital for ${symptom}.`);
    } else if (event.target.classList.contains("book-clinic")) {
        const symptom = event.target.getAttribute("data-symptom");
        alert(`Booking clinic for ${symptom}.`);
    }
});

// Enhanced HTML Selection and Highlighting
document.querySelectorAll('.search-options .option').forEach(option => {
    option.addEventListener('click', function(e) {
        e.preventDefault();
        // Remove 'active' class from all options
        document.querySelectorAll('.search-options .option').forEach(o => o.classList.remove('active'));
        // Add 'active' class to the clicked option
        this.classList.add('active');
        // Refresh recommendations based on the selected option
        identifySymptoms(document.getElementById('symptom-input').value);
    });
});

// Tab switching functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');
        // Remove 'active' class from all buttons and content
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        // Add 'active' class to the clicked button and the corresponding content
        this.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
    });
});


 function loadShortcode() {
      const shortcode = '[kivicareRegisterLogin]';
      const wordpressUrl = 'https://medyatra.com/CIMS/register-login/';

      fetch(wordpressUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `shortcode=${encodeURIComponent(shortcode)}`
      })
        .then(response => response.text())
        .then(data => {
          document.getElementById('shortcode-container').innerHTML = data;
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
// Login/Signup functionality
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const closeButtons = document.querySelectorAll('.close');

loginBtn.addEventListener('click', openLoginModal);
signupBtn.addEventListener('click', openSignupModal);
closeButtons.forEach(button => {
    button.addEventListener('click', closeModal);
});

function openLoginModal() {
    loginModal.style.display = 'block';
}

function openSignupModal() {
    signupModal.style.display = 'block';
}

function closeModal() {
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
}

function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('show');
}

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginForm.addEventListener('submit', handleLogin);
signupForm.addEventListener('submit', handleSignup);

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Perform login logic with email and password
    // Replace with your actual login implementation
    console.log('Login:', email, password);
    
    // Reset form and close modal
    loginForm.reset();
    closeModal();
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const userType = document.getElementById('signup-user-type').value;
    
    // Perform signup logic with name, email, password, and userType
    // Replace with your actual signup implementation
    console.log('Signup:', name, email, password, userType);
    
    // Reset form and close modal
    signupForm.reset();
    closeModal();
}
// Initialize particles.js
particlesJS("particles-js", {
  // ... particle configuration ...
});