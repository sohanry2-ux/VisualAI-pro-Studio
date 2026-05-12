import { useState, useEffect, useRef } from "react";

/* ─── GLOBAL STYLES ─────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Sans:ital,wght@0,400;0,600;1,400&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#060608;--s1:#0d0d12;--s2:#13131a;--s3:#1a1a24;
  --bdr:#ffffff0f;--bdr2:#ffffff18;
  --lime:#c8f135;--cyan:#00e5cc;--rose:#ff3d6e;--amber:#ffb830;
  --txt:#f4f4f8;--muted:#6b6b80;--faint:#2a2a38;
  --r:18px;
}
html{font-size:15px;}
body{background:var(--bg);color:var(--txt);font-family:'Instrument Sans',sans-serif;min-height:100vh;overflow-x:hidden;}

::selection{background:var(--lime);color:#000;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--faint);border-radius:4px;}

/* ── LAYOUT ── */
.wrap{min-height:100vh;display:flex;flex-direction:column;position:relative;}

/* ── ANIMATED BG ── */
.bg-grid{
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:
    linear-gradient(var(--bdr) 1px,transparent 1px),
    linear-gradient(90deg,var(--bdr) 1px,transparent 1px);
  background-size:60px 60px;
  mask-image:radial-gradient(ellipse 80% 80% at 50% 0%,#000 30%,transparent 100%);
}
.bg-blobs{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
.blob{position:absolute;border-radius:50%;filter:blur(100px);animation:drift 12s ease-in-out infinite;}
.blob1{width:600px;height:600px;background:#c8f13512;top:-200px;left:-100px;animation-delay:0s;}
.blob2{width:500px;height:500px;background:#00e5cc0c;bottom:-150px;right:-100px;animation-delay:-5s;}
.blob3{width:400px;height:400px;background:#ff3d6e0a;top:40%;left:60%;animation-delay:-9s;}
@keyframes drift{0%,100%{transform:translate(0,0) scale(1);}50%{transform:translate(40px,-30px) scale(1.1);}}

/* ── NAV ── */
.nav{
  position:relative;z-index:20;
  display:flex;align-items:center;justify-content:space-between;
  padding:18px 36px;
  border-bottom:1px solid var(--bdr);
  backdrop-filter:blur(24px);
}
.nav-logo{
  font-family:'Cabinet Grotesk',sans-serif;
  font-weight:900;font-size:20px;
  display:flex;align-items:center;gap:10px;
  letter-spacing:-0.5px;
}
.logo-pill{
  background:var(--lime);color:#000;
  font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;
  padding:3px 10px;border-radius:20px;
}
.nav-tag{
  font-size:12px;color:var(--muted);
  background:var(--s2);border:1px solid var(--bdr);
  padding:5px 14px;border-radius:20px;
  display:flex;align-items:center;gap:6px;
}
.dot-live{width:6px;height:6px;background:var(--lime);border-radius:50%;animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.3;}}

/* ── HERO ── */
.hero{
  position:relative;z-index:5;
  text-align:center;
  padding:70px 24px 40px;
}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--s2);border:1px solid var(--bdr2);
  padding:6px 16px;border-radius:20px;
  font-size:12px;font-weight:600;color:var(--lime);
  letter-spacing:1px;text-transform:uppercase;
  margin-bottom:24px;
}
.hero h1{
  font-family:'Cabinet Grotesk',sans-serif;
  font-size:clamp(42px,7vw,88px);
  font-weight:900;line-height:0.95;
  letter-spacing:-3px;
  margin-bottom:20px;
}
.hero h1 em{
  font-style:normal;
  -webkit-text-stroke:1.5px var(--lime);
  color:transparent;
}
.hero-sub{
  max-width:480px;margin:0 auto 32px;
  font-size:17px;line-height:1.65;color:var(--muted);
}
.hero-sub strong{color:var(--txt);}

.hero-stats{
  display:inline-flex;gap:0;
  background:var(--s1);border:1px solid var(--bdr);
  border-radius:14px;overflow:hidden;
  margin-bottom:50px;
}
.stat{padding:14px 28px;text-align:center;border-right:1px solid var(--bdr);}
.stat:last-child{border-right:none;}
.stat-num{font-family:'Cabinet Grotesk',sans-serif;font-weight:900;font-size:24px;color:var(--lime);}
.stat-lbl{font-size:11px;color:var(--muted);margin-top:2px;}

/* ── MAIN APP ── */
.app-shell{
  position:relative;z-index:5;
  max-width:1100px;margin:0 auto;
  padding:0 24px 60px;
  display:grid;grid-template-columns:360px 1fr;gap:24px;align-items:start;
}

/* ── MODE SELECTOR ── */
.mode-bar{
  grid-column:1/-1;
  display:flex;gap:8px;
  background:var(--s1);border:1px solid var(--bdr);
  padding:6px;border-radius:16px;
  width:fit-content;
}
.mode-btn{
  padding:10px 22px;border-radius:12px;border:none;
  font-family:'Cabinet Grotesk',sans-serif;font-weight:700;font-size:13px;
  cursor:pointer;transition:all .2s;color:var(--muted);background:transparent;
  display:flex;align-items:center;gap:7px;
}
.mode-btn.on{background:var(--lime);color:#000;}

/* ── PANEL ── */
.panel{
  background:var(--s1);border:1px solid var(--bdr);
  border-radius:var(--r);overflow:hidden;
}
.panel-hd{
  padding:18px 22px;border-bottom:1px solid var(--bdr);
  font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:15px;
  display:flex;align-items:center;gap:8px;
  background:linear-gradient(180deg,var(--s2),var(--s1));
}
.panel-bd{padding:20px 22px;}

/* ── PROMPT BOX ── */
.prompt-wrap{position:relative;margin-bottom:14px;}
.prompt-ta{
  width:100%;background:var(--s2);
  border:1.5px solid var(--bdr);border-radius:14px;
  padding:14px 16px;
  color:var(--txt);font-family:'Instrument Sans',sans-serif;font-size:14px;line-height:1.65;
  resize:none;outline:none;min-height:110px;
  transition:border-color .2s;
}
.prompt-ta:focus{border-color:var(--lime);}
.prompt-ta::placeholder{color:var(--muted);}
.char-count{
  position:absolute;bottom:10px;right:12px;
  font-size:11px;color:var(--muted);
}

/* ── CHIPS ── */
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.chip{
  background:var(--s2);border:1px solid var(--bdr);
  padding:5px 12px;border-radius:20px;
  font-size:12px;color:var(--muted);cursor:pointer;transition:all .2s;
}
.chip:hover{border-color:var(--lime);color:var(--lime);}

/* ── SECTION LABEL ── */
.slbl{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--muted);margin-bottom:10px;}

/* ── PLATFORM GRID ── */
.plat-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;}
.plat-card{
  background:var(--s2);border:1.5px solid var(--bdr);border-radius:12px;
  padding:12px;cursor:pointer;transition:all .2s;text-align:center;
}
.plat-card.on{border-color:var(--lime);background:#c8f1350d;}
.plat-icon{font-size:20px;margin-bottom:4px;}
.plat-name{font-size:12px;font-weight:600;}
.plat-sub{font-size:10px;color:var(--muted);}

/* ── TONE ROW ── */
.tone-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.tone-btn{
  background:var(--s2);border:1.5px solid var(--bdr);
  padding:6px 14px;border-radius:20px;
  font-size:12px;color:var(--muted);cursor:pointer;transition:all .2s;
}
.tone-btn.on{border-color:var(--cyan);color:var(--cyan);background:#00e5cc0d;}

/* ── GENERATE BTN ── */
.gen-btn{
  width:100%;padding:16px;
  background:var(--lime);color:#000;
  border:none;border-radius:14px;
  font-family:'Cabinet Grotesk',sans-serif;font-weight:900;font-size:16px;
  cursor:pointer;transition:all .2s;margin-top:6px;
  display:flex;align-items:center;justify-content:center;gap:8px;
  letter-spacing:-0.3px;position:relative;overflow:hidden;
}
.gen-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px #c8f13540;}
.gen-btn:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none;}
.gen-btn .ripple{
  position:absolute;width:100%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(0,0,0,.1),transparent);
  animation:rpl 2s infinite;
}
@keyframes rpl{from{transform:translateX(-100%);}to{transform:translateX(100%);}}

/* ── OUTPUT ── */
.out-panel{min-height:540px;display:flex;flex-direction:column;}
.out-empty{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:14px;color:var(--muted);text-align:center;padding:40px;
}
.empty-icon{
  width:80px;height:80px;border-radius:20px;
  border:2px dashed var(--bdr2);
  display:flex;align-items:center;justify-content:center;
  font-size:36px;
}
.out-loading{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;
}
.loader-ring{
  width:64px;height:64px;border-radius:50%;
  border:3px solid var(--faint);
  border-top-color:var(--lime);border-right-color:var(--cyan);
  animation:spin 1s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}
.loader-steps{display:flex;flex-direction:column;gap:6px;text-align:center;}
.loader-steps .step{font-size:13px;color:var(--muted);animation:fadestep 3s infinite;}
@keyframes fadestep{0%,100%{opacity:.3;}50%{opacity:1;}}

/* ── RESULT CARD ── */
.result-card{padding:22px;}

.result-header{
  display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;
}
.result-mode-badge{
  font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
  padding:4px 12px;border-radius:20px;
}
.badge-img{background:#c8f1350f;color:var(--lime);border:1px solid var(--lime)30;}
.badge-vid{background:#00e5cc0f;color:var(--cyan);border:1px solid var(--cyan)30;}
.badge-soc{background:#ffb8300f;color:var(--amber);border:1px solid var(--amber)30;}

.copy-all-btn{
  background:var(--s2);border:1px solid var(--bdr);
  padding:7px 14px;border-radius:10px;
  font-size:12px;font-weight:600;color:var(--muted);
  cursor:pointer;transition:all .2s;
}
.copy-all-btn:hover{border-color:var(--lime);color:var(--lime);}

/* ── RESULT SECTIONS ── */
.r-section{
  background:var(--s2);border:1px solid var(--bdr);
  border-radius:14px;margin-bottom:14px;overflow:hidden;
}
.r-sec-hd{
  padding:12px 16px;border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;justify-content:space-between;
}
.r-sec-title{
  font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:13px;
  display:flex;align-items:center;gap:7px;
}
.r-sec-icon{
  width:24px;height:24px;border-radius:7px;
  display:flex;align-items:center;justify-content:center;font-size:13px;
}
.icon-lime{background:#c8f13520;}
.icon-cyan{background:#00e5cc20;}
.icon-amber{background:#ffb83020;}
.icon-rose{background:#ff3d6e20;}

.copy-btn{
  background:transparent;border:1px solid var(--bdr);
  padding:4px 10px;border-radius:7px;
  font-size:11px;color:var(--muted);cursor:pointer;transition:all .2s;
}
.copy-btn:hover{border-color:var(--lime);color:var(--lime);}
.copy-btn.copied{border-color:var(--lime);color:var(--lime);background:#c8f1351a;}

.r-sec-bd{padding:14px 16px;font-size:13px;line-height:1.75;color:#c0c0d0;}
.r-sec-bd code{
  display:block;background:#0a0a10;border:1px solid var(--bdr);
  border-radius:10px;padding:12px 14px;
  font-family:monospace;font-size:12.5px;line-height:1.7;color:var(--lime);
  white-space:pre-wrap;word-break:break-word;
}

/* ── HASHTAG CLOUD ── */
.tag-cloud{display:flex;flex-wrap:wrap;gap:6px;padding:14px 16px;}
.hashtag{
  background:var(--s3);border:1px solid var(--bdr);
  padding:4px 12px;border-radius:20px;font-size:12px;color:var(--cyan);
  cursor:pointer;transition:all .2s;
}
.hashtag:hover{background:#00e5cc15;border-color:var(--cyan);}

/* ── REMIX BAR ── */
.remix-bar{
  display:flex;gap:8px;margin-top:6px;
}
.remix-btn{
  flex:1;padding:11px;border-radius:11px;
  border:1px solid var(--bdr);background:var(--s2);
  font-size:12px;font-weight:600;color:var(--muted);
  cursor:pointer;transition:all .2s;
  display:flex;align-items:center;justify-content:center;gap:6px;
}
.remix-btn:hover{border-color:var(--cyan);color:var(--cyan);}
.remix-btn.highlight{background:var(--s3);border-color:var(--lime);color:var(--lime);}

/* ── HISTORY ── */
.history-row{
  grid-column:1/-1;
  background:var(--s1);border:1px solid var(--bdr);border-radius:var(--r);
  padding:18px 22px;
}
.hist-hd{
  font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:14px;
  margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;
}
.hist-clear{font-size:12px;color:var(--muted);cursor:pointer;}
.hist-clear:hover{color:var(--rose);}
.hist-cards{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;}
.hist-card{
  min-width:180px;background:var(--s2);border:1px solid var(--bdr);
  border-radius:12px;padding:12px;cursor:pointer;transition:all .2s;flex-shrink:0;
}
.hist-card:hover{border-color:var(--lime);}
.hist-mode{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--muted);margin-bottom:5px;}
.hist-prompt{font-size:12px;color:var(--txt);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}

@media(max-width:768px){
  .app-shell{grid-template-columns:1fr;}
  .mode-bar{width:100%;}
  .nav{padding:14px 18px;}
  .hero{padding:50px 18px 30px;}
}
`;

/* ─── DATA ─────────────────────────────────────────────────────── */
const MODES = [
  { id: "image", icon: "🖼️", label: "Image Prompts", sub: "Midjourney • DALL-E • Stable Diffusion" },
  { id: "video", icon: "🎬", label: "Video Scripts", sub: "Sora • Runway • Kling" },
  { id: "social", icon: "📱", label: "Social Content", sub: "Reels • Shorts • TikTok" },
];

const PLATFORMS = {
  image: [
    { id: "midjourney", icon: "✦", name: "Midjourney", sub: "v6 style" },
    { id: "dalle", icon: "◉", name: "DALL-E 3", sub: "OpenAI" },
    { id: "stable", icon: "◈", name: "Stable Diff", sub: "SDXL" },
    { id: "ideogram", icon: "◎", name: "Ideogram", sub: "v2" },
  ],
  video: [
    { id: "sora", icon: "▶", name: "Sora", sub: "OpenAI" },
    { id: "runway", icon: "◉", name: "Runway", sub: "Gen-3" },
    { id: "kling", icon: "✦", name: "Kling", sub: "v1.5" },
    { id: "pika", icon: "◈", name: "Pika", sub: "v2" },
  ],
  social: [
    { id: "instagram", icon: "📸", name: "Instagram", sub: "Reels" },
    { id: "youtube", icon: "▶️", name: "YouTube", sub: "Shorts" },
    { id: "tiktok", icon: "🎵", name: "TikTok", sub: "Videos" },
    { id: "twitter", icon: "𝕏", name: "Twitter/X", sub: "Videos" },
  ],
};

const TONES = ["Cinematic", "Viral", "Aesthetic", "Dark", "Dreamy", "Bold", "Minimal", "Luxury", "Funny", "Emotional"];

const QUICK_PROMPTS = {
  image: ["Golden hour portrait", "Neon cyberpunk street", "Fantasy forest", "Ocean sunrise", "Abstract art"],
  video: ["Product reveal", "Cinematic travel vlog", "Motivational reel", "Nature timelapse", "Story intro"],
  social: ["Fashion OOTD", "Food recipe", "Fitness routine", "Lifestyle morning", "Travel adventure"],
};

/* ─── SYSTEM PROMPTS ────────────────────────────────────────────── */
function buildSystemPrompt(mode, platform, tone) {
  if (mode === "image") return `You are an elite AI image prompt engineer. Generate hyper-detailed, platform-optimized prompts.
Return ONLY valid JSON (no markdown) in this exact shape:
{
  "main_prompt": "The full optimized prompt for ${platform} (150-200 words, very detailed)",
  "negative_prompt": "What to avoid/exclude (comma separated, 30-50 words)",
  "style_modifiers": "Key style keywords comma separated",
  "camera_settings": "Lens, lighting, composition details",
  "variations": ["Shorter version 1", "Shorter version 2", "Shorter version 3"],
  "pro_tip": "One expert tip for best results on ${platform}"
}`;

  if (mode === "video") return `You are an expert AI video prompt writer for ${platform}.
Return ONLY valid JSON (no markdown) in this exact shape:
{
  "video_prompt": "Full cinematic video prompt optimized for ${platform} (120-180 words)",
  "scene_breakdown": ["Scene 1: description", "Scene 2: description", "Scene 3: description"],
  "camera_movements": "Camera directions and movements",
  "mood_audio": "Mood, lighting, and suggested audio/music style",
  "duration_tip": "Ideal duration and pacing advice",
  "negative_prompt": "What to avoid in generation"
}`;

  return `You are a viral social media content strategist for ${platform}.
Return ONLY valid JSON (no markdown) in this exact shape:
{
  "hook": "Irresistible opening hook (1 line, max 10 words)",
  "caption": "Full engaging caption with emojis (80-120 words, ${tone} tone)",
  "script": "If video: 30-60 second script with timestamps like [0:00], [0:05] etc",
  "hashtags": ["hashtag1","hashtag2","hashtag3","hashtag4","hashtag5","hashtag6","hashtag7","hashtag8","hashtag9","hashtag10"],
  "cta": "Strong call-to-action line",
  "posting_tip": "Best time and strategy to post this content"
}`;
}

/* ─── COPY HOOK ─────────────────────────────────────────────────── */
function useCopy() {
  const [copied, setCopied] = useState({});
  const copy = (key, text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 1800);
  };
  return { copied, copy };
}

/* ─── MAIN COMPONENT ───────────────────────────────────────────── */
export default function VisualAIPro() {
  const [mode, setMode] = useState("image");
  const [platform, setPlatform] = useState("midjourney");
  const [tone, setTone] = useState("Cinematic");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadStep, setLoadStep] = useState(0);
  const { copied, copy } = useCopy();
  const stepRef = useRef(null);

  const LOAD_STEPS = [
    "Analyzing your concept...",
    "Engineering the perfect prompt...",
    "Optimizing for " + PLATFORMS[mode]?.find(p => p.id === platform)?.name + "...",
    "Adding professional details...",
    "Almost done ✦",
  ];

  useEffect(() => {
    // reset platform when mode changes
    setPlatform(PLATFORMS[mode][0].id);
    setResult(null);
  }, [mode]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);
    setLoadStep(0);

    stepRef.current = setInterval(() => {
      setLoadStep(s => (s + 1) % LOAD_STEPS.length);
    }, 900);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(mode, platform, tone),
          messages: [{
            role: "user",
            content: `Topic/Idea: "${prompt}"\nTone: ${tone}\nPlatform: ${platform}\n\nGenerate the best possible content for this.`
          }]
        })
      });

      const data = await res.json();
      clearInterval(stepRef.current);

      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      let parsed = {};
      try {
        parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      } catch {
        parsed = { error: raw };
      }

      setResult({ mode, platform, tone, prompt, data: parsed });
      setHistory(h => [{ mode, platform, tone, prompt }, ...h].slice(0, 6));
    } catch (err) {
      clearInterval(stepRef.current);
      setResult({ mode, platform, tone, prompt, data: { error: "Connection failed. Try again." } });
    } finally {
      setLoading(false);
    }
  };

  const currentPlatformName = PLATFORMS[mode]?.find(p => p.id === platform)?.name || platform;

  function renderResult() {
    if (!result) return null;
    const d = result.data;
    if (d.error) return (
      <div style={{ padding: 22, color: "var(--rose)", fontSize: 14 }}>⚠️ {d.error}</div>
    );

    const modeBadge = result.mode === "image" ? "badge-img" : result.mode === "video" ? "badge-vid" : "badge-soc";
    const modeLabel = result.mode === "image" ? "🖼️ Image Prompt" : result.mode === "video" ? "🎬 Video Script" : "📱 Social Content";

    const allText = Object.values(d).filter(v => typeof v === "string").join("\n\n") +
      (d.hashtags ? "\n" + d.hashtags.map(h => `#${h}`).join(" ") : "") +
      (d.variations ? "\n" + d.variations.join("\n") : "") +
      (d.scene_breakdown ? "\n" + d.scene_breakdown.join("\n") : "");

    return (
      <div className="result-card">
        <div className="result-header">
          <span className={`result-mode-badge ${modeBadge}`}>{modeLabel} — {currentPlatformName}</span>
          <button className="copy-all-btn" onClick={() => copy("all", allText)}>
            {copied["all"] ? "✓ Copied!" : "⎘ Copy All"}
          </button>
        </div>

        {/* IMAGE MODE */}
        {result.mode === "image" && <>
          <Section icon="✦" iconClass="icon-lime" title="Main Prompt" copyKey="main" copyText={d.main_prompt} copy={copy} copied={copied}>
            <code>{d.main_prompt}</code>
          </Section>
          {d.negative_prompt && <Section icon="✕" iconClass="icon-rose" title="Negative Prompt" copyKey="neg" copyText={d.negative_prompt} copy={copy} copied={copied}>
            <code>{d.negative_prompt}</code>
          </Section>}
          {d.style_modifiers && <Section icon="◈" iconClass="icon-cyan" title="Style Modifiers" copyKey="style" copyText={d.style_modifiers} copy={copy} copied={copied}>
            <div>{d.style_modifiers}</div>
          </Section>}
          {d.camera_settings && <Section icon="📷" iconClass="icon-amber" title="Camera & Lighting" copyKey="cam" copyText={d.camera_settings} copy={copy} copied={copied}>
            <div>{d.camera_settings}</div>
          </Section>}
          {d.variations?.length > 0 && <Section icon="⟳" iconClass="icon-lime" title="Quick Variations" copyKey="var" copyText={d.variations.join("\n")} copy={copy} copied={copied}>
            {d.variations.map((v, i) => <div key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: "2px solid var(--lime)30" }}>{v}</div>)}
          </Section>}
          {d.pro_tip && <div style={{ background: "#c8f1350a", border: "1px solid #c8f13525", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "var(--lime)", marginTop: 4 }}>
            💡 <strong>Pro Tip:</strong> {d.pro_tip}
          </div>}
        </>}

        {/* VIDEO MODE */}
        {result.mode === "video" && <>
          <Section icon="▶" iconClass="icon-cyan" title="Video Prompt" copyKey="vprompt" copyText={d.video_prompt} copy={copy} copied={copied}>
            <code>{d.video_prompt}</code>
          </Section>
          {d.scene_breakdown?.length > 0 && <Section icon="🎞" iconClass="icon-amber" title="Scene Breakdown" copyKey="scenes" copyText={d.scene_breakdown?.join("\n")} copy={copy} copied={copied}>
            {d.scene_breakdown.map((s, i) => <div key={i} style={{ marginBottom: 8, paddingLeft: 10, borderLeft: "2px solid var(--cyan)40" }}>{s}</div>)}
          </Section>}
          {d.camera_movements && <Section icon="🎥" iconClass="icon-lime" title="Camera Movements" copyKey="cam2" copyText={d.camera_movements} copy={copy} copied={copied}>
            <div>{d.camera_movements}</div>
          </Section>}
          {d.mood_audio && <Section icon="🎵" iconClass="icon-rose" title="Mood & Audio" copyKey="mood" copyText={d.mood_audio} copy={copy} copied={copied}>
            <div>{d.mood_audio}</div>
          </Section>}
          {d.negative_prompt && <Section icon="✕" iconClass="icon-rose" title="Negative Prompt" copyKey="vneg" copyText={d.negative_prompt} copy={copy} copied={copied}>
            <code>{d.negative_prompt}</code>
          </Section>}
          {d.duration_tip && <div style={{ background: "#00e5cc0a", border: "1px solid #00e5cc25", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "var(--cyan)", marginTop: 4 }}>
            ⏱ <strong>Duration:</strong> {d.duration_tip}
          </div>}
        </>}

        {/* SOCIAL MODE */}
        {result.mode === "social" && <>
          {d.hook && <Section icon="🔥" iconClass="icon-rose" title="Hook (Opening)" copyKey="hook" copyText={d.hook} copy={copy} copied={copied}>
            <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 800, fontSize: 18, color: "var(--txt)" }}>{d.hook}</div>
          </Section>}
          {d.caption && <Section icon="📝" iconClass="icon-amber" title="Caption" copyKey="caption" copyText={d.caption} copy={copy} copied={copied}>
            <div>{d.caption}</div>
          </Section>}
          {d.script && <Section icon="🎬" iconClass="icon-cyan" title="Video Script" copyKey="script" copyText={d.script} copy={copy} copied={copied}>
            <code>{d.script}</code>
          </Section>}
          {d.hashtags?.length > 0 && (
            <div className="r-section">
              <div className="r-sec-hd">
                <div className="r-sec-title">
                  <div className="r-sec-icon icon-lime">#</div> Hashtags
                </div>
                <button className={`copy-btn ${copied["tags"] ? "copied" : ""}`} onClick={() => copy("tags", d.hashtags.map(h => `#${h}`).join(" "))}>
                  {copied["tags"] ? "✓" : "Copy"}
                </button>
              </div>
              <div className="tag-cloud">
                {d.hashtags.map(h => <span key={h} className="hashtag" onClick={() => copy("tag_" + h, "#" + h)}>#{h}</span>)}
              </div>
            </div>
          )}
          {d.cta && <Section icon="👆" iconClass="icon-rose" title="Call to Action" copyKey="cta" copyText={d.cta} copy={copy} copied={copied}>
            <div style={{ color: "var(--rose)", fontWeight: 600 }}>{d.cta}</div>
          </Section>}
          {d.posting_tip && <div style={{ background: "#ffb8300a", border: "1px solid #ffb83025", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "var(--amber)", marginTop: 4 }}>
            📅 <strong>Posting Strategy:</strong> {d.posting_tip}
          </div>}
        </>}

        <div className="remix-bar" style={{ marginTop: 16 }}>
          <button className="remix-btn" onClick={() => { setPrompt(result.prompt); setResult(null); }}>↩ Edit</button>
          <button className="remix-btn" onClick={generate}>⟳ Regenerate</button>
          <button className="remix-btn highlight" onClick={() => copy("export", allText)}>
            {copied["export"] ? "✓ Copied!" : "⎘ Export All"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{G}</style>
      <div className="wrap">
        <div className="bg-grid" />
        <div className="bg-blobs">
          <div className="blob blob1" /><div className="blob blob2" /><div className="blob blob3" />
        </div>

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">
            <span className="logo-pill">PRO</span>
            VisualAI Studio
          </div>
          <div className="nav-tag">
            <span className="dot-live" /> All-in-One Generator
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-eyebrow">✦ Powered by Claude AI</div>
          <h1>Create Any<br /><em>Content</em> Instantly</h1>
          <p className="hero-sub">
            <strong>Image prompts, video scripts, social content</strong> — sab kuch ek jagah.<br />
            Koi bhi idea daalo, professional result pao.
          </p>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">4</div><div className="stat-lbl">AI Platforms</div></div>
            <div className="stat"><div className="stat-num">3</div><div className="stat-lbl">Content Types</div></div>
            <div className="stat"><div className="stat-num">10</div><div className="stat-lbl">Tones</div></div>
            <div className="stat"><div className="stat-num">∞</div><div className="stat-lbl">Generations</div></div>
          </div>
        </div>

        {/* APP SHELL */}
        <div className="app-shell">
          {/* MODE BAR */}
          <div className="mode-bar">
            {MODES.map(m => (
              <button key={m.id} className={`mode-btn ${mode === m.id ? "on" : ""}`} onClick={() => setMode(m.id)}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {/* LEFT PANEL — Controls */}
          <div className="panel">
            <div className="panel-hd">✦ Configure</div>
            <div className="panel-bd">
              {/* Platform */}
              <div className="slbl">Platform select karo</div>
              <div className="plat-grid">
                {PLATFORMS[mode].map(p => (
                  <div key={p.id} className={`plat-card ${platform === p.id ? "on" : ""}`} onClick={() => setPlatform(p.id)}>
                    <div className="plat-icon">{p.icon}</div>
                    <div className="plat-name">{p.name}</div>
                    <div className="plat-sub">{p.sub}</div>
                  </div>
                ))}
              </div>

              {/* Tone */}
              <div className="slbl">Tone / Vibe</div>
              <div className="tone-row">
                {TONES.map(t => (
                  <button key={t} className={`tone-btn ${tone === t ? "on" : ""}`} onClick={() => setTone(t)}>{t}</button>
                ))}
              </div>

              {/* Prompt */}
              <div className="slbl">Apna idea likhao</div>
              <div className="prompt-wrap">
                <textarea
                  className="prompt-ta"
                  placeholder={`Kuch bhi likhao... jaise "${QUICK_PROMPTS[mode][0]}"`}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={4}
                  onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) generate(); }}
                />
                <span className="char-count">{prompt.length}</span>
              </div>

              {/* Quick chips */}
              <div className="chips">
                {QUICK_PROMPTS[mode].map(q => (
                  <span key={q} className="chip" onClick={() => setPrompt(q)}>{q}</span>
                ))}
              </div>

              <button className="gen-btn" onClick={generate} disabled={loading || !prompt.trim()}>
                {!loading && <span className="ripple" />}
                {loading ? "⟳ Generating..." : "✦ Generate Now"}
              </button>
              <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 8 }}>Ctrl+Enter shortcut bhi kaam karta hai</div>
            </div>
          </div>

          {/* RIGHT PANEL — Output */}
          <div className="panel out-panel">
            <div className="panel-hd">✦ Output
              {result && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--lime)", fontWeight: 600 }}>Ready ✓</span>}
            </div>

            {!loading && !result && (
              <div className="out-empty">
                <div className="empty-icon">{MODES.find(m2 => m2.id === mode)?.icon}</div>
                <div style={{ fontWeight: 600 }}>Koi bhi idea daalo</div>
                <div style={{ fontSize: 13 }}>AI aapke liye professional content ready karega</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                  Current mode: <span style={{ color: "var(--lime)" }}>{MODES.find(m2 => m2.id === mode)?.label}</span>
                </div>
              </div>
            )}

            {loading && (
              <div className="out-loading">
                <div className="loader-ring" />
                <div className="loader-steps">
                  <div className="step" style={{ fontSize: 15, color: "var(--txt)", fontWeight: 600 }}>
                    {LOAD_STEPS[loadStep]}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Platform: {currentPlatformName} · Tone: {tone}</div>
                </div>
              </div>
            )}

            {!loading && result && renderResult()}
          </div>

          {/* HISTORY */}
          {history.length > 0 && (
            <div className="history-row">
              <div className="hist-hd">
                Recent Generations
                <span className="hist-clear" onClick={() => setHistory([])}>Clear</span>
              </div>
              <div className="hist-cards">
                {history.map((h, i) => (
                  <div key={i} className="hist-card" onClick={() => {
                    setMode(h.mode); setTone(h.tone);
                    setTimeout(() => { setPlatform(h.platform); setPrompt(h.prompt); }, 50);
                  }}>
                    <div className="hist-mode">{MODES.find(m2 => m2.id === h.mode)?.icon} {h.mode} · {h.platform}</div>
                    <div className="hist-prompt">{h.prompt}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── SECTION HELPER ─────────────────────────────────────────────── */
function Section({ icon, iconClass, title, copyKey, copyText, copy, copied, children }) {
  return (
    <div className="r-section">
      <div className="r-sec-hd">
        <div className="r-sec-title">
          <div className={`r-sec-icon ${iconClass}`}>{icon}</div>
          {title}
        </div>
        <button className={`copy-btn ${copied[copyKey] ? "copied" : ""}`} onClick={() => copy(copyKey, copyText)}>
          {copied[copyKey] ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div className="r-sec-bd">{children}</div>
    </div>
  );
}
