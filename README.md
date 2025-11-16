# 📚 Student Management System — Role-Based, Secure, Full-Stack Platform

A production-grade Student Management System built with Django (REST API) and React featuring multi-role authentication, complex relational data models, attendance tracking, and department-wise course management. Designed with a strong backend architecture and clean API layers to demonstrate robust server-side engineering skills.

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

- Developed using Django + DRF

- Multi-table relational schema using SQLite (easily swappable to PostgreSQL)

- Clear separation of concerns:
    - students
    - courses
    - enrolled
    - attendance
    - department
    - instructor
    - auth
    - logs

- Uses rest_framework_simplejwt for secure token issuing & refreshing

- Designed for horizontal scalability and future migration to distributed systems

---
### 🎨 Frontend — React + TailwindCSS

- TailwindCSS for a clean, responsive UI

- Protected routes using React Router

- Interceptor-based token refresh (Axios)

- Role-specific dashboards automatically rendered

- Real-time views for attendance, course enrollment, and instructor tools

---
### 📊 Database Design & Complexity

The project showcases strong backend & database engineering:

- Complex multi-table relationships

- Many-to-Many relations via enrollment

- Instructor-to-course mapping

- Department-level segregation

- Course ↔ Student ↔ Instructor relational graph

- Attendance logs linked across multiple entities

- Admin activity logged and queryable

This demonstrates the ability to build normalized, scalable relational schemas.

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

    SQLite (development), future-ready for PostgreSQL

### **Frontend**

    React

    Axios (token refresh interceptor)

    React Router

    TailwindCSS

### **Other**

    Role-Based Access Control (RBAC)

    Multi-table ORM relations

    Logging middleware


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
python manage.py runserver
````
Frontend
````bash
cd frontend
npm install
npm run dev
````
## 🎯 Why This Project Matters (For Recruiters)

This system demonstrates:

- Ability to design secure, scalable backend systems

- Strong understanding of authentication, role-based access, and token lifecycles

- Implementation of complex relational data models

- Experience building REST APIs used by real frontend clients

- Capability to work across full stack (React + Django)

- Clean architectural decisions and modularity

- Perfect example of backend engineering with full-stack integration.

## 📬 Contact

If you're a recruiter or engineer reviewing this—I'd love to talk!
Feel free to reach out for backend or full-stack opportunities.

**Email - jainshrutd211204@gmail.com**

----
----