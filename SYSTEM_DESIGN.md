# System Design

## Overview

The Identity Reconciliation service is a Node.js REST API that reconciles user identities based on email and phone number.

## Components

- Node.js + Express
- PostgreSQL Database
- Docker
- Kubernetes
- GitHub Actions

## Architecture

```
Client
   |
   v
Kubernetes Service
   |
   v
Deployment (2 Pods)
   |
   v
Node.js Backend
   |
   v
PostgreSQL Database
```

## Kubernetes Resources

- Namespace
- Deployment
- Service
- ConfigMap
- Secret
- Ingress
- Horizontal Pod Autoscaler

## CI/CD

GitHub Actions automatically builds the project whenever code is pushed to the repository.

## Scalability

The application uses a Horizontal Pod Autoscaler to scale between 2 and 5 replicas based on CPU utilization.

## Security

- Database credentials are stored in Kubernetes Secrets.
- Configuration values are stored in ConfigMaps.

## Containerization

- Dockerfile builds the backend image.
- Docker Compose runs backend and PostgreSQL locally.