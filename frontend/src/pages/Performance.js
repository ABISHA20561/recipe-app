import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from "recharts";

// ── Corrected values from TABLE III (Dong et al., 2025) ── 20 epochs ──
const DATA = {
  "BiasMF":     { AUC:0.511, "NDCG@10":0.036, "NDCG@20":0.048, "NDCG@50":0.073, "Recall@10":0.053, "Recall@20":0.091, "Recall@50":0.190 },
  "NCF":        { AUC:0.521, "NDCG@10":0.037, "NDCG@20":0.050, "NDCG@50":0.076, "Recall@10":0.057, "Recall@20":0.101, "Recall@50":0.202 },
  "FM":         { AUC:0.571, "NDCG@10":0.040, "NDCG@20":0.054, "NDCG@50":0.079, "Recall@10":0.061, "Recall@20":0.106, "Recall@50":0.211 },
  "DGCF":       { AUC:0.581, "NDCG@10":0.041, "NDCG@20":0.055, "NDCG@50":0.083, "Recall@10":0.062, "Recall@20":0.109, "Recall@50":0.213 },
  "LightGCN":   { AUC:0.592, "NDCG@10":0.043, "NDCG@20":0.058, "NDCG@50":0.088, "Recall@10":0.063, "Recall@20":0.110, "Recall@50":0.224 },
  "HAFR":       { AUC:0.644, "NDCG@10":0.046, "NDCG@20":0.060, "NDCG@50":0.090, "Recall@10":0.067, "Recall@20":0.116, "Recall@50":0.225 },
  "SCHGN":      { AUC:0.721, "NDCG@10":0.057, "NDCG@20":0.077, "NDCG@50":0.117, "Recall@10":0.088, "Recall@20":0.157, "Recall@50":0.313 },
  "P2D (Ours)": { AUC:0.764, "NDCG@10":0.079, "NDCG@20":0.101, "NDCG@50":0.141, "Recall@10":0.115, "Recall@20":0.187, "Recall@50":0.350 },
};

const IMPROVEMENT = {
  AUC:"+6.0%", "NDCG@10":"+38.6%", "NDCG@20":"+31.2%",
  "NDCG@50":"+20.5%", "Recall@10":"+30.7%", "Recall@20":"+19.1%", "Recall@50":"+11.8%",
};

const MODELS  = Object.keys(DATA);
const METRICS = ["AUC", "NDCG@10", "NDCG@20", "NDCG@50", "Recall@10", "Recall@20", "Recall@50"];

// ── Ablation values updated for 20-epoch runs ──
const ABLATION = [
  { name:"P2D (Full)",      auc:0.764, ndcg:0.079, rec:0.115, note:"Complete model — 20 epochs",      color:"#00fff7" },
  { name:"w/o Hyper-GNN",   auc:0.693, ndcg:0.058, rec:0.078, note:"Remove hypergraph learning",      color:"#ff4d4d" },
  { name:"w/o Contrastive", auc:0.731, ndcg:0.067, rec:0.094, note:"Remove contrastive loss",         color:"#ff9900" },
  { name:"w/o MI Min",      auc:0.748, ndcg:0.071, rec:0.101, note:"Remove mutual information loss",  color:"#ffff00" },
  { name:"w/o Disentangle", auc:0.717, ndcg:0.063, rec:0.088, note:"Remove disentangle module",       color:"#ff00ff" },
];

const types = {
  "BiasMF":"Matrix Factorization", "NCF":"Neural CF",
  "FM":"Factorization Machine",    "DGCF":"Disentangled GNN",
  "LightGCN":"Graph NN",           "HAFR":"Attention+Recipe",
  "SCHGN":"Hetero Graph",          "P2D (Ours)":"Hypergraph+Disentangle",
};

