**🎫 PROG2002-A3-Team – Event Management System**
A full-stack web application for event management, including a client-side interface for users, an admin-side dashboard for management, and a backend API with database support.

**📁 Project Structure**
text
PROG2002-A3-Team/
├── 📂 admin-side/          # Angular-based admin dashboard
│   ├── src/app/
│   │   ├── components/     # UI components
│   │   ├── models/         # Data models
│   │   ├── services/       # API services
│   │   └── app.*           # Config, routes, styles
│   ├── angular.json
│   └── package.json
│
├── 📂 backend/             # Node.js server + API
│   ├── server.js           # Main server file
│   ├── test_update.js      # Update testing script
│   ├── package.json
│   └── prog2002_a3_backup.sql  # Database backup
│
├── 📂 client-side/         # Frontend for users
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript modules
│   │   ├── config.js
│   │   ├── event-details.js
│   │   ├── home.js
│   │   ├── main.js
│   │   ├── registration.js
│   │   └── search.js
│   ├── index.html
│   ├── event-details.html
│   ├── registration.html
│   └── search.html
│
├── 📄 README.md            # Project documentation
└── 📄 .gitignore           # Git ignore rules
**👨‍💻 Team Members & Responsibilities**
Member	Role	Responsibilities
Wang 🧑‍💻	Frontend Developer	Client-side UI & JavaScript
Liu 👩‍💻	Full-Stack Developer	Admin-side Angular app & Backend API
**🚀 Features**
**Client-Side (User)**
Browse events

Event search and filtering

User registration

Event details view

**Admin-Side (Management)**
Angular-based SPA

Event management

User management

Dashboard analytics

**Backend (API & Database)**
RESTful API with Node.js

MySQL database support

Database backup included (prog2002_a3_backup.sql)

**🛠️ Technologies Used**
Frontend (Client): HTML, CSS, JavaScript

Admin Panel: Angular, TypeScript

Backend: Node.js, Express.js

Database: MySQL

Version Control: Git & GitHub

**📦 Installation & Setup**
Backend
bash
cd backend
npm install
node server.js
Admin Side
bash
cd admin-side
npm install
ng serve
Client Side
Open client-side/index.html in a browser.

**📌 Recent Commits & Updates**
Backend API added – whr1314

Admin-side updated – Laughhh

Client-side updated – Luaphh / Lhophhh

Angular configuration improved

Database backup included

