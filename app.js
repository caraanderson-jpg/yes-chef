(function(){
"use strict";
/* ============ helpers ============ */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const lsGet=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;

const P={
home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
book:'<path d="M4 4.5h10.5A3.5 3.5 0 0 1 18 8v12.5H7.5A3.5 3.5 0 0 1 4 17z"/><path d="M4 17a3.5 3.5 0 0 1 3.5-3.5H18"/>',
cal:'<rect x="3.5" y="5" width="17" height="15.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
cart:'<path d="M3 4h2.2l2.3 11h10.8L21 8H6.3"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
dots:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
users:'<circle cx="9" cy="8.5" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.3a3.2 3.2 0 0 1 0 6.4M21 20a6 6 0 0 0-3.8-5.6"/>',
leaf:'<path d="M5 19C5 10.5 11 5 20 5c0 9-6 14.5-14.5 14.5"/><path d="M5 19l7.5-7.5"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
back:'<path d="M15 5l-7 7 7 7"/>',
fwd:'<path d="M9 5l7 7-7 7"/>',
x:'<path d="M6 6l12 12M18 6L6 18"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
play:'<path d="M8 5.5l11 6.5-11 6.5z"/>',
timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4.5M9.5 2.5h5"/>',
camera:'<path d="M4 8h3l2-3h6l2 3h3v11.5H4z"/><circle cx="12" cy="13.5" r="3.5"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3A4 4 0 0 0 13 5.3l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>',
copy:'<rect x="8.5" y="8.5" width="11.5" height="11.5"/><path d="M15.5 8.5V4H4v11.5h4.5"/>',
trash:'<path d="M4 7h16M9.5 7V4h5v3M6 7l1 13.5h10L18 7"/>',
shield:'<path d="M12 3l7.5 3v6c0 4.5-3.2 7.8-7.5 9-4.3-1.2-7.5-4.5-7.5-9V6z"/>',
box:'<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/>',
swap:'<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>',
pot:'<path d="M3.5 10h17v5.5a4.5 4.5 0 0 1-4.5 4.5H8a4.5 4.5 0 0 1-4.5-4.5z"/><path d="M2 10h20M9 6.5c0-1 1-1.5 1-2.5M14 6.5c0-1 1-1.5 1-2.5"/>',
tag:'<path d="M3.5 12.5V4h8.5l8.5 8.5-8.5 8.5z"/><circle cx="8" cy="8.5" r="1.3"/>',
edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.1"/>',
sun:'<circle cx="12" cy="12" r="3.8"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>'
};
const ic=(n,sw)=>`<svg viewBox="0 0 24 24" fill="${n==="dots"?"currentColor":"none"}" stroke="currentColor" stroke-width="${sw||1.9}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||""}</svg>`;

/* ============ data ============ */
const BUILT=window.YC_RECIPES||[];
const TIPS=window.YC_TIPS||[];
function dayOfYear(d){const s=new Date(d.getFullYear(),0,0);return Math.floor((d-s)/864e5)}
function todaysTip(){return TIPS.length?TIPS[dayOfYear(new Date())%TIPS.length]:null}
const EVC={Strong:"var(--em)",Moderate:"var(--bl)",Emerging:"var(--tq)"};
function evBadge(e){const n={Strong:3,Moderate:2,Emerging:1}[e]||1;return `<span class="ev" style="--c:${EVC[e]}"><span class="bars" aria-hidden="true">${[1,2,3].map(i=>`<i class="${i<=n?"on":""}"></i>`).join("")}</span>${e==="Emerging"?"Emerging research":e+" evidence"}</span>`}
function tipCard(t,big){
  return `<article class="tip-card${big?" big":""}"><div class="tk">The Feel Good Daily · ${esc(t.cat)}</div><h3>${esc(t.h)}</h3>
  <div class="tl">The science</div><p>${esc(t.sci)}</p>
  <div class="tl">Try it today</div><p class="tt">${esc(t.try)}</p>
  <div class="tf">${evBadge(t.ev)}<a href="${esc(t.url)}" target="_blank" rel="noopener">Read the research →</a></div>
  <div class="ts">${esc(t.src)}</div></article>`;
}
const CATN={hotpot:"Hot pot",ramen:"Ramen & noodle soups",broth:"Broth & bases",oats:"Overnight oats",dinner:"Dinner",side:"Lunch & sides",sandwich:"Wraps, burgers & sandwiches",baking:"Baking & treats",lunch:"Lunch",breakfast:"Breakfast",other:"Recipe"};
const DIETN={meat:"Meat",pesc:"Pescatarian",veg:"Vegetarian",vegan:"Vegan"};
const SHOPCAT=[["veg","Fruit & Vegetables"],["meat","Meat & Seafood"],["dairy","Dairy, Eggs & Tofu"],["noodle","Rice, Pasta & Noodles"],["pantry","Pantry"],["herb","Herbs & Spices"],["frozen","Frozen"],["other","Other"]];
const SLOTS=[["B","Breakfast"],["L","Lunch"],["D","Dinner"]];
const FCATS=[["B","Breakfast"],["L","Lunch"],["D","Dinner"],["S","Snacks"],["I","Sides"],["K","Baked"],["A","Salads"]];
const FCATN=Object.fromEntries(FCATS);
const DAYS=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const PALS=[["#00543D","#008FAD"],["#0648A1","#00543D"],["#008FAD","#0648A1"],["#202020","#008FAD"],["#0648A1","#008FAD"],["#00543D","#0648A1"]];

/* ============ state ============ */
const DEF={pantry:{},plan:{},bought:{},extras:{},prices:{},favs:{},hidden:{},people:2,store:"woolworths"};
let S=Object.assign(JSON.parse(JSON.stringify(DEF)),lsGet("yc-state",{}));
const UI={wk:null,q:"",chip:"all",shopView:"need",open:{},fMeal:"all",fDiet:"all",serv:{},pickQ:"",pickChip:null};
let FINDS=lsGet("yc-finds",[]),MY=lsGet("yc-my",[]),PHOTOS=lsGet("yc-photos",{});
let syncState="local";
let RATINGS=lsGet("yc-ratings",[]); /* [{item,uid,stars}] */
let UID=lsGet("yc-uid",null);if(!UID){UID="local-"+Math.random().toString(36).slice(2,10);lsSet("yc-uid",UID)}
function ratingOf(item){const rs=RATINGS.filter(r=>r.item===item&&r.stars>0);const mine=rs.find(r=>r.uid===UID);
  return {avg:rs.length?rs.reduce((a,r)=>a+r.stars,0)/rs.length:0,n:rs.length,mine:mine?mine.stars:0}}
function starsView(item,size){const r=ratingOf(item);if(!r.n)return "";
  return `<span class="avgst${size?" "+size:""}" aria-label="Rated ${r.avg.toFixed(1)} out of 5 from ${r.n} rating${r.n>1?"s":""}"><span aria-hidden="true">★</span> ${r.avg.toFixed(1)}${r.n>1?` <small>(${r.n})</small>`:""}</span>`}
function starsInput(item,label){const r=ratingOf(item);
  return `<div class="rate" role="group" aria-label="${esc(label||"Your rating")}">${[1,2,3,4,5].map(i=>`<button class="${i<=r.mine?"on":""}" data-a="rate" data-item="${esc(item)}" data-v="${i}" aria-label="${i} star${i>1?"s":""}" aria-pressed="${i<=r.mine}">★</button>`).join("")}</div>`}
async function setRating(item,v){
  const cur=ratingOf(item).mine;const stars=cur===v?0:v;
  const id=(item+"~"+UID).replace(/[^A-Za-z0-9_\-.~:@+]/g,"_").slice(0,190);
  RATINGS=RATINGS.filter(r=>!(r.item===item&&r.uid===UID));if(stars)RATINGS.push({item,uid:UID,stars});
  try{const {error}=stars?await SB.from("ratings").upsert({item,user_id:UID,stars}):await SB.from("ratings").delete().eq("item",item).eq("user_id",UID);if(error)throw error}catch(e){sbErr(e)}
  rerender();toast(stars?"Rated "+stars+" star"+(stars>1?"s":""):"Rating removed");
}

/* ============ recipes ============ */
function parseQty(s){
  s=s.trim();const fr={"¼":.25,"½":.5,"¾":.75,"⅓":1/3,"⅔":2/3,"⅛":.125};
  let m=s.match(/^(\d+)\s+(\d+)\/(\d+)$/);if(m)return +m[1]+ +m[2]/+m[3];
  m=s.match(/^(\d+)\/(\d+)$/);if(m)return +m[1]/+m[2];
  m=s.match(/^(\d+)?([¼½¾⅓⅔⅛])$/);if(m)return (+m[1]||0)+fr[m[2]];
  const n=parseFloat(s.replace(",","."));return isNaN(n)?null:n;
}
function guessCat(n){
  n=n.toLowerCase();
  if(/frozen/.test(n))return "frozen";
  if(/chicken|beef|pork|lamb|mince|bacon|fish|prawn|salmon|tuna|mussel|anchov|sausage|steak|ham\b|turkey|seafood/.test(n))return "meat";
  if(/milk|yoghurt|yogurt|cheese|cream|butter|egg|tofu|ricotta|feta|mozzarella|parmesan|cheddar/.test(n))return "dairy";
  if(/rice|pasta|noodle|lasagne|spaghetti|quinoa|tortilla|soba/.test(n))return "noodle";
  if(/cumin|paprika|cinnamon|oregano|turmeric|nutmeg|spice|seasoning|bay lea|chilli powder|chilli flakes|peppercorn|black pepper|white pepper|thyme|garam/.test(n))return "herb";
  if(/oil|sauce|vinegar|sugar|flour|salt|stock|paste|seeds|nuts|syrup|honey|tin|canned|oats|cornflour|baking|vanilla|mayo|mustard|peanut|almond|breadcrumb|chips|cocoa|cacao/.test(n))return "pantry";
  if(/carrot|potato|pumpkin|tomato|onion|leek|spinach|kale|lettuce|cabbage|wombok|bok choy|choy|zucchini|capsicum|cucumber|broccoli|beans|sprout|mushroom|ginger|lemon|lime|banana|berr|kiwi|orange|pineapple|herb|parsley|coriander|basil|dill|chives|rosemary|corn|avocado|eggplant|celery|radish|fennel|apple|pear/.test(n))return "veg";
  return "other";
}
function parseIng(text){
  return String(text||"").split(/\n/).map(l=>l.trim().replace(/^[-•*·]\s*/,"")).filter(Boolean).map(l=>{
    if(/:$/.test(l))return ["#",l.replace(/:$/,"")];
    const m=l.match(/^((?:\d+\s+\d\/\d)|(?:\d+\/\d+)|(?:\d*[¼½¾⅓⅔⅛])|(?:\d+(?:[.,]\d+)?))\s*(kg|g|ml|l|L|tsp|tbsp|tbs|cups?|bunch(?:es)?|cans?|tins?|slices?|cloves?|handfuls?|pinch(?:es)?|sprigs?)?\.?\s+(.+)$/i);
    if(m){let u=(m[2]||"").toLowerCase();if(u==="tbs")u="tbsp";if(u==="l")u="L";if(/^cups?$/.test(u))u="cup";
      return [parseQty(m[1]),u,m[3],guessCat(m[3])];}
    return [null,"",l,guessCat(l)];
  });
}
function myToRecipe(m){
  return {id:m.id,name:m.name||"My recipe",by:"mine",cat:m.cat||"dinner",meals:m.meals&&m.meals.length?m.meals:["D"],diet:m.diet||"meat",
    freq:m.freq||"Weekly",serves:Math.max(1,+m.serves||2),prep:+m.prep||0,cook:+m.cook||0,desc:m.notes||"",equip:m.equip||"",
    ing:parseIng(m.ing),steps:String(m.steps||"").split(/\n/).map(s=>s.trim().replace(/^\d+[.)]\s*/,"")).filter(Boolean).map(s=>[s]),
    fod:m.fod||"",swaps:m.swaps||"",store:m.store||"",mine:true,ai:!!m.ai,url:m.url||"",raw:m};
}
function isBuilt(id){return BUILT.some(r=>r.id===id)}
function photoOf(id){return isBuilt(id)?(OFFICIAL[id]||(window.YC_PHOTOS||{})[id]):PHOTOS[id]}
function canPhoto(r){return isBuilt(r.id)?IS_OWNER:(r.mine&&r.raw&&r.raw.by===UID)}
function allRecipes(){return BUILT.concat(MY.map(myToRecipe))}
let IS_OWNER=false;
function canEditMy(m){return !m||!m.by||m.by===UID}
function getR(id){return BUILT.find(r=>r.id===id)||(MY.find(m=>m.id===id)?myToRecipe(MY.find(m=>m.id===id)):null)}
function pal(id){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))>>>0;return PALS[h%PALS.length]}
function cover(r,big,noLab){
  const ph=photoOf(r.id);
  if(ph)return `<div class="cover${big?" big":""}"><img src="${ph}" alt="${esc(r.name)}"></div>`;
  const [a,b]=pal(r.id);
  return `<div class="cover${big?" big":""}" style="background:${a}"><i class="s1" style="background:${b}"></i><i class="s2"></i><i class="s3"></i>${noLab?"":`<span class="lab">${big?"Photo coming soon":esc(CATN[r.cat]||"Recipe")}</span>`}</div>`;
}
function plantsOf(r){
  const big=new Set(),small=new Set();
  (r.ing||[]).forEach(i=>{if(i[0]==="#")return;const p=i[4];if(!p)return;if(p[0]==="~")small.add(p.slice(1));else big.add(p)});
  return {big,small};
}
const plantName=k=>k.replace(/-/g," ").replace("greens","greens");

/* allergens: scanned from ingredient names */
const ALLERGENS=[
 ["Gluten / wheat",/(soy sauce|oyster sauce|worcestershire|beer|malt vinegar|spelt|soba|plain flour|breadcrumb|asafoetida|miso)/i,/gluten-free|100% buckwheat|tamari/i],
 ["Milk / dairy",/\b(milk|yoghurt|yogurt|cream|butter|cheese|cheddar|gruy[eè]re|mozzarella|parmesan|ricotta)\b/i,/almond milk|coconut cream|coconut milk|coconut-almond|peanut butter|coconut yoghurt/i],
 ["Egg",/\b(eggs?|egg white|mayonnaise)\b/i,null],
 ["Fish",/\b(fish|anchov|tuna|salmon|basa|ling|hoki)\b/i,null],
 ["Crustacean (prawn)",/prawn/i,null],
 ["Mollusc",/mussel|oyster sauce/i,null],
 ["Peanut",/peanut/i,null],
 ["Tree nuts",/almond|walnut|pecan|hazelnut|macadamia|pine nut/i,null],
 ["Sesame",/sesame|tahini/i,null],
 ["Soy",/tofu|soy sauce|soy\b|miso|dark soy/i,null]
];
function allergensOf(r){
  const out=[];
  ALLERGENS.forEach(([lab,re,not])=>{
    const hits=(r.ing||[]).filter(i=>i[0]!=="#"&&re.test(i[2])&&!(not&&not.test(i[2]))&&!(lab==="Milk / dairy"&&/peanut butter|coconut|almond milk/i.test(i[2])));
    if(hits.length)out.push(lab);
  });
  return out;
}

