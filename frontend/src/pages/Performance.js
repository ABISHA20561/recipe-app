import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

const DATA = {
  "BiasMF":     { AUC:0.6823, "NDCG@10":0.0312, "Recall@10":0.0401 },
  "FM":         { AUC:0.7012, "NDCG@10":0.0389, "Recall@10":0.0512 },
  "NCF":        { AUC:0.6934, "NDCG@10":0.0356, "Recall@10":0.0478 },
  "LightGCN":   { AUC:0.7234, "NDCG@10":0.0523, "Recall@10":0.0634 },
  "DGCF":       { AUC:0.7456, "NDCG@10":0.0634, "Recall@10":0.0756 },
  "HAFR":       { AUC:0.7823, "NDCG@10":0.0756, "Recall@10":0.0867 },
  "SCHGN":      { AUC:0.8245, "NDCG@10":0.0903, "Recall@10":0.0893 },
  "P2D (Ours)": { AUC:0.7731, "NDCG@10":0.0806, "Recall@10":0.0833 },
};

const MODELS  = Object.keys(DATA);
const METRICS = ["AUC", "NDCG@10", "Recall@10"];

const ABLATION = [
  { name:"P2D (Full)",      auc:0.7731, ndcg:0.0806, rec:0.0833, note:"Complete model",             color:"#00fff7" },
  { name:"w/o Hyper-GNN",   auc:0.6726, ndcg:0.0582, rec:0.0601, note:"Remove hypergraph learning", color:"#ff4d4d" },
  { name:"w/o Contrastive", auc:0.7234, ndcg:0.0689, rec:0.0712, note:"Remove contrastive loss",    color:"#ff9900" },
  { name:"w/o MI Min",      auc:0.7412, ndcg:0.0723, rec:0.0756, note:"Remove mutual info loss",    color:"#ffff00" },
  { name:"w/o Disentangle", auc:0.7089, ndcg:0.0634, rec:0.0667, note:"Remove disentangle module",  color:"#ff00ff" },
];

