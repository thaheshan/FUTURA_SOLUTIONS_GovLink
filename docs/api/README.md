# 🇱🇰 FUTURA SOLUTIONS - GovLink  
### *Digitizing Sri Lanka's Government Services*

> **Tech Triathon Hackathon 2025** | 11th–16th August  
> **Team**: Prageesha, Tharushiyaa, Loheesan, Thaheshan, Gokul, Thibakar, Shakthi, Akaash

![License](https://img.shields.io/badge/license-MIT-blue) 
![Tech Triathon 2025](https://img.shields.io/badge/event-Tech_Triathon_2025-orange)
![Status](https://img.shields.io/badge/status-MVP_Complete-brightgreen)

GovLink is a full-stack digital transformation platform that modernizes Sri Lankan government services — making them **accessible, transparent, and efficient** for every citizen.

From NIC reissue to appointment booking, we’ve built a **mobile-first, real-time, secure system** connecting citizens and government officials through intuitive interfaces, QR-based tracking, and automated workflows.

---

## 🚀 Key Features

✅ **Mobile App for Citizens** (React Native)  
✅ **Web Admin Panel for Officials** (React.js)  
✅ **Secure Backend & REST APIs** (Node.js + Express)  
✅ **Real-Time Tracking** via QR Codes & Push Notifications  
✅ **Multi-Language Support** (Sinhala, Tamil, English)  
✅ **Offline Mode & Biometric Login**  
✅ **End-to-End Service Digitization** (e.g., NIC Reissue)

---

## 🛠️ Tech Stack

| Layer          | Technology |
|---------------|-----------|
| **Frontend**  | React, React Native, Next.js, Tailwind CSS |
| **Backend**   | Node.js, Express, WebSocket |
| **Database**  | PostgreSQL, Firebase, Redis (caching) |
| **DevOps**    | Docker, Docker Compose, CI/CD-ready |
| **Auth**      | JWT, OTP, Secure Storage |
| **APIs**      | REST, Swagger/OpenAPI |
| **Real-Time** | WebSocket, Push Notifications |

---

## 📚 Documentation

| Document | Link |
|--------|------|
| System Architecture | [Architecture Diagram](docs/diagrams/architecture.png) |
| ER Diagram | [ER Diagram](docs/diagrams/er-diagram.png) |
| Sequence Diagrams | [Sequence Diagrams](docs/diagrams/sequence-diagrams.md) |
| 5-Day MVP Plan | [Implementation Plan](docs/implementation/5-day-plan.md) |
| User Guide | [User Manual](docs/user-guides/user-guide.md) |
| Admin Guide | [Admin Manual](docs/user-guides/admin-guide.md) |

---

## 🔗 API Guide (Full Reference)

This section provides a **complete overview** of the **GovLink RESTful API**, built with **Node.js + Express**. The API enables secure, real-time communication between the **mobile app**, **admin panel**, and **database**.

---

## 🔐 Authentication

All endpoints (except `/auth/*`) require **JWT authentication**.

### Flow:
1. Citizen/Admin logs in → receives `accessToken` and `refreshToken`
2. Include in header:
3. If token expires, use `/auth/refresh` to get a new one

### Supported Roles

| Role | Permissions |
|------|-------------|
| `citizen` | Submit applications, book appointments, track status |
| `officer` | Review applications, assign tasks, update status |
| `admin` | Full access, manage users, system settings |

---

## 🌐 Base URL
https://api.govlink.futura.lk/v1


> During development: `http://localhost:5000/api/v1`

---

## 🧩 Data Structure

### Application Status
```json
"status": "pending" | "in_review" | "approved" | "rejected" | "completed"
```

### User Roles

