import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";

const DATA = {
  "BiasMF":      { epochs:50, AUC:0.511, "NDCG@10":0.036, "NDCG@20":0.048, "NDCG@50":0.073, "Recall@10":0.053, "Recall@20":0.091, "Recall@50":0.190, isOurs:false, isPaper:false },
  "NCF":         { epochs:50, AUC:0.521, "NDCG@10":0.037, "NDCG@20":0.050, "NDCG@50":0.076, "Recall@10":0.057, "Recall@20":0.101, "Recall@50":0.202, isOurs:false, isPaper:false },
  "FM":          { epochs:50, AUC:0.571, "NDCG@10":0.040, "NDCG@20":0.054, "NDCG@50":0.079, "Recall@10":0.061, "Recall@20":0.106, "Recall@50":0.211, isOurs:false, isPaper:false },
  "DGCF":        { epochs:50, AUC:0.581, "NDCG@10":0.041, "NDCG@20":0.055, "NDCG@50":0.083, "Recall@10":0.062, "Recall@20":0.109, "Recall@50":0.213, isOurs:false, isPaper:false },
  "LightGCN":    { epochs:50, AUC:0.592, "NDCG@10":0.043, "NDCG@20":0.058, "NDCG@50":0.088, "Recall@10":0.063, "Recall@20":0.110, "Recall@50":0.224, isOurs:false, isPaper:false },
  "HAFR":        { epochs:50, AUC:0.644, "NDCG@10":0.046, "NDCG@20":0.060, "NDCG@50":0.090, "Recall@10":0.067, "Recall@20":0.116, "Recall@50":0.225, isOurs:false, isPaper:false },
  "SCHGN":       { epochs:50, AUC:0.721, "NDCG@10":0.057, "NDCG@20":0.077, "NDCG@50":0.117, "Recall@10":0.088, "Recall@20":0.157, "Recall@50":0.313, isOurs:false, isPaper:false },
  "Paper P2D":   { epochs:50, AUC:0.764, "NDCG@10":0.079, "NDCG@20":0.101, "NDCG@50":0.141, "Recall@10":0.115, "Recall@20":0.187, "Recall@50":0.350, isOurs:false, isPaper:true  },
  "Ours (P2D+)": { epochs:50, AUC:0.773, "NDCG@10":0.086, "NDCG@20":0.111, "NDCG@50":0.155, "Recall@10":0.127, "Recall@20":0.205, "Recall@50":0.378, isOurs:true,  isPaper:false },
};

const CHART_LABEL = {
  "BiasMF":"BiasMF", "NCF":"NCF", "FM":"FM", "DGCF":"DGCF",
  "LightGCN":"LightGCN", "HAFR":"HAFR", "SCHGN":"SCHGN",
  "Paper P2D":"Paper P2D", "Ours (P2D+)":"Ours",
};

const FULL_NAME = {
  "BiasMF":"BiasMF", "NCF":"NCF", "FM":"FM", "DGCF":"DGCF",
  "LightGCN":"LightGCN", "HAFR":"HAFR", "SCHGN":"SCHGN",
  "Paper P2D":"Paper P2D",
  "Ours (P2D+)":"P2D + QNN + FL + Lion + Lookahead (Ours)",
};

const MODELS  = Object.keys(DATA);
const METRICS = ["AUC","NDCG@10","NDCG@20","NDCG@50","Recall@10","Recall@20","Recall@50"];

// ── Ablation Study — exact values from paper table ──
const ABLATION = [
  {
    name:  "Complete Model (Ours)",
    desc:  "P2D + QNN + FL + Lion + Lookahead",
    auc:   0.773, ndcg10: 0.086, ndcg50: 0.155, rec10: 0.127, rec50: 0.378,
    color: "#00fff7", isComplete: true,
  },
  {
    name:  "without QNN",
    desc:  "Remove Quantum Neural Network",
    auc:   0.768, ndcg10: 0.082, ndcg50: 0.148, rec10: 0.121, rec50: 0.362,
    color: "#ff4d4d",
  },
  {
    name:  "without Federated Learning",
    desc:  "Remove FL training strategy",
    auc:   0.766, ndcg10: 0.081, ndcg50: 0.145, rec10: 0.119, rec50: 0.355,
    color: "#ff9900",
  },
  {
    name:  "without Lion optimizer",
    desc:  "Replace Lion with standard optimizer",
    auc:   0.769, ndcg10: 0.083, ndcg50: 0.150, rec10: 0.123, rec50: 0.368,
    color: "#ffff00",
  },
  {
    name:  "without Lookahead",
    desc:  "Remove Lookahead wrapper",
    auc:   0.770, ndcg10: 0.084, ndcg50: 0.152, rec10: 0.124, rec50: 0.371,
    color: "#ff00ff",
  },
  {
    name:  "without Advanced Optimization",
    desc:  "Remove both Lion + Lookahead",
    auc:   0.767, ndcg10: 0.082, ndcg50: 0.147, rec10: 0.121, rec50: 0.360,
    color: "#aaaaff",
  },
];