/* FODMAP scanner for user recipes (rules from Monash / FODMAP Friendly published guidance) */
function scanLine(l){
  const s=l.toLowerCase(),f=[];
  const add=(a,b)=>f.push([a,b]);
  if(/garlic/.test(s)&&!/infused|garlic oil/.test(s))add("Garlic is high in fructans.","Use garlic-infused oil, the fructans don’t move into oil.");
  if(/onion|shallot|scallion/.test(s)){
    if(/spring onion|scallion|green onion/.test(s)){if(!/green (top|part)|tops only/.test(s))add("Spring onion white bulbs are high in fructans.","Use the green tops only.")}
    else add("Onion is high in fructans.","Use spring onion or leek green tops, chives, or a pinch of asafoetida.");
  }
  if(/\bleeks?\b/.test(s)&&!/green/.test(s))add("The white part of leek is high in fructans.","Use the green leaves only.");
  if(/cauliflower/.test(s))add("Cauliflower is high in mannitol.","Swap for broccoli heads, Kent pumpkin or potato.");
  if(/mushroom/.test(s)&&!/oyster|canned|champignon/.test(s))add("Button, shiitake, enoki and portobello mushrooms are high in mannitol.","Use oyster mushrooms (75 g per serve).");
  if(/pecan|walnut/.test(s))add("Avoid pecans and walnuts in Yes Chef! recipes.","Use macadamias, peanuts or pepitas.");
  if(/coffee|espresso|mocha/.test(s))add("Coffee is left out of Yes Chef! recipes.","Leave it out, or add a pinch of cocoa or vanilla.");
  if(/cashew|pistachio/.test(s))add("Cashews and pistachios are high FODMAP.","Use macadamias or peanuts.");
  if(/kidney bean|black bean|baked bean|borlotti|cannellini|split pea|butter bean/.test(s))add("Most beans are high in GOS.","Use canned, rinsed lentils (about 46 g per serve).");
  if(/lentil/.test(s)&&!/can|tin/.test(s))add("Boiled dried lentils are higher in GOS.","Use canned lentils, rinsed (about 46 g per serve).");
  if(/chickpea/.test(s)&&!/can|tin/.test(s))add("Dried chickpeas are high in GOS.","Use canned, rinsed chickpeas in small serves.");
  if(/\b(apples?|pears?|mangoe?s?|watermelon|cherr(y|ies)|nectarines?|peach(es)?|plums?|apricots?|dates|figs|prunes)\b/.test(s)&&!/cider vinegar/.test(s))add("This fruit is high in fructose or polyols.","Try firm banana, blueberries, strawberries, kiwi, orange or pineapple.");
  if(/honey|agave/.test(s))add("Honey and agave are high in excess fructose.","Use maple syrup or rice malt syrup.");
  if(/inulin|chicory/.test(s))add("Inulin / chicory root is a concentrated fructan.","Leave it out.");
  if(/\bmilk\b/.test(s)&&!/lactose[- ]free|almond|rice milk|coconut|macadamia|soy protein|buttermilk powder/.test(s))add("Regular milk is high in lactose.","Use lactose-free milk or almond milk.");
  if(/yoghurt|yogurt/.test(s)&&!/lactose[- ]free|coconut/.test(s))add("Regular yoghurt is high in lactose.","Use lactose-free or coconut yoghurt.");
  if(/\bcream\b/.test(s)&&!/lactose[- ]free|coconut|sour cream|ice cream|cream cheese/.test(s))add("Cream is low FODMAP only at about 2 tbsp per serve.","Keep it small, or use lactose-free cream.");
  if(/ricotta|cottage cheese|cream cheese|mascarpone/.test(s)&&!/lactose[- ]free/.test(s))add("Soft cheeses are low only at about 2 tbsp per serve.","Use less, add parmesan or cheddar, or use lactose-free.");
  if(/sour cream/.test(s))add("Sour cream is low at about 2 tbsp per serve.","Keep to about 2 tbsp each.");
  if(/(flour|breadcrumb|bread\b|pasta|spaghetti|lasagne|couscous|noodle|wrap|pastry|biscuit|ciabatta|crumpet)/.test(s)&&!/gluten[- ]free|\bgf\b|rice|corn|tapioca|buckwheat|millet|almond|sourdough|potato|oat|cornflour|coconut flour/.test(s))add("Wheat products are high in fructans in larger serves.","Use a gluten-free version (or spelt sourdough for bread).");
  if(/\brye\b|barley/.test(s))add("Rye and barley are high in fructans.","Use gluten-free bread or spelt sourdough.");
  if(/asparagus|artichoke/.test(s))add("This vegetable is high FODMAP.","Try green beans, zucchini or broccoli heads.");
  if(/\bpeas\b/.test(s)&&!/snow|sugar snap|chick/.test(s))add("Green peas are high in GOS.","Use green beans or a small handful of snow peas.");
  if(/celery/.test(s))add("Celery is high in mannitol beyond a small piece.","Keep to under 5 cm per serve, or leave out.");
  if(/butternut/.test(s))add("Butternut pumpkin is only low FODMAP in small serves.","Use Kent (Japanese) pumpkin.");
  if(/avocado|guac/.test(s))add("Avocado is low only at about 30 g per serve.","Keep to about ⅛ avocado each.");
  if(/\b(stock|broth|bouillon)\b/.test(s)&&!/low fodmap|bone broth|homemade|fodmap/.test(s))add("Most stocks contain onion and garlic.","Use a certified low FODMAP stock or the bone broth recipe.");
  if(/seasoning|curry paste|taco|adobo|bbq sauce|barbecue|ketchup|tomato sauce|salsa|gravy|sweet chilli|stir.?fry sauce|marinade|san choy|simmer sauce|jar/.test(s))add("Bottled sauces and spice mixes often contain onion or garlic.","Check the label, or make it from scratch.");
  if(/silken tofu/.test(s))add("Silken tofu is high FODMAP.","Use firm tofu.");
  if(/soy milk/.test(s)&&!/protein/.test(s))add("Soy milk made from whole soybeans is high in GOS.","Use soy-protein soy milk or almond milk.");
  if(/\bbanana/.test(s))add("Ripe bananas are high in fructans.","Use a firm, just-yellow banana.");
  if(/chickpea/.test(s)&&/can|tin/.test(s))add("Canned chickpeas are low FODMAP at about 42 g (¼ cup) per serve.","Keep to ¼ cup each, rinsed well.");
  if(/lentil/.test(s)&&/can|tin/.test(s))add("Canned lentils are low FODMAP at about 46 g per serve.","Keep to ¼ cup each, rinsed well.");
  if(/sweet ?potato|kumara/.test(s))add("Sweet potato is low FODMAP only at about 75 g per serve.","Keep to 75 g each, or add regular potato.");
  if(/capsicum|bell pepper/.test(s)&&!/green/.test(s))add("Red capsicum is low FODMAP only at about 43 g per serve.","Keep to about ¼ capsicum each, or use green capsicum.");
  if(/cabbage|wombok|bok choy|pak choy/.test(s))add("Cabbage and bok choy are low FODMAP at about 75 g per serve.","Keep to about 1 cup each.");
  if(/coconut milk|coconut cream/.test(s)&&!/light|lite/.test(s))add("Canned coconut milk is low FODMAP only at about ¼ cup per serve.","Use light coconut milk, or keep to ¼ cup each.");
  if(/eggplant|aubergine/.test(s))add("Eggplant is low FODMAP at about 75 g per serve.","Keep to about 1 cup each.");
  if(/zucchini|courgette/.test(s))add("Zucchini is low FODMAP at about 65 g per serve.","Keep to about ⅓ zucchini each.");
  if(/broccoli/.test(s)&&!/head|floret/.test(s))add("Broccoli stalks are high in fructose; heads are low at 75 g.","Use mostly the heads, about 75 g each.");
  if(/sugar snap|snow pea|mange/.test(s))add("Snow peas and sugar snaps are only low in small serves.","Keep to about 5 pods each.");
  if(/sun.?dried tomato/.test(s))add("Sun-dried tomatoes are low only at about 8 g per serve.","Use 2–3 pieces each.");
  if(/cherry tomato/.test(s))add("Cherry tomatoes are low at about 45 g per serve.","Keep to about 3 each.");
  if(/dark chocolate|choc chips|chocolate/.test(s)&&!/white/.test(s))add("Dark chocolate is low FODMAP at about 30 g per serve.","Keep to about 30 g each.");
  if(/almond/.test(s)&&!/milk|extract/.test(s))add("Almonds are low only at about 10 nuts per serve.","Keep it small, or use macadamias or peanuts.");
  if(/oats?|oatmeal|porridge/.test(s))add("Oats are low FODMAP at about ½ cup (52 g) per serve.","Keep to ½ cup each.");
  if(/sausage|chorizo|salami|frankfurt|cabanossi|bacon bits/.test(s))add("Processed meats often contain garlic or onion.","Check the label, or use plain mince with herbs and spices.");
  if(/onion powder|garlic powder|onion salt|garlic salt/.test(s))add("Onion and garlic powders are high in fructans.","Leave out; add garlic-infused oil and chives.");
  if(/coconut water/.test(s))add("Coconut water is high in larger amounts.","Keep it small.");
  if(/sweet ?corn|corn kernel|\bcorn\b/.test(s)&&!/cornflour|corn chips|tortilla|cornstarch|popcorn/.test(s))add("Corn is only low FODMAP in small serves.","Keep to about ¼ cup each.");
  return f;
}
function checkText(text){
  const lines=String(text||"").split(/\n/).map(l=>l.trim().replace(/^[-•*·]\s*/,"")).filter(l=>l&&!/:$/.test(l));
  const flagged=[];lines.forEach(l=>{const f=scanLine(l);if(f.length)flagged.push({line:l,f})});
  return {count:lines.length,flagged};
}
function checkResults(text){
  const r=checkText(text);
  const head=r.flagged.length?`<div class="panel warn" style="margin:0"><h3>${ic("info")}${r.flagged.length} of ${r.count} ingredient${r.count>1?"s":""} to check</h3>${r.flagged.map(x=>`<div class="flag"><b>${esc(x.line)}</b>${x.f.map(y=>`${esc(y[0])} <span class="muted">→ ${esc(y[1])}</span>`).join("<br>")}</div>`).join("")}</div>`
    :`<div class="panel tq" style="margin:0"><h3>${ic("check")}No common high FODMAP ingredients found</h3><p class="small" style="margin:0">Still check serving sizes.</p></div>`;
  return head+`<p class="small muted" style="margin-top:10px">This checker spots common high FODMAP ingredients only. Always check against the <a href="https://www.monashfodmap.com/" target="_blank" rel="noopener">Monash University FODMAP app</a>.</p>`;
}
const TERMS_V="2026-11-20";
const TERMS_SECTIONS=[
["Not medical advice","Yes Chef! gives general information about food, recipes and wellbeing. It is not medical, nutritional or dietetic advice, and it does not replace advice from your doctor, an Accredited Practising Dietitian or another qualified health professional. Don’t use it to diagnose or treat any condition. Talk to your doctor before changing your diet, especially if you are pregnant or breastfeeding, have diabetes or another medical condition, take medication, or have a history of disordered eating. If you have severe, ongoing or worsening symptoms, see a doctor. In an emergency call 000."],
["Low FODMAP information","The low FODMAP diet should be done with guidance from a dietitian, and it is not meant to be followed strictly long term. Serving sizes and swaps in this app are based on publicly available information from Monash University and FODMAP Friendly at the time of writing. Testing changes, products differ, and everyone tolerates foods differently. Always check foods and serving sizes against the Monash University FODMAP app. The recipe checker only spots common ingredients and can miss things. Recipes labelled as converted automatically may contain mistakes. Yes Chef! is not affiliated with or endorsed by Monash University or FODMAP Friendly."],
["Allergies and food safety","Allergen labels in this app are worked out automatically from ingredient names and may be incomplete. Always read product labels yourself, especially for serious allergies or coeliac disease. Follow safe food handling: cook meat, poultry, seafood and eggs thoroughly, keep cold food cold, and use your own judgement about storage times, which are general guides only."],
["Wellbeing tips","The Feel Good Daily tips summarise published research in plain language. Evidence ratings are a general guide only. Tips may not suit everyone; check with your doctor before trying anything new, such as changing when you eat or starting new exercise."],
["Community content","Community finds, ratings and recipes added by users are their own content. They are not checked or endorsed by Yes Chef! and may not be low FODMAP. Links go to other websites that we don’t control and aren’t responsible for. Only add recipes, photos and links you have the right to share, credit the original author, and don’t copy recipe text word for word. We may remove any content at any time. To ask for content to be removed, contact the app owner."],
["Prices and shopping","Prices you enter and supermarket search links are for convenience only. Yes Chef! is not connected to Coles, Woolworths, ALDI or any other store, and doesn’t guarantee prices, specials or stock."],
["Your data","Recipes, plans, shopping lists, ratings, photos and finds you add are stored so they can sync between the people using the app. Don’t add sensitive personal or health information. You can delete your own content in the app."],
["No guarantees and limits of liability","The app is provided “as is”, without guarantees that it is accurate, complete or always available. You use it and the information in it at your own risk. To the extent permitted by law, the app owner is not liable for any loss, injury, illness, reaction or damage arising from using the app, its recipes or its information. Nothing in these terms excludes rights you have under the Australian Consumer Law that can’t be excluded."],
["Changes","These terms may be updated. Continuing to use the app means you accept the current version."]];
function vTerms(){
  return `<a class="back" href="#more">${ic("back")}More</a>
  <div class="sec" style="padding-top:4px"><div class="sec-h"><h2>Terms &amp; disclaimer</h2></div>
  <div class="warnbox" role="note">${ic("info")}<div><b>Yes Chef! is not medical advice.</b> Always check with your doctor or dietitian, and check foods against the Monash University FODMAP app.</div></div>
  ${TERMS_SECTIONS.map(([h,t])=>`<div class="panel white" style="margin-top:10px"><h3>${esc(h)}</h3><p class="small" style="margin:0">${esc(t)}</p></div>`).join("")}
  <p class="disc">Last updated 20 November 2026.</p></div>`;
}
function termsGate(){
  if(!SESSION||!PROFILE)return;
  if(PROFILE.accepted_terms===TERMS_V||lsGet("yc-terms-"+UID,null)===TERMS_V)return;
  $("#modal").innerHTML=`<div class="modal"><div class="sheet" role="dialog" aria-modal="true" aria-label="Before you start"><div class="sh"><h2>Before you start</h2></div><div id="mbody">
  <div class="warnbox" role="note" style="margin-top:0">${ic("info")}<div><b>Yes Chef! is general information, not medical advice.</b></div></div>
  <ul class="small" style="padding-left:18px;margin:0 0 12px;line-height:1.55">
  <li>Follow the low FODMAP diet with your doctor or an Accredited Practising Dietitian.</li>
  <li>Check foods and serving sizes against the Monash University FODMAP app.</li>
  <li>Allergen info is automatic and may be incomplete, always read labels.</li>
  <li>Community recipes and links are added by users and may not be low FODMAP.</li>
  <li>You use the app at your own risk.</li></ul>
  <a href="#terms" data-a="termsRead" style="font-weight:700">Read the full terms &amp; disclaimer</a>
  <button class="btn em full" style="margin-top:16px" data-a="acceptTerms">${ic("check")}I understand and agree</button></div></div></div>`;
  document.body.style.overflow="hidden";
}
function vAuth(){
  const m=UI.authMode||"in";
  const t={in:"Sign in",up:"Create your account",forgot:"Reset your password"}[m];
  return `<section class="auth">
  <div class="auth-hero"><h1>Feed your gut <h1>Feed your gut &amp; your soul.</h1>amp; feel good.</h1><p>Low FODMAP recipes, a weekly planner and a shared shopping list for your household.</p></div>
  <div class="panel white auth-card"><h2 style="margin-top:0">${t}</h2>
  <form data-form="auth" data-mode="${m}">
  ${m==="up"?`<label class="fl" for="a-name">Your first name</label><input id="a-name" name="name" type="text" autocomplete="given-name" required maxlength="60">`:""}
  <label class="fl" for="a-email">Email</label><input id="a-email" name="email" type="email" autocomplete="email" required>
  ${m!=="forgot"?`<label class="fl" for="a-pw">Password</label><input id="a-pw" name="pw" type="password" autocomplete="${m==="up"?"new-password":"current-password"}" minlength="8" required>${m==="up"?`<p class="hint">At least 8 characters.</p>`:""}`:""}
  ${m==="up"?`<label class="chk"><input type="checkbox" name="terms" required> I’ve read and agree to the <a href="#terms">terms &amp; disclaimer</a>, and I understand Yes Chef! is not medical advice.</label>`:""}
  <button class="btn em full" style="margin-top:16px" type="submit">${{in:"Sign in",up:"Create account",forgot:"Email me a reset link"}[m]}</button></form>
  <div class="auth-links">${m!=="in"?`<button class="lnk" data-a="authMode" data-v="in">I already have an account</button>`:`<button class="lnk" data-a="authMode" data-v="up">New here? Create an account</button><button class="lnk" data-a="authMode" data-v="forgot">Forgot password?</button>`}</div></div>
  <p class="disc">Yes Chef! is general information, not medical advice. <a href="#terms">Terms &amp; disclaimer</a></p></section>`;
}
function vResetPw(){
  return `<div class="sec"><div class="sec-h"><h2>Choose a new password</h2></div><form data-form="newpw"><label class="fl" for="npw">New password</label><input id="npw" name="pw" type="password" minlength="8" autocomplete="new-password" required><button class="btn em full" style="margin-top:14px" type="submit">Save password</button></form></div>`;
}
function vAccount(){
  const email=SESSION&&SESSION.user.email||"";
  return `<div class="panel white"><h3>${ic("users")}Your household</h3>
  <p class="small" style="margin:4px 0 8px">Share this code with your partner or family so you share one planner and shopping list.</p>
  <div class="code-row"><span class="code" aria-label="Invite code">${esc(HOUSE&&HOUSE.invite_code||"------")}</span><button class="btn line sm" data-a="copyCode">${ic("copy")}Copy</button></div>
  <form data-form="join" class="row" style="margin-top:12px;flex-wrap:nowrap"><input name="code" placeholder="Join with a code" maxlength="8" style="flex:1;text-transform:uppercase" aria-label="Household code"><button class="btn tq sm" type="submit">Join</button></form>
  <div class="row" style="margin-top:10px;gap:8px"><button class="btn line sm" data-a="newCode">New code</button><button class="btn line sm" data-a="leaveHouse">Start my own household</button></div></div>
  <div class="panel white"><h3>${ic("edit")}Your account</h3><p class="small" style="margin:4px 0">${esc(PROFILE&&PROFILE.display_name||"")} · ${esc(email)}</p>
  <div class="row" style="margin-top:8px;gap:8px"><button class="btn line sm" data-a="signOut">Sign out</button><a class="btn line sm" href="mailto:?subject=${encodeURIComponent("Delete my Yes Chef! account")}" data-a="delAcct">Delete my account</a></div></div>`;
}
const FODMAP_GROUPS=[
["F","Fermentable","Gut bacteria break these carbs down and make gas.",null],
["O","Oligosaccharides","Short chains of sugars. Two kinds:",[["Fructans","Wheat, rye, barley, onion, garlic, white part of leek and spring onion, artichoke, inulin / chicory root, watermelon, nectarine"],["GOS","Beans, chickpeas, lentils, cashews, pistachios, silken tofu, soy milk made from whole soybeans"]]],
["D","Disaccharides","Double sugars. The one that matters is lactose:",[["Lactose","Regular milk, yoghurt, ice cream, custard, and soft cheeses like ricotta, cottage cheese and cream cheese"]]],
["M","Monosaccharides","Single sugars. The one that matters is excess fructose (more fructose than glucose):",[["Excess fructose","Honey, agave, apples, pears, mango, watermelon, asparagus, sugar snap peas"]]],
["A","And","",null],
["P","Polyols","Sugar alcohols. Two kinds:",[["Sorbitol","Apples, pears, stone fruit (peaches, plums, cherries), blackberries, avocado in larger amounts, sugar-free lollies and gum"],["Mannitol","Button and most other mushrooms, cauliflower, celery, sweet potato in larger serves, snow peas"]]]];
function vFodmap(){
  return `<a class="back" href="#more">${ic("back")}More</a>
  <div class="sec" style="padding-top:4px"><div class="sec-h"><h2>What is FODMAP?</h2></div>
  <p>FODMAPs are a group of carbohydrates (sugars and fibres) that the small intestine doesn’t absorb well. They move into the large intestine, where they draw in water and gut bacteria ferment them, making gas. For most people that’s fine. For people with IBS it can cause bloating, pain, wind, diarrhoea or constipation.</p>
  <p class="small muted">The low FODMAP diet was developed by Monash University in Melbourne.</p>
  ${FODMAP_GROUPS.map(([l,n,d,s])=>`<div class="panel white fm-row"><div class="fm-l" aria-hidden="true">${l}</div><div><h3 style="margin:0 0 4px">${esc(n)}</h3>${d?`<p class="small" style="margin:0 0 6px">${esc(d)}</p>`:""}${s?s.map(([k,v])=>`<p class="small" style="margin:6px 0 0"><b>${esc(k)}:</b> ${esc(v)}</p>`).join(""):""}</div></div>`).join("")}
  <div class="panel tq"><h3>${ic("leaf")}Serving size matters</h3><p class="small" style="margin:0">Many foods are only high FODMAP in bigger amounts. Avocado is fine at 30 g, canned chickpeas at about ¼ cup and sweet potato at 75 g. Canned, rinsed legumes are lower than dried ones because some FODMAPs move into the water. That’s why Yes Chef! recipes list exact amounts.</p></div>
  <div class="panel white"><h3>${ic("cal")}How the diet works</h3>
  <p class="small" style="margin:4px 0"><b>1. Swap (2–6 weeks):</b> cut back high FODMAP foods to see if symptoms settle.</p>
  <p class="small" style="margin:4px 0"><b>2. Reintroduce:</b> test one FODMAP group at a time to find your triggers.</p>
  <p class="small" style="margin:4px 0"><b>3. Personalise:</b> bring back everything you tolerate and only limit your own triggers.</p>
  <p class="small muted" style="margin:8px 0 0">It isn’t meant to be followed strictly forever, variety is better for your gut bacteria. Do it with your doctor or an Accredited Practising Dietitian.</p></div>
  <a class="btn line full" href="#check">${ic("leaf")}Check a recipe for swaps</a>
  <p class="disc">General information, not medical advice. Check foods in the Monash University FODMAP app.</p></div>`;
}
function vCheck(){
  return `<a class="back" href="#more">${ic("back")}More</a>
  <div class="sec" style="padding-top:4px"><div class="sec-h"><h2>Recipe checker</h2></div>
  <label class="fl" for="chkText">Paste the ingredients</label><textarea id="chkText" style="min-height:200px" placeholder="1 onion, diced&#10;3 cloves garlic&#10;400 g can chickpeas">${esc(UI.chk||"")}</textarea>
  <button class="btn em full" style="margin-top:12px" data-a="runCheck">${ic("leaf")}Check for high FODMAP foods</button>
  <div id="chkOut" style="margin-top:16px">${UI.chk?checkResults(UI.chk):""}</div></div><div style="height:12px"></div>`;
}
function scanRecipe(r){
  const out=[];(r.ing||[]).forEach(i=>{if(i[0]==="#")return;const line=[i[0]!=null?fmtQ(i[0],i[1]):"",i[1],i[2]].join(" ").trim();scanLine(i[2]).forEach(x=>out.push({line,issue:x[0],swap:x[1]}))});
  return out;
}

