# Data Studio: Reimagining the LLM Interface

[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](docker-compose.yaml)
[![Kubernetes](https://img.shields.io/badge/kubernetes-ready-326ce5.svg)](infra/)

> A sophisticated, graph-based interface for complex Large Language Model (LLM) workflows, inspired by cutting-edge research like the 'Tree of Thought' paper.
This project also includes an unrelated dashboard section.


## Demo

https://github.com/user-attachments/assets/cf9d3a9f-14df-401d-91bf-24a3f76de0df

## 🌟 Project Overview

Data Studio revolutionizes how we interact with Large Language Models by providing a graph-like, node-based interface that supports complex reasoning paths and multi-step analyses. Built with enterprise-grade technologies, it offers real-time WebSocket communication, document processing, and scalable infrastructure.

## 🚀 Key Features

### 🔄 Graph-like Node Architecture

- **Interactive Node Graph**: Visual workflow creation using React Flow
- **Custom Node Types**: Text Input, Document Input, Chat Model, Vector Search, and Output nodes
- **Real-time Execution**: Stream processing with live feedback
- **Save/Load Workflows**: Persistent graph storage and template system

### 🔗 Real-time Communication

- **WebSocket Streaming**: Live LLM response streaming via Django Channels
- **HTTP ONLY JWT Authentication**: A custom implementation of Http only jwt auth
- **Multi-user Support**: User-isolated conversations and data processing

### 📄 Advanced Document Processing

- **Multiple Formats**: Support for various document types via Unstructured
- **Vector Search**: ChromaDB integration for semantic document search
- **Chunked Processing**: Configurable document chunking with LangChain

### ⚡ High-Performance Infrastructure

- **Containerized**: Full Docker & Docker Compose support
- **Kubernetes Ready**: Helm charts and production deployments
- **Load Balancing**: Nginx reverse proxy with SSL support

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  📱 React/Next.js Frontend                                      │
│  ├── Node Graph Interface (React Flow)                         │
│  ├── Real-time WebSocket connections                           │
│  └── Redux state management                                    │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTPS/WSS
┌─────────────────▼───────────────────────────────────────────────┐
│                    LOAD BALANCER                               │
├─────────────────────────────────────────────────────────────────┤
│  🔄 Nginx Reverse Proxy                                        │
│  ├── SSL termination                                           │
│  ├── Load balancing                                           │
│  └── Static file serving                                      │
└─────┬─────────────────────┬─────────────────────────────────────┘
      │ HTTP/REST API       │ WebSocket
┌─────▼─────────────────────▼─────────────────────────────────────┐
│                   APPLICATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  🚀 Django API Server     🔗 WebSocket Server                  │
│  ├── REST endpoints       ├── Django Channels                 │
│  ├── Authentication       ├── Real-time streaming             │
│  └── Business logic       └── JWT middleware                  │
│                                                               │
│  ⚡ Celery Workers                                            │
│  ├── Document processing                                      │
│  ├── LLM interactions                                        │
│  └── Background tasks                                        │
└─────┬─────────────────────┬─────────────────────┬─────────────────┘
      │                     │                     │
┌─────▼─────────────────────▼─────────────────────▼─────────────────┐
│                      DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  🗃️ PostgreSQL          📦 Redis Cache          🔍 ChromaDB      │
│  ├── User data          ├── Sessions            ├── Embeddings   │
│  ├── Node graphs        ├── WebSocket state     ├── Vector search │
│  └── Configurations     └── Task queue          └── Documents     │
│                                                                 │
│  📁 File Storage                                               │
│  ├── Uploaded documents                                       │
│  ├── Processed data                                          │
│  └── User assets                                             │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                 EXTERNAL SERVICES                              │
├─────────────────────────────────────────────────────────────────┤
│  🤖 OpenAI API                                                │
│  ├── GPT models                                              │
│  ├── Streaming responses                                     │
│  └── Token management                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                              │
├─────────────────────────────────────────────────────────────────┤
│  ☸️ Kubernetes Cluster                                         │
│  ├── Pod orchestration                                        │
│  └── Health monitoring                                        │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
savvy_data_studio/
├── 📁 frontend/              # Next.js React Application
│   ├── 📁 src/
│   │   ├── 📁 app/           # Next.js App Router
│   │   ├── 📁 components/    # React Components
│   │   │   ├── 📁 custom/    # Custom Components
│   │   │   │   └── 📁 node-graph/  # React Flow Node Components
│   │   │   └── 📁 ui/        # Shadcn UI Components
│   │   ├── 📁 features/      # Redux State Management
│   │   ├── 📁 services/      # API Services
│   │   └── 📁 types/         # TypeScript Types
│   └── 📄 package.json       # Dependencies & Scripts
│
├── 📁 backend/               # Django Application
│   ├── 📁 src/
│   │   ├── 📁 core/          # Django Core Settings
│   │   │   ├── 📁 authentication/  # JWT & WebSocket Auth
│   │   │   └── 📁 middleware/      # Custom Middleware
│   │   ├── 📁 node_graph/    # Main App
│   │   │   ├── 📁 consumers/ # WebSocket Consumers
│   │   │   ├── 📁 models/    # Database Models
│   │   │   ├── 📁 services/  # Business Logic
│   │   │   └── 📁 views/     # API Views
│   │   └── 📁 data_processing/  # Document Processing
│   ├── 📁 docker/            # Docker Configuration
│   └── 📄 requirements.txt   # Python Dependencies
│
├── 📁 infra/                 # Infrastructure as Code
│   ├── 📁 docker-compose.prod/  # Kubernetes Helm Charts
│   └── 📁 nginx/             # Nginx Ingress Configuration
│
├── 📄 docker-compose.yaml    # Development Environment
├── 📄 docker-compose.prod.yaml  # Production Environment, no bind mounts,etc
└── 📄 README.md              # This file
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **UI Components**: Shadcn UI, Radix UI
- **Graph Visualization**: React Flow
- **Package Manager**: pnpm

### Backend

- **Framework**: Django with Django REST Framework
- **Language**: Python
- **Database**: PostgreSQL
- **Cache/Message Broker**: Redis
- **Task Queue**: Celery with Flower monitoring
- **WebSockets**: Django Channels with Channels Redis
- **LLM Integration**: OpenAI , LangChain
- **Document Processing**: Unstructured , PyPDF
- **Vector Database**: ChromaDB

### DevOps & Infrastructure

- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes with Helm Charts
- **Reverse Proxy**: Nginx with SSL/TLS
- **Monitoring**: Prometheus, Grafana
- **Tracing**: OpenTelemetry
- **CI/CD**: ArgoCD (GitOps)

## 🚦 Getting Started

### Prerequisites

- Docker & Docker Compose
- Git
- (Optional) Node.js 18+ and Python 3.9+ for local development

### Quick Start with Docker Compose(Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd savvy_data_studio
   ```

2. **Set up environment variables**

   ```bash
   # Copy the sample environment file
   cp .env.sample .env

   # Edit the .env file with your configuration
   # Required variables:
   # - PROJECT_NAME=data-studio
   # - DB_PASSWORD=your_secure_password
   # - DB_USER=postgres
   # - DB_NAME=data_studio
   # - SECRET_KEY=your_django_secret_key
   # - OPENAI_API_KEY=your_openai_api_key (optional, can be set per user. useful when testing)
   ```

3. **Start the development environment**

   ```bash
   # Build and start all services
   docker compose up --build

   # Or run in detached mode
   docker compose up --build -d
   ```

4. **Access the application**
   - Frontend: https://localhost
   - API Documentation: https://localhost/api/docs/

### Production Deployment

#### Using Docker Compose (Production)

```bash
# Use production docker-compose file
docker-compose -f docker-compose.prod.yaml up --build -d
```

#### Using Kubernetes

```bash
# Navigate to infrastructure directory
cd infra/docker-compose.prod

# Install with Helm
helm install data-studio . --namespace data-studio --create-namespace

# Or apply directly
kubectl apply -f templates/
```

### Local Development Setup(not tested, please use docker)

#### Frontend Development

```bash
cd frontend
pnpm install
pnpm dev
# Runs on http://localhost:3000
```

#### Backend Development

```bash
cd backend/src
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# Runs on http://localhost:8000
```

## 📋 Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
# Project Configuration
PROJECT_NAME=data-studio
BUILD_ENV=development

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=data_studio
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Django Configuration
SECRET_KEY=your_django_secret_key_here
DEBUG=True
DJANGO_URL_PREFIX=/api

# Superuser Configuration
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin123

# Celery Configuration
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
FLOWER_PORT=5555

# CORS Configuration
BACKEND_CORS_ORIGINS=https://localhost:443,http://localhost:3000

# SSL Configuration (for production)
PGSSLCERT=/path/to/cert

# Production Host (for production)
PRODUCTION_HOST=your-domain.com
```

## 🎯 Usage Guide

### Creating Node Graphs

1. **Access the Node Graph Interface**

   - Navigate to `/admin` after logging in
   - Right-click on the canvas to add nodes

2. **Available Node Types**

   - **Text Input**: Manual text input for prompts
   - **Document Input**: Upload and process documents
   - **Chat Model**: LLM interaction with configurable parameters
   - **Vector Search**: Semantic search through processed documents
   - **Text Output**: Display results and outputs

3. **Connecting Nodes**

   - Drag from output handles to input handles
   - Data flows through connections during execution

4. **Executing Workflows**
   - Click the execution button to run the entire graph
   - Monitor real-time progress and streaming responses

## 📊 Monitoring & Observability

### Built-in Monitoring

- **Health Checks**: `/api/health/` endpoint
- **Logs**

### Production Monitoring Stack

```yaml
# Included exporters
- PostgreSQL Exporter: Database metrics
- Redis Exporter: Cache metrics
- Django Prometheus: Application metrics
```

## 🚀 Deployment Strategies

### Development

- Docker Compose with hot reload
- Local development servers

### Production

- Kubernetes cluster deployment

---

**Data Studio** - Reimagining the future of LLM interactions through sophisticated graph-based workflows and enterprise-grade infrastructure.