const ABL_METRICS = ["AUC","NDCG@10","NDCG@50","Recall@10","Recall@50"];

export default function Performance() {
  const [metric,    setMetric]    = useState("NDCG@10");
  const [tab,       setTab]       = useState("table");
  const [ablMetric, setAblMetric] = useState("NDCG@10");

  const best = m => Math.max(...MODELS.map(x => DATA[x][m]));

  const chartData = MODELS.map(m => ({
    name:    CHART_LABEL[m],
    value:   DATA[m][metric],
    isOurs:  DATA[m].isOurs,
    isPaper: DATA[m].isPaper,
  }));

  // chart data for ablation bar chart
  const ablChartKey = ablMetric === "NDCG@10" ? "ndcg10"
                    : ablMetric === "NDCG@50"  ? "ndcg50"
                    : ablMetric === "Recall@10" ? "rec10"
                    : ablMetric === "Recall@50" ? "rec50"
                    : "auc";

  const ablChartData = ABLATION.map(r => ({
    name:  r.name === "Complete Model (Ours)" ? "Complete" :
           r.name === "without Advanced Optimization" ? "w/o Adv.Opt" :
           r.name.replace("without ", "w/o "),
    value: r[ablChartKey],
    color: r.color,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"#0a0a1a", border:"1px solid #00fff7", borderRadius:8, padding:"10px 16px", color:"#00fff7" }}>
        <p><strong>{label}</strong></p>
        <p>{metric}: {payload[0].value.toFixed(3)}</p>
      </div>
    );
  };

  const AblTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background:"#0a0a1a", border:"1px solid #00fff7", borderRadius:8, padding:"10px 16px", color:"#00fff7" }}>
        <p><strong>{label}</strong></p>
        <p>{ablMetric}: {payload[0].value.toFixed(3)}</p>
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
                    const isOurs    = DATA[model].isOurs;
                    const isPaper   = DATA[model].isPaper;
                    const rowBg     = isOurs  ? "rgba(0,255,247,0.07)"
                                    : isPaper ? "rgba(167,139,250,0.06)"
                                    : i % 2 === 0 ? "rgba(255,255,255,0.025)" : "transparent";
                    const borderClr = isOurs  ? "#00fff7" : isPaper ? "#a78bfa" : "transparent";
                    const nameColor = isOurs  ? "#00fff7" : isPaper ? "#a78bfa" : "#e0e0e0";
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
                <XAxis dataKey="name" angle={-30} textAnchor="end" tick={{ fontSize:11, fill:"#bbb" }} interval={0} />
                <YAxis tickFormatter={v => v.toFixed(3)} tick={{ fontSize:11, fill:"#bbb" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  <LabelList dataKey="value" position="top" formatter={v => v.toFixed(3)} style={{ fontSize:10, fill:"#aaa" }} />
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.isOurs ? "#00fff7" : entry.isPaper ? "#a78bfa" : "#3b82f6"} />
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
            <h3 style={{ color:"#00fff7", marginBottom:2, textShadow:"0 0 10px #00fff7", fontSize:"1.1rem" }}>
              Ablation Study of Proposed Model (P2D + QNN + FL)
            </h3>
            <p style={{ color:"#888", fontSize:"0.85rem", marginBottom:20 }}>
              Each variant removes one component to measure its individual contribution
            </p>

            {/* ── Ablation Table ── */}
            <div style={{ overflowX:"auto", marginBottom:28 }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:620 }}>
                <thead>
                  <tr style={{ background:"rgba(0,255,247,0.08)" }}>
                    {["Model Variant","AUC","NDCG@10","NDCG@50","Recall@10","Recall@50"].map(h => (
                      <th key={h} style={{ ...styles.th, textAlign: h === "Model Variant" ? "left" : "center", paddingLeft: h === "Model Variant" ? 14 : undefined }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ABLATION.map((row, i) => {
                    const full    = ABLATION[0];
                    const isComplete = row.isComplete;
                    return (
                      <tr key={i} style={{
                        background:  isComplete ? "rgba(0,255,247,0.07)" : i % 2 === 0 ? "rgba(255,255,255,0.025)" : "transparent",
                        borderLeft: `3px solid ${row.color}`,
                      }}>
                        <td style={{
                          ...styles.td, textAlign:"left", paddingLeft:12,
                          color:      row.color,
                          fontWeight: isComplete ? "800" : "500",
                          textShadow: isComplete ? `0 0 8px ${row.color}` : "none",
                          fontSize:   "0.88rem",
                        }}>
                          {row.name}
                          {isComplete && <span style={{ marginLeft:8, fontSize:"0.75rem", color:"#00ff99" }}>★ Best</span>}
                          <br />
                          <span style={{ color:"#555", fontWeight:"400", fontSize:"0.75rem" }}>{row.desc}</span>
                        </td>

                        {/* AUC */}
                        <td style={{ ...styles.td, color: isComplete ? "#aaffee" : "#bbb" }}>
                          {row.auc.toFixed(3)}
                          {!isComplete && (
                            <span style={{ display:"block", fontSize:"0.72rem", color:"#ff6666" }}>
                              -{((full.auc - row.auc) / full.auc * 100).toFixed(1)}%
                            </span>
                          )}
                        </td>
                        {/* NDCG@10 */}
                        <td style={{ ...styles.td, color: isComplete ? "#aaffee" : "#bbb" }}>
                          {row.ndcg10.toFixed(3)}
                          {!isComplete && (
                            <span style={{ display:"block", fontSize:"0.72rem", color:"#ff6666" }}>
                              -{((full.ndcg10 - row.ndcg10) / full.ndcg10 * 100).toFixed(1)}%
                            </span>
                          )}
                        </td>
                        {/* NDCG@50 */}
                        <td style={{ ...styles.td, color: isComplete ? "#aaffee" : "#bbb" }}>
                          {row.ndcg50.toFixed(3)}
                          {!isComplete && (
                            <span style={{ display:"block", fontSize:"0.72rem", color:"#ff6666" }}>
                              -{((full.ndcg50 - row.ndcg50) / full.ndcg50 * 100).toFixed(1)}%
                            </span>
                          )}
                        </td>
                        {/* Recall@10 */}
                        <td style={{ ...styles.td, color: isComplete ? "#aaffee" : "#bbb" }}>
                          {row.rec10.toFixed(3)}
                          {!isComplete && (
                            <span style={{ display:"block", fontSize:"0.72rem", color:"#ff6666" }}>
                              -{((full.rec10 - row.rec10) / full.rec10 * 100).toFixed(1)}%
                            </span>
                          )}
                        </td>
                        {/* Recall@50 */}
                        <td style={{ ...styles.td, color: isComplete ? "#aaffee" : "#bbb" }}>
                          {row.rec50.toFixed(3)}
                          {!isComplete && (
                            <span style={{ display:"block", fontSize:"0.72rem", color:"#ff6666" }}>
                              -{((full.rec50 - row.rec50) / full.rec50 * 100).toFixed(1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Ablation Bar Chart ── */}
            <div style={{ borderTop:"1px solid rgba(0,255,247,0.15)", paddingTop:20 }}>
              <p style={{ color:"#bbb", fontSize:"0.88rem", marginBottom:12 }}>
                Visualise drop per metric:
              </p>
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                {ABL_METRICS.map(m => (
                  <button key={m} onClick={() => setAblMetric(m)}
                    style={{
                      ...styles.metricBtn,
                      background: ablMetric === m ? "#00fff7" : "transparent",
                      color:      ablMetric === m ? "#000"    : "#00fff7",
                      boxShadow:  ablMetric === m ? "0 0 12px rgba(0,255,247,0.5)" : "none",
                    }}>
                    {m}
                  </button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ablChartData} margin={{ top:16, right:16, left:0, bottom:60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize:11, fill:"#bbb" }} interval={0} />
                  <YAxis
                    tickFormatter={v => v.toFixed(3)}
                    tick={{ fontSize:11, fill:"#bbb" }}
                    domain={['auto','auto']}
                  />
                  <Tooltip content={<AblTooltip />} />
                  <Bar dataKey="value" radius={[5,5,0,0]}>
                    <LabelList dataKey="value" position="top" formatter={v => v.toFixed(3)} style={{ fontSize:10, fill:"#aaa" }} />
                    {ablChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={i === 0 ? 1 : 0.75} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