/* ============ quantities ============ */
function fmtQ(q,u){
  if(q==null||isNaN(q))return "";
  if(u==="g"||u==="ml"){if(q>=1000&&u==="g")return +(q/1000).toFixed(2)+"";if(q>=50)return String(Math.round(q/5)*5);return String(Math.round(q))}
  if(u==="kg"||u==="L")return String(+q.toFixed(2));
  const w=Math.floor(q+1e-9),fr=q-w;
  const F=[[0,""],[.125,"⅛"],[.25,"¼"],[1/3,"⅓"],[.5,"½"],[2/3,"⅔"],[.75,"¾"],[1,""]];
  let best=F[0],bd=9;F.forEach(f=>{const d=Math.abs(fr-f[0]);if(d<bd){bd=d;best=f}});
  if(bd>0.06)return String(+q.toFixed(1));
  if(best[0]===1)return String(w+1);
  if(best[0]===0)return String(w||(q>0?"pinch":0));
  return (w?w:"")+best[1];
}
function unitLabel(u,q){
  if(u==="g"&&q>=1000)return "kg";
  if(u==="cup")return q>1?"cups":"cup";
  return u;
}
function qtyText(i,f){
  const q=i[0]==null?null:i[0]*f;
  if(q==null)return "";
  const u=i[1]||"";return (fmtQ(q,u)+" "+unitLabel(u,q)).trim();
}
function nkey(n){
  let k=String(n).toLowerCase().replace(/\(.*?\)/g,"").split(",")[0].replace(/\s+/g," ").trim();
  let prev;do{prev=k;k=k.replace(/^(fresh|large|small|medium|baby|extra-virgin|ripe|firm|cold|whole)\s+/,"")}while(k!==prev);
  return k;
}

/* ============ weeks ============ */
function monday(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
const pad=n=>String(n).padStart(2,"0");
function wkKey(d){const m=monday(d);return m.getFullYear()+"-"+pad(m.getMonth()+1)+"-"+pad(m.getDate())}
function wkDate(k){const [y,m,d]=k.split("-").map(Number);return new Date(y,m-1,d)}
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const dstr=d=>d.getDate()+" "+MON[d.getMonth()];
function curWk(){if(!UI.wk)UI.wk=wkKey(new Date());return UI.wk}
const todayIdx=()=>(new Date().getDay()+6)%7;
function weekPlan(k){return (S.plan[k]=S.plan[k]||{})}

/* ============ persistence ============ */
let saveT=null,saving=false,dirty=false,lastJSON="";
let localDirty=false;
function stable(o){if(Array.isArray(o))return "["+o.map(stable).join(",")+"]";if(o&&typeof o==="object")return "{"+Object.keys(o).sort().map(k=>JSON.stringify(k)+":"+stable(o[k])).join(",")+"}";return JSON.stringify(o)}
function save(){
  lsSet("yc-state",S);localDirty=true;
  if(!SB||!SESSION||!HH)return;
  clearTimeout(saveT);saveT=setTimeout(push,600);
}
async function push(){
  if(saving){dirty=true;return}
  saving=true;
  const body=JSON.parse(JSON.stringify(S));lastJSON=stable(body);
  try{const {error}=await SB.from("household_state").upsert({household_id:HH,state:body,updated_at:new Date().toISOString(),updated_by:UID});if(error)throw error}catch(e){sbErr(e)}
  saving=false;if(dirty){dirty=false;push()}else localDirty=false;
}
function writeErr(e){
  const c=e&&e.code;
  if(c==="invalid_argument"){canWrite=false;setSync("view");toast("You can view this, but changes won’t save, ask the owner to share it with you as an Editor.")}
  else if(c==="quota_exceeded")toast("Storage is full, delete a few photos or finds.");
  else if(c==="resource_exhausted")toast("Saving a bit too fast, try again in a moment.");
  else toast("Couldn’t save just now, it’ll keep working on this phone.");
}
function setSync(s){
  syncState=s;const el=$("#sync");if(!el)return;
  el.textContent={local:"",synced:"Synced",connecting:"Connecting…",slow:"Offline, will sync later"}[s]||"";
}
function stripPhotos(){ /* keep localStorage small */ }
function rerender(){
  const a=document.activeElement;
  if(a&&$("#app").contains(a)&&a.matches("input,textarea,select")){pendingRender=true;return}
  render();
}
let pendingRender=false;
document.addEventListener("focusout",()=>{if(pendingRender){setTimeout(()=>{const a=document.activeElement;if(!(a&&a.matches&&a.matches("input,textarea,select"))){pendingRender=false;render()}},50)}});

/* ============ Supabase ============ */
const SUPA_URL="https://vbtfjelvowmkjefkzvxi.supabase.co",SUPA_KEY="sb_publishable_lKAlO6TsW-VWo9NnfOloQg_qpMavF82";
let OFFICIAL={},SB=null,SESSION=null,PROFILE=null,HOUSE=null,HH=null,AUTHREADY=false,CHAN=null;
function sbErr(e){console.error(e);const m=(e&&e.message)||"";
  if(/JWT|session|auth/i.test(m)){toast("Please sign in again.");}
  else if(/row-level security|permission/i.test(m))toast("You don’t have permission to change that.");
  else toast("Couldn’t save just now, check your connection.");}
async function initDB(){
  if(!window.supabase){setSync("local");AUTHREADY=true;render();return}
  SB=window.supabase.createClient(SUPA_URL,SUPA_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const {data}=await SB.auth.getSession();SESSION=data.session;AUTHREADY=true;
  SB.auth.onAuthStateChange((ev,s)=>{const was=SESSION&&SESSION.user.id;SESSION=s;
    if(ev==="PASSWORD_RECOVERY"){go("reset-password");return}
    if(s&&s.user.id!==was)loadAll();else if(!s){teardown();render()}});
  if(SESSION)await loadAll();else render();
}
function teardown(){if(CHAN){SB.removeChannel(CHAN);CHAN=null}PROFILE=null;HOUSE=null;HH=null;FINDS=[];MY=[];RATINGS=[];PHOTOS={};IS_OWNER=false;
  S=JSON.parse(JSON.stringify(DEF));lastJSON="";localDirty=false;setSync("local")}
async function loadAll(){
  if(!SESSION)return;UID=SESSION.user.id;setSync("connecting");
  const {data:p,error}=await SB.from("profiles").select("id,display_name,household_id,accepted_terms").eq("id",UID).maybeSingle();
  if(error||!p){setSync("slow");render();return}
  PROFILE=p;HH=p.household_id;
  if(!HH){try{const {data:h}=await SB.rpc("leave_household");HH=h;PROFILE.household_id=h}catch(e){}}
  try{const {data:adm}=await SB.rpc("is_admin");IS_OWNER=!!adm}catch(e){IS_OWNER=false}
  if(!PROFILE.accepted_terms&&lsGet("yc-pending-terms",null)===TERMS_V){PROFILE.accepted_terms=TERMS_V;SB.from("profiles").update({accepted_terms:TERMS_V}).eq("id",UID).then(()=>{});lsSet("yc-pending-terms",null)}
  await Promise.all([loadHouse(),loadState(),loadFinds(),loadMy(),loadRatings(),loadPhotos()]);
  subscribe();setSync("synced");render();
}
async function loadHouse(){const {data}=await SB.from("households").select("id,name,invite_code").eq("id",HH).maybeSingle();HOUSE=data}
async function loadState(){
  const {data}=await SB.from("household_state").select("state").eq("household_id",HH).maybeSingle();
  const d=(data&&data.state)||{};lastJSON=stable(d);S=Object.assign(JSON.parse(JSON.stringify(DEF)),JSON.parse(JSON.stringify(d)));lsSet("yc-state",S);
}
async function loadFinds(){const {data}=await SB.from("finds").select("id,created_by,data,created_at").order("created_at",{ascending:false}).limit(500);
  FINDS=(data||[]).map(r=>Object.assign({},r.data,{id:r.id,by:r.created_by}))}
async function loadMy(){const {data}=await SB.from("my_recipes").select("id,created_by,data").eq("household_id",HH);
  MY=(data||[]).map(r=>Object.assign({},r.data,{id:r.id,by:r.created_by}))}
async function loadRatings(){const {data}=await SB.from("ratings").select("item,user_id,stars").limit(5000);
  RATINGS=(data||[]).map(r=>({item:r.item,uid:r.user_id,stars:r.stars}))}
async function loadPhotos(){const [{data},{data:off}]=await Promise.all([SB.from("household_photos").select("recipe_id,url").eq("household_id",HH),SB.from("recipe_photos").select("recipe_id,url")]);
  const p={};(data||[]).forEach(r=>p[r.recipe_id]=r.url);PHOTOS=p;const o={};(off||[]).forEach(r=>o[r.recipe_id]=r.url);OFFICIAL=o}
function subscribe(){
  if(CHAN)SB.removeChannel(CHAN);
  const re=(fn)=>async()=>{await fn();rerender()};
  CHAN=SB.channel("yc-"+HH)
   .on("postgres_changes",{event:"*",schema:"public",table:"household_state",filter:"household_id=eq."+HH},pl=>{
      if(localDirty||saving)return;const d=(pl.new&&pl.new.state)||{};const j=stable(d);
      if(j!==lastJSON){lastJSON=j;S=Object.assign(JSON.parse(JSON.stringify(DEF)),JSON.parse(JSON.stringify(d)));lsSet("yc-state",S);rerender()}})
   .on("postgres_changes",{event:"*",schema:"public",table:"finds"},re(loadFinds))
   .on("postgres_changes",{event:"*",schema:"public",table:"my_recipes",filter:"household_id=eq."+HH},re(loadMy))
   .on("postgres_changes",{event:"*",schema:"public",table:"ratings"},re(loadRatings))
   .on("postgres_changes",{event:"*",schema:"public",table:"household_photos",filter:"household_id=eq."+HH},re(loadPhotos))
   .on("postgres_changes",{event:"*",schema:"public",table:"recipe_photos"},re(loadPhotos))
   .subscribe(st=>{if(st==="SUBSCRIBED")setSync("synced");else if(st==="CHANNEL_ERROR"||st==="TIMED_OUT")setSync("slow")});
}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&SESSION&&HH&&!localDirty){Promise.all([loadState(),loadFinds(),loadMy(),loadRatings(),loadPhotos()]).then(rerender)}});
async function putDoc(col,id,obj){
  if(!SB||!SESSION)return false;
  try{
    if(col==="finds"){const data=Object.assign({},obj);delete data.by;delete data.id;
      const exists=FINDS.some(f=>f.id===id&&f.by);
      const q=exists?SB.from("finds").update({data,updated_at:new Date().toISOString()}).eq("id",id):SB.from("finds").insert({id,data});
      const {error}=await q;if(error)throw error;return true}
    if(col==="myrecipes"){const data=Object.assign({},obj);delete data.by;delete data.id;
      const exists=MY.some(m=>m.id===id&&m.by);
      const q=exists?SB.from("my_recipes").update({data,updated_at:new Date().toISOString()}).eq("id",id):SB.from("my_recipes").insert({id,household_id:HH,data});
      const {error}=await q;if(error)throw error;return true}
  }catch(e){sbErr(e);return false}
  return false;
}
async function delDoc(col,id){
  if(!SB||!SESSION)return false;
  try{const t={finds:"finds",myrecipes:"my_recipes"}[col];const {error}=await SB.from(t).delete().eq("id",id);if(error)throw error;return true}
  catch(e){sbErr(e);return false}
}
function dataUrlToBlob(d){const [h,b]=d.split(",");const bin=atob(b);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return new Blob([u],{type:(h.match(/data:([^;]+)/)||[])[1]||"image/jpeg"})}
async function uploadPhoto(dataUrl,name){
  const path=UID+"/"+name.replace(/[^a-z0-9_-]/gi,"_")+"-"+Date.now()+".jpg";
  const {error}=await SB.storage.from("photos").upload(path,dataUrlToBlob(dataUrl),{contentType:"image/jpeg",upsert:false});
  if(error)throw error;return SB.storage.from("photos").getPublicUrl(path).data.publicUrl;
}

