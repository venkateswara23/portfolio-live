# Kubernetes & Minikube Deployment Guide
## Timmareddy Venkateswara Reddy Portfolio

This guide explains how to deploy the portfolio containerized application into a local Kubernetes cluster using **Minikube** and **kubectl**.

---

### Prerequisites
1. **Docker Desktop** installed and running.
2. **kubectl** installed (Verified: v1.36.1).
3. **Minikube** installed:
   ```powershell
   winget install Kubernetes.minikube
   ```
   *(Or alternatively, enable Kubernetes with 1 click in Docker Desktop Settings -> Kubernetes -> Enable Kubernetes)*.

---

### Step-by-Step Deployment to Minikube

#### 1. Start the Minikube Cluster
```powershell
minikube start --driver=docker
```

#### 2. Configure Local Shell to Use Minikube's Docker Daemon
To build the Docker image directly inside Minikube without needing an external Docker registry:
```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

#### 3. Build the Portfolio Docker Image
```powershell
cd "C:\Users\Sai Ram\.gemini\antigravity\scratch\portfolio-main"
docker build -t portfolio-app:latest .
```

#### 4. Apply Kubernetes Manifests
Deploy the ConfigMap, Deployment (2 pod replicas with health probes), and NodePort Service:
```powershell
kubectl apply -f k8s/
```

#### 5. Verify Pods & Services
```powershell
kubectl get pods -l app=portfolio-app
kubectl get services portfolio-service
```
Expected output:
```text
NAME                                    READY   STATUS    RESTARTS   AGE
portfolio-deployment-xxxxxxxxx-xxxxx    1/1     Running   0          30s
portfolio-deployment-xxxxxxxxx-yyyyy    1/1     Running   0          30s
```

#### 6. Access Your Portfolio Pod in Browser
- **Option A (Minikube Service URL)**:
  ```powershell
  minikube service portfolio-service
  ```
- **Option B (Kubectl Port-Forward)**:
  ```powershell
  kubectl port-forward svc/portfolio-service 8080:8080
  ```
  Open **http://localhost:8080/** in your browser!

---

### Teardown / Cleanup
```powershell
kubectl delete -f k8s/
minikube stop
```
