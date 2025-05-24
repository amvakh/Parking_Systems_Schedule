# Parking Systems Scheduler

A scheduling system that integrates with Paychex to help automate employee shift planning and parking availability for a small organization. Designed with a clean separation between backend logic and frontend interface, the tool makes it easier to generate, modify, and visualize parking schedules based on predefined business rules.

---

## 📌 Project Overview

This project was built to simulate a real-world scheduling system that handles availability tracking, user account management, and secure schedule generation. While originally developed as an academic project, the system uses full-stack practices and reflects workflows found in internal scheduling tools.

It was developed as part of coursework at NYIT in 2024 and later expanded for portfolio use.

---

## 🛠 Tech Stack

**Frontend**
- React
- HTML, CSS, JavaScript
- Bootstrap (optional components)

**Backend**
- Node.js
- Express
- MongoDB or SQLite (modularized for mock data)
- RESTful API structure

**Other**
- Firebase Auth (if used)
- Paychex API simulation
- Git version control

---

## 🔧 Features

- Admin login with access control
- Availability-based schedule generation
- Option to export schedules (CSV or screen view)
- API endpoints for basic CRUD operations
- Manual override of generated time slots
- Frontend UI for both employees and admins
- Modular backend logic for different schedule types

---

## 🗂️ Folder Structure

Parking-Systems-Scheduler/
├── public/ # Static files
├── src/ # React frontend
├── PaymentPortal/ # Paychex integration and logic
├── modify/ # Backend scheduler logic and helpers
├── .gitignore
├── package.json
├── README.md


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/amvakh/Parking-Systems-Scheduler.git
cd Parking-Systems-Scheduler
npm install
npm start