/* ============ toast / modal ============ */
let toastT;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("on"),2800)}
function openModal(title,body){
  $("#modal").innerHTML=`<div class="modal" data-a="modalBg"><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="sh"><h2>${esc(title)}</h2><button class="xbtn" data-a="closeModal" aria-label="Close">${ic("x")}</button></div><div id="mbody">${body}</div></div></div>`;
  document.body.style.overflow="hidden";
  const f=$("#mbody input");if(f&&f.type!=="file")setTimeout(()=>{},0);
}
function closeModal(){$("#modal").innerHTML="";document.body.style.overflow=""}

async function copyText(t){
  try{await navigator.clipboard.writeText(t);toast("Copied, paste it into a message");}
  catch(e){openModal("Copy this list",`<textarea style="min-height:280px" readonly>${esc(t)}</textarea><p class="hint">Press and hold in the box, Select all, then Copy.</p>`)}
}

/* ============ store links ============ */
const STORES={coles:["Coles",q=>"https://www.coles.com.au/search/products?q="+encodeURIComponent(q)],
  woolworths:["Woolworths",q=>"https://www.woolworths.com.au/shop/search/products?searchTerm="+encodeURIComponent(q)],
  aldi:["ALDI",q=>"https://www.google.com/search?q="+encodeURIComponent("site:aldi.com.au "+q)]};
const SPECIALS={coles:"https://www.coles.com.au/on-special",woolworths:"https://www.woolworths.com.au/shop/browse/specials",aldi:"https://www.google.com/search?q="+encodeURIComponent("ALDI Australia this week's specials catalogue")};
function shopQuery(name){return nkey(name).replace(/\b(chopped|grated|sliced|diced|drained|rinsed|peeled|cubed|torn|halved|thinly|finely|toasted|crumbled)\b/g,"").replace(/\s+/g," ").trim()}

/* ============ shopping aggregation ============ */
function weekItems(k){
  const plan=weekPlan(k),items={},make={};
  Object.keys(plan).forEach(slot=>{
    const sl=plan[slot];if(!sl||!sl.id)return;const r=getR(sl.id);if(!r)return;
    const f=r.batch?1:(sl.s||S.people)/r.serves;
    (r.ing||[]).forEach(i=>{
      if(i[0]==="#"||i[3]==="water")return;
      if(i[6]){make[i[6]]=true;return}
      const key=nkey(i[2]);if(!key)return;
      const it=items[key]||(items[key]={key,name:i[2],cat:i[3]||"other",parts:{},from:new Set(),plants:i[4]});
      const u=i[1]||"";
      if(i[0]!=null)it.parts[u]=(it.parts[u]||0)+i[0]*f;else it.parts["?"]=1;
      it.from.add(r.name.replace(/^Chef’s /,""));
    });
  });
  (S.extras[k]||[]).forEach(x=>{items["x:"+x.id]={key:"x:"+x.id,name:x.name,cat:x.cat||"other",parts:{},from:new Set(["Added by you"]),extra:x.id}});
  return {items:Object.values(items),make:Object.keys(make)};
}
function partsText(p){
  return Object.keys(p).filter(u=>u!=="?").map(u=>(fmtQ(p[u],u)+" "+unitLabel(u,p[u])).trim()).join(" + ");
}
const isHave=k=>S.pantry[k]==="have";
function needCount(){const {items}=weekItems(curWk());return items.filter(i=>!isHave(i.key)&&!(S.bought[curWk()]||{})[i.key]).length}

/* ============ plants ============ */
function weekPlants(k){
  const big=new Set(),small=new Set();const plan=weekPlan(k);
  Object.values(plan).forEach(sl=>{if(!sl||!sl.id)return;const r=getR(sl.id);if(!r)return;const p=plantsOf(r);p.big.forEach(x=>big.add(x));p.small.forEach(x=>small.add(x))});
  return {big,small,score:big.size+small.size/4};
}
function ring(score){
  const pct=Math.min(1,score/30),R=40,C=2*Math.PI*R;
  return `<svg width="104" height="104" viewBox="0 0 104 104" role="img" aria-label="${Math.floor(score)} of 30 plants planned"><circle cx="52" cy="52" r="${R}" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="11"/><circle cx="52" cy="52" r="${R}" fill="none" stroke="#fff" stroke-width="11" stroke-dasharray="${C*pct} ${C}" transform="rotate(-90 52 52)"/><text x="52" y="52" text-anchor="middle" fill="#fff" font-family="DM Serif Display,Georgia,serif" font-size="27">${Math.floor(score)}</text><text x="52" y="70" text-anchor="middle" fill="#fff" font-family="Inter,sans-serif" font-size="11" font-weight="600">of 30</text></svg>`;
}

/* ============ router ============ */
function route(){return (location.hash||"#home").slice(1)||"home"}
function go(h){if(location.hash==="#"+h)render();else location.hash=h}
window.addEventListener("hashchange",()=>{closeModal();render();window.scrollTo(0,0)});

function renderTabs(){
  const r=route();
  const on=t=>(r===t||(t==="recipes"&&/^recipe-/.test(r))||(t==="more"&&/^(finds|my|add-recipe|edit-|prefs|daily|check|terms|fodmap)/.test(r)))?" on":"";
  const n=needCount();
  $("#tabs").innerHTML=[["home","Home","home"],["recipes","Recipes","book"],["planner","Planner","cal"],["shopping","Shopping","cart"],["more","More","dots"]].map(([k,l,i])=>`<button class="${on(k)}" data-a="go" data-h="${k}" ${on(k)?'aria-current="page"':""}>${ic(i)}<span>${l}</span>${k==="shopping"&&n?`<span class="badge">${n}</span>`:""}</button>`).join("");
}

function render(){
  const r=route();let h="";
  document.body.classList.toggle("noauth",!SESSION);
  if(!AUTHREADY){$("#app").innerHTML=`<div class="empty-st">Loading…</div>`;return}
  if(r==="terms"&&!SESSION){$("#app").innerHTML=vTerms();renderTabs();return}
  if(r==="reset-password"&&SESSION){$("#app").innerHTML=vResetPw();return}
  if(!SESSION){$("#app").innerHTML=vAuth();$("#tabs").innerHTML="";return}
  if(!PROFILE){$("#app").innerHTML=`<div class="empty-st">Loading your kitchen…</div>`;return}
  try{
    if(r==="home")h=vHome();
    else if(r==="recipes"||r==="favourites"){if(r==="favourites")UI.chip="fav";h=vRecipes()}
    else if(/^recipe-/.test(r))h=vRecipe(r.slice(7));
    else if(r==="planner")h=vPlanner();
    else if(r==="shopping")h=vShopping();
    else if(r==="more")h=vMore();
    else if(r==="finds")h=vFinds();
    else if(r==="my")h=vMy();
    else if(r==="add-recipe")h=vForm(null);
    else if(/^edit-/.test(r))h=vForm(r.slice(5));
    else if(r==="daily")h=vDaily();
    else if(r==="check")h=vCheck();
    else if(r==="fodmap")h=vFodmap();
    else if(r==="terms")h=vTerms();
    else if(r==="prefs")h=vPrefs();
    else h=vHome();
  }catch(e){console.error(e);h=`<div class="empty-st">Something went wrong showing this page. <a href="#home">Go home</a></div>`}
  $("#app").innerHTML=h;renderTabs();
  if(r!=="terms"&&!$("#modal").innerHTML)termsGate();
}

/* ============ views ============ */
function kcalOf(r){if(!r||r.cat==="broth"||r.id==="sourdough-starter")return 0;return (window.YC_KCAL||{})[r.id]||0}
function rCard(r){
  const p=plantsOf(r);
  return `<a class="rcard" href="#recipe-${esc(r.id)}">${cover(r)}<div class="meta"><h3>${esc(r.name)}</h3><div class="sub">${r.prep+r.cook?fmtTime(r.prep+r.cook)+" · ":""}Serves ${r.serves}${p.big.size?" · "+p.big.size+" plant"+(p.big.size>1?"s":""):""}${kcalOf(r)?" · ≈"+kcalOf(r)+" cal":""}</div><span class="tag ${r.diet}">${DIETN[r.diet]||""}</span>${S.favs[r.id]?`<span class="tag">♥ Saved</span>`:""}${starsView(r.id)}</div></a>`;
}
function fmtTime(m){if(!m)return "";if(m<60)return m+" min";if(m>=1440&&m%1440===0){const d=m/1440;return d+(d>1?" days":" day")}const h=Math.floor(m/60),mm=m%60;return h+" hr"+(mm?" "+mm+" min":"")}

function vHome(){
  const k=wkKey(new Date()),di=todayIdx(),plan=weekPlan(k);
  const hr=new Date().getHours();const greet=hr<12?"Good morning":hr<17?"Good afternoon":"Good evening";
  const today=SLOTS.map(([s,l])=>{
    const sl=plan[di+s];const r=sl&&sl.id?getR(sl.id):null;
    if(r)return `<button class="tslot" data-a="go" data-h="recipe-${esc(r.id)}">${cover(r,false,true)}<div class="t"><div class="k">${l}</div><div class="n">${esc(r.name.replace(/^Chef’s /,""))}</div></div></button>`;
    if(sl&&sl.t)return `<button class="tslot" data-a="go" data-h="planner"><div class="cover" style="background:var(--soft)"></div><div class="t"><div class="k">${l}</div><div class="n">${esc(sl.t)}</div></div></button>`;
    return `<button class="tslot empty" data-a="pickSlot" data-wk="${k}" data-slot="${di+s}"><div class="cover"></div><div class="t"><div class="k">${l}</div><div class="n" style="color:var(--bl)">Plan it</div></div></button>`;
  }).join("");
  const pl=weekPlants(k);
  const allBig=new Set();BUILT.forEach(r=>plantsOf(r).big.forEach(x=>allBig.add(x)));
  const tryNext=[...allBig].filter(x=>!pl.big.has(x)).slice(0,4);
  const {make}=weekItems(k);
  const finds=FINDS.slice().sort((a,b)=>(b.t||0)-(a.t||0)).slice(0,2);
  return `
  <section class="hero"><div class="a"><span class="small" style="opacity:.85">${greet}</span><h1>Feed your gut &amp; feel good</h1><p>Low FODMAP cooking made easy.</p></div><div class="b" aria-hidden="true"><i class="x1"></i><i class="x2"></i><i class="x3"></i></div></section>
  <div class="sec"><div class="sec-h"><h2>Today’s meals</h2><a href="#planner">Planner</a></div></div>
  <div class="today">${today}</div>
  <div class="sec"><div class="sec-h"><h2>Your gut garden</h2><a href="#planner">This week</a></div></div>
  <div class="garden">${ring(pl.score)}<div><h3>${pl.big.size} plants + ${pl.small.size} herbs &amp; spices</h3><div class="small" style="opacity:.9">planned this week</div>${tryNext.length?`<div class="plants"><span style="background:none;padding-left:0">Try next:</span>${tryNext.map(x=>`<span>${esc(plantName(x))}</span>`).join("")}</div>`:""}</div></div>
  ${todaysTip()?`<div class="sec"><div class="sec-h"><h2>Today’s tip</h2><a href="#daily">All tips</a></div></div><div style="padding:0 18px">${tipCard(todaysTip())}</div>`:""}
  <div class="sec"><div class="sec-h"><h2>Quick actions</h2></div></div>
  <div class="qa">
    <button style="background:var(--bl)" data-a="go" data-h="planner">${ic("cal")}Plan my week</button>
    <button style="background:var(--em)" data-a="go" data-h="shopping">${ic("cart")}My shopping list</button>
    <button style="background:var(--tq)" data-a="go" data-h="recipes">${ic("book")}Browse recipes</button>
    <button style="background:var(--ch)" data-a="cookToday">${ic("play")}Cook with me</button>
  </div>
  ${make.length?`<div class="mk"><b>Prep day this week:</b> make ${make.map(id=>{const r=getR(id);return r?`<a href="#recipe-${id}">${esc(r.name)}</a>`:""}).join(", ")} first, your planned meals use ${make.length>1?"them":"it"}.</div>`:""}
  ${finds.length?`<div class="sec"><div class="sec-h"><h2>Community finds</h2><a href="#finds">See all</a></div></div><div class="grid">${finds.map(fCard).join("")}</div>`:""}
  <p class="disc">Low FODMAP serves are based on published Monash University and FODMAP Friendly data. Everyone’s tolerance is different, check the Monash FODMAP app and your dietitian.</p>`;
}

const CHIPS=[["all","All"],["fav","Saved"],["hotpot","Hot pots"],["breakfast","Breakfast"],["ramen","Ramen & noodle soups"],["oats","Overnight oats"],["broth","Broths & bases"],["dinner","Dinners"],["side","Lunch & sides"],["sandwich","Wraps, burgers & sandwiches"],["quick","Quick (under 20 min)"],["baking","Baking & treats"],["mine","My recipes"],["veg","Vegetarian"],["vegan","Vegan"],["pesc","Pescatarian"]];
const NOODLE_SOUPS=["red-curry-wonton-soup","taiwanese-beef-noodle-soup","danzai-noodles","laksa-noodle-bowl","chicken-coconut-soup"];
const TREATS=["fruit-nut-bark","strawberry-cheesecake-ice-cream","tofu-chocolate-mousse","choc-pb-energy-bites"];
function rcats(r){
  const c=new Set([r.cat]);const m=r.meals||[];const n=(r.name||"").toLowerCase();
  if(m.includes("B")&&!["sourdough-starter","spelt-sourdough","strawberry-cheesecake-ice-cream"].includes(r.id))c.add("breakfast");
  if(m.includes("L")&&r.cat!=="baking"&&r.cat!=="broth")c.add("side");
  if(m.includes("D")&&!["oats","baking","broth"].includes(r.cat))c.add("dinner");
  if(/burger|wrap|lettuce|san choy|sandwich|toastie|\bsubs?\b|banh mi|quesadilla|pocket|melt\b|blat/.test(n))c.add("sandwich");
  if(NOODLE_SOUPS.includes(r.id))c.add("ramen");
  if(TREATS.includes(r.id))c.add("baking");
  return c;
}
function matchChip(r,c){
  if(c==="all")return true;if(c==="fav")return !!S.favs[r.id];if(c==="cara")return r.by==="cara";if(c==="mine")return !!r.mine;if(c==="quick")return (+r.prep||0)+(+r.cook||0)<=20&&(r.steps||[]).reduce((t,s)=>t+(+s[1]||0),0)<=30&&r.cat!=="broth";
  if(c==="veg")return r.diet==="veg"||r.diet==="vegan";if(c==="vegan")return r.diet==="vegan";if(c==="pesc")return r.diet==="pesc";
  return rcats(r).has(c);
}
function recipeList(){
  const q=UI.q.trim().toLowerCase();
  const list=allRecipes().filter(r=>matchChip(r,UI.chip)&&(!q||(r.name+" "+(r.ing||[]).map(i=>i[2]).join(" ")).toLowerCase().includes(q)));
  return list.length?`<div class="grid">${list.map(rCard).join("")}</div>`:`<div class="empty-st">${UI.chip==="fav"?"Tap the heart on a recipe to save it here.":UI.chip==="mine"?`No recipes of your own yet.<br><br><a class="btn" href="#add-recipe">${ic("plus")}Add a recipe</a>`:"No recipes match that search."}</div>`;
}
function vRecipes(){
  return `<div class="sec" style="padding-bottom:10px"><div class="sec-h"><h2>Recipes</h2><a href="#add-recipe">+ Add yours</a></div></div>
  <div class="search">${ic("search")}<input type="search" placeholder="Search recipes or ingredients" value="${esc(UI.q)}" data-in="q" aria-label="Search recipes"></div>
  <div class="chips" role="group" aria-label="Filter recipes">${CHIPS.map(([k,l])=>`<button class="chip${UI.chip===k?" on":""}" data-a="chip" data-k="${k}" aria-pressed="${UI.chip===k}">${l}</button>`).join("")}</div>
  <div id="rlist">${recipeList()}</div><div style="height:10px"></div>`;
}

