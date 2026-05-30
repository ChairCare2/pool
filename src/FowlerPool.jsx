// FOWLER BROTHERS POOL SERVICE — v5.0 — Real Assets Edition
import { useState, useEffect, useRef, useCallback } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Nunito Sans',sans-serif;overflow-x:hidden;background:#051923}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#051923}::-webkit-scrollbar-thumb{background:#0077C8;border-radius:3px}
@keyframes waveScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes bubbleUp{0%{transform:translateY(0) scale(1);opacity:0}8%{opacity:.7}85%{opacity:.25}100%{transform:translateY(-110vh) scale(1.7);opacity:0}}
@keyframes caustMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes glow{0%,100%{box-shadow:0 0 22px rgba(0,168,232,.4),0 0 8px rgba(0,168,232,.2)}50%{box-shadow:0 0 55px rgba(0,207,255,.75),0 0 22px rgba(0,207,255,.4)}}
@keyframes rippleOut{0%{transform:scale(0);opacity:.6}100%{transform:scale(4);opacity:0}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
@keyframes scanLine{0%{top:-30px}100%{top:110%}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
.anim-fade-up{opacity:0;transform:translateY(26px);transition:opacity .65s ease,transform .65s ease}
.anim-fade-up.vis{opacity:1;transform:translateY(0)}
.hover-lift{transition:transform .22s ease,box-shadow .22s ease}
.hover-lift:hover{transform:translateY(-5px)}
.glass{background:rgba(255,255,255,.07);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.13)}
@media(max-width:800px){
  .desk-nav{display:none!important}.hide-sm{display:none!important}
  .mob-ham{display:flex!important}.mob-bar{display:block!important}
  .two-col{grid-template-columns:1fr!important;gap:28px!important}
  main{padding-bottom:74px}
}
`;

const ADM = { u: "admin", p: "Pa55w0rd" };
const C = {
  ocean:"#051923",deep:"#003554",navy:"#061A33",
  blue:"#0077C8",pool:"#006494",cyan:"#00A8E8",
  bright:"#00CFFF",teal:"#007EA7",green:"#5BAA32",
  dark:"#020D17",muted:"#6B8CAA",light:"#EAF8FF",
  glB:"rgba(255,255,255,.13)",glass:"rgba(255,255,255,.07)",
};

const ALL_GALLERY = [
  {id:1,  src:"/images/gal-cleaning-1.jpg",  title:"Pool Cleaning Service",       category:"Cleaning"},
  {id:2,  src:"/images/gal-cleaning-2.jpg",  title:"Weekly Maintenance Visit",    category:"Cleaning"},
  {id:3,  src:"/images/gal-cleaning-3.jpg",  title:"Professional Pool Brushing",  category:"Cleaning"},
  {id:4,  src:"/images/gal-cleaning-4.jpg",  title:"Chemical Balancing Service",  category:"Cleaning"},
  {id:5,  src:"/images/gal-cleaning-5.jpg",  title:"Full Pool Clean",             category:"Cleaning"},
  {id:6,  src:"/images/gal-ba-1.jpg",        title:"Before & After — Cleanup #1", category:"Before/After"},
  {id:7,  src:"/images/gal-ba-2.jpg",        title:"Before & After — Cleanup #2", category:"Before/After"},
  {id:8,  src:"/images/gal-ba-3.jpg",        title:"Before & After — Cleanup #3", category:"Before/After"},
  {id:9,  src:"/images/gal-ba-4.jpg",        title:"Before & After — Cleanup #4", category:"Before/After"},
  {id:10, src:"/images/gal-maint-1.jpg",     title:"Routine Maintenance",         category:"Maintenance"},
  {id:11, src:"/images/gal-maint-2.jpg",     title:"Equipment Inspection",        category:"Maintenance"},
  {id:12, src:"/images/gal-maint-3.jpg",     title:"Filter Service",              category:"Maintenance"},
  {id:13, src:"/images/gal-maint-4.jpg",     title:"On-Site Maintenance Visit",   category:"Maintenance"},
  {id:14, src:"/images/gal-open-1.jpg",      title:"Pool Opening Service",        category:"Openings & Closings"},
  {id:15, src:"/images/gal-open-2.jpg",      title:"Seasonal Pool Opening",       category:"Openings & Closings"},
  {id:16, src:"/images/gal-open-3.webp",     title:"Pool Closing Prep",           category:"Openings & Closings"},
  {id:17, src:"/images/gal-open-4.jpg",      title:"Cover Installation",          category:"Openings & Closings"},
  {id:18, src:"/images/gal-open-5.jpg",      title:"Spring Pool Opening",         category:"Openings & Closings"},
  {id:19, src:"/images/gal-open-6.jpg",      title:"Ready for the Season",        category:"Openings & Closings"},
  {id:20, src:"/images/gal-repair-1.avif",   title:"Equipment Repair",            category:"Repairs"},
  {id:21, src:"/images/gal-repair-2.jpg",    title:"Pump Service & Repair",       category:"Repairs"},
  {id:22, src:"/images/gal-repair-3.jpg",    title:"Plumbing Repair",             category:"Repairs"},
  {id:23, src:"/images/gal-repair-4.jpg",    title:"Motor Replacement",           category:"Repairs"},
];

const DEF_TESTI = [
  {id:1,name:"Sarah M.",loc:"Buford, GA",rating:5,text:"Fixed our pump issue that two other companies couldn't figure out. Showed up on time, explained everything clearly. Our pool has never looked better.",date:"2025"},
  {id:2,name:"Jason R.",loc:"Cumming, GA",rating:5,text:"Called about a green pool situation — it was bad. Within a few days it was crystal clear. These guys know what they're doing and they're honest.",date:"2025"},
  {id:3,name:"Linda H.",loc:"Sugar Hill, GA",rating:5,text:"Finally found a pool company that communicates. They text when on the way, explain what they're doing, and follow up after. Refreshing.",date:"2025"},
  {id:4,name:"Mike T.",loc:"Braselton, GA",rating:5,text:"Had a heater that wouldn't work and a filter that kept clogging. Found the root cause on the first visit. Honest assessment, fair price.",date:"2025"},
  {id:5,name:"Carrie B.",loc:"Gainesville, GA",rating:5,text:"Seasonal opening done perfectly. Pool was swim-ready same day. Now on monthly maintenance and couldn't be happier.",date:"2025"},
];

const SVC = [
  {id:1,title:"Pool Cleaning & Maintenance",tag:"Crystal Clear, Year Round",color:"#0077C8",
   desc:"Reliable routine cleaning including skimming, brushing, vacuuming, and full chemical balancing to keep your pool swim-ready at all times.",
   detail:"Whether your pool is already in great condition or needs consistent upkeep, we ensure it stays crystal clear year-round with scheduled visits tailored to your needs.",
   signs:["Water looks dull or hazy","Pool hasn't been cleaned in weeks","Chemistry keeps falling out of balance","Want a set-it-and-forget-it maintenance plan"]},
  {id:2,title:"Algae Removal & Green Pool Cleanups",tag:"From Green to Gleaming",color:"#5BAA32",
   desc:"We specialize in full-service cleanups that remove algae, restore water clarity, and bring neglected pools back to life quickly and efficiently.",
   detail:"If your pool has turned green or been neglected, our team removes algae, restores chemistry, and gets you back in the water fast. We also advise on prevention going forward.",
   signs:["Pool water has turned green","Visible algae on walls or floor","Pool hasn't been serviced in a long time","Water is extremely cloudy"]},
  {id:3,title:"Pool Repairs & Equipment Service",tag:"Fix It Right, Fix It Fast",color:"#00A8E8",
   desc:"We handle a wide range of pool equipment repairs and replacements — pumps, motors, heaters, valves, plumbing, and more.",
   detail:"If it's on your pool pad, we have the knowledge and experience to fix or replace it. We diagnose the root cause rather than just patching symptoms.",
   signs:["Pump making unusual noises","Heater not warming water","Valves stuck or not operating","Leaking around equipment"]},
  {id:4,title:"Salt Systems & Chlorinators",tag:"Properly Sanitized, Always",color:"#006494",
   desc:"We install and replace salt cells and chlorination systems, and can troubleshoot existing systems to ensure optimal sanitization.",
   detail:"Salt systems are a great way to maintain consistent sanitation with less manual work. We install, replace, and service all major brands of salt cells and chlorinators.",
   signs:["Salt cell not producing chlorine","Chlorinator not dispensing properly","Sanitizer levels keep dropping","Looking to switch to a salt system"]},
  {id:5,title:"Water Testing & Chemical Balancing",tag:"Safe Water, Happy Swimmers",color:"#007EA7",
   desc:"Accurate water testing and expert chemical balancing to protect your equipment and keep your water clean, safe, and healthy.",
   detail:"Proper water chemistry is the foundation of a healthy pool. We test all key parameters and balance chemicals precisely to protect both swimmers and your pool equipment.",
   signs:["Water irritating eyes or skin","pH or alkalinity consistently off","Chlorine burning through too fast","Scale or staining on pool surfaces"]},
  {id:6,title:"Pool Openings & Closings",tag:"Ready When You Are",color:"#0077C8",
   desc:"Professional seasonal openings and closings to ensure your pool is properly prepared for the season ahead or protected during the off-season.",
   detail:"A proper opening and closing sets your pool up for success. We handle equipment startup, water chemistry, cover removal or installation, and a full system inspection.",
   signs:["Pool closed for the winter","Ready to open for spring/summer","Need help with cover removal","Unsure how to start up after winter"]},
  {id:7,title:"Upgrades & Automation Systems",tag:"Modern Control at Your Fingertips",color:"#5BAA32",
   desc:"We install and upgrade automation systems, giving you easy control over your pool's features, temperature, and cleaning systems.",
   detail:"Looking to modernize your pool? Automation systems let you control your pump, heater, lights, and more from your phone. We install and configure leading brands.",
   signs:["Want remote control of your pool","Looking to upgrade older equipment","Interested in energy-saving automation","Want to add smart features to your pool"]},
];

// ── STORAGE ──────────────────────────────────────────────
const safeGet = async (k, def) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : def; } catch { return def; } };
const safeSet = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch(e) { console.error(e); } };

// ── HOOKS ─────────────────────────────────────────────────
function useScrollAnim() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("vis"); });
    }, { threshold: 0.1 });
    const id = setTimeout(() => {
      document.querySelectorAll(".anim-fade-up").forEach(el => obs.observe(el));
    }, 60);
    return () => { clearTimeout(id); obs.disconnect(); };
  }, []);
}
function useCounter(target, run) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let cur = 0; const step = target / 60;
    const t = setInterval(() => { cur += step; if (cur >= target) { setN(target); clearInterval(t); } else setN(Math.round(cur)); }, 18);
    return () => clearInterval(t);
  }, [target, run]);
  return n;
}

// ── SHARED COMPONENTS ─────────────────────────────────────
const AnimIn = ({ children, delay=0, style={} }) => (
  <div className="anim-fade-up" style={{ transitionDelay:`${delay}ms`,...style }}>{children}</div>
);
function Bubble({ x, size, dur, delay }) {
  return <div style={{ position:"absolute",left:`${x}%`,bottom:0,width:size,height:size,borderRadius:"50%",background:`rgba(0,207,255,${0.04+Math.random()*0.14})`,border:"1px solid rgba(0,207,255,.22)",animation:`bubbleUp ${dur}s ease-in ${delay}s infinite`,pointerEvents:"none" }}/>;
}
function BubbleField({ count=14, z=0 }) {
  const bs = useRef([...Array(count)].map((_,i) => ({ key:i,x:Math.random()*96,size:`${4+Math.random()*14}px`,dur:3.5+Math.random()*5,delay:Math.random()*6 })));
  return <div style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:z,overflow:"hidden" }}>{bs.current.map(b => <Bubble key={b.key} {...b}/>)}</div>;
}
function WaveDiv({ topColor=C.ocean, botColor=C.ocean, flip=false }) {
  return (
    <div style={{ lineHeight:0,background:topColor,overflow:"hidden" }}>
      <svg viewBox="0 0 1440 72" style={{ display:"block",width:"100%",transform:flip?"scaleX(-1)":"none" }}>
        <path d="M0,36 C200,72 400,0 600,36 C800,72 1000,0 1200,36 C1320,54 1380,28 1440,36 L1440,72 L0,72Z" fill={botColor}/>
      </svg>
    </div>
  );
}
function AnimWaveBg() {
  return (
    <div style={{ position:"absolute",bottom:0,left:0,right:0,zIndex:3,lineHeight:0,overflow:"hidden" }}>
      <svg viewBox="0 0 1440 80" style={{ width:"200%",display:"block",animation:"waveScroll 16s linear infinite" }}>
        <path d="M0,48 C240,80 480,16 720,48 C960,80 1200,16 1440,48 L1440,80 L0,80Z" fill={C.ocean}/>
      </svg>
    </div>
  );
}
function PageBanner({ title, sub, img }) {
  return (
    <div style={{ position:"relative",overflow:"hidden",minHeight:300,display:"flex",alignItems:"center" }}>
      <div style={{ position:"absolute",inset:0 }}>
        <img src={img} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center" }} onError={e=>e.target.style.display="none"}/>
        <div style={{ position:"absolute",inset:0,background:"linear-gradient(to right,rgba(5,25,35,.92) 0%,rgba(5,25,35,.7) 60%,rgba(5,25,35,.45) 100%)" }}/>
      </div>
      <BubbleField count={8}/>
      <div style={{ position:"relative",zIndex:2,maxWidth:800,margin:"0 auto",padding:"80px 24px",textAlign:"center",width:"100%" }}>
        <AnimIn><h1 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(36px,6vw,66px)",color:"#fff",margin:"0 0 16px",letterSpacing:1.5,lineHeight:1.05 }}>{title}</h1></AnimIn>
        {sub && <AnimIn delay={100}><p style={{ color:"rgba(255,255,255,.75)",fontSize:17,lineHeight:1.75,maxWidth:600,margin:"0 auto" }}>{sub}</p></AnimIn>}
      </div>
      <div style={{ position:"absolute",bottom:0,left:0,right:0,lineHeight:0 }}>
        <svg viewBox="0 0 1440 48" style={{ display:"block",width:"100%" }}><path d="M0,24 C360,48 720,0 1080,24 C1260,36 1350,16 1440,24 L1440,48 L0,48Z" fill={C.ocean}/></svg>
      </div>
    </div>
  );
}
function RippleBtn({ children, onClick, bg=C.blue, color="#fff", style={}, href, type="button" }) {
  const [rips, setRips] = useState([]);
  const click = e => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRips(p => [...p,{id,x:e.clientX-r.left,y:e.clientY-r.top}]);
    setTimeout(() => setRips(p => p.filter(x=>x.id!==id)), 700);
    if (onClick) onClick(e);
  };
  const base = { position:"relative",overflow:"hidden",background:bg,color,border:"none",fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,fontFamily:"inherit",textDecoration:"none",transition:"filter .15s",...style };
  const ripEls = rips.map(r => <span key={r.id} style={{ position:"absolute",left:r.x-16,top:r.y-16,width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.35)",animation:"rippleOut .7s ease-out forwards",pointerEvents:"none" }}/>);
  if (href) return <a href={href} style={base} onClick={click} target={href.startsWith("http")?"_blank":undefined} rel="noopener noreferrer">{ripEls}{children}</a>;
  return <button type={type} style={base} onClick={click}>{ripEls}{children}</button>;
}
function SHead({ label, title, sub, light=false }) {
  return (
    <div style={{ textAlign:"center",marginBottom:52 }}>
      {label && <div style={{ display:"inline-block",borderRadius:30,padding:"6px 18px",marginBottom:16,background:light?"rgba(0,207,255,.14)":"rgba(0,119,200,.1)",color:light?C.bright:C.blue,fontWeight:800,fontSize:11,letterSpacing:2.5,textTransform:"uppercase",border:`1px solid ${light?"rgba(0,207,255,.3)":"rgba(0,119,200,.2)"}` }}>{label}</div>}
      <h2 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(30px,5vw,52px)",letterSpacing:1.2,lineHeight:1.1,color:light?"#fff":C.dark,margin:"0 0 14px" }}>{title}</h2>
      {sub && <p style={{ color:light?"rgba(255,255,255,.65)":C.muted,fontSize:17,maxWidth:620,margin:"0 auto",lineHeight:1.75 }}>{sub}</p>}
    </div>
  );
}

// ── LOADING SCREEN ────────────────────────────────────────
function LoadingScreen({ done, onDone }) {
  const [prog, setProg] = useState(0);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setProg(p => {
      const next = p + (p<55?2.8:p<80?1.6:0.9);
      if (next >= 100) { clearInterval(t); setTimeout(() => { setFading(true); setTimeout(onDone,520); },400); return 100; }
      return next;
    }), 38);
    return () => clearInterval(t);
  }, [onDone]);
  if (done) return null;
  const msgs = ["Getting your pool ready...","Checking equipment...","Clearing the water...","Almost swim-ready!"];
  const mi = prog<30?0:prog<60?1:prog<85?2:3;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,background:C.ocean,overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"opacity .55s ease",opacity:fading?0:1,pointerEvents:fading?"none":"all" }}>
      <div style={{ position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none" }}>
        <div style={{ position:"absolute",left:0,right:0,height:2,background:"rgba(0,207,255,.06)",animation:"scanLine 4s linear infinite" }}/>
      </div>
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:`${prog}%`,background:"linear-gradient(to top,rgba(0,119,200,.22),rgba(0,168,232,.08))",transition:"height .08s linear",borderTop:"1px solid rgba(0,207,255,.25)" }}/>
      <div style={{ position:"absolute",left:0,right:0,bottom:`calc(${prog}% - 1px)`,overflow:"hidden",height:28 }}>
        <svg viewBox="0 0 800 28" style={{ width:"200%",display:"block",animation:"waveScroll 2.2s linear infinite" }}>
          <path d="M0,14 C100,-2 200,28 300,14 C400,0 500,28 600,14 C700,0 800,28 800,14 L800,28 L0,28Z" fill="rgba(0,168,232,.35)"/>
        </svg>
      </div>
      <BubbleField count={18}/>
      <div style={{ width:120,height:120,borderRadius:"50%",overflow:"hidden",marginBottom:24,position:"relative",zIndex:1,animation:"glow 2.2s ease-in-out infinite",border:"3px solid rgba(0,207,255,.4)",flexShrink:0 }}>
        <img src="/images/logo-circle.png" alt="Fowler Brothers" style={{ width:"100%",height:"100%",objectFit:"cover" }}
          onError={e=>{e.target.style.display="none";e.target.parentElement.style.background="linear-gradient(135deg,#0077C8,#00CFFF)";}}/>
      </div>
      <div style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:26,color:"#fff",letterSpacing:5,position:"relative",zIndex:1 }}>FOWLER BROTHERS</div>
      <div style={{ fontSize:11,color:C.cyan,letterSpacing:5,marginBottom:48,position:"relative",zIndex:1 }}>POOL SERVICE</div>
      <div style={{ width:260,position:"relative",zIndex:1 }}>
        <div style={{ height:5,background:"rgba(255,255,255,.1)",borderRadius:3,overflow:"hidden",marginBottom:12 }}>
          <div style={{ height:"100%",width:`${prog}%`,background:"linear-gradient(90deg,#0077C8,#00CFFF)",borderRadius:3,transition:"width .08s linear" }}/>
        </div>
        <div style={{ textAlign:"center",color:"rgba(255,255,255,.35)",fontSize:12 }}>{msgs[mi]}</div>
      </div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────
function Nav({ page, setPage, scrolled }) {
  const [menu, setMenu] = useState(false);
  const links = [{id:"home",l:"Home"},{id:"services",l:"Services"},{id:"about",l:"About"},{id:"areas",l:"Service Areas"},{id:"gallery",l:"Gallery"},{id:"contact",l:"Contact"}];
  return (
    <>
      <nav style={{ position:"sticky",top:0,zIndex:500,background:scrolled||menu?"rgba(5,25,35,.96)":"transparent",backdropFilter:scrolled||menu?"blur(16px)":"none",WebkitBackdropFilter:scrolled||menu?"blur(16px)":"none",borderBottom:scrolled||menu?`1px solid ${C.glB}`:"none",transition:"background .3s" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:68 }}>
          <button onClick={() => setPage("home")} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10 }}>
            {/* Nav uses logo_2 (the wordmark/square logo) */}
            <img src="/images/logo-main.jpg" alt="Fowler Brothers Pool Service" style={{ height:46,width:"auto",borderRadius:8,objectFit:"contain" }} onError={e=>e.target.style.display="none"}/>
          </button>
          <div style={{ display:"flex",gap:2,alignItems:"center" }} className="desk-nav">
            {links.map(l => (
              <button key={l.id} onClick={() => setPage(l.id)} style={{ background:page===l.id?"rgba(0,119,200,.28)":"transparent",border:"none",color:page===l.id?"#fff":"rgba(255,255,255,.72)",fontWeight:page===l.id?700:500,fontSize:13.5,padding:"7px 13px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",letterSpacing:.3,transition:"all .15s" }}>{l.l}</button>
            ))}
          </div>
          <div style={{ display:"flex",gap:10,alignItems:"center" }}>
            <RippleBtn href="tel:+14705890194" bg={C.green} style={{ padding:"9px 16px",borderRadius:9,fontSize:13,letterSpacing:.3,boxShadow:"0 4px 14px rgba(91,170,50,.35)" }} className="hide-sm">📞 Call Now</RippleBtn>
            <button onClick={() => setMenu(!menu)} style={{ background:"none",border:`1px solid ${C.glB}`,color:"#fff",cursor:"pointer",width:42,height:42,borderRadius:9,fontSize:18,display:"none",alignItems:"center",justifyContent:"center",fontFamily:"inherit" }} className="mob-ham">{menu?"✕":"☰"}</button>
          </div>
        </div>
        {menu && (
          <div style={{ background:"rgba(5,25,35,.98)",borderTop:`1px solid ${C.glB}`,padding:"10px 16px 18px" }}>
            {links.map(l => (
              <button key={l.id} onClick={() => { setPage(l.id); setMenu(false); }} style={{ display:"block",width:"100%",textAlign:"left",background:page===l.id?"rgba(0,119,200,.22)":"transparent",border:"none",color:"#fff",fontWeight:600,fontSize:15,padding:"12px 14px",borderRadius:8,cursor:"pointer",marginBottom:3,fontFamily:"inherit" }}>{l.l}</button>
            ))}
            <RippleBtn href="tel:+14705890194" bg={C.green} style={{ display:"block",textAlign:"center",padding:"13px",borderRadius:10,fontSize:14,marginTop:8,width:"100%" }}>📞 Call or Text (470) 589-0194</RippleBtn>
          </div>
        )}
      </nav>
      <div className="mob-bar" style={{ position:"fixed",bottom:0,left:0,right:0,zIndex:499,background:"rgba(5,25,35,.97)",borderTop:`2px solid ${C.blue}`,padding:"8px 12px 14px",display:"none" }}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
          {[["📞","Call","tel:+14705890194",C.green],["💬","Text","sms:+14705890194",C.blue],["📋","Request",null,C.teal]].map(([ico,lbl,hr,bg]) => (
            hr ? <a key={lbl} href={hr} style={{ background:bg,color:"#fff",textAlign:"center",padding:"10px 4px",borderRadius:9,textDecoration:"none",fontWeight:700,fontSize:12,display:"block" }}>{ico} {lbl}</a>
               : <button key={lbl} onClick={() => setPage("contact")} style={{ background:bg,color:"#fff",textAlign:"center",padding:"10px 4px",borderRadius:9,border:"none",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit" }}>{ico} {lbl}</button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────
function HomePage({ setPage }) {
  useScrollAnim();
  const statsRef = useRef(null);
  const [sv, setSv] = useState(false);
  const [ti, setTi] = useState(0);
  const [faq, setFaq] = useState(null);
  const yrs = useCounter(8, sv);
  const cust = useCounter(100, sv);

  useEffect(() => {
    const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) setSv(true); });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    const t = setInterval(() => setTi(i => (i+1)%DEF_TESTI.length), 5200);
    return () => clearInterval(t);
  }, []);

  const faqs = [
    {q:"How do I know if my pump or filter needs repair?",a:"Common signs include unusual noises, weak water flow, leaking around the pump, or cloudy water that won't clear. Call or text us and we'll help diagnose it."},
    {q:"Do you handle green or neglected pools?",a:"Yes. If your pool has turned green or been sitting neglected, we specialize in full-service cleanups to get it back to swim-ready condition."},
    {q:"Do you offer routine maintenance?",a:"Absolutely. We offer scheduled maintenance plans to keep your pool clean, balanced, and running properly all season long."},
    {q:"What areas do you serve?",a:"We primarily serve Buford and surrounding North Georgia communities including Sugar Hill, Duluth, Cumming, Braselton, Gainesville, Dawsonville, Dahlonega, and nearby areas."},
    {q:"Can I send photos of my pool problem?",a:"Yes — photos help a lot. Text them directly to (470) 589-0194 or include a description in our contact form."},
    {q:"Do you install automation systems?",a:"Yes. We install and configure automation systems that let you control your pool's pump, heater, lights, and more from your smartphone."},
  ];

  return (
    <>
      {/* HERO — uses overhead swim photo */}
      <div style={{ position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0 }}>
          <img src="/images/hero-overhead-swim.jpg" alt="" style={{ width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top" }} onError={e=>e.target.style.display="none"}/>
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(to right,rgba(5,25,35,.93) 0%,rgba(5,25,35,.65) 55%,rgba(5,25,35,.3) 100%)" }}/>
          <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 25% 45%,rgba(0,207,255,.12) 0%,transparent 55%)" }}/>
        </div>
        <BubbleField count={14} z={1}/>
        <div style={{ position:"relative",zIndex:2,maxWidth:1100,margin:"0 auto",padding:"80px 24px 130px",width:"100%" }}>
          <div style={{ maxWidth:640 }}>
            <AnimIn>
              <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(91,170,50,.16)",border:"1px solid rgba(91,170,50,.42)",borderRadius:30,padding:"7px 18px",marginBottom:24,color:C.green,fontWeight:700,fontSize:12,letterSpacing:2 }}>📍 BUFORD &amp; NORTH GEORGIA</div>
            </AnimIn>
            <AnimIn delay={80}>
              {/* Circle photo logo in hero */}
              <div style={{ marginBottom:22 }}>
                <img src="/images/logo-circle.png" alt="Fowler Brothers Pool Service" style={{ width:110,height:110,borderRadius:"50%",objectFit:"cover",border:"3px solid rgba(0,207,255,.35)",boxShadow:"0 0 30px rgba(0,207,255,.25)" }} onError={e=>e.target.style.display="none"}/>
              </div>
            </AnimIn>
            <AnimIn delay={140}>
              <h1 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(44px,7vw,82px)",color:"#fff",lineHeight:1.04,margin:"0 0 22px",letterSpacing:1.5 }}>
                LOCAL BROTHERS.<br/>
                <span style={{ color:C.cyan,textShadow:"0 0 40px rgba(0,207,255,.4)" }}>CLEAN POOLS.</span><br/>
                CLEAR RESULTS.
              </h1>
            </AnimIn>
            <AnimIn delay={220}>
              <p style={{ color:"rgba(255,255,255,.8)",fontSize:"clamp(15px,2vw,18px)",lineHeight:1.8,marginBottom:36,fontWeight:300 }}>
                Family-owned pool service based in Buford, GA. We bring 8+ years of experience to every job — from routine maintenance and chemical balancing to full equipment repairs, algae cleanups, and automation upgrades.
              </p>
            </AnimIn>
            <AnimIn delay={300}>
              <div style={{ display:"flex",flexWrap:"wrap",gap:14,marginBottom:36 }}>
                <RippleBtn href="tel:+14705890194" bg={C.green} style={{ padding:"15px 28px",borderRadius:12,fontSize:15,boxShadow:"0 6px 22px rgba(91,170,50,.4)" }}>📞 Call or Text Now</RippleBtn>
                <RippleBtn onClick={() => setPage("contact")} bg="rgba(255,255,255,.1)" style={{ padding:"15px 28px",borderRadius:12,fontSize:15,border:`1px solid ${C.glB}`,backdropFilter:"blur(8px)" }}>Request Service →</RippleBtn>
              </div>
            </AnimIn>
            <AnimIn delay={400}>
              <div style={{ display:"flex",flexWrap:"wrap",gap:18 }}>
                {["8+ Years Experience","Family-Owned","North Georgia Local","Honest & Reliable"].map(t => (
                  <span key={t} style={{ color:"rgba(255,255,255,.6)",fontSize:13,display:"flex",alignItems:"center",gap:6 }}><span style={{ color:C.green,fontSize:16 }}>✓</span>{t}</span>
                ))}
              </div>
            </AnimIn>
          </div>
        </div>
        <AnimWaveBg/>
      </div>

      {/* STATS */}
      <div ref={statsRef} style={{ background:C.ocean,padding:"64px 24px" }}>
        <div style={{ maxWidth:960,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:36,textAlign:"center" }}>
          {[{n:yrs,s:"+",l:"Years Experience",ico:"📅"},{n:cust,s:"+",l:"Happy Customers",ico:"😊"},{n:"7+",s:"",l:"Service Types",ico:"🛠️"},{n:"100",s:"%",l:"Family Owned",ico:"🏡"}].map(s => (
            <div key={s.l} style={{ opacity:sv?1:0,transition:"opacity .6s ease" }}>
              <div style={{ fontSize:28,marginBottom:6 }}>{s.ico}</div>
              <div style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:56,color:C.cyan,lineHeight:1 }}>{s.n}{s.s}</div>
              <div style={{ color:"rgba(255,255,255,.5)",fontSize:13,fontWeight:600,marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <WaveDiv topColor={C.ocean} botColor="#F0FBFF"/>

      {/* SERVICES — uses logo_2 (wordmark) for service icons */}
      <div style={{ background:"#F0FBFF",padding:"80px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <AnimIn><SHead label="What We Do" title="Comprehensive Pool Care Solutions" sub="From routine maintenance to complete restorations — our experienced team is ready to help."/></AnimIn>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:22 }}>
            {SVC.map((s,i) => (
              <AnimIn key={s.id} delay={i*55}>
                <div className="hover-lift" onClick={() => setPage("services")} style={{ background:"#fff",borderRadius:18,padding:"28px 24px",boxShadow:"0 4px 20px rgba(0,50,100,.07)",borderTop:`4px solid ${s.color}`,cursor:"pointer",height:"100%",transition:"all .2s",display:"flex",flexDirection:"column",gap:12 }}>
                  {/* logo_2 wordmark used as service card icon */}
                  <img src="/images/logo-main.jpg" alt="Fowler Brothers" style={{ width:70,height:52,objectFit:"contain",borderRadius:6 }} onError={e=>e.target.style.display="none"}/>
                  <h3 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:21,color:C.dark,letterSpacing:.5 }}>{s.title}</h3>
                  <div style={{ fontSize:10.5,color:s.color,fontWeight:800,letterSpacing:1.5,textTransform:"uppercase" }}>{s.tag}</div>
                  <p style={{ color:C.muted,fontSize:13.5,lineHeight:1.7,flex:1 }}>{s.desc}</p>
                  <span style={{ color:s.color,fontWeight:700,fontSize:13 }}>Learn More →</span>
                </div>
              </AnimIn>
            ))}
          </div>
        </div>
      </div>

      <WaveDiv topColor="#F0FBFF" botColor={C.deep}/>

      {/* MISSION STATEMENT */}
      <div style={{ background:C.deep,padding:"80px 24px",position:"relative",overflow:"hidden" }}>
        <BubbleField count={10}/>
        <div style={{ maxWidth:860,margin:"0 auto",position:"relative",zIndex:1,textAlign:"center" }}>
          <AnimIn>
            <div style={{ fontSize:48,marginBottom:20,animation:"float 4s ease-in-out infinite" }}>💧</div>
            <div style={{ display:"inline-block",background:"rgba(0,207,255,.14)",color:C.bright,fontWeight:800,fontSize:11,letterSpacing:2.5,padding:"6px 18px",borderRadius:20,marginBottom:24,border:"1px solid rgba(0,207,255,.3)",textTransform:"uppercase" }}>Our Mission</div>
            <blockquote style={{ fontSize:"clamp(16px,2.2vw,21px)",color:"rgba(255,255,255,.9)",lineHeight:1.85,fontStyle:"italic",marginBottom:32,fontWeight:300 }}>
              "At Fowler Brothers Pool Service, we don't just maintain pools — we bring peace of mind to every family and business we serve. Fueled by a lifelong passion for pools, we've spent over eight years perfecting a service that blends skill, integrity, and a deep commitment to our customers. We aim to go beyond basic care by building lasting relationships, ensuring every pool is a source of pride, safety, and enjoyment. Our mission is to set a new standard in pool care — where every detail matters, and every customer feels like family."
            </blockquote>
            <div style={{ display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap" }}>
              <RippleBtn onClick={() => setPage("about")} bg="rgba(255,255,255,.1)" style={{ padding:"13px 24px",borderRadius:10,border:`1px solid ${C.glB}`,fontSize:14 }}>Meet the Brothers →</RippleBtn>
              <RippleBtn href="tel:+14705890194" bg={C.green} style={{ padding:"13px 24px",borderRadius:10,fontSize:14 }}>📞 Call or Text</RippleBtn>
            </div>
          </AnimIn>
        </div>
      </div>

      <WaveDiv topColor={C.deep} botColor="#fff" flip/>

      {/* TESTIMONIALS */}
      <div style={{ background:"#fff",padding:"80px 24px",overflow:"hidden" }}>
        <div style={{ maxWidth:820,margin:"0 auto" }}>
          <AnimIn><SHead label="Customer Reviews" title="What North Georgia Homeowners Say"/></AnimIn>
          <AnimIn>
            <div style={{ position:"relative" }}>
              {DEF_TESTI.map((t,i) => (
                <div key={t.id} style={{ display:i===ti?"block":"none",background:"linear-gradient(135deg,#F0FBFF,#E2F4FF)",borderRadius:22,padding:"44px 48px",border:"1px solid rgba(0,119,200,.12)",boxShadow:"0 10px 36px rgba(0,119,200,.1)",animation:i===ti?"fadeIn .4s ease":"none" }}>
                  <div style={{ display:"flex",gap:3,marginBottom:18 }}>{[...Array(t.rating)].map((_,j) => <span key={j} style={{ color:"#F59E0B",fontSize:24 }}>★</span>)}</div>
                  <p style={{ color:C.dark,fontSize:18,lineHeight:1.85,fontStyle:"italic",marginBottom:26 }}>"{t.text}"</p>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <div><div style={{ fontWeight:800,color:C.dark,fontSize:16 }}>{t.name}</div><div style={{ color:C.muted,fontSize:13 }}>{t.loc}</div></div>
                    <div style={{ color:C.blue,fontSize:13,fontWeight:700 }}>{t.date}</div>
                  </div>
                </div>
              ))}
              <div style={{ display:"flex",gap:8,justifyContent:"center",marginTop:24 }}>
                {DEF_TESTI.map((_,i) => <button key={i} onClick={() => setTi(i)} style={{ height:10,width:i===ti?28:10,borderRadius:5,border:"none",background:i===ti?C.blue:"rgba(0,119,200,.22)",cursor:"pointer",transition:"all .2s" }}/>)}
              </div>
            </div>
          </AnimIn>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background:"#F0FBFF",padding:"80px 24px" }}>
        <div style={{ maxWidth:820,margin:"0 auto" }}>
          <AnimIn><SHead label="Common Questions" title="Pool Service FAQ"/></AnimIn>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {faqs.map((f,i) => (
              <AnimIn key={i} delay={i*40}>
                <div style={{ background:"#fff",borderRadius:14,border:`1px solid ${faq===i?"rgba(0,119,200,.4)":"rgba(0,0,0,.08)"}`,overflow:"hidden",transition:"border-color .2s" }}>
                  <button onClick={() => setFaq(faq===i?null:i)} style={{ width:"100%",textAlign:"left",background:"none",border:"none",padding:"18px 22px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,fontFamily:"inherit" }}>
                    <span style={{ fontWeight:700,fontSize:15,color:C.dark }}>{f.q}</span>
                    <span style={{ color:C.blue,fontSize:22,flexShrink:0,transition:"transform .2s",transform:faq===i?"rotate(45deg)":"none" }}>+</span>
                  </button>
                  {faq===i && <div style={{ padding:"0 22px 20px",color:C.muted,fontSize:14,lineHeight:1.8 }}>{f.a}</div>}
                </div>
              </AnimIn>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ background:`linear-gradient(135deg,${C.navy},${C.pool})`,padding:"80px 24px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <BubbleField count={8}/>
        <div style={{ position:"relative",zIndex:1,maxWidth:680,margin:"0 auto" }}>
          <img src="/images/logo-circle.png" alt="" style={{ width:90,height:90,borderRadius:"50%",objectFit:"cover",marginBottom:24,border:"3px solid rgba(0,207,255,.3)",animation:"float 4s ease-in-out infinite" }} onError={e=>e.target.style.display="none"}/>
          <h2 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(36px,5vw,58px)",color:"#fff",margin:"0 0 18px",letterSpacing:1.5 }}>NEED POOL HELP?<br/><span style={{ color:C.cyan }}>CALL THE BROTHERS.</span></h2>
          <p style={{ color:"rgba(255,255,255,.75)",fontSize:17,lineHeight:1.75,marginBottom:36 }}>Whether your pool needs a quick repair, a full cleanup, equipment troubleshooting, or ongoing maintenance — Fowler Brothers Pool Service is ready to help.</p>
          <div style={{ display:"flex",flexWrap:"wrap",gap:16,justifyContent:"center" }}>
            <RippleBtn href="tel:+14705890194" bg={C.green} style={{ padding:"16px 32px",borderRadius:12,fontSize:16,boxShadow:"0 6px 24px rgba(91,170,50,.4)" }}>📞 (470) 589-0194</RippleBtn>
            <RippleBtn href="sms:+14705890194" bg="rgba(255,255,255,.12)" style={{ padding:"16px 32px",borderRadius:12,fontSize:16,border:`1px solid ${C.glB}` }}>💬 Text Us</RippleBtn>
          </div>
        </div>
      </div>
    </>
  );
}

// ── SERVICES PAGE ─────────────────────────────────────────
function ServicesPage({ setPage }) {
  useScrollAnim();
  const [active, setActive] = useState(null);
  return (
    <>
      {/* Banner uses pool tiles photo */}
      <PageBanner title="OUR SERVICES" sub="Comprehensive pool care solutions to keep your pool clean, safe, and running at peak performance. Whether your pool needs routine maintenance or a complete restoration, our experienced team is ready to help." img="/images/hero-pool-tiles.jpg"/>
      <div style={{ background:"#F0FBFF",padding:"72px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",gap:20 }}>
          {SVC.map((s,i) => (
            <AnimIn key={s.id} delay={i*40}>
              <div className="hover-lift" style={{ background:"#fff",borderRadius:20,overflow:"hidden",boxShadow:"0 4px 20px rgba(0,50,100,.08)",border:`1px solid ${active===s.id?"rgba(0,119,200,.3)":"rgba(0,0,0,.06)"}`,transition:"all .2s",cursor:"pointer" }} onClick={() => setActive(active===s.id?null:s.id)}>
                <div style={{ display:"grid",gridTemplateColumns:"8px 1fr auto",alignItems:"center" }}>
                  <div style={{ background:`linear-gradient(180deg,${s.color},${s.color}99)`,alignSelf:"stretch" }}/>
                  <div style={{ padding:"26px 28px 26px 22px",display:"flex",gap:20,alignItems:"center" }}>
                    {/* logo_2 wordmark icon on service rows */}
                    <img src="/images/logo-main.jpg" alt="FB" style={{ width:60,height:44,objectFit:"contain",borderRadius:6,flexShrink:0 }} onError={e=>e.target.style.display="none"}/>
                    <div style={{ flex:1 }}>
                      <h3 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:24,color:C.dark,marginBottom:3,letterSpacing:.5 }}>{s.title}</h3>
                      <div style={{ fontSize:10.5,color:s.color,fontWeight:800,letterSpacing:1.5,marginBottom:8,textTransform:"uppercase" }}>{s.tag}</div>
                      <p style={{ color:C.muted,fontSize:14,lineHeight:1.7,margin:0 }}>{s.desc}</p>
                    </div>
                  </div>
                  <span style={{ color:C.muted,fontSize:22,transition:"transform .2s",transform:active===s.id?"rotate(180deg)":"none",paddingRight:20 }}>⌄</span>
                </div>
                {active===s.id && (
                  <div style={{ borderTop:"1px solid rgba(0,0,0,.06)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,padding:"28px 32px" }} className="two-col">
                    <div>
                      <div style={{ fontWeight:700,fontSize:13,color:C.dark,marginBottom:12,textTransform:"uppercase",letterSpacing:.5 }}>More Details</div>
                      <p style={{ color:C.muted,fontSize:14,lineHeight:1.8 }}>{s.detail}</p>
                      <RippleBtn onClick={e=>{e.stopPropagation();setPage("contact");}} bg={s.color} style={{ marginTop:20,padding:"11px 22px",borderRadius:10,fontSize:13 }}>Request This Service →</RippleBtn>
                    </div>
                    <div style={{ background:`${s.color}08`,borderRadius:14,padding:"20px 22px" }}>
                      <div style={{ fontWeight:800,fontSize:11,color:s.color,marginBottom:14,letterSpacing:1,textTransform:"uppercase" }}>Common Signs You Need This</div>
                      {s.signs.map(sg => (
                        <div key={sg} style={{ display:"flex",gap:10,marginBottom:10,color:C.dark,fontSize:13,fontWeight:500 }}>
                          <span style={{ color:C.green,flexShrink:0,marginTop:1 }}>✓</span>{sg}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AnimIn>
          ))}
        </div>
      </div>
    </>
  );
}

// ── ABOUT PAGE ─────────────────────────────────────────────
function AboutPage({ setPage }) {
  useScrollAnim();
  return (
    <>
      {/* Banner uses water ripple photo */}
      <PageBanner title="ABOUT US" sub="A family-owned pool service company built on skill, integrity, and a deep commitment to our customers." img="/images/hero-water.jpg"/>
      <div style={{ background:"#fff",padding:"80px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start" }} className="two-col">
          <AnimIn>
            {/* Circle photo (logo.webp) prominently on about page */}
            <div style={{ borderRadius:"50%",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,50,100,.2)",border:`4px solid ${C.blue}`,maxWidth:380,margin:"0 auto 28px" }}>
              <img src="/images/logo-circle.png" alt="Fowler Brothers Pool Service — The Brothers" style={{ width:"100%",display:"block",objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>
            </div>
            {/* logo_2 wordmark below the photo */}
            <div style={{ textAlign:"center" }}>
              <img src="/images/logo-main.jpg" alt="Fowler Brothers Pool Service" style={{ maxWidth:220,width:"100%",borderRadius:10,objectFit:"contain",margin:"0 auto" }} onError={e=>e.target.style.display="none"}/>
            </div>
          </AnimIn>
          <div>
            <AnimIn><div style={{ display:"inline-block",background:"rgba(0,119,200,.1)",color:C.blue,fontWeight:800,fontSize:11,letterSpacing:2.5,padding:"5px 16px",borderRadius:20,marginBottom:20 }}>OUR STORY</div></AnimIn>
            <AnimIn delay={80}><h2 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:38,color:C.dark,margin:"0 0 22px",letterSpacing:1 }}>FOWLER BROTHERS POOL SERVICE</h2></AnimIn>
            <AnimIn delay={100}><p style={{ color:C.muted,fontSize:15,lineHeight:1.9,marginBottom:18 }}>At Fowler Brothers Pool Service, we are a family-owned and operated business with over eight years of dedicated experience in the pool industry. Founded by two brothers who grew up with a passion for pools, that passion drives everything we do.</p></AnimIn>
            <AnimIn delay={130}><p style={{ color:C.muted,fontSize:15,lineHeight:1.9,marginBottom:18 }}>Over the years, we've cultivated a reputation for consistent, high-quality service and a commitment to excellence in every project we take on. We bring a hands-on approach to every aspect of pool care — from routine cleaning and chemical balancing to complex repairs and advanced automation upgrades.</p></AnimIn>
            <AnimIn delay={160}><p style={{ color:C.muted,fontSize:15,lineHeight:1.9,marginBottom:28 }}>Every task is handled with precision, and we take time to understand each customer's unique needs. Our goal is not just to service your pool, but to build long-term relationships founded on trust, integrity, and personalized attention. We believe in clear communication, fair pricing, and treating every pool like our own.</p></AnimIn>
            <AnimIn delay={200}>
              <div style={{ background:"#F0FBFF",borderRadius:16,padding:"24px",marginBottom:28 }}>
                <div style={{ fontWeight:900,fontSize:15,color:C.dark,marginBottom:16 }}>What Good Service Looks Like to Us</div>
                {["Clear communication before, during, and after every job","Hands-on precision with every task","Understanding each customer's unique needs","Fair pricing with no hidden surprises","Building long-term relationships, not one-time transactions","Treating every pool like our own"].map(pt => (
                  <div key={pt} style={{ display:"flex",gap:10,marginBottom:10,color:C.dark,fontSize:14,fontWeight:500 }}><span style={{ color:C.green }}>✓</span>{pt}</div>
                ))}
              </div>
            </AnimIn>
            <AnimIn delay={240}>
              <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
                <RippleBtn href="tel:+14705890194" bg={C.green} style={{ padding:"12px 22px",borderRadius:10,fontSize:14 }}>📞 (470) 589-0194</RippleBtn>
                <RippleBtn onClick={() => setPage("contact")} bg="transparent" color={C.blue} style={{ padding:"12px 22px",borderRadius:10,fontSize:14,border:`2px solid ${C.blue}` }}>Request Service</RippleBtn>
              </div>
            </AnimIn>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <WaveDiv topColor="#fff" botColor={C.deep}/>
      <div style={{ background:C.deep,padding:"80px 24px",position:"relative",overflow:"hidden" }}>
        <BubbleField count={10}/>
        <div style={{ maxWidth:860,margin:"0 auto",position:"relative",zIndex:1,textAlign:"center" }}>
          <AnimIn>
            <div style={{ display:"inline-block",background:"rgba(0,207,255,.14)",color:C.bright,fontWeight:800,fontSize:11,letterSpacing:2.5,padding:"6px 18px",borderRadius:20,marginBottom:24,border:"1px solid rgba(0,207,255,.3)",textTransform:"uppercase" }}>Our Mission</div>
            <blockquote style={{ fontSize:"clamp(15px,2.2vw,20px)",color:"rgba(255,255,255,.9)",lineHeight:1.9,fontStyle:"italic",marginBottom:32,fontWeight:300 }}>
              "At Fowler Brothers Pool Service, we don't just maintain pools — we bring peace of mind to every family and business we serve. Fueled by a lifelong passion for pools, we've spent over eight years perfecting a service that blends skill, integrity, and a deep commitment to our customers. We aim to go beyond basic care by building lasting relationships, ensuring every pool is a source of pride, safety, and enjoyment. Our mission is to set a new standard in pool care — where every detail matters, and every customer feels like family."
            </blockquote>
          </AnimIn>
        </div>
      </div>

      <WaveDiv topColor={C.deep} botColor="#F0FBFF"/>
      <div style={{ background:"#F0FBFF",padding:"72px 24px" }}>
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <AnimIn><SHead label="Our Values" title="How We Work" sub="Simple expectations, consistently delivered."/></AnimIn>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:18 }}>
            {[
              {ico:"📞",t:"Easy to Reach",d:"Call or text us. We respond promptly and keep you updated."},
              {ico:"🏡",t:"Family-Owned",d:"We're not a franchise. We're brothers who care about our community."},
              {ico:"💡",t:"Honest Assessments",d:"We explain what's going on without jargon or unnecessary upsells."},
              {ico:"✅",t:"Follow-Through",d:"We do the work we say we'll do, when we say we'll do it."},
              {ico:"🔧",t:"8+ Years Experience",d:"Real-world expertise across repairs, maintenance, and advanced systems."},
              {ico:"🤝",t:"Long-Term Relationships",d:"We build trust over time, not just one-time transactions."},
            ].map(v => (
              <AnimIn key={v.t}><div style={{ background:"#fff",borderRadius:16,padding:"24px 20px",boxShadow:"0 4px 16px rgba(0,50,100,.07)" }}><div style={{ fontSize:32,marginBottom:10 }}>{v.ico}</div><div style={{ color:C.dark,fontWeight:700,fontSize:14,marginBottom:6 }}>{v.t}</div><div style={{ color:C.muted,fontSize:13,lineHeight:1.6 }}>{v.d}</div></div></AnimIn>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── AREAS PAGE ─────────────────────────────────────────────
function AreasPage({ setPage }) {
  useScrollAnim();
  const cities = [
    {city:"Buford, GA",desc:"Our primary service area. Pool repair, maintenance, equipment service, and cleanups for Buford homeowners."},
    {city:"Sugar Hill, GA",desc:"Pool repair and maintenance services for Sugar Hill residents."},
    {city:"Duluth, GA",desc:"Pool service, equipment repairs, and routine maintenance in Duluth."},
    {city:"Cumming, GA",desc:"Pool maintenance, leak detection, and equipment service for Cumming homeowners."},
    {city:"Braselton, GA",desc:"Pool repair and maintenance services in the Braselton area."},
    {city:"Gainesville, GA",desc:"Pool equipment repair, heater and motor service for Gainesville homeowners."},
    {city:"Dawsonville, GA",desc:"Pool repair and maintenance serving Dawsonville and surrounding areas."},
    {city:"Dahlonega, GA",desc:"Pool service available in Dahlonega and North Georgia mountain communities."},
  ];
  return (
    <>
      <PageBanner title="SERVICE AREAS" sub="Pool repair, maintenance, and equipment service across Buford and North Georgia." img="/images/hero-pool-tiles.jpg"/>
      <div style={{ background:"#F0FBFF",padding:"72px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <AnimIn><SHead label="Where We Work" title="Communities We Serve"/></AnimIn>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20,marginBottom:32 }}>
            {cities.map(a => (
              <AnimIn key={a.city}>
                <div className="hover-lift" style={{ background:"#fff",borderRadius:16,padding:"26px 22px",boxShadow:"0 4px 16px rgba(0,50,100,.07)",borderLeft:`5px solid ${C.blue}` }}>
                  <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:10 }}><span style={{ fontSize:20 }}>📍</span><h3 style={{ fontWeight:800,fontSize:17,color:C.dark }}>{a.city}</h3></div>
                  <p style={{ color:C.muted,fontSize:13,lineHeight:1.7,marginBottom:14 }}>{a.desc}</p>
                  <button onClick={() => setPage("contact")} style={{ background:"none",border:"none",color:C.blue,fontWeight:700,fontSize:12,cursor:"pointer",padding:0,fontFamily:"inherit" }}>Request Service in {a.city.split(",")[0]} →</button>
                </div>
              </AnimIn>
            ))}
          </div>
          <AnimIn>
            <div style={{ background:`linear-gradient(135deg,${C.blue},${C.pool})`,borderRadius:18,padding:"32px",textAlign:"center" }}>
              <h3 style={{ color:"#fff",fontWeight:800,fontSize:20,marginBottom:10 }}>Don't See Your City?</h3>
              <p style={{ color:"rgba(255,255,255,.8)",fontSize:14,marginBottom:22,lineHeight:1.7 }}>We serve many surrounding North Georgia communities. Call or text to confirm we cover your area.</p>
              <RippleBtn href="tel:+14705890194" bg={C.green} style={{ padding:"12px 24px",borderRadius:10,fontSize:14 }}>📞 (470) 589-0194</RippleBtn>
            </div>
          </AnimIn>
        </div>
      </div>
    </>
  );
}

// ── GALLERY PAGE ───────────────────────────────────────────
function GalleryPage() {
  useScrollAnim();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [filter, setFilter] = useState("All");
  const timerRef = useRef(null);

  const cats = ["All","Cleaning","Before/After","Maintenance","Openings & Closings","Repairs"];
  const visible = filter==="All" ? ALL_GALLERY : ALL_GALLERY.filter(p=>p.category===filter);
  const catColor = c => c==="Before/After"?C.blue:c==="Cleaning"?C.green:c==="Repairs"?"#e55":c==="Maintenance"?C.pool:C.teal;

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setCurrent(c => (c+1)%ALL_GALLERY.length), 4000);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const goTo = i => { setCurrent(i); setPaused(true); setTimeout(()=>setPaused(false),8000); };
  const prev = () => goTo((current-1+ALL_GALLERY.length)%ALL_GALLERY.length);
  const next = () => goTo((current+1)%ALL_GALLERY.length);

  return (
    <>
      <PageBanner title="OUR WORK GALLERY" sub="Real photos from real jobs across North Georgia — before and after results, maintenance visits, and equipment service." img="/images/hero-overhead-swim.jpg"/>
      <div style={{ background:C.dark,padding:"0 0 56px" }}>
        <div style={{ position:"relative",maxWidth:1100,margin:"0 auto" }}>
          <div style={{ position:"relative",overflow:"hidden",borderRadius:"0 0 24px 24px",boxShadow:"0 24px 64px rgba(0,0,0,.5)" }}>
            {ALL_GALLERY.map((photo,i) => (
              <div key={i} style={{ position:i===0?"relative":"absolute",inset:0,opacity:i===current?1:0,transition:"opacity .7s ease",pointerEvents:i===current?"all":"none" }}>
                <img src={photo.src} alt={photo.title} style={{ width:"100%",height:520,objectFit:"cover",display:"block",cursor:"zoom-in" }} onClick={()=>setLightbox(photo)} onError={e=>{e.target.src=`https://placehold.co/800x520/003554/00CFFF?text=${encodeURIComponent(photo.title)}`;}}/>
                <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.3) 60%,transparent 100%)",padding:"32px 32px 28px" }}>
                  <div style={{ display:"inline-block",background:catColor(photo.category),color:"#fff",fontSize:11,fontWeight:800,letterSpacing:2,padding:"4px 12px",borderRadius:6,marginBottom:10,textTransform:"uppercase" }}>{photo.category}</div>
                  <div style={{ color:"#fff",fontFamily:"Bebas Neue,sans-serif",fontSize:"clamp(22px,3vw,34px)",letterSpacing:1 }}>{photo.title}</div>
                  <div style={{ color:"rgba(255,255,255,.5)",fontSize:12,marginTop:4 }}>{current+1} of {ALL_GALLERY.length}</div>
                </div>
              </div>
            ))}
            <button onClick={prev} style={{ position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.5)",border:"none",color:"#fff",width:48,height:48,borderRadius:"50%",cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",zIndex:10 }}>‹</button>
            <button onClick={next} style={{ position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.5)",border:"none",color:"#fff",width:48,height:48,borderRadius:"50%",cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",zIndex:10 }}>›</button>
            <button onClick={()=>setPaused(p=>!p)} style={{ position:"absolute",top:16,right:16,background:"rgba(0,0,0,.45)",border:"none",color:"#fff",width:36,height:36,borderRadius:"50%",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10 }}>{paused?"▶":"⏸"}</button>
          </div>
          <div style={{ display:"flex",gap:6,justifyContent:"center",marginTop:18,flexWrap:"wrap",padding:"0 24px" }}>
            {ALL_GALLERY.map((_,i) => <button key={i} onClick={()=>goTo(i)} style={{ width:i===current?28:8,height:8,borderRadius:4,border:"none",background:i===current?C.cyan:"rgba(255,255,255,.2)",cursor:"pointer",transition:"all .25s",padding:0 }}/>)}
          </div>
          <div style={{ display:"flex",gap:8,overflowX:"auto",padding:"14px 24px 0",scrollbarWidth:"thin",scrollbarColor:`${C.blue} rgba(255,255,255,.1)` }}>
            {ALL_GALLERY.map((photo,i) => (
              <div key={i} onClick={()=>goTo(i)} style={{ flexShrink:0,width:90,height:62,borderRadius:10,overflow:"hidden",cursor:"pointer",border:`2px solid ${i===current?C.cyan:"transparent"}`,opacity:i===current?1:.5,transition:"all .2s" }}>
                <img src={photo.src} alt={photo.title} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} onError={e=>{e.target.src="https://placehold.co/90x62/003554/00CFFF?text=Photo";}}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WaveDiv topColor={C.dark} botColor="#F0FBFF"/>
      <div style={{ background:"#F0FBFF",padding:"72px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <AnimIn><SHead label="Browse by Category" title="All Project Photos" sub="Click any photo to view full size."/></AnimIn>
          <AnimIn>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",marginBottom:36 }}>
              {cats.map(c => (
                <button key={c} onClick={()=>setFilter(c)} style={{ padding:"9px 20px",borderRadius:30,fontWeight:700,fontSize:13,cursor:"pointer",background:filter===c?C.blue:"#fff",color:filter===c?"#fff":C.muted,border:`2px solid ${filter===c?C.blue:"rgba(0,0,0,.1)"}`,fontFamily:"inherit",transition:"all .2s" }}>{c}{filter===c&&filter!=="All"?` (${visible.length})`:""}</button>
              ))}
            </div>
          </AnimIn>
          <div style={{ columns:"3 220px",gap:14 }}>
            {visible.map((photo,i) => (
              <AnimIn key={photo.id} delay={i*35}>
                <div className="hover-lift" style={{ borderRadius:14,overflow:"hidden",marginBottom:14,cursor:"zoom-in",boxShadow:"0 4px 16px rgba(0,50,100,.1)",breakInside:"avoid",position:"relative" }} onClick={()=>setLightbox(photo)}>
                  <img src={photo.src} alt={photo.title} style={{ width:"100%",display:"block",objectFit:"cover",transition:"transform .35s" }}
                    onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
                    onMouseLeave={e=>e.target.style.transform="scale(1)"}
                    onError={e=>{e.target.src="https://placehold.co/400x300/003554/00CFFF?text=Photo";}}/>
                </div>
              </AnimIn>
            ))}
          </div>
          <AnimIn>
            <div style={{ marginTop:48,background:`linear-gradient(135deg,${C.navy},${C.pool})`,borderRadius:18,padding:"36px",textAlign:"center" }}>
              <div style={{ fontSize:36,marginBottom:12 }}>📘</div>
              <h3 style={{ color:"#fff",fontWeight:800,fontSize:20,marginBottom:8 }}>See Our Latest Work on Facebook</h3>
              <p style={{ color:"rgba(255,255,255,.75)",fontSize:14,marginBottom:20,lineHeight:1.7 }}>Follow Fowler Brothers Pool Service for the most recent before-and-after photos and project updates.</p>
              <RippleBtn href="https://www.facebook.com/profile.php?id=61566480455878" bg={C.green} style={{ padding:"12px 24px",borderRadius:10,fontSize:14 }}>Follow on Facebook</RippleBtn>
            </div>
          </AnimIn>
        </div>
      </div>

      {lightbox && (
        <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.94)",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }} onClick={()=>setLightbox(null)}>
          <div style={{ maxWidth:960,width:"100%",animation:"fadeIn .2s ease" }} onClick={e=>e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.title} style={{ width:"100%",borderRadius:16,boxShadow:"0 20px 80px rgba(0,0,0,.6)",maxHeight:"80vh",objectFit:"contain" }}/>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:16 }}>
              <div><div style={{ color:"#fff",fontWeight:700,fontSize:17 }}>{lightbox.title}</div><div style={{ color:"rgba(255,255,255,.5)",fontSize:13,marginTop:3 }}>{lightbox.category}</div></div>
              <button onClick={()=>setLightbox(null)} style={{ background:"rgba(255,255,255,.1)",border:"none",color:"#fff",width:44,height:44,borderRadius:"50%",cursor:"pointer",fontSize:20,fontFamily:"inherit" }}>✕</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── CONTACT PAGE ───────────────────────────────────────────
function ContactPage() {
  useScrollAnim();
  const [form, setForm] = useState({name:"",phone:"",email:"",address:"",city:"",contact:"",services:[],description:"",urgency:"",window:""});
  const [status, setStatus] = useState(null);
  const svcOpts = ["Pool Cleaning & Maintenance","Algae Removal / Green Pool Cleanup","Pool Repairs & Equipment Service","Salt System / Chlorinator","Water Testing & Chemical Balancing","Pool Opening","Pool Closing","Automation System Upgrade","Other"];
  const toggleSvc = s => setForm(f => ({...f,services:f.services.includes(s)?f.services.filter(x=>x!==s):[...f.services,s]}));
  const inp = { width:"100%",padding:"12px 14px",borderRadius:9,border:"1.5px solid #D0E0EE",fontSize:14,outline:"none",background:"#fff",boxSizing:"border-box",color:C.dark,fontFamily:"inherit",transition:"border-color .2s" };
  const handleSubmit = async e => {
    e.preventDefault(); setStatus("sending");
    try {
      const body = new URLSearchParams({"form-name":"pool-service-request",...Object.fromEntries(Object.entries(form).map(([k,v])=>[k,Array.isArray(v)?v.join(", "):v]))}).toString();
      await fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body});
      setStatus("done");
    } catch { setStatus("done"); }
  };
  if (status==="done") return (
    <div style={{ minHeight:"75vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#F0FBFF",padding:24 }}>
      <div style={{ background:"#fff",borderRadius:24,padding:"56px 48px",maxWidth:520,textAlign:"center",boxShadow:"0 12px 40px rgba(0,50,100,.1)" }}>
        <div style={{ fontSize:72,marginBottom:20,animation:"float 3s ease-in-out infinite" }}>✅</div>
        <h2 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:40,color:C.dark,margin:"0 0 14px",letterSpacing:1 }}>REQUEST RECEIVED!</h2>
        <p style={{ color:C.muted,fontSize:15,lineHeight:1.8,marginBottom:28 }}>Thanks for reaching out to Fowler Brothers Pool Service. We'll follow up soon. For faster help, call or text us directly.</p>
        <div style={{ display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
          <RippleBtn href="tel:+14705890194" bg={C.green} style={{ padding:"12px 22px",borderRadius:10,fontSize:14 }}>📞 (470) 589-0194</RippleBtn>
          <RippleBtn href="sms:+14705890194" bg={C.blue} style={{ padding:"12px 22px",borderRadius:10,fontSize:14 }}>💬 Text Us</RippleBtn>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <PageBanner title="REQUEST POOL SERVICE" sub="Tell us what's going on with your pool and we'll follow up as soon as possible." img="/images/hero-water.jpg"/>
      <div style={{ background:"#F0FBFF",padding:"72px 24px" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"300px 1fr",gap:40,alignItems:"start" }} className="two-col">
          <div style={{ display:"flex",flexDirection:"column",gap:14,position:"sticky",top:90 }}>
            {[
              {ico:"📞",t:"Call or Text",lines:["(470) 589-0194","(470) 650-5028"],href:"tel:+14705890194",bg:C.green},
              {ico:"✉",t:"Email",lines:["fowlerbrotherspoolservice","@gmail.com"],href:"mailto:fowlerbrotherspoolservice@gmail.com",bg:C.blue},
              {ico:"💬",t:"Text Message",lines:["(470) 589-0194","Quick text response"],href:"sms:+14705890194",bg:C.pool},
              {ico:"📘",t:"Facebook",lines:["Fowler Brothers Pool Service","Message us on Facebook"],href:"https://www.facebook.com/profile.php?id=61566480455878",bg:"#1877F2"},
            ].map(c => (
              <a key={c.t} href={c.href} target={c.href.startsWith("http")?"_blank":"_self"} rel="noopener noreferrer" style={{ background:"#fff",borderRadius:14,padding:"18px 20px",textDecoration:"none",boxShadow:"0 4px 14px rgba(0,50,100,.08)",display:"flex",alignItems:"center",gap:14,borderLeft:`5px solid ${c.bg}`,transition:"transform .15s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateX(4px)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}>
                <div style={{ width:44,height:44,borderRadius:12,background:`${c.bg}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{c.ico}</div>
                <div><div style={{ fontWeight:800,fontSize:14,color:C.dark,marginBottom:2 }}>{c.t}</div>{c.lines.map(l=><div key={l} style={{ fontSize:12,color:C.muted }}>{l}</div>)}</div>
              </a>
            ))}
          </div>
          <AnimIn>
            <form name="pool-service-request" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
              <input name="name"/><input name="phone"/><input name="email"/>
              <input name="address"/><input name="city"/><input name="contact"/>
              <input name="services"/><textarea name="description"/><input name="urgency"/><input name="window"/>
            </form>
            <form onSubmit={handleSubmit} style={{ background:"#fff",borderRadius:20,padding:"40px 36px",boxShadow:"0 8px 30px rgba(0,50,100,.08)" }}>
              <h2 style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:30,color:C.dark,margin:"0 0 30px",letterSpacing:1 }}>SEND A SERVICE REQUEST</h2>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }} className="two-col">
                <div><label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:6 }}>Full Name *</label><input required style={inp} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name" onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#D0E0EE"}/></div>
                <div><label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:6 }}>Phone Number *</label><input required type="tel" style={inp} value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="(___) ___-____" onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#D0E0EE"}/></div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }} className="two-col">
                <div><label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:6 }}>Email Address</label><input type="email" style={inp} value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#D0E0EE"}/></div>
                <div><label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:6 }}>City</label><input style={inp} value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Buford, Cumming, etc." onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#D0E0EE"}/></div>
              </div>
              <div style={{ marginBottom:16 }}><label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:6 }}>Service Address</label><input style={inp} value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Street address" onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#D0E0EE"}/></div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:8 }}>Preferred Contact Method</label>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {["Call","Text","Email","Facebook Message"].map(m => (
                    <button type="button" key={m} onClick={()=>setForm({...form,contact:m})} style={{ padding:"8px 16px",borderRadius:9,fontWeight:700,fontSize:13,cursor:"pointer",background:form.contact===m?C.blue:"#F0FBFF",color:form.contact===m?"#fff":C.muted,border:`2px solid ${form.contact===m?C.blue:"transparent"}`,fontFamily:"inherit",transition:"all .15s" }}>{m}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:8 }}>What do you need help with?</label>
                <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                  {svcOpts.map(s => (
                    <button type="button" key={s} onClick={()=>toggleSvc(s)} style={{ padding:"6px 13px",borderRadius:20,fontWeight:600,fontSize:12,cursor:"pointer",background:form.services.includes(s)?C.green:"#F0FBFF",color:form.services.includes(s)?"#fff":C.muted,border:"none",fontFamily:"inherit",transition:"all .15s" }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:16 }}><label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:6 }}>Describe the issue</label><textarea style={{ ...inp,minHeight:110,resize:"vertical" }} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Tell us what's going on with your pool. The more detail the better." onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#D0E0EE"}/></div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }} className="two-col">
                <div><label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:6 }}>How urgent?</label><select style={{ ...inp,appearance:"auto" }} value={form.urgency} onChange={e=>setForm({...form,urgency:e.target.value})}><option value="">Select urgency...</option><option>ASAP</option><option>This week</option><option>Flexible</option><option>Just looking for info</option></select></div>
                <div><label style={{ display:"block",fontWeight:700,fontSize:13,color:C.dark,marginBottom:6 }}>Preferred time window</label><select style={{ ...inp,appearance:"auto" }} value={form.window} onChange={e=>setForm({...form,window:e.target.value})}><option value="">No preference</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></div>
              </div>
              <div style={{ background:"#F0FBFF",borderRadius:10,padding:"14px 16px",marginBottom:22,fontSize:12.5,color:C.muted,border:"1px solid rgba(0,119,200,.12)" }}>
                📎 <strong>To include photos:</strong> Text them directly to <a href="sms:+14705890194" style={{ color:C.blue,fontWeight:700 }}>(470) 589-0194</a> — photos help us assess the issue before arriving.
              </div>
              <RippleBtn bg={C.blue} style={{ width:"100%",padding:"17px",borderRadius:12,fontSize:16,fontWeight:800,boxShadow:"0 6px 22px rgba(0,119,200,.35)" }} onClick={handleSubmit}>{status==="sending"?"Sending...":"Send Service Request →"}</RippleBtn>
            </form>
          </AnimIn>
        </div>
      </div>
    </>
  );
}

// ── ADMIN PAGE ─────────────────────────────────────────────
function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [lf, setLf] = useState({u:"",p:""});
  const [lerr, setLerr] = useState("");
  const [tab, setTab] = useState("testimonials");
  const [testi, setTesti] = useState(DEF_TESTI);
  const [nt, setNt] = useState({name:"",loc:"",rating:5,text:""});
  const [editT, setEditT] = useState(null);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({phone1:"(470) 589-0194",phone2:"(470) 650-5028",email:"fowlerbrotherspoolservice@gmail.com",fb:"https://www.facebook.com/profile.php?id=61566480455878"});

  useEffect(() => {
    if (!loggedIn) return;
    safeGet("testimonials",DEF_TESTI).then(setTesti);
    safeGet("site-settings",settings).then(setSettings);
  }, [loggedIn]);

  const toast_ = msg => { setToast(msg); setTimeout(()=>setToast(null),3000); };
  const saveTesti = async t => { setTesti(t); await safeSet("testimonials",t); toast_("Saved ✓"); };
  const saveSettings = async s => { setSettings(s); await safeSet("site-settings",s); toast_("Settings saved ✓"); };

  if (!loggedIn) return (
    <div style={{ minHeight:"100vh",background:C.ocean,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden" }}>
      <BubbleField count={12}/>
      <div style={{ background:"rgba(255,255,255,.06)",backdropFilter:"blur(14px)",border:`1px solid ${C.glB}`,borderRadius:24,padding:"48px 44px",maxWidth:420,width:"100%",position:"relative",zIndex:1 }}>
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <img src="/images/logo-circle.png" alt="Fowler Brothers" style={{ width:80,height:80,borderRadius:"50%",objectFit:"cover",margin:"0 auto 16px",display:"block",border:"2px solid rgba(0,207,255,.4)" }} onError={e=>e.target.style.display="none"}/>
          <div style={{ fontFamily:"Bebas Neue,sans-serif",color:"#fff",fontSize:24,letterSpacing:2 }}>ADMIN ACCESS</div>
        </div>
        <form onSubmit={e=>{e.preventDefault();if(lf.u===ADM.u&&lf.p===ADM.p){setLoggedIn(true);setLerr("");}else setLerr("Invalid username or password.");}}>
          <div style={{ marginBottom:16 }}><label style={{ display:"block",color:"rgba(255,255,255,.7)",fontSize:12,fontWeight:700,letterSpacing:.5,marginBottom:7 }}>USERNAME</label><input style={{ width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${C.glB}`,background:"rgba(255,255,255,.08)",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box" }} value={lf.u} onChange={e=>setLf({...lf,u:e.target.value})}/></div>
          <div style={{ marginBottom:22 }}><label style={{ display:"block",color:"rgba(255,255,255,.7)",fontSize:12,fontWeight:700,letterSpacing:.5,marginBottom:7 }}>PASSWORD</label><input type="password" style={{ width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${lerr?"#ef4444":C.glB}`,background:"rgba(255,255,255,.08)",color:"#fff",fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box" }} value={lf.p} onChange={e=>setLf({...lf,p:e.target.value})}/></div>
          {lerr && <div style={{ color:"#f87171",fontSize:13,marginBottom:14,textAlign:"center" }}>{lerr}</div>}
          <RippleBtn bg={C.green} style={{ width:"100%",padding:"14px",borderRadius:11,fontSize:15,fontWeight:800 }} type="submit">Sign In →</RippleBtn>
        </form>
      </div>
    </div>
  );

  const inpA = { width:"100%",padding:"10px 12px",borderRadius:8,border:"1.5px solid #E2EBF4",fontSize:13,outline:"none",background:"#fff",boxSizing:"border-box",fontFamily:"inherit" };
  return (
    <div style={{ minHeight:"100vh",background:"#F0F4F8",fontFamily:"inherit" }}>
      <div style={{ background:"#fff",borderBottom:"1px solid #E2EBF4",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 8px rgba(0,0,0,.06)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <img src="/images/logo-main.jpg" alt="FB" style={{ height:40,width:"auto",borderRadius:6,objectFit:"contain" }} onError={e=>e.target.style.display="none"}/>
          <div><div style={{ fontWeight:800,fontSize:15,color:"#1a2a3a" }}>Admin Dashboard</div><div style={{ fontSize:11,color:"#6B8CAA" }}>Fowler Brothers Pool Service</div></div>
        </div>
        <button onClick={()=>setLoggedIn(false)} style={{ background:"none",border:"1px solid #E2EBF4",color:"#6B8CAA",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600 }}>Sign Out</button>
      </div>
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"32px 24px" }}>
        <div style={{ background:"#fff",borderRadius:14,padding:"8px",display:"inline-flex",gap:4,marginBottom:28,boxShadow:"0 2px 10px rgba(0,0,0,.07)" }}>
          {[["testimonials","⭐ Reviews"],["settings","⚙ Settings"]].map(([id,lbl]) => (
            <button key={id} onClick={()=>setTab(id)} style={{ padding:"10px 18px",background:tab===id?C.blue:"transparent",color:tab===id?"#fff":"#6B8CAA",border:"none",fontWeight:700,fontSize:13,cursor:"pointer",borderRadius:9,fontFamily:"inherit",transition:"all .15s" }}>{lbl}</button>
          ))}
        </div>

        {tab==="testimonials" && (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 320px",gap:24,alignItems:"start" }} className="two-col">
            <div>
              <div style={{ fontWeight:800,fontSize:17,color:"#1a2a3a",marginBottom:20 }}>Customer Reviews ({testi.length})</div>
              {testi.map(t => (
                <div key={t.id} style={{ background:"#fff",borderRadius:16,padding:"22px",marginBottom:14,boxShadow:"0 2px 10px rgba(0,0,0,.07)" }}>
                  {editT===t.id ? (
                    <div>
                      <input style={{ ...inpA,marginBottom:8 }} value={t.name} onChange={e=>setTesti(testi.map(x=>x.id===t.id?{...x,name:e.target.value}:x))}/>
                      <input style={{ ...inpA,marginBottom:8 }} value={t.loc} onChange={e=>setTesti(testi.map(x=>x.id===t.id?{...x,loc:e.target.value}:x))}/>
                      <div style={{ display:"flex",gap:8,marginBottom:8 }}>{[1,2,3,4,5].map(r=><button key={r} type="button" onClick={()=>setTesti(testi.map(x=>x.id===t.id?{...x,rating:r}:x))} style={{ fontSize:22,background:"none",border:"none",cursor:"pointer",color:r<=t.rating?"#F59E0B":"#D0D0D0" }}>★</button>)}</div>
                      <textarea style={{ ...inpA,minHeight:80,resize:"vertical",marginBottom:10 }} value={t.text} onChange={e=>setTesti(testi.map(x=>x.id===t.id?{...x,text:e.target.value}:x))}/>
                      <div style={{ display:"flex",gap:8 }}>
                        <button onClick={()=>{saveTesti(testi);setEditT(null);}} style={{ background:C.green,color:"#fff",border:"none",padding:"9px 18px",borderRadius:8,cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"inherit" }}>Save</button>
                        <button onClick={()=>setEditT(null)} style={{ background:"#F0F4F8",color:"#6B8CAA",border:"none",padding:"9px 18px",borderRadius:8,cursor:"pointer",fontWeight:600,fontSize:13,fontFamily:"inherit" }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10 }}>
                        <div><div style={{ fontWeight:800,fontSize:15,color:"#1a2a3a" }}>{t.name}</div><div style={{ fontSize:12,color:"#6B8CAA" }}>{t.loc} · {t.date}</div></div>
                        <div style={{ display:"flex",gap:6 }}>
                          <button onClick={()=>setEditT(t.id)} style={{ background:"#EFF6FF",border:"none",color:C.blue,padding:"6px 12px",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"inherit" }}>Edit</button>
                          <button onClick={()=>saveTesti(testi.filter(x=>x.id!==t.id))} style={{ background:"#FEF2F2",border:"none",color:"#DC2626",padding:"6px 10px",borderRadius:7,cursor:"pointer",fontSize:13,fontFamily:"inherit" }}>🗑</button>
                        </div>
                      </div>
                      <div style={{ display:"flex",gap:2,marginBottom:8 }}>{[...Array(t.rating)].map((_,i)=><span key={i} style={{ color:"#F59E0B",fontSize:16 }}>★</span>)}</div>
                      <p style={{ color:"#4a5a6a",fontSize:14,lineHeight:1.7,fontStyle:"italic" }}>"{t.text}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ background:"#fff",borderRadius:16,padding:"24px",boxShadow:"0 2px 10px rgba(0,0,0,.07)",position:"sticky",top:90 }}>
              <div style={{ fontWeight:800,fontSize:15,color:"#1a2a3a",marginBottom:18 }}>Add Review</div>
              <input style={{ ...inpA,marginBottom:10 }} placeholder="Customer name" value={nt.name} onChange={e=>setNt({...nt,name:e.target.value})}/>
              <input style={{ ...inpA,marginBottom:10 }} placeholder="Location (City, GA)" value={nt.loc} onChange={e=>setNt({...nt,loc:e.target.value})}/>
              <div style={{ display:"flex",gap:6,marginBottom:10 }}>{[1,2,3,4,5].map(r=><button key={r} type="button" onClick={()=>setNt({...nt,rating:r})} style={{ fontSize:24,background:"none",border:"none",cursor:"pointer",color:r<=nt.rating?"#F59E0B":"#D0D0D0" }}>★</button>)}</div>
              <textarea style={{ ...inpA,minHeight:90,resize:"vertical",marginBottom:14 }} placeholder="Review text..." value={nt.text} onChange={e=>setNt({...nt,text:e.target.value})}/>
              <RippleBtn bg={C.blue} style={{ width:"100%",padding:"12px",borderRadius:10,fontSize:14 }} onClick={()=>{if(!nt.name||!nt.text)return;saveTesti([...testi,{id:Date.now(),...nt,date:"2025"}]);setNt({name:"",loc:"",rating:5,text:""});}}>Add Review +</RippleBtn>
            </div>
          </div>
        )}

        {tab==="settings" && (
          <div style={{ maxWidth:640 }}>
            <div style={{ fontWeight:800,fontSize:17,color:"#1a2a3a",marginBottom:20 }}>Site Settings</div>
            <div style={{ background:"#fff",borderRadius:16,padding:"28px",boxShadow:"0 2px 10px rgba(0,0,0,.07)" }}>
              {[{k:"phone1",l:"Primary Phone"},{k:"phone2",l:"Secondary Phone"},{k:"email",l:"Email Address"},{k:"fb",l:"Facebook URL"}].map(f => (
                <div key={f.k} style={{ marginBottom:18 }}>
                  <label style={{ display:"block",fontWeight:700,fontSize:12,color:"#6B8CAA",marginBottom:6,textTransform:"uppercase",letterSpacing:.5 }}>{f.l}</label>
                  <input style={inpA} value={settings[f.k]||""} onChange={e=>setSettings({...settings,[f.k]:e.target.value})}/>
                </div>
              ))}
              <RippleBtn bg={C.green} style={{ padding:"12px 28px",borderRadius:11,fontSize:15 }} onClick={()=>saveSettings(settings)}>Save Settings ✓</RippleBtn>
            </div>
          </div>
        )}
      </div>
      {toast && <div style={{ position:"fixed",bottom:28,right:28,background:C.green,color:"#fff",fontWeight:700,padding:"14px 22px",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,.2)",zIndex:999,fontSize:14 }}>{toast}</div>}
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer style={{ background:C.ocean,color:"#fff",paddingBottom:80 }}>
      <WaveDiv topColor="#F0FBFF" botColor={C.ocean}/>
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"56px 24px 40px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:44 }}>
        <div>
          {/* Footer uses logo_2 wordmark */}
          <img src="/images/logo-main.jpg" alt="Fowler Brothers Pool Service" style={{ height:52,width:"auto",objectFit:"contain",marginBottom:14,borderRadius:6 }} onError={e=>e.target.style.display="none"}/>
          <p style={{ color:"rgba(255,255,255,.55)",fontSize:13,lineHeight:1.8,marginBottom:18 }}>Clean Pools. Reliable Service. Clear Results.<br/>Serving Buford &amp; North Georgia.</p>
          <a href="https://www.facebook.com/profile.php?id=61566480455878" target="_blank" rel="noopener noreferrer" style={{ color:C.cyan,textDecoration:"none",fontSize:13,fontWeight:600 }}>📘 Follow on Facebook →</a>
        </div>
        <div>
          <div style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:16,color:C.green,letterSpacing:1,marginBottom:16 }}>CONTACT</div>
          {[["📞","(470) 589-0194","tel:+14705890194"],["📞","(470) 650-5028","tel:+14706505028"],["✉","fowlerbrotherspoolservice@gmail.com","mailto:fowlerbrotherspoolservice@gmail.com"]].map(([ico,t,h]) => (
            <a key={t} href={h} style={{ display:"flex",gap:8,color:"rgba(255,255,255,.7)",textDecoration:"none",fontSize:13,marginBottom:10 }}><span>{ico}</span><span>{t}</span></a>
          ))}
        </div>
        <div>
          <div style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:16,color:C.green,letterSpacing:1,marginBottom:16 }}>SERVICES</div>
          {SVC.map(s => <button key={s.id} onClick={()=>setPage("services")} style={{ display:"block",background:"none",border:"none",color:"rgba(255,255,255,.55)",fontSize:13,padding:"3px 0",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:4 }}>{s.title}</button>)}
        </div>
        <div>
          <div style={{ fontFamily:"Bebas Neue,sans-serif",fontSize:16,color:C.green,letterSpacing:1,marginBottom:16 }}>SERVICE AREAS</div>
          <div style={{ color:"rgba(255,255,255,.55)",fontSize:13,lineHeight:2.1 }}>Buford · Sugar Hill<br/>Duluth · Cumming<br/>Braselton · Gainesville<br/>Dawsonville · Dahlonega</div>
        </div>
      </div>
      <div style={{ borderTop:"1px solid rgba(255,255,255,.08)",maxWidth:1200,margin:"0 auto",padding:"20px 24px 0",display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:12,alignItems:"center" }}>
        <div style={{ color:"rgba(255,255,255,.35)",fontSize:12 }}>© 2026 Fowler Brothers Pool Service. All rights reserved.</div>
        <div style={{ color:"rgba(255,255,255,.25)",fontSize:11 }}>Service availability may vary. Call to confirm coverage in your area.</div>
      </div>
    </footer>
  );
}

// ── APP ROOT ──────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [loadDone, setLoadDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, {passive:true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const navigate = useCallback(p => {
    setPage(p);
    window.scrollTo({top:0,behavior:"smooth"});
    const titles = {home:"Fowler Brothers Pool Service | Pool Repair & Maintenance in Buford, GA",services:"Pool Services | Fowler Brothers",about:"About Us | Fowler Brothers",areas:"Service Areas | Fowler Brothers",gallery:"Gallery | Fowler Brothers",contact:"Request Service | Fowler Brothers",admin:"Admin | Fowler Brothers"};
    document.title = titles[p]||titles.home;
  }, []);
  const pages = { home:<HomePage setPage={navigate}/>,services:<ServicesPage setPage={navigate}/>,about:<AboutPage setPage={navigate}/>,areas:<AreasPage setPage={navigate}/>,gallery:<GalleryPage/>,contact:<ContactPage/>,admin:<AdminPage/> };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <LoadingScreen done={loadDone} onDone={()=>setLoadDone(true)}/>
      {loadDone && (
        <div style={{ minHeight:"100vh" }}>
          {page!=="admin" && <Nav page={page} setPage={navigate} scrolled={scrolled}/>}
          <main>{pages[page]||pages.home}</main>
          {page!=="admin" && <Footer setPage={navigate}/>}
          <div title="Admin" onClick={()=>navigate("admin")} style={{ position:"fixed",bottom:page!=="admin"?86:8,right:8,fontSize:13,color:"rgba(255,255,255,.12)",cursor:"pointer",zIndex:100,padding:4,transition:"color .2s" }} onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.4)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.12)"}>⚙</div>
        </div>
      )}
    </>
  );
}
