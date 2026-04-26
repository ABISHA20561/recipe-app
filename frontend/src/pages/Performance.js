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
  { name:"P2D (Full)",      auc:0.7731, ndcg:0.0806, rec:0.0833, note:"Complete model",                color:"#27ae60" },
  { name:"w/o Hyper-GNN",   auc:0.6726, ndcg:0.0582, rec:0.0601, note:"Remove hypergraph learning",    color:"#e74c3c" },
  { name:"w/o Contrastive", auc:0.7234, ndcg:0.0689, rec:0.0712, note:"Remove contrastive loss",       color:"#e67e22" },
  { name:"w/o MI Min",      auc:0.7412, ndcg:0.0723, rec:0.0756, note:"Remove mutual info loss",       color:"#f39c12" },
  { name:"w/o Disentangle", auc:0.7089, ndcg:0.0634, rec:0.0667, note:"Remove disentangle module",     color:"#9b59b6" },
];

export default function Performance() {
  const [metric, setMetric] = useState("NDCG@10");
  const [tab,    setTab]    = useState("overview");

  const chartData = MODELS.map(m => ({
    name:  m === "P2D (Ours)" ? "P2D" : m,
    value: DATA[m][metric],
    isOurs: m === "P2D (Ours)"
  }));

  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:24 }}>

      {/* Header */}
      <div style={{ background:"#1a1a2e", borderRadius:12,
                    padding:24, color:"white", marginBottom:24 }}>
        <h2 style={{ margin:"0 0 8px" }}> Model Performance</h2>
        <p style={{ color:"#aaa", margin:0 }}>
          P2D vs 7 baseline models on Food.com dataset
        </p>
      </div>

      {/* 3 Key Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
                    gap:16, marginBottom:24 }}>
        {METRICS.map(m => {
          const vals   = MODELS.map(mod => DATA[mod][m]);
          const best   = Math.max(...vals);
          const p2dVal = DATA["P2D (Ours)"][m];
          const rank   = [...vals].sort((a,b)=>b-a).indexOf(p2dVal) + 1;
          return (
            <div key={m} style={{ background:"white", borderRadius:10,
                                   padding:20, textAlign:"center",
                                   boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
              <p style={{ color:"#666", margin:"0 0 6px",
                          fontSize:"0.85rem" }}>{m}</p>
              <p style={{ fontSize:"1.8rem", fontWeight:"bold",
                          color:"#1a1a2e", margin:"0 0 4px" }}>
                {p2dVal.toFixed(4)}
              </p>
              <p style={{ color: rank<=2 ? "#27ae60":"#e67e22",
                          margin:0, fontSize:"0.8rem" }}>
                Rank #{rank} of {MODELS.length} models
              </p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[
          { key:"overview",  label:" Comparison Table" },
          { key:"chart",     label:" Bar Chart"        },
          { key:"ablation",  label:" Ablation Study"   },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ padding:"10px 20px", borderRadius:8,
                     border:"none", cursor:"pointer",
                     background: tab===t.key ? "#1a1a2e" : "#f0f0f0",
                     color:      tab===t.key ? "white"   : "#333",
                     fontWeight: tab===t.key ? "bold"    : "normal" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TABLE ── */}
      {tab === "overview" && (
        <div style={{ background:"white", borderRadius:12,
                      padding:20, boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
                      overflowX:"auto" }}>
          <p style={{ color:"#666", fontSize:"0.85rem", marginBottom:16 }}>
            ★ = Best result &nbsp;|&nbsp;
            Green row = Our P2D model &nbsp;|&nbsp;
            Values from paper (Dong et al., 2025)
          </p>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#1a1a2e" }}>
                <th style={th}>Model</th>
                <th style={th}>AUC</th>
                <th style={th}>NDCG@10</th>
                <th style={th}>Recall@10</th>
                <th style={th}>Type</th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((model, i) => {
                const isOurs = model === "P2D (Ours)";
                const best   = m => Math.max(...MODELS.map(x => DATA[x][m]));
                const types  = {
                  "BiasMF":"Matrix Factorization",
                  "FM":"Factorization Machine",
                  "NCF":"Neural CF",
                  "LightGCN":"Graph NN",
                  "DGCF":"Disentangled GNN",
                  "HAFR":"Attention+Recipe",
                  "SCHGN":"Hetero Graph",
                  "P2D (Ours)":"Hypergraph+Disentangle"
                };
                return (
                  <tr key={model}
                    style={{ background: isOurs ? "#f0fff4"
                             : i%2===0 ? "white" : "#fafafa" }}>
                    <td style={{ ...td,
                                 fontWeight: isOurs?"bold":"normal",
                                 color:      isOurs?"#27ae60":"#333" }}>
                      {isOurs ? " " : ""}{model}
                    </td>
                    {METRICS.map(m => {
                      const isBest = DATA[model][m] === best(m);
                      return (
                        <td key={m} style={{ ...td,
                                             fontWeight: isBest?"bold":"normal",
                                             color:      isBest?"#27ae60":"#333",
                                             background: isBest?"#e8f8f0":"inherit" }}>
                          {DATA[model][m].toFixed(4)}
                          {isBest ? " ★" : ""}
                        </td>
                      );
                    })}
                    <td style={{ ...td, color:"#888",
                                 fontSize:"0.8rem" }}>
                      {types[model]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── CHART ── */}
      {tab === "chart" && (
        <div style={{ background:"white", borderRadius:12,
                      padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>

          {/* Metric selector */}
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {METRICS.map(m => (
              <button key={m} onClick={() => setMetric(m)}
                style={{ padding:"8px 18px", borderRadius:20,
                         border:"none", cursor:"pointer",
                         background: metric===m ? "#1a1a2e":"#f0f0f0",
                         color:      metric===m ? "white"  :"#333" }}>
                {m}
              </button>
            ))}
          </div>

          <h3 style={{ color:"#1a1a2e", marginBottom:4 }}>
            {metric} — All Models
          </h3>
          <p style={{ color:"#999", fontSize:"0.85rem", marginBottom:16 }}>
            Green bar = P2D (our model)
          </p>

          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData}
              margin={{ top:10, right:20, left:0, bottom:50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-30}
                textAnchor="end" tick={{ fontSize:12 }} />
              <YAxis tickFormatter={v => v.toFixed(3)}
                tick={{ fontSize:11 }} />
              <Tooltip formatter={v => [v.toFixed(4), metric]} />
              <Bar dataKey="value" radius={[6,6,0,0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i}
                    fill={entry.isOurs ? "#27ae60" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── ABLATION ── */}
      {tab === "ablation" && (
        <div style={{ background:"white", borderRadius:12,
                      padding:24, boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
          <h3 style={{ color:"#1a1a2e", marginBottom:4 }}>
            What happens when we remove parts of P2D?
          </h3>
          <p style={{ color:"#666", fontSize:"0.85rem", marginBottom:20 }}>
            Each row removes one component to show its importance
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {ABLATION.map((row, i) => {
              const drop = i===0 ? null
                : (((ABLATION[0].ndcg - row.ndcg)/ABLATION[0].ndcg)*100).toFixed(1);
              return (
                <div key={i}
                  style={{ border:`2px solid ${row.color}`,
                           borderRadius:10, padding:16,
                           background: i===0 ? "#f0fff4":"white" }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                                alignItems:"center", flexWrap:"wrap", gap:8 }}>
                    <div>
                      <span style={{ fontWeight:"bold", color:row.color,
                                     fontSize:"1rem" }}>
                        {i===0 ? " " : " "}{row.name}
                      </span>
                      <span style={{ color:"#888", fontSize:"0.85rem",
                                     marginLeft:10 }}>
                        — {row.note}
                      </span>
                    </div>
                    {drop && (
                      <span style={{ background:"#fff0f0", color:"#e74c3c",
                                     padding:"4px 12px", borderRadius:20,
                                     fontWeight:"bold", fontSize:"0.85rem" }}>
                        NDCG@10 drops −{drop}%
                      </span>
                    )}
                  </div>
                  <div style={{ display:"flex", gap:20, marginTop:12 }}>
                    {[["AUC",row.auc],["NDCG@10",row.ndcg],
                      ["Recall@10",row.rec]].map(([label,val]) => (
                      <div key={label} style={{ textAlign:"center" }}>
                        <p style={{ color:"#999", fontSize:"0.75rem",
                                    margin:"0 0 2px" }}>{label}</p>
                        <p style={{ fontWeight:"bold", color:"#1a1a2e",
                                    margin:0, fontSize:"1rem" }}>
                          {val.toFixed(4)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background:"#f8f9fa", borderRadius:8,
                        padding:16, marginTop:20 }}>
            <p style={{ fontWeight:"bold", color:"#1a1a2e",
                        margin:"0 0 8px" }}>
           
            </p>
            <p style={{ color:"#555", margin:0, lineHeight:1.6 }}>
              
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const th = {
  color:"white", padding:"12px 14px",
  textAlign:"center", fontWeight:"bold"
};
const td = {
  padding:"11px 14px", textAlign:"center",
  borderBottom:"1px solid #f0f0f0"
};