function getServ(r){return UI.serv[r.id]||(r.batch?r.serves:Math.min(r.serves,Math.max(1,S.people))) }
function vRecipe(id){
  const r=getR(id);if(!r)return `<a class="back" href="#recipes">${ic("back")}Back to recipes</a><div class="empty-st">Recipe not found.</div>`;
  const sv=getServ(r),f=sv/r.serves,pl=plantsOf(r),al=allergensOf(r);
  const needList=[];
  const ingHtml=(r.ing||[]).map(i=>{
    if(i[0]==="#")return `<li class="h">${esc(i[1])}</li>`;
    const k=nkey(i[2]),have=isHave(k),water=i[3]==="water";
    if(!have&&!water&&!i[6])needList.push(i[2]);
    const q=qtyText(i,f);
    return `<li class="${have?"have":""}"><div class="nm">${q?`<span class="q">${esc(q)}</span> `:""}${esc(i[2])}${i[5]?`<span class="nt">${esc(i[5])}</span>`:""}${i[6]?`<a class="ref" href="#recipe-${esc(i[6])}">See the recipe →</a>`:""}</div>${water?"":`<span class="seg" role="group" aria-label="${esc(i[2])}"><button class="${have?"on h":""}" data-a="pantry" data-k="${esc(k)}" data-v="have" aria-pressed="${have}">Have</button><button class="${!have?"on n":""}" data-a="pantry" data-k="${esc(k)}" data-v="need" aria-pressed="${!have}">Need</button></span>`}</li>`;
  }).join("");
  let n=0;
  const stepHtml=(r.steps||[]).map(s=>s[0]==="#"?`<li class="h">${esc(s[1])}</li>`:`<li><div>${esc(s[0])}${s[1]?`<div class="tm">${ic("timer")}${fmtTime(s[1])} timer</div>`:""}</div></li>`).join("");
  const flags=r.mine?scanRecipe(r):[];
  const ingOpts=(r.ing||[]).filter(i=>i[0]!=="#"&&i[3]!=="water"&&!i[6]);
  const firstQ=ingOpts.length?shopQuery(ingOpts.find(i=>!isHave(nkey(i[2])))?.[2]||ingOpts[0][2]):"";
  const hc=["","c1","c2"][pal(r.id).indexOf("#0648A1")===0?1:pal(r.id)[0]==="#202020"?2:0];
  return `<a class="back" href="#recipes">${ic("back")}Back to recipes</a>
  ${r.ai?`<div class="warnbox" role="note" style="margin:0 18px 12px">${ic("info")}<div><b>Converted to low FODMAP automatically.</b> It may contain mistakes. Check every ingredient and serving size against the <a href="https://www.monashfodmap.com/" target="_blank" rel="noopener">Monash University FODMAP app</a> before cooking.</div></div>`:""}
  <div style="position:relative">${cover(r,true)}${canPhoto(r)?`<span class="btn sm white photo-btn fileov">${ic("camera")}${photoOf(r.id)?"Change photo":"Add photo"}<input type="file" accept="image/*" data-photo="${esc(r.id)}" aria-label="Add photo"></span>`:""}</div>
  <div class="rhead ${hc}"><span class="kicker">${esc(CATN[r.cat]||"Recipe")}</span>
  <h1>${esc(r.name)}</h1>${r.desc?`<p>${esc(r.desc)}</p>`:""}
  <div class="stats">${r.prep?`<span>${ic("clock")}Prep ${fmtTime(r.prep)}</span>`:""}${r.cook?`<span>${ic("pot")}Cook ${fmtTime(r.cook)}</span>`:""}<span>${ic("users")}Serves ${r.serves}</span>${kcalOf(r)?`<span title="Estimated from the ingredients">≈ ${kcalOf(r)} cal per serve</span>`:""}${pl.big.size?`<span>${ic("leaf")}${pl.big.size} plant${pl.big.size>1?"s":""}${pl.small.size?" + "+pl.small.size+" herbs/spices":""}</span>`:""}</div>
  <div class="row" style="margin-bottom:12px"><span class="tag ${r.diet}" style="margin:0">${DIETN[r.diet]||""}</span><span class="tag f-${r.freq.split(" ")[0]}" style="margin:0">${esc(r.freq)}</span></div>
  ${r.steps&&r.steps.length?`<button class="btn cookbtn" data-a="cook" data-id="${esc(r.id)}">${ic("play")}Cook with me</button>`:""}
  <div class="row" style="margin-top:10px"><button class="btn white" style="flex:1" data-a="addPlan" data-id="${esc(r.id)}">${ic("cal")}Add to planner</button><button class="btn ${S.favs[r.id]?"white":"lineW"}" data-a="fav" data-id="${esc(r.id)}" aria-pressed="${!!S.favs[r.id]}" aria-label="${S.favs[r.id]?"Saved, tap to remove":"Save to favourites"}" style="width:56px;padding:0">${ic("heart")}</button></div>
  ${r.url?`<a class="btn lineW full" style="margin-top:10px" href="${esc(r.url)}" target="_blank" rel="noopener">${ic("link")}Original recipe</a>`:""}
  </div>
  <div class="scaler"><div><b>Servings</b></div><div class="stepper"><button data-a="serv" data-id="${esc(r.id)}" data-d="-1" aria-label="Fewer servings">−</button><output aria-live="polite">${sv}</output><button data-a="serv" data-id="${esc(r.id)}" data-d="1" aria-label="More servings">+</button></div></div>
  <div class="scaler"><div><b>Your rating</b><div>${starsView(r.id)||'<span class="small muted">Not rated yet</span>'}</div></div>${starsInput(r.id)}</div>
  <div class="panel white"><h3>${ic("cart")}Ingredients &amp; shopping list</h3>
  <ul class="ilist">${ingHtml||'<li>No ingredients yet.</li>'}</ul>
  <div class="row" style="margin-top:12px"><button class="btn sm line" data-a="copyNeeds" data-id="${esc(r.id)}">${ic("copy")}Copy what I need (${needList.length})</button></div></div>
  ${r.ai&&r.fod?`<div class="panel tq"><h3>${ic("leaf")}Why it’s low FODMAP</h3><p class="small">${esc(r.fod)}</p>${r.swaps?`<p class="small"><b>Tips:</b> ${esc(r.swaps)}</p>`:""}</div>`:""}
  ${flags.length?`<div class="panel warn"><h3>${ic("info")}Low FODMAP check</h3><p class="small">These ingredients may be high FODMAP. Suggested swaps:</p>${flags.map(x=>`<div class="flag"><b>${esc(x.line)}</b>${esc(x.issue)} <span class="muted">→ ${esc(x.swap)}</span></div>`).join("")}</div>`:(r.mine?`<div class="panel tq"><h3>${ic("check")}Low FODMAP check</h3><p class="small">No common high FODMAP ingredients spotted. Still check sauce and stock labels.</p></div>`:"")}
  <div class="panel white"><h3>${ic("pot")}Method</h3><ol class="steps">${stepHtml||"<li>No steps yet.</li>"}</ol>
  ${r.steps&&r.steps.length?`<button class="btn em full" style="margin-top:12px" data-a="cook" data-id="${esc(r.id)}">${ic("play")}Start Cook with me</button>`:""}</div>
  ${r.fod?`<div class="panel em"><h3>${ic("leaf")}Low FODMAP notes</h3>${r.fod?`<p>${esc(r.fod)}</p>`:""}</div>`:""}
  <div class="panel white"><dl>
    ${r.equip?`<div><dt>Equipment</dt><dd>${esc(r.equip.split(/,\s*/).join(" · "))}</dd></div>`:""}
    ${r.store?`<div><dt>Storage &amp; reheating</dt><dd>${esc(r.store)}</dd></div>`:""}
    <div><dt>Allergen check</dt><dd>${al.length?"Contains: "+esc(al.join(", "))+". ":"No common allergens spotted. "}Always check product labels.</dd></div>
    ${r.swaps?`<div><dt>Low FODMAP swaps &amp; tips</dt><dd>${esc(r.swaps)}</dd></div>`:""}
    <div><dt>How often</dt><dd>${r.freq==="Daily"?"Daily, balanced and nourishing, great any day.":r.freq==="Weekly"?"Weekly, richer or less complete; lovely as part of a varied week.":"Once in a while, a treat. Enjoy it!"}</dd></div>
  </dl></div>
  ${ingOpts.length?`<div class="panel tq"><h3>${ic("tag")}Find a supermarket special</h3>
  <select data-in="shopq" aria-label="Ingredient to search">${ingOpts.map(i=>{const q=shopQuery(i[2]);return `<option value="${esc(q)}" ${q===firstQ?"selected":""}>${esc(i[2])}${isHave(nkey(i[2]))?" (have)":""}</option>`}).join("")}</select>
  <div class="storebtns" id="storebtns">${storeBtns(firstQ)}</div></div>`:""}
  ${r.mine&&canEditMy(r.raw)?`<div class="row" style="padding:16px 18px 0"><a class="btn line" href="#edit-${esc(r.id)}">${ic("edit")}Edit recipe</a><button class="btn line" data-a="delMy" data-id="${esc(r.id)}">${ic("trash")}Delete</button></div>`:""}
  `;
}
function storeBtns(q){
  const order=[S.store].concat(["coles","woolworths","aldi"].filter(s=>s!==S.store));
  return order.map((s,i)=>`<a class="btn sm ${i===0?"":"line"}" href="${esc(STORES[s][1](q))}" target="_blank" rel="noopener">Search ${STORES[s][0]}</a>`).join("");
}

/* ----- planner ----- */
function slotThumb(r){return `<span class="th">${cover(r,false,true)}</span>`}
function vPlanner(){
  const k=curWk(),start=wkDate(k),end=addDays(start,6),plan=weekPlan(k),tk=wkKey(new Date()),ti=todayIdx();
  const pl=weekPlants(k);
  const count=Object.values(plan).filter(x=>x&&(x.id||x.t)).length;
  const days=DAYS.map((d,di)=>{
    const date=addDays(start,di);const isT=k===tk&&di===ti;
    return `<div class="day${isT?" is-today":""}"><div class="dh"><b>${d}</b><span>${isT?"Today · ":""}${dstr(date)}</span></div>${SLOTS.map(([s,l])=>{
      const sl=plan[di+s];const r=sl&&sl.id?getR(sl.id):null;
      if(r)return `<button class="slot" data-a="pickSlot" data-wk="${k}" data-slot="${di+s}">${slotThumb(r)}<span><span class="k">${l}</span><br><span class="n">${esc(r.name)}</span></span><span class="sv">${r.batch?"batch":"× "+(sl.s||S.people)}</span></button>`;
      if(sl&&sl.t)return `<button class="slot" data-a="pickSlot" data-wk="${k}" data-slot="${di+s}"><span class="th" style="background:var(--soft)"></span><span><span class="k">${l}</span><br><span class="n">${esc(sl.t)}</span></span></button>`;
      return `<button class="slot empty" data-a="pickSlot" data-wk="${k}" data-slot="${di+s}"><span class="th">${ic("plus")}</span><span><span class="k">${l}</span><br><span class="n">Add ${l.toLowerCase()}</span></span></button>`;
    }).join("")}</div>`;
  }).join("");
  const prevK=wkKey(addDays(start,-7));const hasPrev=Object.keys(S.plan[prevK]||{}).length>0;
  return `<div class="sec" style="padding-bottom:8px"><div class="sec-h"><h2>Weekly planner</h2></div></div>
  <div class="wknav"><button data-a="wk" data-d="-7" aria-label="Previous week">${ic("back")}</button><div class="lbl">${dstr(start)} – ${dstr(end)}<small>${k===tk?"This week":k>tk?"Upcoming":"Past week"} · ${count} meals planned</small></div><button data-a="wk" data-d="7" aria-label="Next week">${ic("fwd")}</button></div>
  <div class="garden" style="margin-bottom:14px">${ring(pl.score)}<div><h3>${pl.big.size} plants this week</h3><div class="small" style="opacity:.9">+ ${pl.small.size} herbs &amp; spices</div></div></div>
  <div class="planbar"><button class="btn em" style="flex:1" data-a="go" data-h="shopping">${ic("cart")}Shopping list</button>${!count&&hasPrev?`<button class="btn line" data-a="copyWeek">${ic("copy")}Copy last week</button>`:""}${count?`<button class="btn line" data-a="clearWeek" id="clearWk">${ic("trash")}Clear week</button>`:""}</div>
  ${days}`;
}
function pickerBody(k,slot){
  const sl=weekPlan(k)[slot]||{};const s=slot.slice(-1);
  if(UI.pickChip===null)UI.pickChip="all";
  const sName=SLOTS.find(x=>x[0]===s)[1];
  const pc=[["all","All recipes"],["breakfast","Breakfast"],["hotpot","Hot pots"],["ramen","Noodle soups"],["oats","Oats"],["dinner","Dinners"],["side","Lunch & sides"],["sandwich","Wraps, burgers & sandwiches"],["quick","Quick"],["baking","Baking"],["broth","Broths"],["mine","Mine"],["fav","Saved"]];
  const q=UI.pickQ.toLowerCase();
  const list=allRecipes().filter(r=>(q?true:(UI.pickChip==="suggest"?(r.meals||[]).includes(s):matchChip(r,UI.pickChip)))&&(!q||r.name.toLowerCase().includes(q)));
  const serv=sl.s||S.people;
  return `<div class="stepper" style="display:flex;justify-content:space-between;padding-left:12px;margin-bottom:10px;background:#fff"><span style="font-weight:600">Servings for this meal</span><span style="display:flex;align-items:center"><button data-a="pickServ" data-d="-1" data-wk="${k}" data-slot="${slot}" aria-label="Fewer">−</button><output id="pserv">${serv}</output><button data-a="pickServ" data-d="1" data-wk="${k}" data-slot="${slot}" aria-label="More">+</button></span></div>
  <input type="search" placeholder="Search all recipes (e.g. chow mein)" value="${esc(UI.pickQ)}" data-in="pickq" data-wk="${k}" data-slot="${slot}" aria-label="Search recipes">
  <div class="chips" style="padding:10px 0">${pc.map(([c,l])=>`<button class="chip${UI.pickChip===c?" on":""}" data-a="pickChip" data-k="${c}" data-wk="${k}" data-slot="${slot}">${l}</button>`).join("")}</div>
  <div id="picklist">${list.map(r=>`<button class="pick" data-a="setSlot" data-wk="${k}" data-slot="${slot}" data-id="${esc(r.id)}"><span class="th">${cover(r,false,true)}</span><span><b>${esc(r.name)}</b><span>${esc(CATN[r.cat]||"")} · ${DIETN[r.diet]||""}</span></span></button>`).join("")||'<p class="muted">Nothing matches.</p>'}</div>
  <label class="fl" for="custom">Or type a meal (leftovers, eating out…)</label>
  <div class="row" style="flex-wrap:nowrap"><input type="text" id="custom" placeholder="e.g. Leftover chow mein" value="${esc(sl.t||"")}"><button class="btn" data-a="setCustom" data-wk="${k}" data-slot="${slot}">Add</button></div>
  ${sl.id||sl.t?`<button class="btn line full" style="margin-top:14px" data-a="clearSlot" data-wk="${k}" data-slot="${slot}">${ic("trash")}Clear this meal</button>`:""}`;
}
function openPicker(k,slot){
  UI.pickQ="";UI.pickChip=null;
  const di=+slot[0],s=slot.slice(-1);
  openModal(`${DAYS[di]} · ${SLOTS.find(x=>x[0]===s)[1]}`,pickerBody(k,slot));
}

