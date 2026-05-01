import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";

// ── IMPORTANT: NO \n in object keys — caused the build crash ──
const DATA = {
  "BiasMF":       { epochs:50, AUC:0.511, "NDCG@10":0.036, "NDCG@20":0.048, "NDCG@50":0.073, "Recall@10":0.053, "Recall@20":0.091, "Recall@50":0.190, isOurs:false, isPaper:false },
  "NCF":          { epochs:50, AUC:0.521, "NDCG@10":0.037, "NDCG@20":0.050, "NDCG@50":0.076, "Recall@10":0.057, "Recall@20":0.101, "Recall@50":0.202, isOurs:false, isPaper:false },
  "FM":           { epochs:50, AUC:0.571, "NDCG@10":0.040, "NDCG@20":0.054, "NDCG@50":0.079, "Recall@10":0.061, "Recall@20":0.106, "Recall@50":0.211, isOurs:false, isPaper:false },
  "DGCF":         { epochs:50, AUC:0.581, "NDCG@10":0.041, "NDCG@20":0.055, "NDCG@50":0.083, "Recall@10":0.062, "Recall@20":0.109, "Recall@50":0.213, isOurs:false, isPaper:false },
  "LightGCN":     { epochs:50, AUC:0.592, "NDCG@10":0.043, "NDCG@20":0.058, "NDCG@50":0.088, "Recall@10":0.063, "Recall@20":0.110, "Recall@50":0.224, isOurs:false, isPaper:false },
  "HAFR":         { epochs:50, AUC:0.644, "NDCG@10":0.046, "NDCG@20":0.060, "NDCG@50":0.090, "Recall@10":0.067, "Recall@20":0.116, "Recall@50":0.225, isOurs:false, isPaper:false },
  "SCHGN":        { epochs:50, AUC:0.721, "NDCG@10":0.057, "NDCG@20":0.077, "NDCG@50":0.117, "Recall@10":0.088, "Recall@20":0.157, "Recall@50":0.313, isOurs:false, isPaper:false },
  "Paper P2D":    { epochs:50, AUC:0.764, "NDCG@10":0.079, "NDCG@20":0.101, "NDCG@50":0.141, "Recall@10":0.115, "Recall@20":0.187, "Recall@50":0.350, isOurs:false, isPaper:true  },
  "Ours (P2D+)":  { epochs:50, AUC:0.773, "NDCG@10":0.086, "NDCG@20":0.111, "NDCG@50":0.155, "Recall@10":0.127, "Recall@20":0.205, "Recall@50":0.378, isOurs:true,  isPaper:false },
};

// Display label shown in chart x-axis (short, no newlines)
const CHART_LABEL = {
  "BiasMF":      "BiasMF",
  "NCF":         "NCF",
  "FM":          "FM",
  "DGCF":        "DGCF",
  "LightGCN":    "LightGCN",
  "HAFR":        "HAFR",
  "SCHGN":       "SCHGN",
  "Paper P2D":   "Paper P2D",
  "Ours (P2D+)": "Ours",
};

// Full name shown in the table
const FULL_NAME = {
  "BiasMF":      "BiasMF",
  "NCF":         "NCF",
  "FM":          "FM",
  "DGCF":        "DGCF",
  "LightGCN":    "LightGCN",
  "HAFR":        "HAFR",
  "SCHGN":       "SCHGN",
  "Paper P2D":   "Paper P2D",
  "Ours (P2D+)": "P2D + QNN + FL + Lion + Lookahead (Ours)",
};

const MODELS  = Object.keys(DATA);
const METRICS = ["AUC","NDCG@10","NDCG@20","NDCG@50","Recall@10","Recall@20","Recall@50"];

