# 🚀 Full Stack DevOps CI/CD Deployment on AWS EC2

This project demonstrates a complete DevOps CI/CD pipeline for deploying a full-stack application using **React, Spring Boot, MySQL, Docker, Docker Compose, GitHub Actions, Docker Hub, and AWS EC2** .

---

## 📌 Project Overview

Whenever code is pushed to the **main** branch:

1. GitHub Actions automatically starts.
2. Frontend Docker image is built.
3. Backend Docker image is built.
4. Images are pushed to Docker Hub.
5. GitHub Actions connects to AWS EC2 using SSH.
6. EC2 executes `deploy2.sh`.
7. Latest Docker images are pulled.
8. Existing containers are stopped.
9. New containers are started using Docker Compose.

---

## 🛠 Tech Stack

### Frontend

* React (Vite)
* Nginx
* Docker

### Backend

* Java 21
* Spring Boot
* Maven
* Docker

### Database

* MySQL 8
* Docker Container

### DevOps

* Linux Ubuntu
* Docker
* Docker Compose
* Docker Hub
* GitHub Actions
* AWS EC2
* Bash Script

---

## 📁 Project Structure

```text
.
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── Dockerfile
│   ├── src/
│   └── pom.xml
│
├── docker-compose.yml
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── deploy2.sh
│
└── README.md
```

---

## ⚙️ CI/CD Pipeline

```
Developer
     │
     ▼
 git push
     │
     ▼
GitHub Actions
     │
     ├───────────────┐
     ▼               ▼
Build Frontend   Build Backend
Docker Image     Docker Image
     │               │
     └───────┬───────┘
             ▼
        Docker Hub
             │
             ▼
          AWS EC2
             │
             ▼
        deploy2.sh
             │
             ▼
     Docker Compose Deploy
             │
     ▼───────────────▼
 React Container  Spring Boot Container
             │
             ▼
        MySQL Container
```

---

## 🐳 Docker

The project uses Docker multi-stage builds.

### Frontend Docker Build

**Builder Stage**

* Node.js 22 Alpine
* React production build

**Production Stage**

* Nginx Alpine
* Serves React static files

### Backend Docker Build

**Build Stage**

* Maven
* Java 21
* Application package creation

**Production Stage**

* Eclipse Temurin JRE Alpine
* Runs Spring Boot application

---

## 🐳 Docker Compose

Docker Compose manages multiple containers:

Services:

```
cloud-engine-frontend
cloud-engine-backend
cloud-engine-mysql
```

Run application:

```bash
docker-compose up -d
```

Stop application:

```bash
docker-compose down
```

---

## 🔄 GitHub Actions Workflow

Pipeline performs:

* Checkout Repository
* Setup Docker Buildx
* Login to Docker Hub
* Build Frontend Image
* Build Backend Image
* Push Images to Docker Hub
* SSH into AWS EC2
* Execute Deployment Script

---

## 📜 Deployment Script

`deploy2.sh` automatically:

* Pulls latest frontend image
* Pulls latest backend image
* Stops old containers
* Starts new containers using Docker Compose
* Removes unused Docker images

---

## 🔐 GitHub Secrets

Configured secrets:

```
DOCKER_USERNAME
DOCKER_TOKEN

EC2_HOST
EC2_USERNAME
SSH_PRIVATE_KEY
```

---

## 🚀 Features

* Automated CI/CD Pipeline
* Full Stack Docker Deployment
* React Frontend Container
* Spring Boot Backend Container
* MySQL Database Container
* Docker Hub Image Management
* AWS EC2 Deployment
* Zero Manual Deployment
* Multi-container Application Setup

---

## 📷 Architecture

```
                 GitHub
                    │
                    ▼
             GitHub Actions
                    │
                    ▼
              Docker Hub
                    │
                    ▼
               AWS EC2
                    │
             Docker Compose
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
  Frontend      Backend        MySQL
  React         Spring Boot    Database
  Nginx         Java 21
```

---

## 🔮 Future Improvements

* Kubernetes Deployment
* Terraform Infrastructure as Code
* AWS S3 + CloudFront
* Nginx Reverse Proxy
* HTTPS with SSL
* Prometheus & Grafana Monitoring
* ArgoCD GitOps Deployment

---

## 👨‍💻 Author

**Nilesh Parmar**

GitHub:
https://github.com/nilesh2033parmarDevOps

---

⭐ If you like this project, don't forget to star the repository.