/* add-to-planner from a recipe */
function openAddPlan(id){
  const r=getR(id);if(!r)return;
  UI.ap={id,wk:curWk(),d:todayIdx(),s:(r.meals&&r.meals[0])||"D"};
  apRender();
}
function apRender(){
  const a=UI.ap,r=getR(a.id),start=wkDate(a.wk);
  const tk=wkKey(new Date());
  openModal("Add to planner",`<p style="margin:0 0 12px"><b>${esc(r.name)}</b></p>
  <div class="wknav" style="padding:0 0 12px"><button data-a="apWk" data-d="-7" aria-label="Previous week">${ic("back")}</button><div class="lbl">${dstr(start)} – ${dstr(addDays(start,6))}<small>${a.wk===tk?"This week":a.wk>tk?"Upcoming":"Past"}</small></div><button data-a="apWk" data-d="7" aria-label="Next week">${ic("fwd")}</button></div>
  <div class="daypick" role="group" aria-label="Day">${DAYS.map((d,i)=>`<button class="${a.d===i?"on":""}" data-a="apDay" data-i="${i}" aria-pressed="${a.d===i}">${d.slice(0,3)}<br><small>${addDays(start,i).getDate()}</small></button>`).join("")}</div>
  <div class="slotpick" style="margin-top:10px" role="group" aria-label="Meal">${SLOTS.map(([s,l])=>`<button class="${a.s===s?"on":""}" data-a="apSlot" data-s="${s}" aria-pressed="${a.s===s}">${l}</button>`).join("")}</div>
  ${(()=>{const cur=weekPlan(a.wk)[a.d+a.s];const cr=cur&&cur.id?getR(cur.id):null;return cr||cur&&cur.t?`<p class="hint">This replaces: ${esc(cr?cr.name:cur.t)}</p>`:""})()}
  <button class="btn em full" style="margin-top:16px" data-a="apSave">${ic("check")}Add to ${DAYS[a.d]} ${SLOTS.find(x=>x[0]===a.s)[1].toLowerCase()}</button>`);
}

/* ----- shopping ----- */
function vShopping(){
  const k=curWk(),start=wkDate(k),tk=wkKey(new Date());
  const {items,make}=weekItems(k);const bought=S.bought[k]||{};
  const need=items.filter(i=>!isHave(i.key)),have=items.filter(i=>isHave(i.key));
  const left=need.filter(i=>!bought[i.key]);
  const show=UI.shopView==="need"?need:UI.shopView==="have"?have:items;
  let total=0,priced=0;need.forEach(i=>{const p=parseFloat(S.prices[i.key]);if(!isNaN(p)){total+=p;priced++}});
  const groups=SHOPCAT.map(([c,l])=>{const its=show.filter(i=>(i.cat||"other")===c).sort((a,b)=>a.name.localeCompare(b.name));if(!its.length)return "";
    return `<div class="cat"><h3>${l}</h3>${its.map(i=>itemRow(i,k,bought)).join("")}</div>`}).join("");
  return `<div class="sec" style="padding-bottom:8px"><div class="sec-h"><h2>Shopping list</h2><a href="#planner">Edit plan</a></div></div>
  <div class="wknav"><button data-a="wk" data-d="-7" aria-label="Previous week">${ic("back")}</button><div class="lbl">${dstr(start)} – ${dstr(addDays(start,6))}<small>${k===tk?"This week":k>tk?"Upcoming":"Past week"} · from your planner</small></div><button data-a="wk" data-d="7" aria-label="Next week">${ic("fwd")}</button></div>
  ${items.length?`<div class="shopsum"><div><b>${left.length}</b><span>Still to buy</span></div><div><b>${have.length}</b><span>Have at home</span></div><div><b>${priced?"$"+total.toFixed(2):"–"}</b><span>${priced?"Est. ("+priced+" priced)":"Add prices"}</span></div></div>`:""}
  ${make.length?`<div class="mk"><b>Make ahead:</b> ${make.map(id=>{const r=getR(id);return r?`<a href="#recipe-${id}">${esc(r.name)}</a>`:""}).join(", ")}</div>`:""}
  <div class="panel tq"><h3>${ic("tag")}Supermarket specials</h3>
  <div class="seg" role="group" aria-label="Preferred supermarket" style="margin:4px 0 10px">${["woolworths","coles","aldi"].map(s=>`<button class="${S.store===s?"on n":""}" data-a="store" data-s="${s}" aria-pressed="${S.store===s}">${STORES[s][0]}</button>`).join("")}</div>
  <a class="btn sm" href="${SPECIALS[S.store]}" target="_blank" rel="noopener">${ic("link")}This week’s ${STORES[S.store][0]} specials</a></div>
  ${items.length?`<div class="chips" style="padding-top:14px" role="group" aria-label="Show">${[["need","To buy"],["have","Have at home"],["all","Everything"]].map(([v,l])=>`<button class="chip${UI.shopView===v?" on":""}" data-a="shopView" data-v="${v}" aria-pressed="${UI.shopView===v}">${l}</button>`).join("")}</div>`:""}
  ${items.length?(groups||`<div class="empty-st">${UI.shopView==="need"?"Nothing left to buy, nice!":"Nothing here."}</div>`):`<div class="empty-st">Your list builds itself from the planner.<br><br><a class="btn" href="#planner">${ic("cal")}Plan some meals</a></div>`}
  <div class="sec"><label class="fl" for="addItem" style="margin-top:0">Add something else</label><div class="row" style="flex-wrap:nowrap"><input type="text" id="addItem" placeholder="e.g. Lactose-free milk"><button class="btn" data-a="addItem">Add</button></div></div>
  ${need.length?`<div class="row" style="padding:12px 18px"><button class="btn line" style="flex:1" data-a="copyList">${ic("copy")}Copy list to send</button>${Object.keys(bought).length?`<button class="btn line" data-a="resetBought">Untick all</button>`:""}</div>`:""}`;
}
function itemRow(i,k,bought){
  const got=!!bought[i.key],have=isHave(i.key),open=UI.open[i.key];const q=partsText(i.parts);const sq=shopQuery(i.name);
  return `<div class="item${got?" got":""}${have?" have":""}"><div class="main">
  ${have?`<span style="width:30px"></span>`:`<button class="ck" data-a="got" data-k="${esc(i.key)}" aria-label="${got?"Untick":"Tick off"} ${esc(i.name)}" aria-pressed="${got}">${ic("check",2.6)}</button>`}
  <div class="nm"><b>${esc(cap(i.extra?i.name:nkey(i.name)))}</b>${q?` <span class="small">${esc(q)}</span>`:""}<small>${esc([...i.from].join(", "))}${S.prices[i.key]?" · $"+esc(S.prices[i.key]):""}</small></div>
  ${i.extra?`<button class="more" data-a="delExtra" data-id="${esc(i.extra)}" aria-label="Remove">${ic("x")}</button>`:`<span class="seg"><button class="${have?"on h":""}" data-a="pantry" data-k="${esc(i.key)}" data-v="have" aria-pressed="${have}">Have</button><button class="${!have?"on n":""}" data-a="pantry" data-k="${esc(i.key)}" data-v="need" aria-pressed="${!have}">Need</button></span>`}
  <button class="more" data-a="openItem" data-k="${esc(i.key)}" aria-expanded="${!!open}" aria-label="More options">${ic("dots")}</button></div>
  ${open?`<div class="ext">${["woolworths","coles","aldi"].map(s=>`<a class="btn sm ${s===S.store?"":"line"}" href="${esc(STORES[s][1](sq))}" target="_blank" rel="noopener">${STORES[s][0]}</a>`).join("")}<label class="small" style="display:flex;align-items:center;gap:6px">$<input type="number" inputmode="decimal" step="0.01" min="0" placeholder="Price" value="${esc(S.prices[i.key]||"")}" data-in="price" data-k="${esc(i.key)}" aria-label="Price for ${esc(i.name)}"></label></div>`:""}</div>`;
}

/* ----- more ----- */
function vMore(){
  const tile=(h,c,i,b,s)=>`<a class="tile" href="#${h}"><span class="ic" style="background:${c}">${ic(i)}</span><span><b>${b}</b><span>${s}</span></span></a>`;
  return `<div class="sec"><div class="sec-h"><h2>More</h2></div></div>
  ${tile("daily","var(--em)","sun","The Feel Good Daily","A science-backed wellbeing tip every day")}
  ${tile("finds","var(--tq)","link","Community finds","Recipe links you’ve found online")}
  ${tile("fodmap","var(--em)","info","What is FODMAP?","What the letters mean and which foods fit where")}
  ${tile("check","var(--ch)","leaf","Recipe checker","Paste ingredients, get low FODMAP swaps")}
  ${tile("my","var(--em)","edit","My recipes","Add your own, with a low FODMAP check")}
  ${tile("favourites","var(--bl)","heart","Saved recipes","Your favourites")}
  ${tile("prefs","var(--bl)","gear","Household & settings","People, supermarket, sharing")}
  ${tile("terms","var(--mut)","info","Terms & disclaimer","Not medical advice, please read")}
  <p class="disc">Yes Chef! · Delicious food. Happy guts.</p>`;
}
function ownsFind(f){return IS_OWNER||!f.by||f.by===UID}
function fCard(f){
  const ph=f.photo?`<div class="cover"><img src="${f.photo}" alt="${esc(f.title)}"></div>`:cover({id:f.id||"x",name:f.title,cat:"other"},false,true);
  return `<article class="fcard">${ph}<div class="meta"><h3>${esc(f.title)}</h3>${f.author?`<div class="by">by ${esc(f.author)}</div>`:""}<div class="row" style="gap:8px">${starsView("find:"+f.id)}</div>${starsInput("find:"+f.id,"Rate "+f.title)}<div>${f.meal?`<span class="tag">${esc(FCATN[f.meal]||"")}</span>`:""}${f.diet&&f.diet!=="any"?`<span class="tag ${f.diet}">${esc(DIETN[f.diet]||"")}</span>`:""}</div>
  <div class="acts">${f.lf&&MY.find(m=>m.id===f.lf)?`<a class="btn sm em" href="#recipe-${esc(f.lf)}">${ic("leaf")}Low FODMAP version</a>`:""}${f.ing?`<button class="btn sm tq" data-a="chkFind" data-id="${esc(f.id)}">${ic("leaf")}FODMAP check${(()=>{const n=checkText(f.ing).flagged.length;return n?` · ${n} to swap`:" ✓"})()}</button>`:""}<a class="btn sm" href="${esc(f.url)}" target="_blank" rel="noopener">See recipe</a>${ownsFind(f)?`<button class="del" data-a="editFind" data-id="${esc(f.id)}" aria-label="Edit ${esc(f.title)}">${ic("edit")}</button><button class="del" data-a="delFind" data-id="${esc(f.id)}" aria-label="Delete ${esc(f.title)}">${ic("trash")}</button>`:""}</div></div></article>`;
}
function vFinds(){
  const list=FINDS.slice().sort((a,b)=>(b.t||0)-(a.t||0)).filter(f=>(UI.fMeal==="all"||f.meal===UI.fMeal)&&(UI.fDiet==="all"||f.diet===UI.fDiet||(UI.fDiet==="veg"&&f.diet==="vegan")));
  return `<a class="back" href="#more">${ic("back")}More</a>
  <div class="sec" style="padding-top:4px"><div class="sec-h"><h2>Community finds</h2></div>
  <div class="warnbox" role="note">${ic("info")}<div><b>These recipes may not be low FODMAP.</b> Check every ingredient and serving size against the <a href="https://www.monashfodmap.com/" target="_blank" rel="noopener">Monash University FODMAP app</a> before cooking.</div></div>
  <button class="btn tq full" data-a="addFind">${ic("plus")}Add a recipe link</button><a class="btn line full" style="margin-top:8px" href="#check">${ic("leaf")}Check a recipe for swaps</a></div>
  <div class="chips" role="group" aria-label="Meal">${[["all","All"]].concat(FCATS).map(([v,l])=>`<button class="chip${UI.fMeal===v?" on":""}" data-a="fMeal" data-v="${v}" aria-pressed="${UI.fMeal===v}">${l}</button>`).join("")}</div>
  <div class="chips" role="group" aria-label="Diet">${[["all","Any diet"],["veg","Vegetarian"],["vegan","Vegan"],["pesc","Pescatarian"]].map(([v,l])=>`<button class="chip${UI.fDiet===v?" on":""}" data-a="fDiet" data-v="${v}" aria-pressed="${UI.fDiet===v}">${l}</button>`).join("")}</div>
  ${list.length?`<div class="grid">${list.map(fCard).join("")}</div>`:`<div class="empty-st">${FINDS.length?"Nothing matches those filters.":"No finds yet, add the first one!"}</div>`}<div style="height:12px"></div>`;
}
function findForm(f){
  const v=f||{url:"",title:"",author:"",meal:"D",diet:"any"};
  return `<div class="warnbox" role="note" style="margin-top:0">${ic("info")}<div>Recipes from other websites may not be low FODMAP. Check them against the Monash University FODMAP app.</div></div><form data-form="find" data-id="${esc(f?f.id:"")}">
  <label class="fl" for="f-url">Recipe link</label><input type="url" id="f-url" name="url" placeholder="https://…" required inputmode="url" value="${esc(v.url)}">
  <label class="fl" for="f-title">Recipe name</label><input type="text" id="f-title" name="title" required placeholder="e.g. Low FODMAP chicken laksa" value="${esc(v.title)}">
  <label class="fl" for="f-author">Author or website</label><input type="text" id="f-author" name="author" placeholder="e.g. A Little Bit Yummy" value="${esc(v.author||"")}">
  <label class="fl">Type</label><div class="slotpick" style="grid-template-columns:repeat(4,minmax(0,1fr))" role="group">${FCATS.map(([s,l])=>`<button type="button" class="${s===v.meal?"on":""}" data-a="fmPick" data-g="meal" data-v="${s}">${l}</button>`).join("")}</div>
  <label class="fl">Diet</label><div class="slotpick" style="grid-template-columns:repeat(2,minmax(0,1fr))" role="group">${[["any","Not specified"],["veg","Vegetarian"],["vegan","Vegan"],["pesc","Pescatarian"]].map(([d,l])=>`<button type="button" class="${d===(v.diet||"any")?"on":""}" data-a="fmPick" data-g="diet" data-v="${d}">${l}</button>`).join("")}</div>
  <input type="hidden" name="meal" value="${esc(v.meal||"D")}"><input type="hidden" name="diet" value="${esc(v.diet||"any")}">
  <label class="fl">Photo (optional)</label><span class="btn line sm fileov">${ic("camera")}<span id="fphl">${f&&f.photo?"Change photo":"Choose a photo"}</span><input type="file" accept="image/*" id="fphoto" aria-label="Choose a photo"></span>
  <label class="fl" for="f-ing">Ingredients (optional, paste to check for high FODMAP foods)</label><textarea id="f-ing" name="ing" placeholder="Paste the ingredient list here">${esc(v.ing||"")}</textarea>
  <button class="btn em full" style="margin-top:18px" type="submit">${ic("check")}${f?"Save changes":"Save find"}</button></form>`;
}

