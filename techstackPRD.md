💻 Tech Stack PRD
Project Name

AI Resume Builder

Frontend: HTML5 + CSS3 + JavaScript (Vanilla)

Version: 1.0

1. Frontend Technologies
Technology	Purpose
HTML5	Website Structure
CSS3	Styling & Responsive Design
JavaScript (ES6+)	Interactivity & AI API Integration
Fetch API	API Requests
Local Storage	Save Draft Resume
Session Storage	Temporary Data
CSS Variables	Theme Management
CSS Grid	Layout
Flexbox	Responsive Layout
Media Queries	Mobile Responsive
2. Folder Structure
AI-Resume-Builder/
│
├── index.html
├── login.html
├── signup.html
├── dashboard.html
├── builder.html
├── preview.html
├── ats.html
├── templates.html
├── profile.html
│
├── css/
│   ├── style.css
│   ├── navbar.css
│   ├── hero.css
│   ├── dashboard.css
│   ├── builder.css
│   ├── ats.css
│   ├── templates.css
│   ├── footer.css
│   ├── responsive.css
│   └── variables.css
│
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── resume.js
│   ├── ai.js
│   ├── ats.js
│   ├── pdf.js
│   ├── storage.js
│   ├── validation.js
│   ├── animation.js
│   └── api.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   ├── logos/
│   └── fonts/
│
└── README.md
3. HTML Pages
Landing Page
index.html

Contains

Hero Section
AI Features
Resume Templates
Testimonials
FAQ
Footer
Authentication
login.html

signup.html

Features

Login
Register
Forgot Password
Dashboard
dashboard.html

Features

My Resume
ATS Score
Analytics
Recent Activity
Resume Builder
builder.html

Contains

Personal Details
Education
Experience
Skills
Projects
Certificates
AI Buttons
Preview
preview.html

Contains

Live Resume
Print
Download PDF
ATS
ats.html

Contains

ATS Score
Suggestions
Missing Keywords
4. CSS Modules
variables.css

Contains

:root{
--primary:#4F46E5;
--secondary:#06B6D4;
--success:#10B981;
--background:#F8FAFC;
--text:#111827;
--radius:18px;
}
style.css

Global Styling

navbar.css

Navbar Styling

hero.css

Landing Hero

builder.css

Resume Form Styling

dashboard.css

Dashboard Cards

ats.css

ATS Page

templates.css

Resume Templates

responsive.css

Responsive Design

5. JavaScript Modules
app.js

Controls

Page Initialization
Theme
Navigation
auth.js

Handles

Login
Signup
Logout
Validation
resume.js

Handles

Resume Data
CRUD Operations
Live Preview
ai.js

Handles

AI Prompt
API Request
AI Response
Loading
ats.js

Handles

ATS Score
Keyword Analysis
Suggestions
pdf.js

Handles

Download PDF
Print Resume
validation.js

Checks

Required Fields
Email
Phone
Skills
storage.js

Handles

Local Storage

Session Storage
api.js

Contains

const API_URL="";

Functions

Generate Summary

Generate Skills

Generate Projects

Generate ATS

Generate Cover Letter
6. UI Components
Buttons

Primary

Secondary

Outline

Danger

Success

Cards

Resume Card

ATS Card

Template Card

Dashboard Card

Feature Card

Forms

Input

Textarea

Dropdown

Date Picker

Upload

Checkbox

Radio

Navigation

Navbar

Sidebar

Breadcrumb

Footer

Modals

Delete Confirmation

AI Loading

Preview

Profile

Alerts

Toast

Success

Warning

Error

Loading

7. Responsive Design

Desktop

1440px

Laptop

1024px

Tablet

768px

Mobile

480px
8. JavaScript Features

✔ Live Resume Preview

✔ Auto Save

✔ Form Validation

✔ Dark Mode

✔ PDF Download

✔ AI Integration

✔ ATS Score

✔ Drag Drop Sections

✔ Resume Templates

✔ Search

✔ Filter

9. Browser Support
Chrome
Edge
Firefox
Brave
Opera
Safari
10. External Libraries (CDN)
Icons
Font Awesome
Animations
AOS
PDF Export
html2pdf.js
Charts
Chart.js
Fonts
Google Fonts
11. AI Integration Flow
User Input

↓

JavaScript Collects Form Data

↓

Fetch API Request

↓

AI API

↓

Generated Content

↓

Live Preview

↓

Save Resume

↓

Export PDF
12. Performance Goals
First Load Time: < 2 seconds
AI Response Time: < 5 seconds
Resume Preview Update: < 300 ms
Lighthouse Performance Score: 90+
Mobile Responsive: 100%
13. Recommended Backend (Future Integration)

Although your UI is built using HTML, CSS, and JavaScript, for AI functionality and user accounts you'll eventually need a backend.

Layer	Technology
Frontend	HTML5, CSS3, JavaScript
Backend	Node.js + Express.js
Database	MongoDB
Authentication	JWT
AI	Gemini API or OpenAI API
PDF Generation	html2pdf.js (Frontend) or Puppeteer (Backend)
Deployment	GitHub Pages (Frontend), Render (Backend), MongoDB Atlas (Database)