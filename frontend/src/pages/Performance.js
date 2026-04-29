import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";

// ── Data from actual results (image) ──
const DATA = {
  "BiasMF":          { epochs: 50, AUC: 0.511, "NDCG@10": 0.036, "Recall@10": 0.053, isOurs: false },
  "NCF":             { epochs: 50, AUC: 0.521, "NDCG@10": 0.037, "Recall@10": 0.057, isOurs: false },
  "FM":              { epochs: 50, AUC: 0.571, "NDCG@10": 0.040, "Recall@10": 0.061, isOurs: false },
  "DGCF":            { epochs: 50, AUC: 0.581, "NDCG@10": 0.041, "Recall@10": 0.062, isOurs: false },
  "LightGCN":        { epochs: 50, AUC: 0.592, "NDCG@10": 0.043, "Recall@10": 0.063, isOurs: false },
  "HAFR":            { epochs: 50, AUC: 0.644, "NDCG@10": 0.046, "Recall@10": 0.067, isOurs: false },
  "SCHGN":           { epochs: 50, AUC: 0.721, "NDCG@10": 0.057, "Recall@10": 0.088, isOurs: false },
  "Paper P2D":       { epochs: 50, AUC: 0.764, "NDCG@10": 0.079, "Recall@10": 0.115, isOurs: false, isPaper: true },
  "P2D+QNN+FL\n+Lion+Lookahead\n(Ours)": {
    epochs: 15, AUC: 0.766, "NDCG@10": 0.081, "Recall@10": 0.121, isOurs: true,
  },
};