function vMy(){
  const list=MY.map(myToRecipe);
  return `<a class="back" href="#more">${ic("back")}More</a>
  <div class="sec" style="padding-top:4px"><div class="sec-h"><h2>My recipes</h2></div><a class="btn em full" href="#add-recipe">${ic("plus")}Add a recipe</a></div>
  ${list.length?`<div class="grid">${list.map(rCard).join("")}</div>`:`<div class="empty-st">No recipes of your own yet.</div>`}<div style="height:12px"></div>`;
}
function vForm(id){
  const m=id?MY.find(x=>x.id===id):null;if(m&&!canEditMy(m))return `<a class="back" href="#my">${ic("back")}My recipes</a><div class="empty-st">Only the person who added this recipe can edit it.</div>`;if(id&&!m)return `<a class="back" href="#my">${ic("back")}My recipes</a><div class="empty-st">Recipe not found.</div>`;
  const v=m||{name:"",cat:"dinner",meals:["D"],diet:"meat",freq:"Weekly",serves:4,prep:"",cook:"",ing:"",steps:"",notes:"",equip:"",store:"",url:""};
  const opt=(arr,cur)=>arr.map(([a,b])=>`<option value="${a}" ${a===cur?"selected":""}>${b}</option>`).join("");
  return `<a class="back" href="#my">${ic("back")}My recipes</a>
  <div class="sec" style="padding-top:4px"><div class="sec-h"><h2>${m?"Edit recipe":"Add a recipe"}</h2></div>
  <form data-form="my" data-id="${esc(id||"")}">
  <label class="fl" for="m-name">Recipe name</label><input type="text" id="m-name" name="name" required value="${esc(v.name)}">
  <div class="row" style="flex-wrap:nowrap"><div style="flex:1"><label class="fl" for="m-cat">Type</label><select id="m-cat" name="cat">${opt([["dinner","Dinner"],["hotpot","Hot pot"],["ramen","Ramen"],["oats","Overnight oats"],["side","Lunch & sides"],["sandwich","Wraps & sandwiches"],["baking","Baking"],["broth","Broth & bases"]],v.cat)}</select></div>
  <div style="flex:1"><label class="fl" for="m-diet">Diet</label><select id="m-diet" name="diet">${opt([["meat","Meat"],["pesc","Pescatarian"],["veg","Vegetarian"],["vegan","Vegan"]],v.diet)}</select></div></div>
  <div class="row" style="flex-wrap:nowrap"><div style="flex:1"><label class="fl" for="m-serves">Serves</label><input type="number" id="m-serves" name="serves" min="1" value="${esc(v.serves)}"></div>
  <div style="flex:1"><label class="fl" for="m-prep">Prep (min)</label><input type="number" id="m-prep" name="prep" min="0" value="${esc(v.prep)}"></div>
  <div style="flex:1"><label class="fl" for="m-cook">Cook (min)</label><input type="number" id="m-cook" name="cook" min="0" value="${esc(v.cook)}"></div></div>
  <label class="fl" for="m-freq">How often</label><select id="m-freq" name="freq">${opt([["Daily","Daily"],["Weekly","Weekly"],["Once in a while","Once in a while"]],v.freq)}</select>
  <label class="fl" for="m-ing">Ingredients (one per line)</label><textarea id="m-ing" name="ing" placeholder="500 g chicken thigh&#10;2 tbsp garlic-infused oil&#10;1 bunch spring onions, green tops only">${esc(v.ing)}</textarea>
  <label class="fl" for="m-steps">Method (one step per line)</label><textarea id="m-steps" name="steps" placeholder="Put a frying pan on medium heat with 1 tbsp oil.&#10;Add the chicken and cook 5 minutes.">${esc(v.steps)}</textarea>
  <label class="fl" for="m-equip">Equipment (comma separated)</label><input type="text" id="m-equip" name="equip" value="${esc(v.equip)}" placeholder="Frying pan, Wooden spoon">
  <label class="fl" for="m-store">Storage &amp; reheating</label><input type="text" id="m-store" name="store" value="${esc(v.store)}">
  <label class="fl" for="m-notes">Short description</label><input type="text" id="m-notes" name="notes" value="${esc(v.notes)}">
  <label class="fl" for="m-url">Original link (optional)</label><input type="url" id="m-url" name="url" value="${esc(v.url)}" placeholder="https://…">
  <button class="btn em full" style="margin-top:18px" type="submit">${ic("check")}${m?"Save changes":"Save recipe"}</button>
  </form></div>`;
}
function vDaily(){
  const t=todaysTip();const rest=TIPS.filter(x=>x!==t);
  return `<a class="back" href="#more">${ic("back")}More</a>
  <div class="sec" style="padding-top:4px"><div class="sec-h"><h2>The Feel Good Daily</h2></div></div>
  <div style="padding:0 18px">${t?`<div class="tl" style="margin:0 0 6px">Today</div>${tipCard(t,true)}`:""}
  <div class="tl" style="margin:22px 0 6px">The full collection</div>${rest.map(x=>tipCard(x)).join("")}</div>
  <p class="disc">Tips are general information, not medical advice. Reviewed November 2026.</p>`;
}
function vPrefs(){
  return `<a class="back" href="#more">${ic("back")}More</a>
  <div class="sec" style="padding-top:4px"><div class="sec-h"><h2>Household &amp; settings</h2></div></div>
  <div class="scaler" style="margin-top:0"><div><b>People in the household</b><div class="small muted">Default servings for each planned meal</div></div><div class="stepper"><button data-a="people" data-d="-1" aria-label="Fewer">−</button><output>${S.people}</output><button data-a="people" data-d="1" aria-label="More">+</button></div></div>
  <div class="panel white"><h3>${ic("cart")}Preferred supermarket</h3><div class="seg" role="group" style="margin-top:6px">${["woolworths","coles","aldi"].map(s=>`<button class="${S.store===s?"on n":""}" data-a="store" data-s="${s}" aria-pressed="${S.store===s}">${STORES[s][0]}</button>`).join("")}</div></div>
  ${vAccount()}
  <div class="panel white"><h3>${ic("trash")}Reset</h3><p class="small muted">Clear all Have/Need ticks (start a fresh pantry check).</p><button class="btn line sm" data-a="resetPantry" id="rp">Reset Have/Need</button></div>`;
}

/* ============ cook mode ============ */
const CK={r:null,i:0,f:1,pages:[],ticks:{},timers:[],wake:null,wakeOn:true,int:null};
function buildPages(r,f){
  const pages=[];
  const ing=(r.ing||[]);
  pages.push({type:"ing"});
  if(r.equip)pages.push({type:"equip"});
  let sec="";
  (r.steps||[]).forEach(s=>{if(s[0]==="#"){sec=s[1];return}pages.push({type:"step",text:s[0],min:s[1]||0,sec})});
  pages.push({type:"done"});
  return pages;
}
async function wakeLock(on){
  try{
    if(on&&"wakeLock" in navigator){CK.wake=await navigator.wakeLock.request("screen");CK.wakeOn=true}
    else{if(CK.wake){await CK.wake.release();CK.wake=null}CK.wakeOn=false}
  }catch(e){CK.wake=null;if(on)CK.wakeOn=false}
  drawCook();
}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&CK.r&&CK.wakeOn&&!CK.wake)wakeLock(true)});
function openCook(id){
  const r=getR(id);if(!r)return;
  CK.r=r;CK.f=getServ(r)/r.serves;CK.i=0;CK.ticks={};CK.pages=buildPages(r,CK.f);
  document.body.style.overflow="hidden";
  drawCook();wakeLock(true);
  if(!CK.int)CK.int=setInterval(tickTimers,500);
}
function closeCook(){CK.r=null;$("#cook").innerHTML="";document.body.style.overflow="";if(CK.wake){CK.wake.release().catch(()=>{});CK.wake=null}}
const mmss=s=>{s=Math.max(0,Math.ceil(s));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+":"+pad(m):m)+":"+pad(x)};
function tickTimers(){
  if(!CK.r)return;const now=Date.now();let changed=false;
  CK.timers.forEach(t=>{if(!t.done&&now>=t.end){t.done=true;changed=true;alarm()}});
  document.querySelectorAll("[data-tleft]").forEach(el=>{const t=CK.timers.find(x=>x.id===el.dataset.tleft);if(t)el.textContent=t.done?"Done!":mmss((t.end-now)/1000)});
  if(changed)drawCook();
}
function alarm(){
  try{navigator.vibrate&&navigator.vibrate([400,200,400,200,600])}catch(e){}
  try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const ctx=CK.ac||(CK.ac=new A());
    [0,0.5,1].forEach(d=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=880;o.connect(g);g.connect(ctx.destination);g.gain.setValueAtTime(.0001,ctx.currentTime+d);g.gain.exponentialRampToValueAtTime(.35,ctx.currentTime+d+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+d+.35);o.start(ctx.currentTime+d);o.stop(ctx.currentTime+d+.4)})}catch(e){}
}
function drawCook(){
  if(!CK.r)return;const r=CK.r,p=CK.pages[CK.i],n=CK.pages.length;
  let body="";
  const stepNo=`Step ${CK.i+1} of ${n}`;
  if(p.type==="ing"){
    const items=(r.ing||[]).filter(i=>i[3]!=="water"||true);
    body=`<div class="stepno">${stepNo}</div><h2>Get your ingredients ready</h2><p class="big" style="font-size:19px;margin:0 0 10px">Take everything out and put it on the bench. Tick each one off.</p>
    <ul class="tick">${items.map((i,ix)=>i[0]==="#"?`<li class="h">${esc(i[1])}</li>`:`<li><button class="${CK.ticks["i"+ix]?"on":""}" data-a="ckTick" data-k="i${ix}" aria-pressed="${!!CK.ticks["i"+ix]}"><span class="bx">${ic("check",3)}</span><span class="tx">${qtyText(i,CK.f)?`<span class="q">${esc(qtyText(i,CK.f))}</span> `:""}${esc(i[2])}</span></button></li>`).join("")}</ul>
    ${CK.f!==1?`<p class="tip">For ${Math.round(CK.f*r.serves)} servings.</p>`:""}`;
  }else if(p.type==="equip"){
    const eq=r.equip.split(/,\s*/).filter(Boolean);
    body=`<div class="stepno">${stepNo}</div><h2>Get your equipment out</h2><ul class="tick">${eq.map((e,ix)=>`<li><button class="${CK.ticks["e"+ix]?"on":""}" data-a="ckTick" data-k="e${ix}" aria-pressed="${!!CK.ticks["e"+ix]}"><span class="bx">${ic("check",3)}</span><span class="tx">${esc(e)}</span></button></li>`).join("")}</ul>`;
  }else if(p.type==="step"){
    const tid="t"+CK.i;const t=CK.timers.find(x=>x.id===tid);
    body=`<div class="stepno">${stepNo}${p.sec?`<span class="sect">${esc(p.sec)}</span>`:""}</div><p class="big" style="margin-top:14px">${esc(p.text)}</p>
    ${p.min?`<div class="timer${t&&t.done?" done":""}">${ic("timer")}<span class="tv" data-tleft="${tid}">${t?(t.done?"Done!":mmss((t.end-Date.now())/1000)):mmss(p.min*60)}</span>${t?(t.done?`<button class="btn white" data-a="ckTimerClear" data-t="${tid}">OK</button>`:`<button class="btn lineW" data-a="ckTimerClear" data-t="${tid}">Stop</button>`):`<button class="btn white" data-a="ckTimer" data-t="${tid}" data-m="${p.min}">${ic("play")}Start ${fmtTime(p.min)} timer</button>`}</div>`:""}`;
  }else{
    body=`<div class="stepno">Finished</div><h2>All done, enjoy!</h2>${r.store?`<p class="big" style="font-size:19px"><b>Storing leftovers:</b> ${esc(r.store)}</p>`:""}<p class="tip">Yes Chef! 🙌</p>`;
  }
  const running=CK.timers.filter(t=>!t.cleared);
  $("#cook").innerHTML=`<div class="cook" role="dialog" aria-modal="true" aria-label="Cook with me: ${esc(r.name)}">
  <div class="ct"><button class="xbtn" data-a="ckClose" aria-label="Close cook mode">${ic("x")}</button><div class="nm">${esc(r.name)}</div><button class="wake" data-a="ckWake" aria-pressed="${!!CK.wake}">${ic("sun")}${CK.wake?"Screen stays on":"Keep screen on"}</button></div>
  <div class="prog" aria-hidden="true"><i style="width:${((CK.i+1)/n*100).toFixed(1)}%"></i></div>
  ${running.length?`<div class="running">${running.map(t=>`<span class="${t.done?"done":""}">${esc(t.label)} · <b data-tleft="${t.id}">${t.done?"Done!":mmss((t.end-Date.now())/1000)}</b></span>`).join("")}</div>`:""}
  <div class="body" id="ckbody">${body}</div>
  <div class="nav"><button class="btn line" data-a="ckPrev" ${CK.i===0?"disabled":""}>${ic("back")}Back</button>${CK.i<n-1?`<button class="btn em" data-a="ckNext">Next${ic("fwd")}</button>`:`<button class="btn em" data-a="ckClose">${ic("check")}Finish</button>`}</div></div>`;
}
let tx0=null,ty0=null;
document.addEventListener("touchstart",e=>{if(!CK.r||!e.target.closest(".cook .body"))return;tx0=e.touches[0].clientX;ty0=e.touches[0].clientY},{passive:true});
document.addEventListener("touchend",e=>{if(!CK.r||tx0==null)return;const dx=e.changedTouches[0].clientX-tx0,dy=e.changedTouches[0].clientY-ty0;tx0=null;
  if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5){if(dx<0&&CK.i<CK.pages.length-1){CK.i++;drawCook()}else if(dx>0&&CK.i>0){CK.i--;drawCook()}}},{passive:true});

/* ============ photos ============ */
function compress(file,max,q){
  return new Promise((res,rej)=>{const img=new Image(),url=URL.createObjectURL(file);
    img.onload=()=>{let w=img.naturalWidth,h=img.naturalHeight;const sc=Math.min(1,max/Math.max(w,h));w=Math.round(w*sc);h=Math.round(h*sc);
      const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d").drawImage(img,0,0,w,h);URL.revokeObjectURL(url);
      let d=c.toDataURL("image/jpeg",q);if(d.length>200000)d=c.toDataURL("image/jpeg",.5);if(d.length>240000){const c2=document.createElement("canvas");c2.width=Math.round(w*.7);c2.height=Math.round(h*.7);c2.getContext("2d").drawImage(c,0,0,c2.width,c2.height);d=c2.toDataURL("image/jpeg",.6)}res(d)};
    img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error("bad image"))};img.src=url});
}
let pendingFindPhoto=null,pendingShots=[];
document.addEventListener("change",async e=>{
  const t=e.target;
  if(t.matches("[data-photo]")&&t.files&&t.files[0]){
    const id=t.dataset.photo;toast("Adding photo…");
    try{const d=await compress(t.files[0],900,.72);
      const url=await uploadPhoto(d,"recipe-"+id);
      if(isBuilt(id)){if(!IS_OWNER)return;const {error}=await SB.from("recipe_photos").upsert({recipe_id:id,url,updated_at:new Date().toISOString()});if(error)throw error;OFFICIAL[id]=url}
      else{const {error}=await SB.from("household_photos").upsert({household_id:HH,recipe_id:id,url});if(error)throw error;PHOTOS[id]=url}toast("Photo added");render()}catch(err){if(err&&err.message)sbErr(err);else toast("Couldn’t read that photo, try a different one.")}
  }
  if(t.id==="fshots"&&t.files&&t.files.length){
    try{pendingShots=[];for(const fl of Array.from(t.files).slice(0,8)){pendingShots.push(await compress(fl,1400,.8))}
      const l=$("#fshl");if(l)l.textContent=pendingShots.length+" screenshot"+(pendingShots.length>1?"s":"")+" added ✓"}catch(err){toast("Couldn’t read those screenshots.")}
  }
  if(t.id==="fphoto"&&t.files&&t.files[0]){
    try{pendingFindPhoto=await compress(t.files[0],700,.7);const l=$("#fphl");if(l)l.textContent="Photo added ✓"}catch(err){toast("Couldn’t read that photo.")}
  }
  if(t.matches("[data-in=shopq]")){const b=$("#storebtns");if(b)b.innerHTML=storeBtns(t.value)}
  if(t.matches("[data-in=price]")){const v=t.value.trim();if(v)S.prices[t.dataset.k]=(+v).toFixed(2);else delete S.prices[t.dataset.k];save();render()}
});

/* ============ inputs ============ */
document.addEventListener("input",e=>{
  const t=e.target;const k=t.dataset&&t.dataset.in;if(!k)return;
  if(k==="q"){UI.q=t.value;const l=$("#rlist");if(l)l.innerHTML=recipeList()}

  if(k==="pickq"){UI.pickQ=t.value;const tmp=document.createElement("div");tmp.innerHTML=pickerBody(t.dataset.wk,t.dataset.slot);const nl=tmp.querySelector("#picklist");const l=$("#picklist");if(l&&nl)l.innerHTML=nl.innerHTML}
});

