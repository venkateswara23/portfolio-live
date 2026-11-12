# 📈 Grafana Website Uptime & Downtime Monitoring

This system provides continuous, synthetic uptime and downtime monitoring for the developer portfolio using **Grafana**, **Prometheus**, and **Blackbox Exporter**.

---

## 🏛️ How It Works

```
[Grafana Dashboard :3000]
           │ Queries metrics & renders SLA gauges
           ▼
[Prometheus Time-Series Engine :9090]
     │                      │
     │ Scrapes /metrics     │ Scrapes /probe?target=...
     ▼                      ▼
[Portfolio Website :8080]  [Blackbox Exporter :9115]
  • /health (200 OK)         • HTTP Synthetic Probes (every 15s)
  • /metrics (Prometheus)    • Latency, DNS, SSL verification
```

1. **Synthetic Health Check**: Blackbox Exporter pings `http://host.docker.internal:8080/health` every 15 seconds.
2. **Prometheus Scraping**: Prometheus collects `probe_success` (1 = UP, 0 = DOWN) and `probe_duration_seconds`.
3. **Grafana Visualization**:
   - **Status Gauge**: Instant Green `UP (Operational)` or Red `DOWN (Outage)`.
   - **Uptime SLA Gauge**: 30-Day availability ratio (e.g. `99.98%`).
   - **Latency Stat**: Average response time in milliseconds.
   - **Outage Incident Log**: Tracks timestamp, duration, and recovery status.

---

## 🚀 Running with Docker

### 1. Launch the Stack:
```bash
docker compose -f docker-compose.monitoring.yml up -d
```

### 2. Access Dashboards:
- **Grafana**: [http://localhost:3000](http://localhost:3000) (Login: `admin` / `admin`)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Blackbox Exporter**: [http://localhost:9115](http://localhost:9115)

### 3. Import Dashboard:
1. In Grafana, click **Dashboards** > **New** > **Import**.
2. Select or paste the contents of `monitoring/grafana/dashboards/website-uptime.json`.
3. Select the Prometheus data source and click **Import**.

---

## 💻 In-App Interactive Uptime Dashboard

You can also view and test the Grafana Uptime monitor directly in the portfolio admin panel at [`admin.html`](http://localhost:8080/admin.html):
- **Live 30-Day Uptime Bar**: Visual state history (like GitHub status).
- **Simulate Downtime Incident**: Toggle the website between `UP` and `DOWN` to see the dashboard respond live!
