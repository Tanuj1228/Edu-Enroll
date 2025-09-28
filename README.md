<!-- 🌟 Edu-Enroll GitHub README -->

<h1 align="center">
  🎓 Edu-Enroll
</h1>

<p align="center">
  <strong>Next-gen Course Enrollment System</strong><br>
  <em>Dynamic, Interactive, and Secure Learning Platform</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2.0-green?logo=spring&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/JWT-Secure-red" alt="JWT"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.5.0-purple?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</p>

---

## ✨ Project Highlights

- Fully **responsive** design for mobile, tablet, and desktop  
- **Dark & Light mode** with smooth theme transition  
- **Animated UI**: typewriter text, scroll reveals, hover effects  
- **Real-time stats** updated every 15 seconds  
- **Role-based access**: Users vs Admins  
- **Secure JWT authentication** and **BCrypt password hashing**  

---

## 🎯 Core Features

### 🔐 User Authentication & Authorization
- Secure **login & registration** using JWT  
- Role-based access: **USER** vs **ADMIN**  
- Passwords hashed with **BCrypt**  

### 📚 Course Management
- View **all courses** on interactive cards  
- Course details with description and enrolled students  
- **Top 3 popular courses** dynamically fetched  
- **Colored borders** for courses for easy visual distinction  
- **Admin** can manage courses via API  

### 📝 Enrollment
- One-click course enrollment  
- Prevents duplicate enrollments  
- Enrollment updates **real-time student count** and popularity stats  

### 👨‍🎓 Student Management
- Admin can view all registered students  
- Remove a course from all students when deleted  
- Users can view their profile and enrolled courses  

### 📊 Real-Time Stats
- Total courses & students displayed on homepage  
- Animated counters for better UX  
- Stats auto-update every **15 seconds**  
- Course popularity ranking for backend analytics  

---

## 🌐 Frontend / UI Features

### 🎨 Dark & Light Theme
- Toggle between **dark & light modes**  
- Smooth transitions & dynamic color adjustments  

### 📱 Responsive Design
- Works perfectly on **mobile, tablet, desktop**  
- Adaptive cards & sections  

### ✨ Interactive Cards
- Hover effects & subtle scaling  
- Colored borders and shadow effects  

### 📈 Scroll & Reveal Animations
- Cards animate as they come into view  
- Delayed animations for polished look  

### ⌨️ Typewriter Effect
- Hero section with **dynamic typewriter text**  

### 🔝 Scroll-To-Top Button
- Appears after scrolling 320px  
- Smooth scroll back to top  

### 🌌 Background Animation
- Subtle **radial & linear gradients**  
- Smooth motion for visual liveliness  

---

## 📈 Analytics / Backend Features

### 🛠️ Admin APIs
- List all students  
- Remove courses from students  
- Protected via **ROLE_ADMIN**  

### 👤 User APIs
- Enroll in a course  
- Get own profile  
- Secure access with JWT  

### 📊 Stats APIs
- Returns total courses & students  
- Used for animated frontend counters  

### 🗄️ Database Integration
- **Spring Boot JPA** for ORM  
- MySQL storage  
- Maintains student-course relationships  

---

## 🛠️ Developer / Misc Features

- **JWT authentication** and role-based authorization  
- **Password encryption** using BCrypt  
- Axios API calls with **live updating data**  
- IntersectionObserver for **lazy animations**  
- Smooth hover transitions, shadows & consistent font/color scheme  

---

## 🔗 Tech Stack

| Frontend | Backend | Database | DevOps |
|----------|---------|----------|--------|
| React + Hooks | Spring Boot | MySQL | GitHub |
| Tailwind CSS & Bootstrap | JWT Auth | JPA / Hibernate | VS Code |
| Axios for API calls | REST APIs | Student-Course Relationships | Postman |

---

## 🚀 Demo Screenshots

<p align="center">
  <img src="https://i.ibb.co/XYZ/hero-section.png" alt="Hero Section" width="600"/>
  <img src="https://i.ibb.co/XYZ/course-cards.png" alt="Course Cards" width="600"/>
  <img src="https://i.ibb.co/XYZ/admin-dashboard.png" alt="Admin Dashboard" width="600"/>
</p>

---

## 🎯 How to Run Locally

```bash
# Clone the repo
git clone https://github.com/yourusername/edu-enroll.git
cd edu-enroll

# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm start