const MODELS  = Object.keys(DATA);
const METRICS = ["AUC", "NDCG@10", "Recall@10"];

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
          fontSize: "0.88rem",
        }}>
          <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
          <p style={{ margin: "4px 0 0", color: "#fff" }}>
            {metric}: <strong>{payload[0].value.toFixed(3)}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.content}>

        {/* Header */}
        <div style={styles.headerBox}>
          <h2 style={styles.heading}>Model Performance</h2>
          <p style={styles.subHeading}>
            Food.com dataset · Baselines at <strong style={{ color: "#00fff7" }}>50 epochs</strong> ·
            Our model at <strong style={{ color: "#00ff99" }}>15 epochs</strong>
          </p>
        </div>

        {/* Stat cards */}
        <div style={styles.statsRow}>
          {METRICS.map(m => {
            const oursVal = DATA["P2D+QNN+FL\n+Lion+Lookahead\n(Ours)"][m];
            const paperVal = DATA["Paper P2D"][m];
            const gain = (((oursVal - paperVal) / paperVal) * 100).toFixed(1);
            return (
              <div key={m} style={styles.statCard}>
                <p style={styles.statLabel}>{m}</p>
                <p style={styles.statValue}>{oursVal.toFixed(3)}</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#00ff99", fontWeight: "600" }}>
                  +{gain}% vs Paper P2D
                </p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={styles.tabRow}>
          {[
            { key: "table", label: "Comparison Table" },
            { key: "chart", label: "Bar Chart" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                ...styles.tabBtn,
                background: tab === t.key ? "#00fff7" : "transparent",
                color:      tab === t.key ? "#000"    : "#00fff7",
                boxShadow:  tab === t.key ? "0 0 16px rgba(0,255,247,0.5)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TABLE TAB */}
        {tab === "table" && (
          <div style={styles.tableBox}>
            <p style={styles.tableNote}>
              ★ = Best result &nbsp;|&nbsp;
              <span style={{ color: "#00fff7" }}>■</span> Cyan = Our model &nbsp;|&nbsp;
              <span style={{ color: "#a78bfa" }}>■</span> Purple = Paper P2D
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                <thead>
                  <tr style={{ background: "rgba(0,255,247,0.06)" }}>
                    {["Model", "Epochs", "AUC", "NDCG@10", "Recall@10"].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((model, i) => {
                    const isOurs  = DATA[model].isOurs;
                    const isPaper = DATA[model].isPaper;
                    const rowBg   = isOurs
                      ? "rgba(0,255,247,0.07)"
                      : isPaper
                      ? "rgba(167,139,250,0.06)"
                      : i % 2 === 0
                      ? "rgba(255,255,255,0.02)"
                      : "transparent";
                    const borderLeft = isOurs
                      ? "3px solid #00fff7"
                      : isPaper
                      ? "3px solid #a78bfa"
                      : "3px solid transparent";

                    return (
                      <tr key={model} style={{ background: rowBg, borderLeft }}>
                        <td style={{
                          ...styles.td,
                          textAlign: "left",
                          paddingLeft: 16,
                          color: isOurs ? "#00fff7" : isPaper ? "#a78bfa" : "#e0e0e0",
                          fontWeight: isOurs || isPaper ? "800" : "500",
                          textShadow: isOurs
                            ? "0 0 8px #00fff7"
                            : isPaper
                            ? "0 0 8px #a78bfa"
                            : "none",
                          whiteSpace: "pre-line",
                        }}>
                          {model}
                        </td>
                        <td style={{ ...styles.td, color: "#888" }}>{DATA[model].epochs}</td>

                        {METRICS.map(m => {
                          const isBest = DATA[model][m] === best(m);
                          return (
                            <td key={m} style={{
                              ...styles.td,
                              color: isBest
                                ? "#00ff99"
                                : isOurs
                                ? "#aaffee"
                                : isPaper
                                ? "#c4b5fd"
                                : "#ccc",
                              fontWeight: isBest ? "bold" : "normal",
                              textShadow: isBest ? "0 0 8px #00ff99" : "none",
                            }}>
                              {DATA[model][m].toFixed(3)}{isBest ? " ★" : ""}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CHART TAB */}
        {tab === "chart" && (
          <div style={styles.tableBox}>
            {/* Metric selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {METRICS.map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  style={{
                    ...styles.metricBtn,
                    background: metric === m ? "#00fff7" : "transparent",
                    color:      metric === m ? "#000"    : "#00fff7",
                    boxShadow:  metric === m ? "0 0 12px rgba(0,255,247,0.5)" : "none",
                  }}>
                  {m}
                </button>
              ))}
            </div>

            <h3 style={{ color: "#00fff7", marginBottom: 4, textShadow: "0 0 10px #00fff7" }}>
              {metric} — All Models
            </h3>
            <div style={{ display: "flex", gap: 20, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.82rem", color: "#aaa" }}>
                <span style={{ color: "#3b82f6" }}>■</span> Baselines
              </span>
              <span style={{ fontSize: "0.82rem", color: "#aaa" }}>
                <span style={{ color: "#a78bfa" }}>■</span> Paper P2D
              </span>
              <span style={{ fontSize: "0.82rem", color: "#aaa" }}>
                <span style={{ color: "#00fff7" }}>■</span> Our model
              </span>
            </div>

            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  tick={{ fontSize: 12, fill: "#bbb" }}
                  interval={0}
                />
                <YAxis
                  tickFormatter={v => v.toFixed(3)}
                  tick={{ fontSize: 11, fill: "#bbb" }}
                  domain={[0, 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    formatter={v => v.toFixed(3)}
                    style={{ fontSize: "0.72rem", fill: "#999" }}
                  />
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={
                        entry.isOurs  ? "#00fff7" :
                        entry.isPaper ? "#a78bfa" :
                        "#3b82f6"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.92)", zIndex: 0,
  },
  content: {
    position: "relative", zIndex: 1,
    maxWidth: 900, margin: "0 auto", padding: "24px",
  },
  headerBox: {
    background: "rgba(0,0,0,0.7)",
    border: "1px solid #00fff7",
    boxShadow: "0 0 30px rgba(0,255,247,0.2)",
    borderRadius: 14, padding: "24px 28px",
    marginBottom: 20, marginTop: 16,
  },
  heading: {
    margin: "0 0 6px", color: "#fff",
    fontSize: "1.9rem", fontWeight: "800",
    textShadow: "0 0 20px #00fff7",
  },
  subHeading: { color: "#bbb", margin: 0, fontSize: "0.95rem" },
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(3,1fr)",
    gap: 16, marginBottom: 24,
  },
  statCard: {
    background: "rgba(0,0,0,0.75)",
    border: "1px solid rgba(0,255,247,0.3)",
    boxShadow: "0 0 16px rgba(0,255,247,0.1)",
    borderRadius: 12, padding: 20, textAlign: "center",
  },
  statLabel: {
    color: "#bbb", margin: "0 0 8px",
    fontSize: "0.9rem", letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: "2rem", fontWeight: "800",
    color: "#fff", margin: "0 0 6px",
    textShadow: "0 0 14px #00fff7",
  },
  tabRow: { display: "flex", gap: 10, marginBottom: 20 },
  tabBtn: {
    padding: "10px 22px", borderRadius: 8,
    border: "2px solid #00fff7", cursor: "pointer",
    fontWeight: "bold", fontSize: "0.9rem",
    transition: "all 0.2s", letterSpacing: "0.5px",
  },
  tableBox: {
    background: "rgba(0,0,0,0.80)",
    border: "1px solid rgba(0,255,247,0.25)",
    boxShadow: "0 0 20px rgba(0,255,247,0.08)",
    borderRadius: 12, padding: 24,
  },
  tableNote: { color: "#999", fontSize: "0.82rem", marginBottom: 16 },
  th: {
    color: "#00fff7", padding: "13px 12px",
    textAlign: "center", fontWeight: "700",
    borderBottom: "2px solid rgba(0,255,247,0.4)",
    fontSize: "0.85rem", letterSpacing: "0.5px",
    background: "rgba(0,255,247,0.06)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 12px", textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontSize: "0.92rem", color: "#e8e8e8",
  },
  metricBtn: {
    padding: "7px 14px", borderRadius: 20,
    border: "1px solid #00fff7", cursor: "pointer",
    fontWeight: "bold", transition: "all 0.2s",
    fontSize: "0.82rem",
  },
};
