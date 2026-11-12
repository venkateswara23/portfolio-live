# 📊 ELK Stack Integration: Elasticsearch, Logstash, and Kibana

This module integrates the industry-standard **ELK Stack** (Elasticsearch, Logstash, Kibana) with the developer portfolio application to collect, process, search, and visualize server and application logs in real time.

---

## 🏛️ Architecture Overview

```
[Web Users / REST API Clients]
              │
              ▼
    [Java / Python Backend Server]
              │  (Writes structured JSON events)
              ▼
     [logs/portfolio-elk.log]
              │
              ├───► [Filebeat / TCP Port 5000 / 5044]
              │                  │
              ▼                  ▼
      [Logstash Ingestion & Grok Processing]
              │  • Field extraction & normalization
              │  • HTTP status categorization (2xx, 4xx, 5xx)
              │  • Timestamp parsing
              ▼
   [Elasticsearch Cluster (Port 9200)]
              │  • Sharded, indexed search engine
              │  • Index template: portfolio-logs-YYYY.MM.DD
              ▼
   [Kibana Analytics & Dashboards (Port 5601)]
              │  • Live Search & Querying (KQL)
              │  • HTTP status pie charts & bar trends
              │  • Latency heatmaps & anomaly monitoring
```

---

## 🚀 Quick Start (Running ELK with Docker)

### Prerequisites:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on Windows, macOS, or Linux.

### 1. Launch the ELK Stack:
Run the following command from the project root:
```bash
docker compose -f docker-compose.elk.yml up -d
```

### 2. Verify Stack Components:
- **Elasticsearch**: Check cluster health at [http://localhost:9200](http://localhost:9200)
- **Logstash**: Monitoring API at [http://localhost:9600](http://localhost:9600)
- **Kibana**: Analytics dashboard at [http://localhost:5601](http://localhost:5601)

### 3. Generate Traffic:
Browse through the portfolio website or run test API calls:
```bash
curl http://localhost:8080/api/projects
curl http://localhost:8080/api/profile
```
Structured logs are automatically written to `logs/portfolio-elk.log` and streamed into Logstash and Elasticsearch.

### 4. Search and Visualize in Kibana:
1. Open [http://localhost:5601](http://localhost:5601)
2. Go to **Stack Management** > **Index Patterns** (or Data Views)
3. Create a data view with index pattern `portfolio-logs-*`
4. Set timestamp field to `@timestamp`
5. Click **Discover** to search logs with full text and field filters:
   - `level : "ERROR"`
   - `status >= 400`
   - `duration_ms > 100`

---

## 💻 Native In-App Observability (Without Docker)

If Docker is not running on your computer, this portfolio includes a built-in **Live ELK Observability Console** directly in [`admin.html`](http://localhost:8080/admin.html):
- **Live Ingested Log Stream**: Real-time log inspector.
- **Dynamic Search & Level Filter**: Search by keyword or filter by `INFO`, `WARN`, `ERROR`.
- **Latency & Error Rate Metrics**: Computed live from server traffic.
- **Interactive Log Emitter**: Click "Emit Test Log Event" to simulate real-time traffic.