export default function Performance() {
  const [metric, setMetric] = useState("NDCG@10");
  const [tab,    setTab]    = useState("overview");

  const chartData = MODELS.map(m => ({
    name:   m === "P2D (Ours)" ? "P2D" : m,
    value:  DATA[m][metric],
    isOurs: m === "P2D (Ours)"
  }));

  const types = {
    "BiasMF":"Matrix Factorization", "FM":"Factorization Machine",
    "NCF":"Neural CF", "LightGCN":"Graph NN",
    "DGCF":"Disentangled GNN", "HAFR":"Attention+Recipe",
    "SCHGN":"Hetero Graph", "P2D (Ours)":"Hypergraph+Disentangle"
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.content}>

        {/* Header */}
        <div style={styles.headerBox}>
          <h2 style={styles.heading}>Model Performance</h2>
          <p style={styles.subHeading}>
            P2D vs 7 baseline models on Food.com dataset
          </p>
        </div>

        {/* Stat cards */}
        <div style={styles.statsRow}>
          {METRICS.map(m => {
            const p2dVal = DATA["P2D (Ours)"][m];
            const rank   = [...MODELS.map(mod => DATA[mod][m])]
                            .sort((a,b) => b-a).indexOf(p2dVal) + 1;
            return (
              <div key={m} style={styles.statCard}>
                <p style={styles.statLabel}>{m}</p>
                <p style={styles.statValue}>{p2dVal.toFixed(4)}</p>
                <p style={{
                  ...styles.statRank,
                  color: rank <= 2 ? "#00fff7" : "#ff9900"
                }}>
                  Rank #{rank} of {MODELS.length} models
                </p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={styles.tabRow}>
          {[
            { key:"overview", label:"Comparison Table" },
            { key:"chart",    label:"Bar Chart" },
            { key:"ablation", label:"Ablation Study" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                ...styles.tabBtn,
                background: tab === t.key ? "#00fff7" : "transparent",
                color:      tab === t.key ? "#000"    : "#00fff7",
                boxShadow:  tab === t.key
                  ? "0 0 16px rgba(0,255,247,0.6)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        {tab === "overview" && (
          <div style={styles.tableBox}>
            <p style={styles.tableNote}>
              * = Best result &nbsp;|&nbsp; Cyan = Our P2D model &nbsp;|&nbsp;
              Values from paper (Dong et al., 2025)
            </p>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"rgba(0,255,247,0.08)" }}>
                    {["Model","AUC","NDCG@10","Recall@10","Type"].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((model, i) => {
                    const isOurs = model === "P2D (Ours)";
                    const best   = m => Math.max(...MODELS.map(x => DATA[x][m]));
                    return (
                      <tr key={model} style={{
                        background: isOurs
                          ? "rgba(0,255,247,0.07)"
                          : i%2===0
                            ? "rgba(255,255,255,0.03)"
                            : "transparent",
                        borderLeft: isOurs
                          ? "3px solid #00fff7" : "3px solid transparent",
                      }}>
                        <td style={{
                          ...styles.td,
                          color: isOurs ? "#00fff7" : "#e0e0e0",
                          fontWeight: isOurs ? "800" : "500",
                          textShadow: isOurs ? "0 0 8px #00fff7" : "none",
                        }}>
                          {model}
                        </td>
                        {METRICS.map(m => {
                          const isBest = DATA[model][m] === best(m);
                          return (
                            <td key={m} style={{
                              ...styles.td,
                              color: isBest ? "#00ff99"
                                : isOurs ? "#aaffee" : "#ccc",
                              fontWeight: isBest ? "bold" : "normal",
                              textShadow: isBest
                                ? "0 0 8px #00ff99" : "none",
                            }}>
                              {DATA[model][m].toFixed(4)}
                              {isBest ? " ★" : ""}
                            </td>
                          );
                        })}
                        <td style={{
                          ...styles.td,
                          color: isOurs ? "#aaa" : "#666",
                          fontSize:"0.8rem",
                        }}>
                          {types[model]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bar Chart */}
        {tab === "chart" && (
          <div style={styles.tableBox}>
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {METRICS.map(m => (
                <button key={m} onClick={() => setMetric(m)}
                  style={{
                    ...styles.metricBtn,
                    background: metric===m ? "#00fff7" : "transparent",
                    color:      metric===m ? "#000"    : "#00fff7",
                    boxShadow:  metric===m
                      ? "0 0 12px rgba(0,255,247,0.5)" : "none",
                  }}>
                  {m}
                </button>
              ))}
            </div>
            <h3 style={{ color:"#00fff7", marginBottom:4,
                         textShadow:"0 0 10px #00fff7" }}>
              {metric} — All Models
            </h3>
            <p style={{ color:"#888", fontSize:"0.85rem", marginBottom:16 }}>
              Cyan bar = P2D (our model)
            </p>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={chartData}
                margin={{ top:10, right:20, left:0, bottom:50 }}>
                <CartesianGrid strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" angle={-30} textAnchor="end"
                  tick={{ fontSize:12, fill:"#bbb" }} />
                <YAxis tickFormatter={v => v.toFixed(3)}
                  tick={{ fontSize:11, fill:"#bbb" }} />
                <Tooltip
                  formatter={v => [v.toFixed(4), metric]}
                  contentStyle={{
                    background:"#0a0a1e",
                    border:"1px solid #00fff7",
                    color:"#00fff7",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i}
                      fill={entry.isOurs ? "#00fff7" : "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Ablation Study */}
        {tab === "ablation" && (
          <div style={styles.tableBox}>
            <h3 style={{ color:"#00fff7", marginBottom:4,
                         textShadow:"0 0 10px #00fff7" }}>
              What happens when we remove parts of P2D?
            </h3>
            <p style={{ color:"#888", fontSize:"0.85rem", marginBottom:20 }}>
              Each row removes one component to show its importance
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {ABLATION.map((row, i) => {
                const drop = i===0 ? null
                  : (((ABLATION[0].ndcg - row.ndcg)
                      / ABLATION[0].ndcg)*100).toFixed(1);
                return (
                  <div key={i} style={{
                    border:`1px solid ${row.color}`,
                    borderRadius:10, padding:16,
                    background:"rgba(0,0,0,0.5)",
                    boxShadow:`0 0 12px ${row.color}25`,
                  }}>
                    <div style={{
                      display:"flex", justifyContent:"space-between",
                      alignItems:"center", flexWrap:"wrap", gap:8,
                    }}>
                      <div>
                        <span style={{
                          fontWeight:"800", color:row.color,
                          fontSize:"1rem",
                          textShadow:`0 0 8px ${row.color}`,
                        }}>
                          {row.name}
                        </span>
                        <span style={{
                          color:"#888", fontSize:"0.85rem", marginLeft:10,
                        }}>
                          — {row.note}
                        </span>
                      </div>
                      {drop && (
                        <span style={{
                          background:"rgba(255,77,77,0.12)",
                          color:"#ff6666",
                          padding:"4px 12px", borderRadius:20,
                          fontWeight:"bold", fontSize:"0.85rem",
                          border:"1px solid #ff4d4d",
                        }}>
                          NDCG@10 drops -{drop}%
                        </span>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:24, marginTop:12 }}>
                      {[
                        ["AUC",      row.auc],
                        ["NDCG@10",  row.ndcg],
                        ["Recall@10",row.rec],
                      ].map(([label, val]) => (
                        <div key={label} style={{ textAlign:"center" }}>
                          <p style={{
                            color:"#777", fontSize:"0.75rem",
                            margin:"0 0 4px",
                          }}>
                            {label}
                          </p>
                          <p style={{
                            fontWeight:"bold", color:"#eee",
                            margin:0, fontSize:"1.05rem",
                          }}>
                            {val.toFixed(4)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight:"100vh", position:"relative",
    backgroundImage:`url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80')`,
    backgroundSize:"cover", backgroundPosition:"center",
    backgroundAttachment:"fixed",
  },
  overlay: {
    position:"fixed", inset:0,
    background:"rgba(0,0,0,0.92)", zIndex:0,
  },
  content: {
    position:"relative", zIndex:1,
    maxWidth:980, margin:"0 auto", padding:"24px",
  },
  headerBox: {
    background:"rgba(0,0,0,0.7)",
    border:"1px solid #00fff7",
    boxShadow:"0 0 30px rgba(0,255,247,0.2)",
    borderRadius:14, padding:"24px 28px",
    marginBottom:24, marginTop:16,
  },
  heading: {
    margin:"0 0 6px", color:"#fff",
    fontSize:"1.9rem", fontWeight:"800",
    textShadow:"0 0 20px #00fff7",
  },
  subHeading: { color:"#888", margin:0, fontSize:"0.95rem" },
  statsRow: {
    display:"grid", gridTemplateColumns:"repeat(3,1fr)",
    gap:16, marginBottom:24,
  },
  statCard: {
    background:"rgba(0,0,0,0.75)",
    border:"1px solid rgba(0,255,247,0.3)",
    boxShadow:"0 0 16px rgba(0,255,247,0.1)",
    borderRadius:12, padding:20, textAlign:"center",
  },
  statLabel: {
    color:"#888", margin:"0 0 8px", fontSize:"0.85rem",
    letterSpacing:"0.5px",
  },
  statValue: {
    fontSize:"2rem", fontWeight:"800",
    color:"#fff", margin:"0 0 6px",
    textShadow:"0 0 14px #00fff7",
  },
  statRank: { margin:0, fontSize:"0.8rem", fontWeight:"600" },
  tabRow: { display:"flex", gap:10, marginBottom:20 },
  tabBtn: {
    padding:"10px 22px", borderRadius:8,
    border:"2px solid #00fff7", cursor:"pointer",
    fontWeight:"bold", fontSize:"0.9rem",
    transition:"all 0.2s", letterSpacing:"0.5px",
  },
  tableBox: {
    background:"rgba(0,0,0,0.75)",
    border:"1px solid rgba(0,255,247,0.2)",
    boxShadow:"0 0 20px rgba(0,255,247,0.05)",
    borderRadius:12, padding:24,
  },
  tableNote: {
    color:"#666", fontSize:"0.82rem", marginBottom:16,
  },
  th: {
    color:"#00fff7", padding:"13px 16px",
    textAlign:"center", fontWeight:"700",
    borderBottom:"1px solid rgba(0,255,247,0.3)",
    fontSize:"0.9rem", letterSpacing:"0.5px",
  },
  td: {
    padding:"12px 16px", textAlign:"center",
    borderBottom:"1px solid rgba(255,255,255,0.06)",
    fontSize:"0.92rem",
  },
  metricBtn: {
    padding:"8px 18px", borderRadius:20,
    border:"1px solid #00fff7", cursor:"pointer",
    fontWeight:"bold", transition:"all 0.2s",
    fontSize:"0.85rem",
  },
};