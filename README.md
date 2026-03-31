# 🚀 Scalable Microservices URL Shortener Platform

A production grade, distributed URL shortening system built using a microservices architecture, designed for high throughput, low latency, and observability. The platform leverages caching, containerization, and cloud-native principles to efficiently handle large-scale traffic with real-time analytics.

[![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Terraform](https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)](https://github.com/features/actions)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)



---


## 📋 Table of Contents

- [🧠 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [⚙️ Tech Stack](#️-tech-stack)
- [✨ Features](#-features)
- [📊 Request Load Calculations](#-request-load-calculations)
- [🧱 System Design Considerations](#-system-design-considerations)
- [📈 Observability](#-observability)
- [🐳 Running Locally](#-running-locally)
- [⚙️ Environment Variables](#️-environment-variables)
- [📁 Project Structure](#-project-structure)
- [🔌 API Endpoints](#-api-endpoints)
- [🔄 CI/CD](#-cicd)
- [☸️ Kubernetes Deployment](#️-kubernetes-deployment)
- [☁️ Infrastructure (Terraform)](#️-infrastructure-terraform)
- [🚀 Future Improvements](#-future-improvements)
- [👨‍💻 Author](#-author)


---


## 🧠 Overview

This system demonstrates a distributed URL shortener platform with:

- High throughput request handling
- Low latency redirection using caching
- Scalable microservices
- Monitoring and analytics

---

## 🏗️ Architecture

```


Client → NGINX → Microservices
├── Shortener Service
├── Redirect Service
├── Analytics Service
└── Frontend

        ↓
  Redis (Cache Layer)
  PostgreSQL (Database)

        ↓

Prometheus → Grafana (Monitoring)

```


---

## ⚙️ Tech Stack

**Backend**
- Node.js
- Express / Fastify
- REST APIs

**Frontend**
- React.js
- Tailwind CSS

**Databases**
- PostgreSQL
- Redis

**DevOps**
- Docker
- Docker Compose
- Kubernetes
- Terraform

**Monitoring**
- Prometheus
- Grafana

**CI/CD**
- GitHub Actions

---

## ✨ Features

- URL shortening with custom short codes
- High-speed redirects via Redis caching
- Click analytics tracking
- Rate limiting
- QR code generation
- URL expiration support
- Observability dashboards
- Containerized deployment
- Scalable microservices

---

## 📊 Request Load Calculations

Assuming:


Requests Per Second (RPS) = 2,000


### 📦 Request Volume Table

```


+----------------------+-----------+
| Time Duration |  Total Requests  |
+----------------------+-----------+
| 1 Second      |  2,000           |
| 1 Minute      |  120,000         |
| 1 Hour        |  7,200,000       |
| 24 Hours      |  172,800,000     |  
| 30 Days       |  5,184,000,000   |
| 365 Days      |  63,072,000,000  |
+----------------------+-----------+

```


---

### 🧮 Formula


Total Requests = Requests Per Second × Time (in seconds)


---

### ⚡ Step-by-Step Calculation


1 Minute:
2000 × 60 = 120,000

1 Hour:
120,000 × 60 = 7,200,000

1 Day:
7,200,000 × 24 = 172,800,000

1 Month (30 days):
172,800,000 × 30 = 5,184,000,000

1 Year (365 days):
172,800,000 × 365 = 63,072,000,000


---

## 🧱 System Design Considerations

- Stateless microservices → horizontal scaling
- Redis caching → reduced DB load
- PostgreSQL → persistent storage
- Load balancing via NGINX / Kubernetes ingress
- Rate limiting to prevent abuse
- Fault isolation between services

---

## 📈 Observability

**Metrics Tracked:**
- Requests per second (RPS)
- Latency (p95, p99)
- Error rates
- Cache hit/miss ratio
- Traffic patterns

**Tools Used:**
- Prometheus → metrics collection
- Grafana → dashboards & visualization

---

## 🐳 Running Locally

- bash
- docker-compose up --build
- Services
- Frontend: http://localhost:3000
- Shortener API: http://localhost:5000
- Redirect API: http://localhost:5001
- Analytics API: http://localhost:5002
- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090

---

```

📁 Project Structure
.
├── analytics-service
├── shortener-service
├── redirect-service
├── frontend
├── nginx
├── k8s
├── infra
├── monitoring
├── docker-compose.yml
├── env.example

```

---

## 🔌API Endpoints
- Create Short URL
- POST /shorten
- Redirect URL
- GET /:shortCode
- Analytics
- GET /analytics/:shortCode

---

## 🔄 CI/CD

**GitHub Actions pipelines:**

- Build services
- Run tests
- Build Docker images
- Push to registry
- Deploy to environments
- ☸️ Kubernetes Deployment
- kubectl apply -f k8s/

---



## 🚀 Future Improvements
- Kafka-based event streaming
- Distributed rate limiting
- Multi-region deployment
- CDN integration
- Advanced analytics
- Authentication system (JWT/OAuth)

---

## 👨‍💻 Author
**Mr Smb**  
Focused on production ready Scalable systems

