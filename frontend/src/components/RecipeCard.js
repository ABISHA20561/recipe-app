import API from "../api";

// Map keywords to Unsplash food images (free, no API key needed)
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
  "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80",
  "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80",
  // NEW ONES ADDED BELOW
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=80",
  "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80",
  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&q=80",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
  "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?w=400&q=80",
  "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&q=80",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80",
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
  "https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&q=80",
  "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80",
  "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&q=80",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
  "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80",
  "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=400&q=80",
  "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&q=80",
  "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=400&q=80",
  "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&q=80",
  "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?w=400&q=80",
];

function getImageForRecipe(recipe) {
  const name = (recipe.name || "").toLowerCase();
  if (name.includes("chicken"))  return "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80";
  if (name.includes("pasta"))    return "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80";
  if (name.includes("salad"))    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80";
  if (name.includes("cake"))     return "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80";
  if (name.includes("soup"))     return "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80";
  if (name.includes("bread"))    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80";
  if (name.includes("beef"))     return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80";
  if (name.includes("fish"))     return "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80";
  if (name.includes("rice"))     return "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80";
  if (name.includes("pizza"))    return "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80";
  if (name.includes("burger"))   return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80";
  if (name.includes("cookie"))   return "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80";
  if (name.includes("chocolate"))return "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&q=80";
  if (name.includes("steak"))    return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80";
  if (name.includes("shrimp"))   return "https://images.unsplash.com/photo-1565680018093-ebb6b9ab5460?w=400&q=80";
  if (name.includes("pork"))     return "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80";
  if (name.includes("turkey"))   return "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=400&q=80";
  if (name.includes("cookie"))   return "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80";
  if (name.includes("egg"))      return "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80";
  if (name.includes("mushroom")) return "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80";
  if (name.includes("lemon"))    return "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80";
  if (name.includes("apple"))    return "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80";
  if (name.includes("banana"))   return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80";
  if (name.includes("potato"))   return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80";
  if (name.includes("tomato"))   return "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80";
  if (name.includes("vegetable"))return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80";
  if (name.includes("fruit"))    return "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80";
  if (name.includes("sandwich")) return "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80";
  if (name.includes("taco"))     return "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80";
  if (name.includes("noodle"))   return "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80";
  if (name.includes("sushi"))    return "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80";
  if (name.includes("curry"))    return "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80";
  if (name.includes("muffin"))   return "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&q=80";
  if (name.includes("pancake"))  return "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&q=80";
  if (name.includes("waffle"))   return "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=80";
  if (name.includes("oat"))      return "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&q=80";
  if (name.includes("cheese"))   return "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80";
  if (name.includes("bacon"))    return "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=400&q=80";

  const idx = (recipe.id || recipe.recipe_idx || 0) % FOOD_IMAGES.length;
  return FOOD_IMAGES[idx];
}

const NUTRIENTS = ["Calories","Fat%","Sugar%","Sodium%","Protein%","SatFat%","Carbs%"];

export default function RecipeCard({ recipe, showSave = true }) {
  const imgUrl = getImageForRecipe(recipe);

  const handleSave = async () => {
    try {
      await API.post("/recipes/save", {
        recipeIdx:   recipe.recipe_idx,
        recipeId:    recipe.id,
        name:        recipe.name,
        ingredients: recipe.ingredients,
        nutrition:   recipe.nutrition,
        score:       recipe.score || 0
      });
      alert("Recipe saved!");
    } catch {
      alert("Login to save recipes.");
    }
  };

  return (
    <div style={styles.card}>
      {/* Food image */}
      <div style={styles.imgWrapper}>
        <img src={imgUrl} alt={recipe.name}
          style={styles.img}
          onError={e => {
            e.target.src = FOOD_IMAGES[0];
          }} />
        {recipe.score !== undefined && (
          <div style={styles.scoreBadge}>
             {recipe.score}
          </div>
        )}
      </div>

      <div style={styles.body}>
        <h3 style={styles.title}>{recipe.name}</h3>
        <p style={styles.meta}>
          ⏱ {recipe.minutes} min &nbsp;|&nbsp;
           {recipe.n_steps} steps &nbsp;|&nbsp;
           {recipe.n_ingredients} ings
        </p>

        {recipe.nutrition?.length > 0 && (
          <div style={styles.nutritionRow}>
            {recipe.nutrition.slice(0, 4).map((val, i) => (
              <span key={i} style={styles.nutBadge}>
                {NUTRIENTS[i]}: {typeof val==="number"
                  ? val.toFixed(1) : val}
              </span>
            ))}
          </div>
        )}

        {recipe.ingredients?.length > 0 && (
          <p style={styles.ings}>
             {recipe.ingredients.slice(0, 4).join(", ")}
            {recipe.ingredients.length > 4 ? "..." : ""}
          </p>
        )}

        {showSave && (
          <button onClick={handleSave} style={styles.saveBtn}>
             Save Recipe
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card:         { background:"#fff", borderRadius:12,
                  overflow:"hidden",
                  boxShadow:"0 3px 12px rgba(0,0,0,0.1)",
                  marginBottom:16, transition:"transform 0.2s",
                  cursor:"default" },
  imgWrapper:   { position:"relative", height:180, overflow:"hidden" },
  img:          { width:"100%", height:"100%",
                  objectFit:"cover" },
  scoreBadge:   { position:"absolute", top:10, right:10,
                  background:"rgba(0,0,0,0.7)", color:"#4ade80",
                  padding:"4px 10px", borderRadius:20,
                  fontSize:"0.8rem", fontWeight:"bold" },
  body:         { padding:16 },
  title:        { margin:"0 0 8px", color:"#1a1a2e",
                  fontSize:"1rem", fontWeight:"bold",
                  lineHeight:1.4 },
  meta:         { color:"#666", fontSize:"0.8rem", margin:"0 0 8px" },
  nutritionRow: { display:"flex", flexWrap:"wrap",
                  gap:4, margin:"0 0 8px" },
  nutBadge:     { background:"#eaf4fb", padding:"2px 8px",
                  borderRadius:10, fontSize:"0.72rem", color:"#2980b9" },
  ings:         { color:"#555", fontSize:"0.8rem", margin:"0 0 10px" },
  saveBtn:      { background:"#1a1a2e", color:"white",
                  border:"none", padding:"8px 16px",
                  borderRadius:6, cursor:"pointer",
                  width:"100%", fontWeight:"bold" }
};