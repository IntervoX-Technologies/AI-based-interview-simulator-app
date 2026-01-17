# 🚀 IntervoX: AI-Powered Interview Simulator


**IntervoX** is a cutting-edge mock interview platform designed specifically for undergraduates.
=======



By leveraging Artificial Intelligence and real-time data streaming, IntervoX provides a high-pressure environment to help budding developers master technical and HR interviews.

---

## 🎓 Institutional Context
* **Affiliation:** General Sir John Kotelawala Defence University (KDU)
* **Community:** British Computer Society (BCS) Student Chapter
* **Project Goal:** To bridge the gap between academic learning and industry recruitment standards.

---

## ✨ Key Features

* **🤖 AI-Driven Questioning:** Generates dynamic, category-specific questions (Java, C++, Web Development, and HR) using Groq/OpenAI.
* **⏱️ Pressure Mode:** Integrated countdown timer per question with **Auto-Submit** logic to simulate real-world interview stress.
* **📊 Performance Analytics:** A personalized dashboard tracking "Interviews Completed," "Average Scores," and "Total Questions Faced."
* **📡 Live Data Updates:** Powered by **Socket.io**, the dashboard updates instantly when a session is saved without requiring a page refresh.
* **🎨 Futuristic UI:** Modern "Glassmorphism" design with 3D animated CSS icons (Cubes, Pyramids, Spheres).
* **🔐 Secure Session Management:** Persistent user login using LocalStorage and MySQL authentication.

---

## 🛠️ Technical Architecture

**Frontend:**
* **React.js:** Component-based UI.
* **React Router DOM:** Seamless navigation with "Back" button functionality.
* **Socket.io-client:** Real-time event listening.
* **CSS3:** Advanced 3D transforms and neon animations.

**Backend:**
* **Node.js & Express:** Robust API architecture.
* **MySQL:** Relational database for user profiles and interview history.
* **Socket.io:** Real-time server-to-client communication.
* **Dotenv:** Secure environment variable management.



---

## 🚀 Installation & Setup

### 1. Database Configuration
Create a MySQL database named `intervox_db` and execute the following:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE interview_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category VARCHAR(50),
    score INT,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
IntervoX/
├── intervox-frontend/
│   ├── src/
│   │   ├── pages/        # Dashboard.js, Interview.js, Analytics.js
│   │   └── components/   # Navbar.js, Sidebar.js
├── intervox-backend/
│   ├── server.js attachments/assets/b08edeb1-e0b7-4b0d-b081-f44d205627b5" />
        # Express + Socket.io Server
│   └── .env              # Secrets & Keys
└── README.md


<img width="1897" height="852" alt="9" src="https://github.com/user-attachments/assets/e66652bf-9066-4336-8687-4456dc996cd6" />
<img width="1562" height="680" alt="8" src="https://github.com/user-attachments/assets/26a4dd64-656f-4d2f-8608-6c4429eaf54b" />
<img width="946" height="513" alt="7" src="https://github.com/user-attachments/assets/2516e048-bb1f-4b51-9a0a-a4f383e77174" />
<img width="1862" height="990" alt="6" src="https://github.com/user-attachments/assets/8c99d2a0-b823-42a1-827a-ef9eb8e3434c" />
<img width="1902" height="985" alt="5" src="https://github.com/user-attachments/assets/42c09161-8f86-40bb-bdca-1cf66c3e0a23" />