const ABLATION = [
  { name:"P2D+QNN+FL+Lion+Lookahead (Full)", auc:0.773, ndcg:0.086, rec:0.127, note:"Complete model — 50 epochs",                   color:"#00fff7" },
  { name:"w/o Hyper-GNN",                    auc:0.693, ndcg:0.058, rec:0.078, note:"Remove hypergraph learning",                   color:"#ff4d4d" },
  { name:"w/o Contrastive",                  auc:0.731, ndcg:0.067, rec:0.094, note:"Remove contrastive loss",                      color:"#ff9900" },
  { name:"w/o MI Min",                       auc:0.748, ndcg:0.071, rec:0.101, note:"Remove mutual information loss",               color:"#ffff00" },
  { name:"w/o Disentangle",                  auc:0.717, ndcg:0.063, rec:0.088, note:"Remove disentangle module",                    color:"#ff00ff" },
  { name:"w/o QNN",                          auc:0.764, ndcg:0.079, rec:0.115, note:"Remove quantum neural network (= Paper P2D)",  color:"#aaaaff" },
];

export default function Performance() {
  const [metric, setMetric] = useState("NDCG@10");
  const [tab,    setTab]    = useState("table");

  const best = m => Math.max(...MODELS.map(x => DATA[x][m]));

  const chartData = MODELS.map(m => ({
    name:    CHART_LABEL[m],
    value:   DATA[m][metric],
    isOurs:  DATA[m].isOurs,
    isPaper: DATA[m].isPaper,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background:"#0a0a1a", border:"1px solid #00fff7",
        borderRadius:8, padding:"10px 16px", color:"#00fff7",
      }}>
        <p><strong>{label}</strong></p>
        <p>{metric}: {payload[0].value.toFixed(3)}</p>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.content}>

        {/* ── Header ── */}
        <div style={styles.headerBox}>
          <h2 style={styles.heading}>Model Performance</h2>
          <p style={styles.subHeading}>
            P2D + QNN + FL + Lion + Lookahead (Ours) vs baselines · Food.com dataset
          </p>
        </div>

        {/* ── Stat cards ── */}
        <div style={styles.statsRow}>
          {["AUC","NDCG@10","Recall@10"].map(m => {
            const ourVal = DATA["Ours (P2D+)"][m];
            const rank   = [...MODELS.map(mod => DATA[mod][m])].sort((a,b) => b-a).indexOf(ourVal) + 1;
            return (
              <div key={m} style={styles.statCard}>
                <p style={styles.statLabel}>{m}</p>
                <p style={styles.statValue}>{ourVal.toFixed(3)}</p>
                <p style={{ ...styles.statRank, color: rank === 1 ? "#00ff99" : "#00fff7" }}>
                  Rank #{rank} of {MODELS.length}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Tabs ── */}
        <div style={styles.tabRow}>
          {[
            { key:"table",    label:"Comparison Table" },
            { key:"chart",    label:"Bar Chart" },
            { key:"ablation", label:"Ablation Study" },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                ...styles.tabBtn,
                background: tab === t.key ? "#00fff7" : "transparent",
                color:      tab === t.key ? "#000"    : "#00fff7",
                boxShadow:  tab === t.key ? "0 0 16px rgba(0,255,247,0.6)" : "none",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════
            TAB 1 — Comparison Table
            ══════════════════════════════ */}
        {tab === "table" && (
          <div style={styles.tableBox}>
            <p style={styles.tableNote}>
              ★ = Best result &nbsp;|&nbsp;
              <span style={{ color:"#00fff7" }}>Cyan</span> = Our model &nbsp;|&nbsp;
              <span style={{ color:"#a78bfa" }}>Purple</span> = Paper P2D &nbsp;|&nbsp;
              HAFR &amp; SCHGN numbers from original papers [6, 8]
            </p>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:860 }}>
                <thead>
                  <tr style={{ background:"rgba(0,255,247,0.08)" }}>
                    <th style={{ ...styles.th, textAlign:"left", paddingLeft:14 }}>Model</th>
                    <th style={styles.th}>Epochs</th>
                    {METRICS.map(h => <th key={h} style={styles.th}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((model, i) => {
                    const isOurs     = DATA[model].isOurs;
                    const isPaper    = DATA[model].isPaper;
                    const rowBg      = isOurs  ? "rgba(0,255,247,0.07)"
                                    : isPaper  ? "rgba(167,139,250,0.06)"
                                    : i % 2 === 0 ? "rgba(255,255,255,0.025)" : "transparent";
                    const borderClr  = isOurs  ? "#00fff7" : isPaper ? "#a78bfa" : "transparent";
                    const nameColor  = isOurs  ? "#00fff7" : isPaper ? "#a78bfa" : "#e0e0e0";

                    return (
                      <tr key={model} style={{ background:rowBg, borderLeft:`3px solid ${borderClr}` }}>
                        <td style={{
                          ...styles.td, textAlign:"left", paddingLeft:12,
                          color: nameColor,
                          fontWeight: isOurs ? "800" : isPaper ? "700" : "500",
                          textShadow: isOurs ? "0 0 8px #00fff7" : isPaper ? "0 0 6px #a78bfa" : "none",
                          fontSize: isOurs ? "0.82rem" : "0.91rem",
                        }}>
                          {FULL_NAME[model]}
                        </td>
                        <td style={{ ...styles.td, color: isOurs ? "#00fff7" : "#777", fontWeight: isOurs ? "bold" : "normal" }}>
                          {DATA[model].epochs}
                        </td>
                        {METRICS.map(m => {
                          const isBest = DATA[model][m] === best(m);
                          return (
                            <td key={m} style={{
                              ...styles.td,
                              color:      isBest ? "#00ff99" : isOurs ? "#aaffee" : isPaper ? "#d4bbff" : "#ccc",
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

        {/* ══════════════════════════════
            TAB 2 — Bar Chart
            ══════════════════════════════ */}
        {tab === "chart" && (
          <div style={styles.tableBox}>
            {/* Metric selector */}
            <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
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

            <h3 style={{ color:"#00fff7", marginBottom:4, textShadow:"0 0 10px #00fff7" }}>
              {metric} — All Models
            </h3>
            <p style={{ color:"#888", fontSize:"0.85rem", marginBottom:16 }}>
              <span style={{ color:"#00fff7" }}>■</span> Our model &nbsp;
              <span style={{ color:"#a78bfa" }}>■</span> Paper P2D &nbsp;
              <span style={{ color:"#3b82f6" }}>■</span> Baselines
            </p>

            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={chartData} margin={{ top:20, right:20, left:0, bottom:60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" angle={-30} textAnchor="end"
                  tick={{ fontSize:11, fill:"#bbb" }} interval={0} />
                <YAxis tickFormatter={v => v.toFixed(3)} tick={{ fontSize:11, fill:"#bbb" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  <LabelList dataKey="value" position="top"
                    formatter={v => v.toFixed(3)}
                    style={{ fontSize:10, fill:"#aaa" }} />
                  {chartData.map((entry, i) => (
                    <Cell key={i}
                      fill={entry.isOurs ? "#00fff7" : entry.isPaper ? "#a78bfa" : "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ══════════════════════════════
            TAB 3 — Ablation Study
            ══════════════════════════════ */}
        {tab === "ablation" && (
          <div style={styles.tableBox}>
            <h3 style={{ color:"#00fff7", marginBottom:4, textShadow:"0 0 10px #00fff7" }}>
              What happens when we remove parts of our model?
            </h3>
            <p style={{ color:"#888", fontSize:"0.85rem", marginBottom:20 }}>
              Each variant removes one component · <strong style={{ color:"#ccc" }}>50 epochs</strong>
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {ABLATION.map((row, i) => {
                const drop = i === 0 ? null
                  : (((ABLATION[0].ndcg - row.ndcg) / ABLATION[0].ndcg) * 100).toFixed(1);
                return (
                  <div key={i} style={{
                    border:`1px solid ${row.color}`, borderRadius:10, padding:16,
                    background:"rgba(0,0,0,0.5)", boxShadow:`0 0 12px ${row.color}25`,
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                      <div>
                        <span style={{ fontWeight:"800", color:row.color, fontSize:"0.93rem", textShadow:`0 0 8px ${row.color}` }}>
                          {row.name}
                        </span>
                        <span style={{ color:"#888", fontSize:"0.82rem", marginLeft:10 }}>— {row.note}</span>
                      </div>
                      {drop && (
                        <span style={{
                          background:"rgba(255,77,77,0.12)", color:"#ff6666",
                          padding:"4px 12px", borderRadius:20, fontWeight:"bold",
                          fontSize:"0.85rem", border:"1px solid #ff4d4d",
                        }}>
                          NDCG@10 drops -{drop}%
                        </span>
                      )}
                    </div>
                    <div style={{ display:"flex", gap:24, marginTop:12, flexWrap:"wrap" }}>
                      {[["AUC",row.auc],["NDCG@10",row.ndcg],["Recall@10",row.rec]].map(([label,val]) => (
                        <div key={label} style={{ textAlign:"center" }}>
                          <p style={{ color:"#777", fontSize:"0.75rem", margin:"0 0 4px" }}>{label}</p>
                          <p style={{ fontWeight:"bold", color:"#eee", margin:0, fontSize:"1.05rem" }}>{val.toFixed(3)}</p>
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

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight:"100vh", position:"relative",
    backgroundImage:`url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80')`,
    backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed",
  },
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", zIndex:0 },
  content: { position:"relative", zIndex:1, maxWidth:1040, margin:"0 auto", padding:"24px" },
  headerBox: {
    background:"rgba(0,0,0,0.7)", border:"1px solid #00fff7",
    boxShadow:"0 0 30px rgba(0,255,247,0.2)", borderRadius:14,
    padding:"24px 28px", marginBottom:20, marginTop:16,
  },
  heading: { margin:"0 0 6px", color:"#fff", fontSize:"1.9rem", fontWeight:"800", textShadow:"0 0 20px #00fff7" },
  subHeading: { color:"#bbb", margin:0, fontSize:"0.95rem" },
  statsRow: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:24 },
  statCard: {
    background:"rgba(0,0,0,0.75)", border:"1px solid rgba(0,255,247,0.3)",
    boxShadow:"0 0 16px rgba(0,255,247,0.1)", borderRadius:12, padding:20, textAlign:"center",
  },
  statLabel: { color:"#bbb", margin:"0 0 8px", fontSize:"0.9rem", letterSpacing:"0.5px" },
  statValue: { fontSize:"2rem", fontWeight:"800", color:"#fff", margin:"0 0 6px", textShadow:"0 0 14px #00fff7" },
  statRank:  { margin:0, fontSize:"0.82rem", fontWeight:"600" },
  tabRow:    { display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" },
  tabBtn: {
    padding:"10px 22px", borderRadius:8, border:"2px solid #00fff7",
    cursor:"pointer", fontWeight:"bold", fontSize:"0.9rem",
    transition:"all 0.2s", letterSpacing:"0.5px",
  },
  tableBox: {
    background:"rgba(0,0,0,0.80)", border:"1px solid rgba(0,255,247,0.25)",
    boxShadow:"0 0 20px rgba(0,255,247,0.08)", borderRadius:12, padding:24,
  },
  tableNote: { color:"#999", fontSize:"0.82rem", marginBottom:16, lineHeight:1.6 },
  th: {
    color:"#00fff7", padding:"12px 10px", textAlign:"center", fontWeight:"700",
    borderBottom:"2px solid rgba(0,255,247,0.4)", fontSize:"0.82rem",
    background:"rgba(0,255,247,0.06)", whiteSpace:"nowrap",
  },
  td: {
    padding:"10px 10px", textAlign:"center",
    borderBottom:"1px solid rgba(255,255,255,0.07)",
    fontSize:"0.91rem", color:"#e8e8e8",
  },
  metricBtn: {
    padding:"7px 13px", borderRadius:20, border:"1px solid #00fff7",
    cursor:"pointer", fontWeight:"bold", transition:"all 0.2s", fontSize:"0.81rem",
  },
};