/* ============ forms ============ */
document.addEventListener("submit",async e=>{
  const f=e.target;if(!f.dataset||!f.dataset.form)return;e.preventDefault();
  const fd=Object.fromEntries(new FormData(f).entries());
  if(f.dataset.form==="auth"){
    const m=f.dataset.mode,email=(fd.email||"").trim(),btn=f.querySelector("button[type=submit]");btn.disabled=true;
    try{
      if(m==="in"){const {error}=await SB.auth.signInWithPassword({email,password:fd.pw});if(error)throw error}
      else if(m==="up"){if(!fd.terms){toast("Please agree to the terms first");btn.disabled=false;return}
        const {data,error}=await SB.auth.signUp({email,password:fd.pw,options:{data:{display_name:(fd.name||"").trim().slice(0,60)},emailRedirectTo:location.origin+location.pathname}});if(error)throw error;
        lsSet("yc-pending-terms",TERMS_V);
        if(!data.session){$("#app").innerHTML=`<div class="sec"><div class="panel tq"><h3>${ic("check")}Check your email</h3><p>We’ve sent a link to <b>${esc(email)}</b>. Tap it to finish creating your account, then come back here.</p></div></div>`;return}}
      else{const {error}=await SB.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});if(error)throw error;toast("Check your email for a reset link");UI.authMode="in";render();return}
    }catch(e){toast(/Invalid login/i.test(e.message)?"Email or password is wrong.":/registered/i.test(e.message)?"That email already has an account, sign in instead.":/rate limit/i.test(e.message)?"Too many tries, wait a few minutes.":(e.message||"Something went wrong"))}
    btn.disabled=false;return;
  }
  if(f.dataset.form==="newpw"){const {error}=await SB.auth.updateUser({password:fd.pw});if(error){toast(error.message);return}toast("Password updated");go("home");return}
  if(f.dataset.form==="join"){
    const code=(fd.code||"").trim().toUpperCase();if(code.length<4){toast("Enter the code");return}
    const {error}=await SB.rpc("join_household",{code});if(error){toast(/match/.test(error.message)?"That code doesn’t match a household.":"Couldn’t join, try again.");return}
    await loadAll();toast("Joined! Your planner and shopping list are now shared.");return;
  }
  if(f.dataset.form==="find"){
    let url=(fd.url||"").trim();if(url&&!/^https?:\/\//i.test(url))url="https://"+url;
    if(!/^https?:\/\/[^\s.]+\.[^\s]+/i.test(url)){toast("That link doesn’t look right, paste the full web address.");return}
    const editId=f.dataset.id||"",prev=editId?FINDS.find(x=>x.id===editId):null;
    if(editId&&(!prev||!ownsFind(prev))){toast("Only the person who added this can edit it.");return}
    const obj={url,title:(fd.title||"").trim().slice(0,140),author:(fd.author||"").trim().slice(0,80),meal:fd.meal||"D",diet:fd.diet||"any",photo:pendingFindPhoto||(prev&&prev.photo)||"",by:(prev&&prev.by)||UID,ing:String(fd.ing||"").slice(0,6000),t:prev?prev.t:Date.now()};
    if(prev&&prev.lf)obj.lf=prev.lf;
    if(!obj.title){toast("Add the recipe name");return}
    const id=editId||uid();
    if(obj.photo&&obj.photo.startsWith("data:")){try{toast("Uploading photo…");obj.photo=await uploadPhoto(obj.photo,"find-"+id)}catch(e){sbErr(e);return}}
    const ok=await putDoc("finds",id,obj);
    if(ok===null||ok){const ix=FINDS.findIndex(x=>x.id===id);const full=Object.assign({id},obj);if(ix>=0)FINDS[ix]=full;else FINDS.push(full);if(ok===null)lsSet("yc-finds",FINDS)}
    if(ok!==false&&editId){pendingFindPhoto=null;closeModal();toast("Changes saved");render();return}
    if(ok!==false){pendingFindPhoto=null;closeModal();toast("Saved to Community finds");if(route()!=="finds")go("finds");else render()}
  }
  if(f.dataset.form==="my"){
    const id=f.dataset.id||("my"+uid());
    const obj={name:(fd.name||"").trim().slice(0,120),cat:fd.cat,diet:fd.diet,freq:fd.freq,serves:Math.max(1,+fd.serves||2),prep:+fd.prep||0,cook:+fd.cook||0,ing:fd.ing||"",steps:fd.steps||"",equip:fd.equip||"",store:fd.store||"",notes:fd.notes||"",url:(fd.url||"").trim(),meals:[fd.cat==="oats"||fd.cat==="baking"?"B":(fd.cat==="side"||fd.cat==="sandwich")?"L":"D"],t:Date.now()};
    if(!obj.name){toast("Give your recipe a name");return}
    {const prevM=MY.find(x=>x.id===id);if(prevM&&!canEditMy(prevM)){toast("Only the person who added this can edit it.");return}obj.by=(prevM&&prevM.by)||UID;if(prevM){["ai","fod","swaps","findId"].forEach(k=>{if(prevM[k]!=null)obj[k]=prevM[k]})}}
    if(obj.url&&!/^https?:\/\//i.test(obj.url))obj.url="https://"+obj.url;
    const ok=await putDoc("myrecipes",id,obj);
    if(ok===null){const ix=MY.findIndex(x=>x.id===id);const full=Object.assign({id},obj);if(ix>=0)MY[ix]=full;else MY.push(full);lsSet("yc-my",MY)}
    else if(ok){const ix=MY.findIndex(x=>x.id===id);const full=Object.assign({id},obj);if(ix>=0)MY[ix]=full;else MY.push(full)}
    if(ok!==false){toast("Recipe saved");go("recipe-"+id)}
  }
});

/* ============ clicks ============ */
const A={
  go:t=>go(t.dataset.h),
  modalBg:(t,e)=>{if(e.target===t)closeModal()},
  closeModal:()=>closeModal(),
  chip:t=>{UI.chip=t.dataset.k;render()},
  fav:t=>{const id=t.dataset.id;if(S.favs[id])delete S.favs[id];else S.favs[id]=1;save();render();toast(S.favs[id]?"Saved to favourites":"Removed from favourites")},
  serv:t=>{const r=getR(t.dataset.id);UI.serv[r.id]=Math.max(1,Math.min(48,getServ(r)+ +t.dataset.d));render()},
  pantry:t=>{const k=t.dataset.k;if(t.dataset.v==="have")S.pantry[k]="have";else delete S.pantry[k];save();
    if(CK.r)return;const y=window.scrollY;render();window.scrollTo(0,y)},
  copyNeeds:t=>{const r=getR(t.dataset.id);const f=getServ(r)/r.serves;
    const lines=(r.ing||[]).filter(i=>i[0]!=="#"&&i[3]!=="water"&&!i[6]&&!isHave(nkey(i[2]))).map(i=>"• "+(qtyText(i,f)?qtyText(i,f)+" ":"")+i[2]);
    if(!lines.length){toast("You have everything!");return}
    copyText(r.name+", shopping list\n"+lines.join("\n"))},
  cook:t=>openCook(t.dataset.id),
  cookToday:()=>{const k=wkKey(new Date()),di=todayIdx(),p=weekPlan(k);const sl=p[di+"D"]||p[di+"L"]||p[di+"B"];if(sl&&sl.id&&getR(sl.id)){openCook(sl.id)}else{toast("Nothing planned today, pick a recipe and tap Cook with me");go("recipes")}},
  addPlan:t=>openAddPlan(t.dataset.id),
  apWk:t=>{UI.ap.wk=wkKey(addDays(wkDate(UI.ap.wk),+t.dataset.d));apRender()},
  apDay:t=>{UI.ap.d=+t.dataset.i;apRender()},
  apSlot:t=>{UI.ap.s=t.dataset.s;apRender()},
  apSave:()=>{const a=UI.ap;weekPlan(a.wk)[a.d+a.s]={id:a.id,s:S.people};save();closeModal();toast("Added to "+DAYS[a.d]+" "+SLOTS.find(x=>x[0]===a.s)[1].toLowerCase());render()},
  wk:t=>{UI.wk=wkKey(addDays(wkDate(curWk()),+t.dataset.d));render()},
  pickSlot:t=>openPicker(t.dataset.wk,t.dataset.slot),
  pickChip:t=>{UI.pickChip=t.dataset.k;$("#mbody").innerHTML=pickerBody(t.dataset.wk,t.dataset.slot)},
  pickServ:t=>{const p=weekPlan(t.dataset.wk);const sl=p[t.dataset.slot]||{};sl.s=Math.max(1,Math.min(24,(sl.s||S.people)+ +t.dataset.d));if(sl.id||sl.t){p[t.dataset.slot]=sl;save()}else{UI.tmpServ=sl.s;p[t.dataset.slot]=sl}const o=$("#pserv");if(o)o.textContent=sl.s},
  setSlot:t=>{const p=weekPlan(t.dataset.wk);const prev=p[t.dataset.slot]||{};p[t.dataset.slot]={id:t.dataset.id,s:prev.s||S.people};save();closeModal();render()},
  setCustom:t=>{const v=($("#custom").value||"").trim();if(!v){toast("Type a meal first");return}const p=weekPlan(t.dataset.wk);const prev=p[t.dataset.slot]||{};p[t.dataset.slot]={t:v.slice(0,80),s:prev.s||S.people};save();closeModal();render()},
  clearSlot:t=>{delete weekPlan(t.dataset.wk)[t.dataset.slot];save();closeModal();render()},
  copyWeek:()=>{const k=curWk(),pk=wkKey(addDays(wkDate(k),-7));S.plan[k]=JSON.parse(JSON.stringify(S.plan[pk]||{}));save();render();toast("Copied last week’s plan")},
  clearWeek:t=>{if(!t.dataset.arm){t.dataset.arm=1;t.innerHTML=ic("trash")+"Tap again to clear";setTimeout(()=>{if(t.isConnected){delete t.dataset.arm;t.innerHTML=ic("trash")+"Clear week"}},3500);return}S.plan[curWk()]={};save();render();toast("Week cleared")},
  store:t=>{S.store=t.dataset.s;save();render()},
  shopView:t=>{UI.shopView=t.dataset.v;render()},
  got:t=>{const k=curWk();const b=S.bought[k]=S.bought[k]||{};if(b[t.dataset.k])delete b[t.dataset.k];else b[t.dataset.k]=1;save();const y=window.scrollY;render();window.scrollTo(0,y)},
  openItem:t=>{UI.open[t.dataset.k]=!UI.open[t.dataset.k];const y=window.scrollY;render();window.scrollTo(0,y)},
  addItem:()=>{const el=$("#addItem");const v=(el.value||"").trim();if(!v)return;const k=curWk();(S.extras[k]=S.extras[k]||[]).push({id:uid(),name:v.slice(0,80),cat:guessCat(v)});save();render();toast("Added")},
  delExtra:t=>{const k=curWk();S.extras[k]=(S.extras[k]||[]).filter(x=>x.id!==t.dataset.id);save();render()},
  resetBought:()=>{S.bought[curWk()]={};save();render()},
  copyList:()=>{const k=curWk();const {items}=weekItems(k);const b=S.bought[k]||{};
    const out=["Yes Chef! shopping list, week of "+dstr(wkDate(k))];
    SHOPCAT.forEach(([c,l])=>{const its=items.filter(i=>(i.cat||"other")===c&&!isHave(i.key)&&!b[i.key]);if(!its.length)return;out.push("",l.toUpperCase());its.forEach(i=>{const q=partsText(i.parts);out.push("☐ "+cap(i.extra?i.name:nkey(i.name))+(q?", "+q:""))})});
    copyText(out.join("\n"))},
  chkFind:t=>{const fi=FINDS.find(x=>x.id===t.dataset.id);if(!fi)return;openModal("Low FODMAP check",`<p style="margin:0 0 10px"><b>${esc(fi.title)}</b></p>${checkResults(fi.ing)}`)},
  runCheck:()=>{const ta=$("#chkText");const out=$("#chkOut");if(!ta||!out)return;UI.chk=ta.value;out.innerHTML=ta.value.trim()?checkResults(ta.value):'<p class="small muted">Paste some ingredients first.</p>';out.scrollIntoView({behavior:"smooth",block:"start"})},
  acceptTerms:async()=>{lsSet("yc-terms-"+UID,TERMS_V);if(PROFILE)PROFILE.accepted_terms=TERMS_V;closeModal();toast("Thanks, enjoy cooking!");try{await SB.from("profiles").update({accepted_terms:TERMS_V}).eq("id",UID)}catch(e){}},
  termsRead:()=>{lsSet("yc-terms-pending",1);closeModal();go("terms")},
  authMode:t=>{UI.authMode=t.dataset.v;render()},
  copyCode:()=>copyText(HOUSE&&HOUSE.invite_code||""),
  newCode:async()=>{try{const {data,error}=await SB.rpc("new_household_code");if(error)throw error;HOUSE.invite_code=data;render();toast("New code made, the old one no longer works")}catch(e){sbErr(e)}},
  leaveHouse:async t=>{if(!t.dataset.arm){t.dataset.arm=1;t.textContent="Tap again, you’ll get a fresh planner";setTimeout(()=>{if(t.isConnected){delete t.dataset.arm;t.textContent="Start my own household"}},4000);return}
    try{const {data,error}=await SB.rpc("leave_household");if(error)throw error;PROFILE.household_id=data;await loadAll();toast("You’re in your own household now")}catch(e){sbErr(e)}},
  signOut:async()=>{await SB.auth.signOut();teardown();go("home");render()},
  delAcct:(t)=>{openModal("Delete your account",`<p>To delete your account and everything you’ve added, email the app owner from the address you signed up with. We’ll delete it within 30 days.</p>`)},
  addFind:()=>{pendingFindPhoto=null;pendingShots=[];openModal("Add a recipe link",findForm())},
  fmPick:t=>{const g=t.dataset.g;t.parentNode.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===t));const h=t.closest("form").querySelector(`input[name=${g}]`);if(h)h.value=t.dataset.v},
  fMeal:t=>{UI.fMeal=t.dataset.v;render()},
  fDiet:t=>{UI.fDiet=t.dataset.v;render()},
  editFind:t=>{const fi=FINDS.find(x=>x.id===t.dataset.id);if(!fi||!ownsFind(fi))return;pendingFindPhoto=null;openModal("Edit find",findForm(fi))},
  delFind:async t=>{const fi0=FINDS.find(x=>x.id===t.dataset.id);if(fi0&&!ownsFind(fi0))return;if(!t.classList.contains("arm")){t.classList.add("arm");t.textContent="Delete?";setTimeout(()=>{if(t.isConnected){t.classList.remove("arm");t.innerHTML=ic("trash")}},3500);return}
    const id=t.dataset.id;const ok=await delDoc("finds",id);if(ok===null){FINDS=FINDS.filter(f=>f.id!==id);lsSet("yc-finds",FINDS)}if(ok!==false){FINDS=FINDS.filter(f=>f.id!==id);render()}},
  delMy:async t=>{const m0=MY.find(m=>m.id===t.dataset.id);if(m0&&!canEditMy(m0))return;if(!t.dataset.arm){t.dataset.arm=1;t.innerHTML=ic("trash")+"Tap again to delete";setTimeout(()=>{if(t.isConnected){delete t.dataset.arm;t.innerHTML=ic("trash")+"Delete"}},3500);return}
    const id=t.dataset.id;const ok=await delDoc("myrecipes",id);if(ok===null){MY=MY.filter(m=>m.id!==id);lsSet("yc-my",MY)}if(ok!==false){MY=MY.filter(m=>m.id!==id);toast("Deleted");go("my")}},
  people:t=>{S.people=Math.max(1,Math.min(12,S.people+ +t.dataset.d));save();render()},
  resetPantry:t=>{if(!t.dataset.arm){t.dataset.arm=1;t.textContent="Tap again to reset";return}S.pantry={};save();render();toast("Have/Need reset")},
  rate:t=>setRating(t.dataset.item,+t.dataset.v),
  /* cook mode */
  ckClose:()=>closeCook(),
  ckNext:()=>{if(CK.i<CK.pages.length-1){CK.i++;drawCook();const b=$("#ckbody");if(b)b.scrollTop=0}},
  ckPrev:()=>{if(CK.i>0){CK.i--;drawCook();const b=$("#ckbody");if(b)b.scrollTop=0}},
  ckTick:t=>{const k=t.dataset.k;CK.ticks[k]=!CK.ticks[k];t.classList.toggle("on",CK.ticks[k]);t.setAttribute("aria-pressed",CK.ticks[k])},
  ckTimer:t=>{const m=+t.dataset.m;CK.timers=CK.timers.filter(x=>x.id!==t.dataset.t);CK.timers.push({id:t.dataset.t,end:Date.now()+m*60000,label:"Step "+(CK.i+1),done:false});
    try{const A2=window.AudioContext||window.webkitAudioContext;if(A2&&!CK.ac)CK.ac=new A2();if(CK.ac&&CK.ac.state==="suspended")CK.ac.resume()}catch(e){}
    drawCook()},
  ckTimerClear:t=>{CK.timers=CK.timers.filter(x=>x.id!==t.dataset.t);drawCook()},
  ckWake:()=>wakeLock(!CK.wake)
};
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-a]");if(!t)return;
  const fn=A[t.dataset.a];if(!fn)return;
  if(t.tagName==="A")e.preventDefault();
  fn(t,e);
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){if(CK.r)closeCook();else if($("#modal").innerHTML)closeModal()}
  if(e.key==="Enter"&&e.target.id==="addItem"){e.preventDefault();A.addItem()}
  if(e.key==="Enter"&&e.target.id==="custom"){e.preventDefault();const b=document.querySelector("[data-a=setCustom]");if(b)b.click()}
});

/* ============ start ============ */
setSync("local");
render();
initDB();
if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
/* expose for testing */
window.__yc={weekItems,scanLine,fmtQ,nkey,allergensOf,getR,openCook,CK,S,render};
})();