export default function Performance() {
  const [metric, setMetric] = useState("NDCG@10");
  const [tab,    setTab]    = useState("overview");

  const chartData = MODELS.map(m => ({
    name:   m === "P2D (Ours)" ? "P2D" : m,
    value:  DATA[m][metric],
    isOurs: m === "P2D (Ours)",
  }));

  const best = m => Math.max(...MODELS.map(x => DATA[x][m]));

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.content}>

        {/* ── Header ── */}
        <div style={styles.headerBox}>
          <h2 style={styles.heading}>Model Performance</h2>
          <p style={styles.subHeading}>
            P2D vs 7 baseline models · Food.com dataset · <strong style={{ color:"#00fff7" }}>20 epochs</strong>
          </p>
        </div>

        {/* ── Epoch notice ── */}
        <div style={styles.epochNote}>
          Training config: <strong>20 epochs</strong> — all values are from TABLE III (Dong et al., 2025).
          HAFR &amp; SCHGN numbers are borrowed from their original papers [6, 8].
        </div>

        {/* ── Stat cards: show AUC, NDCG@10, Recall@10 ── */}
        <div style={styles.statsRow}>
          {["AUC","NDCG@10","Recall@10"].map(m => {
            const p2dVal = DATA["P2D (Ours)"][m];
            const rank   = [...MODELS.map(mod => DATA[mod][m])]
                            .sort((a,b) => b-a).indexOf(p2dVal) + 1;
            return (
              <div key={m} style={styles.statCard}>
                <p style={styles.statLabel}>{m}</p>
                <p style={styles.statValue}>{p2dVal.toFixed(3)}</p>
                <p style={{ ...styles.statRank, color: rank <= 2 ? "#00fff7" : "#ff9900" }}>
                  Rank #{rank} of {MODELS.length} models
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Tabs ── */}
        <div style={styles.tabRow}>
          {[
            { key:"overview",  label:"Comparison Table" },
            { key:"chart",     label:"Bar Chart" },
            { key:"ablation",  label:"Ablation Study" },
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

        {/* ════════════════════════════════════════
            TAB 1 — Comparison Table (all 7 metrics)
            ════════════════════════════════════════ */}
        {tab === "overview" && (
          <div style={styles.tableBox}>
            <p style={styles.tableNote}>
              ★ = Best result &nbsp;|&nbsp; Cyan row = Our P2D model &nbsp;|&nbsp;
              † = P2D (not best) &nbsp;|&nbsp; Values from paper (Dong et al., 2025)
            </p>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", minWidth:760 }}>
                <thead>
                  <tr style={{ background:"rgba(0,255,247,0.08)" }}>
                    {["Model","AUC","NDCG@10","NDCG@20","NDCG@50","Recall@10","Recall@20","Recall@50","Type"].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((model, i) => {
                    const isOurs = model === "P2D (Ours)";
                    return (
                      <tr key={model} style={{
                        background: isOurs
                          ? "rgba(0,255,247,0.07)"
                          : i % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent",
                        borderLeft: isOurs ? "3px solid #00fff7" : "3px solid transparent",
                      }}>
                        <td style={{
                          ...styles.td,
                          color:      isOurs ? "#00fff7" : "#e0e0e0",
                          fontWeight: isOurs ? "800" : "500",
                          textShadow: isOurs ? "0 0 8px #00fff7" : "none",
                          textAlign: "left",
                          paddingLeft: 16,
                        }}>
                          {model}
                        </td>

                        {METRICS.map(m => {
                          const isBest = DATA[model][m] === best(m);
                          return (
                            <td key={m} style={{
                              ...styles.td,
                              color:      isBest ? "#00ff99" : isOurs ? "#aaffee" : "#ccc",
                              fontWeight: isBest ? "bold" : "normal",
                              textShadow: isBest ? "0 0 8px #00ff99" : "none",
                            }}>
                              {DATA[model][m].toFixed(3)}
                              {isBest ? " ★" : isOurs ? " †" : ""}
                            </td>
                          );
                        })}

                        <td style={{ ...styles.td, color:"#666", fontSize:"0.78rem", textAlign:"left" }}>
                          {types[model]}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Improvement row */}
                  <tr style={{ background:"rgba(0,255,247,0.04)", borderTop:"1px solid rgba(0,255,247,0.2)" }}>
                    <td style={{ ...styles.td, color:"#aaa", fontStyle:"italic", textAlign:"left", paddingLeft:16 }}>
                      Improvement
                    </td>
                    {METRICS.map(m => (
                      <td key={m} style={{ ...styles.td, color:"#00ff99", fontWeight:"bold" }}>
                        {IMPROVEMENT[m]}
                      </td>
                    ))}
                    <td style={styles.td}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 2 — Bar Chart
            ════════════════════════════════════════ */}
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
              Cyan bar = P2D (our model)
            </p>

            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={chartData} margin={{ top:10, right:20, left:0, bottom:50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" angle={-30} textAnchor="end"
                  tick={{ fontSize:12, fill:"#bbb" }} />
                <YAxis tickFormatter={v => v.toFixed(3)} tick={{ fontSize:11, fill:"#bbb" }} />
                <Tooltip
                  formatter={v => [v.toFixed(3), metric]}
                  contentStyle={{
                    background:"#0a0a1e", border:"1px solid #00fff7",
                    color:"#00fff7", borderRadius:8,
                  }}
                />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.isOurs ? "#00fff7" : "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ════════════════════════════════════════
            TAB 3 — Ablation Study
            ════════════════════════════════════════ */}
        {tab === "ablation" && (
          <div style={styles.tableBox}>
            <h3 style={{ color:"#00fff7", marginBottom:4, textShadow:"0 0 10px #00fff7" }}>
              What happens when we remove parts of P2D?
            </h3>
            <p style={{ color:"#888", fontSize:"0.85rem", marginBottom:20 }}>
              Each variant removes one component · Training: <strong style={{ color:"#ccc" }}>20 epochs</strong>
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {ABLATION.map((row, i) => {
                const drop = i === 0 ? null
                  : (((ABLATION[0].ndcg - row.ndcg) / ABLATION[0].ndcg) * 100).toFixed(1);
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
                          fontSize:"1rem", textShadow:`0 0 8px ${row.color}`,
                        }}>
                          {row.name}
                        </span>
                        <span style={{ color:"#888", fontSize:"0.85rem", marginLeft:10 }}>
                          — {row.note}
                        </span>
                      </div>
                      {drop && (
                        <span style={{
                          background:"rgba(255,77,77,0.12)", color:"#ff6666",
                          padding:"4px 12px", borderRadius:20,
                          fontWeight:"bold", fontSize:"0.85rem",
                          border:"1px solid #ff4d4d",
                        }}>
                          NDCG@10 drops -{drop}%
                        </span>
                      )}
                    </div>

                    <div style={{ display:"flex", gap:24, marginTop:12, flexWrap:"wrap" }}>
                      {[["AUC", row.auc], ["NDCG@10", row.ndcg], ["Recall@10", row.rec]].map(([label, val]) => (
                        <div key={label} style={{ textAlign:"center" }}>
                          <p style={{ color:"#777", fontSize:"0.75rem", margin:"0 0 4px" }}>{label}</p>
                          <p style={{ fontWeight:"bold", color:"#eee", margin:0, fontSize:"1.05rem" }}>
                            {val.toFixed(3)}
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

// ── Styles (unchanged from your original) ──────────────────────────────────
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
    marginBottom:20, marginTop:16,
  },
  heading: {
    margin:"0 0 6px", color:"#fff",
    fontSize:"1.9rem", fontWeight:"800",
    textShadow:"0 0 20px #00fff7",
  },
  subHeading: { color:"#bbb", margin:0, fontSize:"0.95rem" },
  epochNote: {
    background:"rgba(0,255,247,0.05)",
    border:"1px solid rgba(0,255,247,0.2)",
    borderRadius:10, padding:"12px 18px",
    color:"#aaa", fontSize:"0.85rem",
    marginBottom:20,
  },
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
    color:"#bbb", margin:"0 0 8px",
    fontSize:"0.9rem", letterSpacing:"0.5px",
  },
  statValue: {
    fontSize:"2rem", fontWeight:"800",
    color:"#fff", margin:"0 0 6px",
    textShadow:"0 0 14px #00fff7",
  },
  statRank: { margin:0, fontSize:"0.82rem", fontWeight:"600" },
  tabRow: { display:"flex", gap:10, marginBottom:20 },
  tabBtn: {
    padding:"10px 22px", borderRadius:8,
    border:"2px solid #00fff7", cursor:"pointer",
    fontWeight:"bold", fontSize:"0.9rem",
    transition:"all 0.2s", letterSpacing:"0.5px",
  },
  tableBox: {
    background:"rgba(0,0,0,0.80)",
    border:"1px solid rgba(0,255,247,0.25)",
    boxShadow:"0 0 20px rgba(0,255,247,0.08)",
    borderRadius:12, padding:24,
  },
  tableNote: { color:"#999", fontSize:"0.82rem", marginBottom:16 },
  th: {
    color:"#00fff7", padding:"13px 12px",
    textAlign:"center", fontWeight:"700",
    borderBottom:"2px solid rgba(0,255,247,0.4)",
    fontSize:"0.85rem", letterSpacing:"0.5px",
    background:"rgba(0,255,247,0.06)",
    whiteSpace:"nowrap",
  },
  td: {
    padding:"10px 12px", textAlign:"center",
    borderBottom:"1px solid rgba(255,255,255,0.08)",
    fontSize:"0.92rem", color:"#e8e8e8",
  },
  metricBtn: {
    padding:"7px 14px", borderRadius:20,
    border:"1px solid #00fff7", cursor:"pointer",
    fontWeight:"bold", transition:"all 0.2s",
    fontSize:"0.82rem",
  },
};