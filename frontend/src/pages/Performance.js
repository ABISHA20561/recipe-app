```javascript
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";

// ── Updated Data with @10, @20, @50 ──
const DATA = {
  "BiasMF": { epochs: 50, AUC: 0.511, "NDCG@10": 0.036, "NDCG@20": 0.048, "NDCG@50": 0.073, "Recall@10": 0.053, "Recall@20": 0.091, "Recall@50": 0.190, isOurs: false },
  "NCF": { epochs: 50, AUC: 0.521, "NDCG@10": 0.037, "NDCG@20": 0.050, "NDCG@50": 0.076, "Recall@10": 0.057, "Recall@20": 0.101, "Recall@50": 0.202, isOurs: false },
  "FM": { epochs: 50, AUC: 0.571, "NDCG@10": 0.040, "NDCG@20": 0.054, "NDCG@50": 0.079, "Recall@10": 0.061, "Recall@20": 0.106, "Recall@50": 0.211, isOurs: false },
  "DGCF": { epochs: 50, AUC: 0.581, "NDCG@10": 0.041, "NDCG@20": 0.055, "NDCG@50": 0.083, "Recall@10": 0.062, "Recall@20": 0.109, "Recall@50": 0.213, isOurs: false },
  "LightGCN": { epochs: 50, AUC: 0.592, "NDCG@10": 0.043, "NDCG@20": 0.058, "NDCG@50": 0.088, "Recall@10": 0.063, "Recall@20": 0.110, "Recall@50": 0.224, isOurs: false },
  "HAFR": { epochs: 50, AUC: 0.644, "NDCG@10": 0.046, "NDCG@20": 0.060, "NDCG@50": 0.090, "Recall@10": 0.067, "Recall@20": 0.116, "Recall@50": 0.225, isOurs: false },
  "SCHGN": { epochs: 50, AUC: 0.721, "NDCG@10": 0.057, "NDCG@20": 0.077, "NDCG@50": 0.117, "Recall@10": 0.088, "Recall@20": 0.157, "Recall@50": 0.313, isOurs: false },

  "Paper P2D": {
    epochs: 50,
    AUC: 0.764,
    "NDCG@10": 0.079,
    "NDCG@20": 0.101,
    "NDCG@50": 0.141,
    "Recall@10": 0.115,
    "Recall@20": 0.187,
    "Recall@50": 0.350,
    isOurs: false,
    isPaper: true
  },

  "P2D+QNN+FL\n+Lion+Lookahead\n(Ours)": {
    epochs: 50,
    AUC: 0.773,
    "NDCG@10": 0.086,
    "NDCG@20": 0.111,
    "NDCG@50": 0.155,
    "Recall@10": 0.127,
    "Recall@20": 0.205,
    "Recall@50": 0.378,
    isOurs: true
  }
};

const MODELS = Object.keys(DATA);

const METRICS = [
  "AUC",
  "NDCG@10", "NDCG@20", "NDCG@50",
  "Recall@10", "Recall@20", "Recall@50"
];

const SHORT_NAMES = {
  "BiasMF": "BiasMF",
  "NCF": "NCF",
  "FM": "FM",
  "DGCF": "DGCF",
  "LightGCN": "LightGCN",
  "HAFR": "HAFR",
  "SCHGN": "SCHGN",
  "Paper P2D": "Paper P2D",
  "P2D+QNN+FL\n+Lion+Lookahead\n(Ours)": "Ours",
};

export default function Performance() {
  const [metric, setMetric] = useState("NDCG@10");
  const [tab, setTab] = useState("table");

  const best = m => Math.max(...MODELS.map(x => DATA[x][m]));

  const chartData = MODELS.map(m => ({
    name: SHORT_NAMES[m],
    value: DATA[m][metric],
    isOurs: DATA[m].isOurs,
    isPaper: DATA[m].isPaper,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "#0a0a1a",
          border: "1px solid #00fff7",
          borderRadius: 8,
          padding: "10px 16px",
          color: "#00fff7",
        }}>
          <p><b>{label}</b></p>
          <p>{metric}: {payload[0].value.toFixed(3)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Model Performance</h2>

      {/* Metric Buttons */}
      <div>
        {METRICS.map(m => (
          <button key={m} onClick={() => setMetric(m)}>
            {m}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value">
            <LabelList dataKey="value" position="top" />
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.isOurs ? "#00fff7" : entry.isPaper ? "#a78bfa" : "#3b82f6"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Table */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Model</th>
            <th>Epochs</th>
            <th>AUC</th>
            <th>NDCG@10</th>
            <th>NDCG@20</th>
            <th>NDCG@50</th>
            <th>Recall@10</th>
            <th>Recall@20</th>
            <th>Recall@50</th>
          </tr>
        </thead>
        <tbody>
          {MODELS.map(model => (
            <tr key={model}>
              <td>{model}</td>
              <td>{DATA[model].epochs}</td>
              {METRICS.map(m => (
                <td key={m}>{DATA[model][m].toFixed(3)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```
