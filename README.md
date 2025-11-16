# 📚 Student Management System — Role-Based, Secure, Full-Stack Platform

A production-grade Student Management System engineered with Django REST Framework and React, featuring role-based authentication, relational database design, attendance tracking, and department-wise course orchestration.
This project highlights strong backend architecture, clean REST principles, and real deployment environments suitable for professional-level systems.

## 🔗 Live Demo

- 🌐 **Frontend (Vercel):** 
    
    [![Frontend](https://img.shields.io/badge/Live-Frontend-brightgreen)](https://student-managment-system-beta.vercel.app/)
- 🛠 **Backend API (Render):**

    [![Backend](https://img.shields.io/badge/Live-Backend-blue)](https://student-managment-system-j3al.onrender.com)
- 🗄 **PostgreSQL Database:** Hosted on Render


## 🚀 Key Features

### 🔐 Role-Based Access (JWT Authentication)

- The system supports three fully isolated roles:

    ```
    Student
    Instructor
    Admin
    ```
Authentication is implemented using JWT (SimpleJWT) with secure token refresh flows. Each role accesses different APIs and UI based on permissions.

### 👨‍🎓 Student Features

- Students can:
    1. View personal dashboard (overall attendance %, total classes attended, course analytics)
    2. Enroll in 3–6 courses (valid only within their department)
    3. View attendance breakdown per course
    4. Access course-specific information & schedule
    5. Track learning progress via a clean analytics view

### 👨‍🏫 Instructor Features

- Instructors can:
    1. View student lists, department lists, and course details
    2. Record attendance for each class
    3. Manage course rosters
    4. Monitor performance of enrolled students
    5. Access detailed course-level logs & insights

### 🛠 Admin Features

Admins have complete control:
   1. CRUD on departments & courses
   2. Assign HODs and instructors
   3. Manage students, instructors, and course assignments
   4. View system-wide logs (attendance actions, enrollments, updates)
   5. View real-time statistics across:
            ```
            Students
            Departments
            Courses
            ```
 6. Attendance

Ensure data consistency across complex multi-table relationships

## 🏗️ System Architecture
### 🖥 Backend — Django REST Framework

- Built using Django + DRF

- Fully relational schema using PostgreSQL (production-ready)

- Deployed backend + database on Render

- Clean modular app structure:

    - students
    - courses
    - enrollment
    - attendance
    - department
    - instructor
    - authentication
    - logs

- JWT authentication with secure refresh flow (SimpleJWT)

- Logging middleware for system-wide audit trails

- Designed for horizontal scalability and future migration to distributed systems

---
### 🎨 Frontend — React + TailwindCSS
Features include:

- Responsive UI with TailwindCSS

- Protected routes via React Router

- Token refresh using Axios interceptors

- Role-aware dashboard rendering

- Real-time views for students, instructors, and admins

---
### 🗄️ Database — PostgreSQL

- Hosted on Render PostgreSQL

- Strong relational design:

    - Many-to-many via Enrollment
    - Department-level segregation
    - Instructor ↔ Course mapping
    - Attendance logs linked across multiple models

- Normalized schema optimized for performance

- dumpdata_filtered.json included for easy environment bootstrapping (cleaned and structured for recruiters)
---
### 🔒 Authentication & Security

Implemented with industry-grade practices:

- Access + Refresh token flow

- HttpOnly refresh token support (optional)

- Protected routes on frontend

- Role-aware API layer on backend

- CORS-secured setup

- Auto token refresh using Axios interceptors

---
### 🧰 Tech Stack
### **Backend**

    Django

    Django REST Framework

    SimpleJWT (Access/Refresh token auth)

    PostgreSQL (production)
### **Frontend**

    React

    Axios 

    React Router

    TailwindCSS

### **Other**

    Role-Based Access Control (RBAC)

    Advanced ORM relationships

    Central logging & auditing

    Clean architectural separation

## 🌐 Deployment

- Backend + PostgreSQL Database → Render
- Frontend → Vercel

All environment variables, CORS rules, and production build optimizations are properly configured.

## **📸 Screenshots**
### **Sudent Panel-**

**DashBoard** 

![alt text](Images/image.png)
![alt text](Images/image-1.png)

**Attendance Panel**

![alt text](Images/image-2.png)
![alt text](Images/image-3.png)

**My Courses**

![alt text](Images/image-4.png)
![alt text](Images/image-5.png)

### **Instructor Panel**

**Dashboard**

![alt text](Images/image-6.png)
![alt text](Images/image-7.png)

**My Courses**

![alt text](Images/image-8.png)
![alt text](Images/image-9.png)

**Manage Atttendance**

![alt text](Images/image-10.png)
![alt text](Images/image-11.png)
![alt text](Images/image-12.png)

### **Admin Panel**

**DashBoard**

![alt text](Images/image-13.png)
![alt text](Images/image-14.png)
![alt text](Images/image-15.png)
![alt text](Images/image-16.png)
![alt text](Images/image-17.png)

**Mange Student**

![alt text](Images/image-18.png)

**Manage Instructor**

![alt text](Images/image-19.png)

**Mange Courses**

![alt text](Images/image-20.png)

Assign instructor - 

![alt text](Images/image-21.png)

**Mange Department**

![alt text](Images/image-22.png)

Assign HoD/Edit department - 

![alt text](Images/image-23.png)


## 🧪 How to Run the Project
Backend
````bash 
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata datadump_filtered.json
python manage.py runserver
````
Frontend
````bash
cd frontend
npm install
npm run dev
````
## 🎯 Why This Project Matters (For Recruiters)

This project demonstrates my strong capability in backend system design:

### ✔ Advanced Backend Engineering

- Secure token-based authentication

- RBAC implementation

- Multi-table relational models

- Transaction-safe attendance & enrollment logic

- Logging middleware & auditing

### ✔ Production Deployment Experience

- PostgreSQL configuration

- Render backend + DB deployment

- Vercel static deployment

- CORS, environment variables, build pipelines

### ✔ Full-Stack Integration

- REST API consumed by a real production frontend

- Token lifecycle management with interceptors

- Role-based dashboard rendering

This is a real-world, fully-functional system that reflects how I build scalable backend architectures integrated with modern frontend frameworks.

## 📬 Contact

If you're a recruiter or engineer reviewing this project — I’d love to connect!
Open to Backend or Full-Stack opportunities.

**Email - jainshrutd211204@gmail.com**

----