import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   VisualAI Pro Studio — World's Most Powerful AI Prompt Generator
   Free: 10 prompts/month | Pro: Unlimited + All Features
   Languages: 50+ | Modes: 5 | Platforms: 16+
═══════════════════════════════════════════════════════════════ */

// ── STORAGE HELPERS ──
const STORAGE_KEY = "visualai_pro_usage";
const getUsage = () => {
  try {
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const now = new Date();
    const month = `${now.getFullYear()}-${now.getMonth()}`;
    if (d.month !== month) return { month, count: 0, isPro: false };
    return d;
  } catch { return { month: "", count: 0, isPro: false }; }
};
const saveUsage = (data) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {} };

const FREE_LIMIT = 10;

// ── LANGUAGES ──
const LANGUAGES = [
  { code: "en", label: "🇺🇸 English" },
  { code: "hi", label: "🇮🇳 हिंदी" },
  { code: "ur", label: "🇵🇰 اردو" },
  { code: "ar", label: "🇸🇦 العربية" },
  { code: "zh", label: "🇨🇳 中文" },
  { code: "es", label: "🇪🇸 Español" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "ja", label: "🇯🇵 日本語" },
  { code: "ko", label: "🇰🇷 한국어" },
  { code: "pt", label: "🇧🇷 Português" },
  { code: "ru", label: "🇷🇺 Русский" },
  { code: "it", label: "🇮🇹 Italiano" },
  { code: "tr", label: "🇹🇷 Türkçe" },
  { code: "bn", label: "🇧🇩 বাংলা" },
  { code: "id", label: "🇮🇩 Indonesia" },
  { code: "vi", label: "🇻🇳 Tiếng Việt" },
  { code: "th", label: "🇹🇭 ภาษาไทย" },
  { code: "nl", label: "🇳🇱 Nederlands" },
  { code: "pl", label: "🇵🇱 Polski" },
  { code: "sv", label: "🇸🇪 Svenska" },
  { code: "fa", label: "🇮🇷 فارسی" },
  { code: "ms", label: "🇲🇾 Melayu" },
  { code: "ro", label: "🇷🇴 Română" },
  { code: "hu", label: "🇭🇺 Magyar" },
  { code: "cs", label: "🇨🇿 Čeština" },
  { code: "el", label: "🇬🇷 Ελληνικά" },
  { code: "uk", label: "🇺🇦 Українська" },
  { code: "he", label: "🇮🇱 עברית" },
  { code: "sw", label: "🇰🇪 Kiswahili" },
];

// ── MODES ──
const MODES = [
  { id: "image", icon: "✦", label: "Image Prompt", sub: "AI Art Generator", pro: false },
  { id: "video", icon: "▶", label: "Video Script", sub: "Cinema & Reels", pro: false },
  { id: "social", icon: "◈", label: "Social Media", sub: "Viral Content", pro: false },
  { id: "blog", icon: "✍", label: "Blog & SEO", sub: "Articles & Copy", pro: true },
  { id: "podcast", icon: "🎙", label: "Podcast", sub: "Scripts & Shows", pro: true },
];

// ── PLATFORMS ──
const PLATFORMS = {
  image: [
    { id: "midjourney", icon: "✦", name: "Midjourney", sub: "v6.1" },
    { id: "dalle", icon: "◉", name: "DALL-E 3", sub: "OpenAI" },
    { id: "stable", icon: "◈", name: "Stable Diff", sub: "XL" },
    { id: "ideogram", icon: "◎", name: "Ideogram", sub: "v2" },
    { id: "adobe", icon: "✿", name: "Adobe Firefly", sub: "v3" },
    { id: "flux", icon: "⚡", name: "Flux", sub: "Pro" },
  ],
  video: [
    { id: "sora", icon: "▶", name: "Sora", sub: "OpenAI" },
    { id: "runway", icon: "◉", name: "Runway", sub: "Gen-3 Alpha" },
    { id: "kling", icon: "✦", name: "Kling", sub: "v1.5" },
    { id: "pika", icon: "◈", name: "Pika", sub: "v2.2" },
    { id: "luma", icon: "◎", name: "Luma Dream", sub: "Machine" },
    { id: "hailuo", icon: "⚡", name: "Hailuo", sub: "MiniMax" },
  ],
  social: [
    { id: "instagram", icon: "📸", name: "Instagram", sub: "Reels + Post" },
    { id: "youtube", icon: "▶️", name: "YouTube", sub: "Shorts + Long" },
    { id: "tiktok", icon: "♪", name: "TikTok", sub: "Viral Videos" },
    { id: "twitter", icon: "✕", name: "Twitter/X", sub: "Threads" },
    { id: "linkedin", icon: "in", name: "LinkedIn", sub: "Professional" },
    { id: "pinterest", icon: "✿", name: "Pinterest", sub: "Pins & Boards" },
  ],
  blog: [
    { id: "seo_blog", icon: "◉", name: "SEO Blog", sub: "Google Rank" },
    { id: "newsletter", icon: "✉", name: "Newsletter", sub: "Email Copy" },
    { id: "landing", icon: "⚡", name: "Landing Page", sub: "Convert" },
    { id: "product", icon: "◈", name: "Product Desc", sub: "E-Commerce" },
    { id: "press", icon: "✦", name: "Press Release", sub: "Media" },
    { id: "story", icon: "✍", name: "Storytelling", sub: "Brand Voice" },
  ],
  podcast: [
    { id: "interview", icon: "◉", name: "Interview", sub: "Q&A Format" },
    { id: "solo", icon: "✦", name: "Solo Cast", sub: "Monologue" },
    { id: "story_pod", icon: "◈", name: "Story Ep", sub: "Narrative" },
    { id: "edu_pod", icon: "⚡", name: "Educational", sub: "How-To" },
    { id: "comedy", icon: "✿", name: "Comedy", sub: "Entertainment" },
    { id: "news_pod", icon: "✕", name: "News Brief", sub: "Daily Update" },
  ],
};

const TONES = ["Cinematic", "Viral", "Luxury", "Dark", "Dreamy", "Bold", "Minimal", "Emotional", "Funny", "Epic", "Aesthetic", "Raw"];

const QUICK_IDEAS = {
  image: ["Neon cyberpunk city", "Golden hour portrait", "Surreal dreamscape", "Underwater kingdom", "Ancient ruins at dusk"],
  video: ["Product launch reveal", "Cinematic travel vlog", "Motivational montage", "Brand story film", "Nature timelapse"],
  social: ["Morning routine GRWM", "Recipe tutorial", "Fitness transformation", "Travel adventure", "Fashion OOTD lookbook"],
  blog: ["10 AI tools that changed my life", "Complete beginner's guide to", "Why most people fail at", "The truth about", "How I made $10k with"],
  podcast: ["Why Gen Z thinks differently", "The future of remote work", "My biggest career mistake", "Interview with a founder", "5 habits that changed everything"],
};

// ── SYSTEM PROMPTS ──
function buildSystem(mode, platform, tone, language) {
  const langInstruction = language !== "en"
    ? `IMPORTANT: Generate ALL text content in the language with code "${language}". Only JSON keys must remain in English.`
    : "";

  const base = `You are an elite world-class content strategist and AI prompt engineer. ${langInstruction}
Return ONLY valid JSON (no markdown, no backticks, no preamble). Be specific, detailed, and creative. Tone: ${tone}.`;

  if (mode === "image") return `${base}
Platform: ${platform}. Return this exact JSON shape:
{
  "main_prompt": "Ultra-detailed optimized image prompt for ${platform} (200-250 words, hyper-specific, include artistic style, lighting, composition, color palette, mood, technical camera details)",
  "negative_prompt": "Comma-separated list of 20+ things to avoid",
  "style_modifiers": "15+ comma-separated style/quality keywords",
  "camera_settings": "Specific lens mm, aperture, lighting setup, composition rule used",
  "color_palette": "5 specific hex colors or color names that define this image",
  "variations": ["Variation 1 — shorter focused prompt", "Variation 2 — different angle/style", "Variation 3 — alternative mood"],
  "pro_tip": "One expert secret for best results on ${platform} specifically",
  "estimated_quality": "A percentage like 94% quality score with brief explanation"
}`;

  if (mode === "video") return `${base}
Platform: ${platform}. Return this exact JSON:
{
  "video_prompt": "Full cinematic video prompt for ${platform} (200 words, extremely detailed, motion language, atmosphere)",
  "scene_breakdown": ["[0:00-0:05] Scene 1 description with camera angle", "[0:05-0:12] Scene 2...", "[0:12-0:20] Scene 3...", "[0:20-0:30] Scene 4 — climax"],
  "camera_movements": "Specific sequence: dolly in, aerial spin, tracking shot details etc.",
  "color_grading": "LUT style, color temperature, contrast description",
  "audio_direction": "Music genre, BPM range, sound design cues, voice tone",
  "negative_prompt": "What to avoid in generation",
  "duration_pacing": "Ideal length and rhythm advice",
  "viral_hook": "The first 3 seconds description — the make-or-break moment"
}`;

  if (mode === "social") return `${base}
Platform: ${platform}. Return this exact JSON:
{
  "hook": "The irresistible opening line (max 8 words, stops the scroll)",
  "caption": "Full engaging caption with emojis, line breaks, personality (100-150 words)",
  "script": "If video: word-for-word script with timestamps [0:00], [0:05], [0:10]... cover 30-60 seconds fully",
  "hashtags": ["tag1","tag2","tag3","tag4","tag5","tag6","tag7","tag8","tag9","tag10","tag11","tag12","tag13","tag14","tag15"],
  "cta": "Powerful call-to-action that drives comments/saves/shares",
  "posting_strategy": "Best day, time, frequency, and engagement tactics for ${platform}",
  "thumbnail_idea": "If applicable: exact thumbnail text + visual concept that gets clicks",
  "viral_score": "Estimated viral potential 1-100 with 1 sentence reason"
}`;

  if (mode === "blog") return `${base}
Platform: ${platform}. Return this exact JSON:
{
  "title": "SEO-optimized click-worthy title",
  "meta_description": "155-character meta description for Google",
  "outline": ["## Section 1 — with subtitle", "## Section 2", "## Section 3", "## Section 4", "## Conclusion"],
  "intro_paragraph": "Full opening paragraph (100 words) that hooks the reader instantly",
  "key_points": ["Compelling point 1 with brief explanation", "Point 2", "Point 3", "Point 4", "Point 5"],
  "seo_keywords": ["primary keyword", "secondary kw 1", "secondary kw 2", "long-tail 1", "long-tail 2"],
  "cta": "End-of-article call to action",
  "estimated_read_time": "X minute read",
  "tone_guide": "How the writer should sound throughout this piece"
}`;

  return `${base}
Format: ${platform}. Return this exact JSON:
{
  "episode_title": "Catchy podcast episode title",
  "episode_description": "2-3 sentence show notes for Spotify/Apple Podcasts",
  "cold_open": "First 60 seconds word-for-word script — the hook before the intro music",
  "segment_breakdown": ["[0:00] Cold Open", "[1:30] Intro & topic teaser", "[4:00] Main segment 1", "[12:00] Deep dive", "[22:00] Key takeaways", "[26:00] Outro + CTA"],
  "interview_questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
  "talking_points": ["Point 1 with brief notes", "Point 2", "Point 3", "Point 4"],
  "outro_cta": "Word-for-word outro asking listeners to subscribe/review",
  "estimated_duration": "Ideal episode length for this format"
}`;
}

// ── GLOBAL CSS ──
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --bg:#020108;
  --bg2:#060414;
  --card:#0c0920;
  --card2:#110d28;
  --card3:#170f30;
  --border:rgba(255,255,255,0.06);
  --border2:rgba(255,255,255,0.11);
  --border3:rgba(255,255,255,0.18);
  --v1:#7c3aed;--v2:#9f5fff;--v3:#c084fc;
  --g1:#059669;--g2:#10b981;--g3:#34d399;
  --o1:#d97706;--o2:#f59e0b;--o3:#fbbf24;
  --r1:#dc2626;--r2:#ef4444;--r3:#f87171;
  --b1:#0284c7;--b2:#0ea5e9;--b3:#38bdf8;
  --txt:#ede9fe;--muted:#7c6fa8;--muted2:#a89fd4;
  --r:18px;--r2:12px;
}
html{font-size:15px;scroll-behavior:smooth;}
body{
  background:var(--bg);color:var(--txt);
  font-family:'Outfit',sans-serif;
  min-height:100vh;overflow-x:hidden;
}
::selection{background:var(--v1);color:#fff;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--card3);border-radius:4px;}

/* AURORA */
.aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
.orb{position:absolute;border-radius:50%;filter:blur(120px);animation:drift 18s ease-in-out infinite;}
.orb1{width:800px;height:800px;background:radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%);top:-300px;left:-200px;}
.orb2{width:700px;height:700px;background:radial-gradient(circle,rgba(5,150,105,0.12) 0%,transparent 70%);bottom:-200px;right:-150px;animation-delay:-7s;}
.orb3{width:600px;height:600px;background:radial-gradient(circle,rgba(217,119,6,0.1) 0%,transparent 70%);top:30%;left:40%;animation-delay:-13s;}
.orb4{width:500px;height:500px;background:radial-gradient(circle,rgba(2,132,199,0.1) 0%,transparent 70%);top:10%;right:5%;animation-delay:-4s;}
@keyframes drift{
  0%,100%{transform:translate(0,0) scale(1) rotate(0deg);}
  25%{transform:translate(40px,-50px) scale(1.08) rotate(5deg);}
  50%{transform:translate(-30px,30px) scale(0.95) rotate(-3deg);}
  75%{transform:translate(20px,40px) scale(1.03) rotate(2deg);}
}

/* GRID OVERLAY */
.grid-bg{
  position:fixed;inset:0;z-index:1;pointer-events:none;
  background-image:
    linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px);
  background-size:50px 50px;
  mask-image:radial-gradient(ellipse 100% 100% at 50% 0%,black 20%,transparent 80%);
}

.app-root{position:relative;z-index:2;min-height:100vh;display:flex;flex-direction:column;}

/* ── NAV ── */
.nav{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 32px;
  border-bottom:1px solid var(--border);
  backdrop-filter:blur(40px);
  background:rgba(2,1,8,0.7);
  position:sticky;top:0;z-index:200;
}
.logo{
  font-family:'Syne',sans-serif;font-weight:800;font-size:20px;
  display:flex;align-items:center;gap:10px;letter-spacing:-0.5px;
}
.logo-icon{
  width:36px;height:36px;
  background:linear-gradient(135deg,var(--v1),var(--b2));
  border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-size:16px;box-shadow:0 4px 20px rgba(124,58,237,0.4);
}
.logo-pro{
  font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;
  background:linear-gradient(90deg,var(--o2),var(--o3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.nav-center{display:flex;align-items:center;gap:8px;}
.nav-right{display:flex;align-items:center;gap:10px;}

/* USAGE INDICATOR */
.usage-wrap{
  display:flex;align-items:center;gap:10px;
  background:var(--card);border:1px solid var(--border2);
  padding:8px 14px;border-radius:30px;
}
.usage-text{font-size:12px;color:var(--muted2);}
.usage-track{width:80px;height:5px;background:var(--card3);border-radius:5px;overflow:hidden;}
.usage-fill{height:100%;border-radius:5px;transition:width 0.6s ease;}
.fill-ok{background:linear-gradient(90deg,var(--g2),var(--b2));}
.fill-warn{background:linear-gradient(90deg,var(--o2),var(--r2));}
.fill-full{background:var(--r2);animation:pulse-red 1.5s infinite;}
@keyframes pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.4);}50%{box-shadow:0 0 0 4px rgba(239,68,68,0);}}

/* PRO BUTTON */
.btn-pro{
  background:linear-gradient(135deg,var(--o1),var(--o2));
  color:#000;padding:9px 20px;border-radius:30px;
  font-family:'Syne',sans-serif;font-size:13px;font-weight:800;
  border:none;cursor:pointer;transition:all 0.3s;letter-spacing:0.3px;
  box-shadow:0 4px 20px rgba(217,119,6,0.35);
  display:flex;align-items:center;gap:6px;
}
.btn-pro:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(217,119,6,0.55);}

/* LANG SELECT */
.lang-wrap{position:relative;}
.lang-sel{
  background:var(--card);border:1px solid var(--border2);
  color:var(--txt);padding:8px 32px 8px 12px;border-radius:10px;
  font-family:'Outfit',sans-serif;font-size:13px;outline:none;
  appearance:none;cursor:pointer;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%237c6fa8' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;
  transition:border-color 0.2s;
}
.lang-sel:focus{border-color:var(--v2);}

/* ── HERO ── */
.hero{
  text-align:center;padding:70px 24px 50px;
}
.hero-badge{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(124,58,237,0.1);border:1px solid rgba(124,58,237,0.3);
  padding:7px 18px;border-radius:30px;
  font-size:11px;font-weight:600;color:var(--v3);
  letter-spacing:2px;text-transform:uppercase;margin-bottom:28px;
}
.live-dot{
  width:6px;height:6px;background:var(--g3);border-radius:50%;
  box-shadow:0 0 8px var(--g3);
  animation:liveblink 2s ease infinite;
}
@keyframes liveblink{0%,100%{opacity:1;}50%{opacity:0.3;}}

.hero h1{
  font-family:'Syne',sans-serif;
  font-size:clamp(46px,9vw,104px);
  font-weight:800;line-height:0.88;
  letter-spacing:-5px;margin-bottom:26px;
}
.h1-white{color:var(--txt);}
.h1-grad{
  background:linear-gradient(135deg,var(--v3) 0%,var(--b3) 45%,var(--g3) 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.hero-sub{
  max-width:560px;margin:0 auto 36px;
  font-size:17px;line-height:1.75;color:var(--muted2);font-weight:300;
}
.hero-sub strong{color:var(--txt);font-weight:600;}

/* STATS */
.stats{
  display:inline-flex;
  background:var(--card);border:1px solid var(--border2);
  border-radius:16px;overflow:hidden;margin-bottom:0;
}
.stat{
  padding:16px 28px;text-align:center;
  border-right:1px solid var(--border);
}
.stat:last-child{border:none;}
.stat-n{
  font-family:'Syne',sans-serif;font-weight:800;font-size:26px;
  background:linear-gradient(135deg,var(--v3),var(--b3));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.stat-l{font-size:11px;color:var(--muted);margin-top:3px;text-transform:uppercase;letter-spacing:0.5px;}

/* ── MAIN APP ── */
.main{max-width:1240px;margin:0 auto;padding:40px 24px 80px;}

/* MODE TABS */
.mode-tabs{
  display:flex;gap:6px;
  background:var(--card);border:1px solid var(--border);
  padding:6px;border-radius:20px;
  width:fit-content;margin-bottom:28px;
}
.mtab{
  display:flex;align-items:center;gap:8px;
  padding:11px 22px;border-radius:14px;border:none;
  font-family:'Syne',sans-serif;font-weight:700;font-size:13px;
  cursor:pointer;transition:all 0.25s;
  color:var(--muted2);background:transparent;white-space:nowrap;
}
.mtab.active{
  background:linear-gradient(135deg,var(--v1),var(--b1));
  color:#fff;box-shadow:0 4px 24px rgba(124,58,237,0.45);
}
.mtab-icon{font-size:15px;}
.pro-chip{
  font-size:9px;background:linear-gradient(90deg,var(--o1),var(--o2));
  color:#000;padding:2px 7px;border-radius:6px;
  font-weight:800;letter-spacing:1px;
}

/* ── 2-COL LAYOUT ── */
.cols{display:grid;grid-template-columns:380px 1fr;gap:22px;align-items:start;}

/* PANEL */
.panel{
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--r);overflow:hidden;
}
.ph{
  padding:17px 22px;border-bottom:1px solid var(--border);
  font-family:'Syne',sans-serif;font-weight:700;font-size:14px;
  background:linear-gradient(180deg,var(--card2),var(--card));
  display:flex;align-items:center;justify-content:space-between;
}
.pb{padding:20px 22px;}

/* PLATFORM GRID */
.plat-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin-bottom:18px;}
.plat{
  background:var(--card2);border:1.5px solid var(--border);
  border-radius:12px;padding:11px 8px;text-align:center;
  cursor:pointer;transition:all 0.2s;
}
.plat:hover{border-color:var(--v2);background:rgba(159,95,255,0.05);}
.plat.sel{
  border-color:var(--v2);background:rgba(124,58,237,0.12);
  box-shadow:0 0 20px rgba(124,58,237,0.15);
}
.plat-ic{font-size:18px;margin-bottom:4px;}
.plat-nm{font-size:11px;font-weight:600;color:var(--txt);}
.plat-sb{font-size:9px;color:var(--muted);margin-top:1px;}

/* TONE PILLS */
.tones{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;}
.tone{
  background:var(--card2);border:1.5px solid var(--border);
  padding:6px 13px;border-radius:20px;
  font-size:12px;color:var(--muted2);cursor:pointer;transition:all 0.2s;
}
.tone:hover{border-color:var(--g2);color:var(--g3);}
.tone.sel{
  border-color:var(--g2);color:var(--g3);
  background:rgba(5,150,105,0.1);
}

/* LABEL */
.lbl{
  font-size:10px;font-weight:700;letter-spacing:2px;
  text-transform:uppercase;color:var(--muted);margin-bottom:10px;
  display:flex;align-items:center;gap:6px;
}
.lbl-dot{
  width:4px;height:4px;border-radius:50%;
  background:linear-gradient(135deg,var(--v2),var(--b2));
}

/* TEXTAREA */
.ta-wrap{position:relative;margin-bottom:12px;}
.ta{
  width:100%;background:var(--card2);
  border:1.5px solid var(--border);border-radius:14px;
  padding:14px 16px 32px;
  color:var(--txt);font-family:'Outfit',sans-serif;
  font-size:14px;line-height:1.7;resize:none;outline:none;
  min-height:120px;transition:border-color 0.2s;
}
.ta:focus{border-color:var(--v2);box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
.ta::placeholder{color:var(--muted);}
.ta-count{
  position:absolute;bottom:10px;right:12px;
  font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;
}

/* QUICK IDEAS */
.ideas{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:18px;}
.idea{
  background:var(--card2);border:1px solid var(--border);
  padding:5px 11px;border-radius:20px;
  font-size:11px;color:var(--muted2);cursor:pointer;transition:all 0.2s;
}
.idea:hover{border-color:var(--b2);color:var(--b3);}

/* GENERATE BTN */
.gen{
  width:100%;padding:17px;
  background:linear-gradient(135deg,var(--v1) 0%,var(--b1) 100%);
  color:#fff;border:none;border-radius:14px;
  font-family:'Syne',sans-serif;font-weight:800;font-size:16px;
  cursor:pointer;transition:all 0.3s;
  display:flex;align-items:center;justify-content:center;gap:10px;
  letter-spacing:-0.3px;position:relative;overflow:hidden;
  box-shadow:0 8px 32px rgba(124,58,237,0.4);
}
.gen:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 16px 48px rgba(124,58,237,0.6);}
.gen:disabled{opacity:0.5;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
.gen-shine{
  position:absolute;inset:0;
  background:linear-gradient(105deg,transparent 30%,rgba(255,255,255,0.15) 50%,transparent 70%);
  animation:shine 2.5s infinite;
}
@keyframes shine{from{transform:translateX(-100%);}to{transform:translateX(100%);}}

.gen-hint{font-size:11px;color:var(--muted);text-align:center;margin-top:8px;}

/* ── OUTPUT ── */
.out-panel{min-height:600px;display:flex;flex-direction:column;}
.out-empty{
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:16px;color:var(--muted);text-align:center;padding:50px;
}
.empty-orb{
  width:100px;height:100px;border-radius:24px;
  border:2px dashed var(--border2);
  display:flex;align-items:center;justify-content:center;
  font-size:44px;
  background:radial-gradient(circle,rgba(124,58,237,0.05),transparent);
}
.out-empty p{font-size:14px;color:var(--muted2);max-width:260px;line-height:1.6;}

/* LOADING */
.loading{
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:24px;
}
.spinner-ring{
  width:72px;height:72px;border-radius:50%;
  border:3px solid var(--card3);
  border-top-color:var(--v2);border-right-color:var(--b2);
  border-bottom-color:var(--g2);
  animation:spin 1s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg);}}
.load-text{text-align:center;}
.load-step{font-size:15px;font-weight:600;color:var(--txt);margin-bottom:6px;}
.load-sub{font-size:12px;color:var(--muted);}

/* RESULT */
.result-wrap{padding:22px;}
.result-top{
  display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;
}
.mode-badge{
  font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;
  padding:5px 14px;border-radius:20px;
  background:rgba(124,58,237,0.1);
  border:1px solid rgba(124,58,237,0.3);
  color:var(--v3);
}
.copy-all{
  background:var(--card2);border:1px solid var(--border2);
  padding:7px 14px;border-radius:10px;
  font-size:12px;font-weight:600;color:var(--muted2);
  cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;
}
.copy-all:hover{border-color:var(--v2);color:var(--v3);}

/* RESULT SECTION */
.rs{
  background:var(--card2);border:1px solid var(--border);
  border-radius:14px;margin-bottom:12px;overflow:hidden;
}
.rs-head{
  padding:12px 16px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
}
.rs-title{
  font-family:'Syne',sans-serif;font-weight:700;font-size:12px;
  display:flex;align-items:center;gap:8px;color:var(--muted2);
  text-transform:uppercase;letter-spacing:1px;
}
.rs-icon{
  width:22px;height:22px;border-radius:6px;
  display:flex;align-items:center;justify-content:center;font-size:11px;
}
.ic-v{background:rgba(159,95,255,0.2);color:var(--v3);}
.ic-g{background:rgba(16,185,129,0.2);color:var(--g3);}
.ic-o{background:rgba(245,158,11,0.2);color:var(--o3);}
.ic-b{background:rgba(14,165,233,0.2);color:var(--b3);}
.ic-r{background:rgba(239,68,68,0.2);color:var(--r3);}

.cpbtn{
  background:transparent;border:1px solid var(--border);
  padding:4px 10px;border-radius:7px;
  font-size:11px;color:var(--muted);cursor:pointer;transition:all 0.2s;
}
.cpbtn:hover{border-color:var(--v2);color:var(--v3);}
.cpbtn.done{border-color:var(--g2);color:var(--g3);background:rgba(5,150,105,0.1);}

.rs-body{
  padding:14px 16px;font-size:13px;line-height:1.8;color:var(--muted2);
}
.rs-body code{
  display:block;background:rgba(2,1,8,0.6);
  border:1px solid var(--border);border-radius:10px;
  padding:13px 15px;
  font-family:'JetBrains Mono',monospace;font-size:12px;
  line-height:1.75;color:var(--v3);
  white-space:pre-wrap;word-break:break-word;
}

/* TAGS */
.tagcloud{display:flex;flex-wrap:wrap;gap:6px;padding:14px 16px;}
.htag{
  background:var(--card3);border:1px solid var(--border);
  padding:4px 12px;border-radius:20px;
  font-size:12px;color:var(--b3);cursor:pointer;transition:all 0.2s;
}
.htag:hover{background:rgba(14,165,233,0.1);border-color:var(--b2);}

/* SCENE LIST */
.scene-list{display:flex;flex-direction:column;gap:8px;padding:14px 16px;}
.scene-item{
  display:flex;gap:10px;align-items:flex-start;
  padding:10px;background:rgba(2,1,8,0.3);border-radius:9px;
  border:1px solid var(--border);font-size:12px;
}
.scene-num{
  min-width:22px;height:22px;border-radius:6px;
  background:linear-gradient(135deg,var(--v1),var(--b1));
  display:flex;align-items:center;justify-content:center;
  font-size:10px;font-weight:700;color:#fff;
}

/* REMIX BAR */
.remix{display:flex;gap:8px;margin-top:14px;}
.rbtn{
  flex:1;padding:11px;border-radius:12px;
  border:1px solid var(--border);background:var(--card2);
  font-size:12px;font-weight:600;color:var(--muted2);
  cursor:pointer;transition:all 0.2s;
  display:flex;align-items:center;justify-content:center;gap:6px;
}
.rbtn:hover{border-color:var(--b2);color:var(--b3);}
.rbtn.primary{background:rgba(124,58,237,0.1);border-color:var(--v2);color:var(--v3);}
.rbtn.primary:hover{background:rgba(124,58,237,0.2);}

/* HISTORY */
.history{
  margin-top:22px;
  background:var(--card);border:1px solid var(--border);
  border-radius:var(--r);padding:20px 22px;
}
.hist-head{
  font-family:'Syne',sans-serif;font-weight:700;font-size:13px;
  margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;
}
.hist-clr{font-size:12px;color:var(--muted);cursor:pointer;font-family:'Outfit',sans-serif;font-weight:400;}
.hist-clr:hover{color:var(--r3);}
.hist-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;}
.hcard{
  min-width:170px;background:var(--card2);border:1px solid var(--border);
  border-radius:12px;padding:12px;cursor:pointer;transition:all 0.2s;flex-shrink:0;
}
.hcard:hover{border-color:var(--v2);}
.hcard-mode{font-size:10px;font-weight:700;text-transform:uppercase;color:var(--muted);letter-spacing:1px;margin-bottom:5px;}
.hcard-text{font-size:12px;color:var(--txt);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}

/* PRO GATE OVERLAY */
.pro-gate{
  position:fixed;inset:0;z-index:500;
  display:flex;align-items:center;justify-content:center;
  background:rgba(2,1,8,0.85);backdrop-filter:blur(20px);
  animation:fadeIn 0.3s ease;
}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.gate-box{
  background:var(--card);border:1px solid var(--border2);
  border-radius:24px;padding:48px 44px;
  max-width:460px;width:90%;text-align:center;
  position:relative;overflow:hidden;
}
.gate-glow{
  position:absolute;top:-100px;left:50%;transform:translateX(-50%);
  width:400px;height:400px;
  background:radial-gradient(circle,rgba(124,58,237,0.15),transparent 70%);
  pointer-events:none;
}
.gate-icon{font-size:56px;margin-bottom:20px;}
.gate-h{
  font-family:'Syne',sans-serif;font-weight:800;font-size:30px;
  letter-spacing:-1px;margin-bottom:12px;
}
.gate-sub{font-size:15px;color:var(--muted2);line-height:1.65;margin-bottom:28px;}
.gate-perks{
  display:flex;flex-direction:column;gap:10px;margin-bottom:32px;text-align:left;
}
.perk{
  display:flex;align-items:center;gap:10px;
  padding:11px 14px;background:var(--card2);
  border:1px solid var(--border);border-radius:12px;font-size:13px;
}
.perk-ic{font-size:18px;}
.perk-label{font-weight:500;}
.perk-sub{font-size:11px;color:var(--muted);margin-top:1px;}
.gate-price{margin-bottom:20px;}
.price-main{
  font-family:'Syne',sans-serif;font-weight:800;font-size:42px;letter-spacing:-2px;
}
.price-sub{font-size:13px;color:var(--muted2);}
.gate-cta{
  width:100%;padding:17px;
  background:linear-gradient(135deg,var(--o1),var(--o2));
  color:#000;border:none;border-radius:14px;
  font-family:'Syne',sans-serif;font-weight:800;font-size:16px;
  cursor:pointer;transition:all 0.3s;letter-spacing:-0.3px;
  box-shadow:0 8px 32px rgba(217,119,6,0.4);
  margin-bottom:12px;
}
.gate-cta:hover{transform:translateY(-2px);box-shadow:0 16px 48px rgba(217,119,6,0.6);}
.gate-skip{font-size:12px;color:var(--muted);cursor:pointer;display:block;}
.gate-skip:hover{color:var(--muted2);}

/* LIMIT WARN BANNER */
.limit-warn{
  background:linear-gradient(90deg,rgba(217,119,6,0.1),rgba(220,38,38,0.1));
  border:1px solid rgba(245,158,11,0.3);
  border-radius:14px;padding:14px 18px;margin-bottom:14px;
  display:flex;align-items:center;gap:12px;font-size:13px;
}
.warn-icon{font-size:20px;}

/* TIP BOX */
.tip-box{
  border-radius:12px;padding:12px 16px;
  font-size:13px;margin-top:4px;
  display:flex;align-items:flex-start;gap:8px;
}
.tip-v{background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);color:var(--v3);}
.tip-g{background:rgba(5,150,105,0.08);border:1px solid rgba(5,150,105,0.2);color:var(--g3);}
.tip-o{background:rgba(217,119,6,0.08);border:1px solid rgba(217,119,6,0.2);color:var(--o3);}

@media(max-width:900px){
  .cols{grid-template-columns:1fr;}
  .mode-tabs{width:100%;overflow-x:auto;}
  .nav{padding:12px 16px;}
  .hero{padding:50px 16px 36px;}
  .hero h1{letter-spacing:-3px;}
  .plat-grid{grid-template-columns:1fr 1fr;}
  .stats{flex-wrap:wrap;}
}
@media(max-width:600px){
  .topbar{padding:10px 14px;}
  .stat{padding:12px 16px;}
  .stat-n{font-size:20px;}
  .main{padding:24px 14px 60px;}
}
`;

// ── COPY HOOK ──
function useCopy() {
  const [c, setC] = useState({});
  const copy = useCallback((k, t) => {
    navigator.clipboard.writeText(t).catch(() => {});
    setC(p => ({ ...p, [k]: true }));
    setTimeout(() => setC(p => ({ ...p, [k]: false })), 1800);
  }, []);
  return { c, copy };
}

// ── SECTION COMPONENT ──
function Sec({ title, icon, icClass, ck, text, copy, c, children }) {
  return (
    <div className="rs">
      <div className="rs-head">
        <div className="rs-title">
          <div className={`rs-icon ${icClass}`}>{icon}</div>
          {title}
        </div>
        <button className={`cpbtn ${c[ck] ? "done" : ""}`} onClick={() => copy(ck, text)}>
          {c[ck] ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div className="rs-body">{children}</div>
    </div>
  );
}

// ── PRO GATE MODAL ──
function ProGate({ reason, onClose, onUpgrade }) {
  return (
    <div className="pro-gate" onClick={onClose}>
      <div className="gate-box" onClick={e => e.stopPropagation()}>
        <div className="gate-glow" />
        <div className="gate-icon">⚡</div>
        <div className="gate-h">Unlock <span style={{ background: "linear-gradient(135deg,#d97706,#f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Pro</span></div>
        <p className="gate-sub">{reason || "You've reached the free limit. Upgrade to keep creating without limits."}</p>
        <div className="gate-perks">
          {[
            { ic: "♾️", l: "Unlimited Prompts", s: "No monthly cap — generate as much as you want" },
            { ic: "🌍", l: "50+ World Languages", s: "Generate in any language natively" },
            { ic: "🎙", l: "Blog & Podcast Modes", s: "Unlock 2 extra power modes" },
            { ic: "⚡", l: "Priority AI Speed", s: "Faster generations, zero queue" },
            { ic: "📦", l: "Export & Save History", s: "Download all your prompts as PDF/TXT" },
          ].map(p => (
            <div className="perk" key={p.l}>
              <div className="perk-ic">{p.ic}</div>
              <div>
                <div className="perk-label">{p.l}</div>
                <div className="perk-sub">{p.s}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="gate-price">
          <div className="price-main">$9<span style={{ fontSize: 20, fontWeight: 400 }}>/mo</span></div>
          <div className="price-sub">Cancel anytime · Instant access</div>
        </div>
        <button className="gate-cta" onClick={onUpgrade}>🚀 Get Pro Now — $9/month</button>
        <span className="gate-skip" onClick={onClose}>Maybe later (keep {FREE_LIMIT - getUsage().count} free prompts)</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function VisualAIProStudio() {
  const [mode, setMode] = useState("image");
  const [platform, setPlatform] = useState("midjourney");
  const [tone, setTone] = useState("Cinematic");
  const [prompt, setPrompt] = useState("");
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(0);
  const [usage, setUsage] = useState(getUsage());
  const [showGate, setShowGate] = useState(false);
  const [gateReason, setGateReason] = useState("");
  const stepTimer = useRef(null);
  const { c, copy } = useCopy();

  const STEPS = [
    "Analyzing your concept...",
    "Engineering the perfect prompt...",
    `Optimizing for ${PLATFORMS[mode]?.find(p => p.id === platform)?.name}...`,
    "Adding creative depth...",
    "Polishing final output... ✦",
  ];

  useEffect(() => {
    const plats = PLATFORMS[mode];
    setPlatform(plats[0].id);
    setResult(null);
  }, [mode]);

  const isLimited = !usage.isPro && usage.count >= FREE_LIMIT;
  const usagePct = Math.min((usage.count / FREE_LIMIT) * 100, 100);
  const barClass = usagePct < 60 ? "fill-ok" : usagePct < 90 ? "fill-warn" : "fill-full";

  const tryUnlockPro = () => {
    // Simulate pro unlock (in production: connect to Stripe/payment)
    const newUsage = { ...usage, isPro: true };
    setUsage(newUsage);
    saveUsage(newUsage);
    setShowGate(false);
    alert("🎉 Pro Unlocked! (Demo Mode — Connect Stripe for real payments)");
  };

  const generate = async () => {
    if (!prompt.trim()) return;

    // Pro mode check
    const mode_data = MODES.find(m => m.id === mode);
    if (mode_data?.pro && !usage.isPro) {
      setGateReason(`"${mode_data.label}" mode is exclusive to Pro users. Upgrade to unlock all 5 modes.`);
      setShowGate(true);
      return;
    }

    // Limit check
    if (isLimited) {
      setGateReason(`You've used all ${FREE_LIMIT} free prompts this month. Upgrade to Pro for unlimited generations!`);
      setShowGate(true);
      return;
    }

    setLoading(true);
    setResult(null);
    setStep(0);

    stepTimer.current = setInterval(() => setStep(s => (s + 1) % STEPS.length), 900);

    const langName = LANGUAGES.find(l => l.code === lang)?.label || "English";
    const platName = PLATFORMS[mode]?.find(p => p.id === platform)?.name || platform;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystem(mode, platName, tone, lang),
          messages: [{
            role: "user",
            content: `Topic/Idea: "${prompt}"\nTone: ${tone}\nPlatform: ${platName}\nOutput Language: ${langName}\n\nCreate the most powerful, detailed content possible.`
          }]
        })
      });

      const data = await res.json();
      clearInterval(stepTimer.current);

      const raw = data.content?.find(b => b.type === "text")?.text || "{}";
      let parsed = {};
      try { parsed = JSON.parse(raw.replace(/```json|```/g, "").trim()); }
      catch { parsed = { error: raw }; }

      const newUsage = { ...usage, count: usage.count + 1 };
      setUsage(newUsage);
      saveUsage(newUsage);

      setResult({ mode, platform, tone, lang, prompt, data: parsed, platName });
      setHistory(h => [{ mode, platform, tone, lang, prompt }, ...h].slice(0, 8));

      // Soft upsell after 7 prompts
      if (newUsage.count === 7 && !newUsage.isPro) {
        setTimeout(() => {
          setGateReason(`You're on 🔥 fire! Only ${FREE_LIMIT - 7} free prompts left this month. Upgrade now to never stop creating.`);
          setShowGate(true);
        }, 2000);
      }

    } catch (err) {
      clearInterval(stepTimer.current);
      setResult({ mode, platform, tone, lang, prompt, data: { error: "Connection failed. Check your network and try again." }, platName });
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER RESULT ──
  function renderResult() {
    if (!result) return null;
    const d = result.data;

    if (d.error) return (
      <div style={{ padding: 22, color: "#f87171", fontSize: 14 }}>⚠️ {d.error}</div>
    );

    const allText = [
      ...Object.values(d).filter(v => typeof v === "string"),
      ...(d.hashtags || []).map(h => `#${h}`),
      ...(d.variations || []),
      ...(d.scene_breakdown || []),
      ...(d.outline || []),
      ...(d.key_points || []),
      ...(d.segment_breakdown || []),
      ...(d.talking_points || []),
      ...(d.interview_questions || []),
    ].join("\n\n");

    return (
      <div className="result-wrap">
        <div className="result-top">
          <div className="mode-badge">
            {MODES.find(m => m.id === result.mode)?.icon} {result.mode.toUpperCase()} · {result.platName}
          </div>
          <button className="copy-all" onClick={() => copy("_all", allText)}>
            {c["_all"] ? "✓ Copied All!" : "⎘ Copy All"}
          </button>
        </div>

        {/* ── IMAGE ── */}
        {result.mode === "image" && <>
          <Sec title="Main Prompt" icon="✦" icClass="ic-v" ck="mp" text={d.main_prompt} copy={copy} c={c}>
            <code>{d.main_prompt}</code>
          </Sec>
          {d.negative_prompt && <Sec title="Negative Prompt" icon="✕" icClass="ic-r" ck="np" text={d.negative_prompt} copy={copy} c={c}>
            <code>{d.negative_prompt}</code>
          </Sec>}
          {d.style_modifiers && <Sec title="Style Modifiers" icon="◈" icClass="ic-b" ck="sm" text={d.style_modifiers} copy={copy} c={c}>
            <div>{d.style_modifiers}</div>
          </Sec>}
          {d.camera_settings && <Sec title="Camera & Lighting" icon="📷" icClass="ic-o" ck="cs" text={d.camera_settings} copy={copy} c={c}>
            <div>{d.camera_settings}</div>
          </Sec>}
          {d.color_palette && <Sec title="Color Palette" icon="🎨" icClass="ic-g" ck="cp" text={d.color_palette} copy={copy} c={c}>
            <div>{d.color_palette}</div>
          </Sec>}
          {d.variations?.length > 0 && <Sec title="Quick Variations" icon="⟳" icClass="ic-v" ck="var" text={d.variations.join("\n")} copy={copy} c={c}>
            {d.variations.map((v, i) => <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: "2px solid rgba(159,95,255,0.3)", fontSize: 12 }}>{v}</div>)}
          </Sec>}
          {d.pro_tip && <div className="tip-box tip-v">💡 <div><strong>Pro Tip:</strong> {d.pro_tip}</div></div>}
          {d.estimated_quality && <div className="tip-box tip-g" style={{ marginTop: 8 }}>📊 <div><strong>Quality Score:</strong> {d.estimated_quality}</div></div>}
        </>}

        {/* ── VIDEO ── */}
        {result.mode === "video" && <>
          <Sec title="Video Prompt" icon="▶" icClass="ic-b" ck="vp" text={d.video_prompt} copy={copy} c={c}>
            <code>{d.video_prompt}</code>
          </Sec>
          {d.viral_hook && <div className="tip-box tip-r" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", marginBottom: 12 }}>
            🔥 <div><strong>Viral Hook (First 3s):</strong> {d.viral_hook}</div>
          </div>}
          {d.scene_breakdown?.length > 0 && (
            <div className="rs">
              <div className="rs-head">
                <div className="rs-title"><div className="rs-icon ic-o">🎞</div> Scene Breakdown</div>
                <button className={`cpbtn ${c["sc"] ? "done" : ""}`} onClick={() => copy("sc", d.scene_breakdown.join("\n"))}>
                  {c["sc"] ? "✓" : "Copy"}
                </button>
              </div>
              <div className="scene-list">
                {d.scene_breakdown.map((s, i) => (
                  <div className="scene-item" key={i}>
                    <div className="scene-num">{i + 1}</div>
                    <div style={{ fontSize: 12 }}>{s}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {d.camera_movements && <Sec title="Camera Movements" icon="🎥" icClass="ic-v" ck="cm" text={d.camera_movements} copy={copy} c={c}>
            <div>{d.camera_movements}</div>
          </Sec>}
          {d.color_grading && <Sec title="Color Grading" icon="🎨" icClass="ic-g" ck="cg" text={d.color_grading} copy={copy} c={c}>
            <div>{d.color_grading}</div>
          </Sec>}
          {d.audio_direction && <Sec title="Audio & Music" icon="🎵" icClass="ic-b" ck="au" text={d.audio_direction} copy={copy} c={c}>
            <div>{d.audio_direction}</div>
          </Sec>}
          {d.negative_prompt && <Sec title="Negative Prompt" icon="✕" icClass="ic-r" ck="vnp" text={d.negative_prompt} copy={copy} c={c}>
            <code>{d.negative_prompt}</code>
          </Sec>}
          {d.duration_pacing && <div className="tip-box tip-o">⏱ <div><strong>Duration & Pacing:</strong> {d.duration_pacing}</div></div>}
        </>}

        {/* ── SOCIAL ── */}
        {result.mode === "social" && <>
          {d.hook && <Sec title="Hook — Stop The Scroll" icon="🔥" icClass="ic-r" ck="hk" text={d.hook} copy={copy} c={c}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "var(--txt)", lineHeight: 1.3 }}>{d.hook}</div>
          </Sec>}
          {d.caption && <Sec title="Full Caption" icon="📝" icClass="ic-o" ck="cap" text={d.caption} copy={copy} c={c}>
            <div style={{ whiteSpace: "pre-line" }}>{d.caption}</div>
          </Sec>}
          {d.script && <Sec title="Video Script" icon="🎬" icClass="ic-b" ck="sc2" text={d.script} copy={copy} c={c}>
            <code>{d.script}</code>
          </Sec>}
          {d.hashtags?.length > 0 && (
            <div className="rs">
              <div className="rs-head">
                <div className="rs-title"><div className="rs-icon ic-v">#</div> Hashtags ({d.hashtags.length})</div>
                <button className={`cpbtn ${c["tags"] ? "done" : ""}`} onClick={() => copy("tags", d.hashtags.map(h => `#${h}`).join(" "))}>
                  {c["tags"] ? "✓ Copied" : "Copy All"}
                </button>
              </div>
              <div className="tagcloud">{d.hashtags.map(h => <span key={h} className="htag" onClick={() => copy("t_" + h, "#" + h)}>#{h}</span>)}</div>
            </div>
          )}
          {d.cta && <Sec title="Call To Action" icon="👆" icClass="ic-g" ck="cta" text={d.cta} copy={copy} c={c}>
            <div style={{ color: "var(--g3)", fontWeight: 600 }}>{d.cta}</div>
          </Sec>}
          {d.thumbnail_idea && <Sec title="Thumbnail Concept" icon="🖼" icClass="ic-b" ck="thumb" text={d.thumbnail_idea} copy={copy} c={c}>
            <div>{d.thumbnail_idea}</div>
          </Sec>}
          {d.posting_strategy && <div className="tip-box tip-o">📅 <div><strong>Posting Strategy:</strong> {d.posting_strategy}</div></div>}
          {d.viral_score && <div className="tip-box tip-g" style={{ marginTop: 8 }}>📈 <div><strong>Viral Score:</strong> {d.viral_score}</div></div>}
        </>}

        {/* ── BLOG ── */}
        {result.mode === "blog" && <>
          {d.title && <Sec title="SEO Title" icon="📰" icClass="ic-v" ck="bt" text={d.title} copy={copy} c={c}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "var(--txt)" }}>{d.title}</div>
          </Sec>}
          {d.meta_description && <Sec title="Meta Description" icon="🔍" icClass="ic-b" ck="meta" text={d.meta_description} copy={copy} c={c}>
            <div>{d.meta_description}</div>
          </Sec>}
          {d.intro_paragraph && <Sec title="Opening Paragraph" icon="✍" icClass="ic-g" ck="intro" text={d.intro_paragraph} copy={copy} c={c}>
            <div style={{ whiteSpace: "pre-line" }}>{d.intro_paragraph}</div>
          </Sec>}
          {d.outline?.length > 0 && (
            <div className="rs">
              <div className="rs-head">
                <div className="rs-title"><div className="rs-icon ic-o">📋</div> Article Outline</div>
                <button className={`cpbtn ${c["out"] ? "done" : ""}`} onClick={() => copy("out", d.outline.join("\n"))}>
                  {c["out"] ? "✓" : "Copy"}
                </button>
              </div>
              <div className="scene-list">
                {d.outline.map((s, i) => <div className="scene-item" key={i}><div className="scene-num">{i + 1}</div><div style={{ fontSize: 12 }}>{s}</div></div>)}
              </div>
            </div>
          )}
          {d.seo_keywords?.length > 0 && (
            <div className="rs">
              <div className="rs-head">
                <div className="rs-title"><div className="rs-icon ic-b">🔑</div> SEO Keywords</div>
                <button className={`cpbtn ${c["kw"] ? "done" : ""}`} onClick={() => copy("kw", d.seo_keywords.join(", "))}>
                  {c["kw"] ? "✓" : "Copy"}
                </button>
              </div>
              <div className="tagcloud">{d.seo_keywords.map(k => <span key={k} className="htag" style={{ color: "var(--v3)" }}>{k}</span>)}</div>
            </div>
          )}
          {d.cta && <Sec title="Call To Action" icon="👆" icClass="ic-g" ck="bcta" text={d.cta} copy={copy} c={c}>
            <div style={{ color: "var(--g3)", fontWeight: 600 }}>{d.cta}</div>
          </Sec>}
          {d.estimated_read_time && <div className="tip-box tip-v">⏱ <div><strong>Read Time:</strong> {d.estimated_read_time}</div></div>}
          {d.tone_guide && <div className="tip-box tip-o" style={{ marginTop: 8 }}>🎭 <div><strong>Tone Guide:</strong> {d.tone_guide}</div></div>}
        </>}

        {/* ── PODCAST ── */}
        {result.mode === "podcast" && <>
          {d.episode_title && <Sec title="Episode Title" icon="🎙" icClass="ic-v" ck="pt" text={d.episode_title} copy={copy} c={c}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "var(--txt)" }}>{d.episode_title}</div>
          </Sec>}
          {d.cold_open && <Sec title="Cold Open Script" icon="🔥" icClass="ic-r" ck="co" text={d.cold_open} copy={copy} c={c}>
            <code>{d.cold_open}</code>
          </Sec>}
          {d.episode_description && <Sec title="Show Notes" icon="📝" icClass="ic-g" ck="pd" text={d.episode_description} copy={copy} c={c}>
            <div>{d.episode_description}</div>
          </Sec>}
          {d.segment_breakdown?.length > 0 && (
            <div className="rs">
              <div className="rs-head">
                <div className="rs-title"><div className="rs-icon ic-o">📋</div> Episode Structure</div>
                <button className={`cpbtn ${c["seg"] ? "done" : ""}`} onClick={() => copy("seg", d.segment_breakdown.join("\n"))}>
                  {c["seg"] ? "✓" : "Copy"}
                </button>
              </div>
              <div className="scene-list">
                {d.segment_breakdown.map((s, i) => <div className="scene-item" key={i}><div className="scene-num">{i + 1}</div><div style={{ fontSize: 12 }}>{s}</div></div>)}
              </div>
            </div>
          )}
          {d.interview_questions?.length > 0 && (
            <div className="rs">
              <div className="rs-head">
                <div className="rs-title"><div className="rs-icon ic-b">❓</div> Interview Questions</div>
                <button className={`cpbtn ${c["iq"] ? "done" : ""}`} onClick={() => copy("iq", d.interview_questions.join("\n"))}>
                  {c["iq"] ? "✓" : "Copy"}
                </button>
              </div>
              <div className="scene-list">
                {d.interview_questions.map((q, i) => <div className="scene-item" key={i}><div className="scene-num">Q{i + 1}</div><div style={{ fontSize: 12 }}>{q}</div></div>)}
              </div>
            </div>
          )}
          {d.outro_cta && <Sec title="Outro Script" icon="👋" icClass="ic-g" ck="outro" text={d.outro_cta} copy={copy} c={c}>
            <div>{d.outro_cta}</div>
          </Sec>}
          {d.estimated_duration && <div className="tip-box tip-v">⏱ <div><strong>Ideal Duration:</strong> {d.estimated_duration}</div></div>}
        </>}

        <div className="remix">
          <button className="rbtn" onClick={() => { setPrompt(result.prompt); setResult(null); }}>↩ Edit</button>
          <button className="rbtn" onClick={generate}>⟳ Regenerate</button>
          <button className="rbtn primary" onClick={() => copy("_export", allText)}>
            {c["_export"] ? "✓ Copied!" : "⎘ Export All"}
          </button>
        </div>
      </div>
    );
  }

  const currentMode = MODES.find(m => m.id === mode);

  return (
    <>
      <style>{CSS}</style>

      {/* AURORA BG */}
      <div className="aurora">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="orb orb4" />
      </div>
      <div className="grid-bg" />

      {/* PRO GATE */}
      {showGate && (
        <ProGate
          reason={gateReason}
          onClose={() => setShowGate(false)}
          onUpgrade={tryUnlockPro}
        />
      )}

      <div className="app-root">
        {/* ── NAV ── */}
        <nav className="nav">
          <div className="logo">
            <div className="logo-icon">✦</div>
            <span>VisualAI <span className="logo-pro">PRO STUDIO</span></span>
          </div>

          <div className="nav-right">
            {/* Language Selector */}
            <div className="lang-wrap">
              <select className="lang-sel" value={lang} onChange={e => setLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>

            {/* Usage */}
            {!usage.isPro && (
              <div className="usage-wrap">
                <span className="usage-text">{usage.count}/{FREE_LIMIT} free</span>
                <div className="usage-track">
                  <div className={`usage-fill ${barClass}`} style={{ width: `${usagePct}%` }} />
                </div>
              </div>
            )}
            {usage.isPro && (
              <div className="usage-wrap">
                <span style={{ fontSize: 12, color: "#fbbf24" }}>⚡ Pro · Unlimited</span>
              </div>
            )}

            <button className="btn-pro" onClick={() => { setGateReason(""); setShowGate(true); }}>
              {usage.isPro ? "⚡ Pro Active" : "⚡ Get Pro"}
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div className="hero">
          <div className="hero-badge">
            <div className="live-dot" />
            Powered by Claude AI · 30 Languages · 5 Modes
          </div>
          <h1>
            <span className="h1-white">Create Any</span><br />
            <span className="h1-grad">Content Instantly</span>
          </h1>
          <p className="hero-sub">
            <strong>Image prompts, video scripts, social content, blogs & podcasts</strong> — all in one place.
            Any language. Any idea. Professional results instantly.
          </p>
          <div className="stats">
            {[
              { n: "16+", l: "AI Platforms" },
              { n: "5", l: "Content Modes" },
              { n: "30", l: "Languages" },
              { n: "12", l: "Tone Styles" },
              { n: "∞", l: "Pro Generations" },
            ].map(s => (
              <div className="stat" key={s.l}>
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="main">
          {/* MODE TABS */}
          <div className="mode-tabs">
            {MODES.map(m => (
              <button
                key={m.id}
                className={`mtab ${mode === m.id ? "active" : ""}`}
                onClick={() => {
                  if (m.pro && !usage.isPro) {
                    setGateReason(`"${m.label}" is a Pro-only mode. Upgrade to unlock Blog & Podcast content generation.`);
                    setShowGate(true);
                    return;
                  }
                  setMode(m.id);
                }}
              >
                <span className="mtab-icon">{m.icon}</span>
                {m.label}
                {m.pro && !usage.isPro && <span className="pro-chip">PRO</span>}
              </button>
            ))}
          </div>

          {/* LOW USAGE WARNING */}
          {!usage.isPro && usage.count >= FREE_LIMIT - 3 && usage.count < FREE_LIMIT && (
            <div className="limit-warn">
              <div className="warn-icon">⚠️</div>
              <div>
                <strong>Almost at your limit!</strong> Only {FREE_LIMIT - usage.count} free prompts left this month.
                <span
                  style={{ color: "#fbbf24", cursor: "pointer", marginLeft: 8, fontWeight: 600 }}
                  onClick={() => setShowGate(true)}
                >
                  Upgrade to Pro →
                </span>
              </div>
            </div>
          )}

          {/* 2-COL */}
          <div className="cols">
            {/* LEFT — CONTROLS */}
            <div className="panel">
              <div className="ph">
                <span>✦ Configure</span>
                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 400 }}>{currentMode?.sub}</span>
              </div>
              <div className="pb">
                {/* PLATFORM */}
                <div className="lbl"><div className="lbl-dot" /> Platform</div>
                <div className="plat-grid">
                  {PLATFORMS[mode].map(p => (
                    <div key={p.id} className={`plat ${platform === p.id ? "sel" : ""}`} onClick={() => setPlatform(p.id)}>
                      <div className="plat-ic">{p.icon}</div>
                      <div className="plat-nm">{p.name}</div>
                      <div className="plat-sb">{p.sub}</div>
                    </div>
                  ))}
                </div>

                {/* TONE */}
                <div className="lbl"><div className="lbl-dot" /> Tone & Vibe</div>
                <div className="tones">
                  {TONES.map(t => (
                    <button key={t} className={`tone ${tone === t ? "sel" : ""}`} onClick={() => setTone(t)}>{t}</button>
                  ))}
                </div>

                {/* PROMPT */}
                <div className="lbl"><div className="lbl-dot" /> Your Idea</div>
                <div className="ta-wrap">
                  <textarea
                    className="ta"
                    placeholder={`Type your idea... e.g. "${QUICK_IDEAS[mode]?.[0]}"`}
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    rows={4}
                    onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate(); }}
                  />
                  <span className="ta-count">{prompt.length}</span>
                </div>

                {/* QUICK IDEAS */}
                <div className="ideas">
                  {QUICK_IDEAS[mode]?.map(q => (
                    <span key={q} className="idea" onClick={() => setPrompt(q)}>{q}</span>
                  ))}
                </div>

                {/* GENERATE */}
                <button className="gen" onClick={generate} disabled={loading || !prompt.trim()}>
                  {!loading && <span className="gen-shine" />}
                  {loading ? "⟳ Generating..." : "✦ Generate Now"}
                </button>
                <div className="gen-hint">Ctrl+Enter shortcut · Output Language: {LANGUAGES.find(l => l.code === lang)?.label}</div>
              </div>
            </div>

            {/* RIGHT — OUTPUT */}
            <div className="panel out-panel">
              <div className="ph">
                <span>✦ Output</span>
                {result && <span style={{ fontSize: 11, color: "var(--g3)", fontWeight: 600 }}>Ready ✓</span>}
              </div>

              {!loading && !result && (
                <div className="out-empty">
                  <div className="empty-orb">{currentMode?.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16 }}>Enter any idea to get started</div>
                  <p>AI will craft world-class professional content for you — in any language</p>
                  <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                    <span style={{ background: "var(--card2)", border: "1px solid var(--border)", padding: "4px 12px", borderRadius: 20 }}>Mode: {currentMode?.label}</span>
                    <span style={{ background: "var(--card2)", border: "1px solid var(--border)", padding: "4px 12px", borderRadius: 20 }}>Tone: {tone}</span>
                    <span style={{ background: "var(--card2)", border: "1px solid var(--border)", padding: "4px 12px", borderRadius: 20 }}>Lang: {LANGUAGES.find(l => l.code === lang)?.label}</span>
                  </div>
                </div>
              )}

              {loading && (
                <div className="loading">
                  <div className="spinner-ring" />
                  <div className="load-text">
                    <div className="load-step">{STEPS[step]}</div>
                    <div className="load-sub">Platform: {PLATFORMS[mode]?.find(p => p.id === platform)?.name} · Tone: {tone}</div>
                  </div>
                </div>
              )}

              {!loading && result && renderResult()}
            </div>
          </div>

          {/* HISTORY */}
          {history.length > 0 && (
            <div className="history">
              <div className="hist-head">
                <span>Recent Generations</span>
                <span className="hist-clr" onClick={() => setHistory([])}>Clear All</span>
              </div>
              <div className="hist-row">
                {history.map((h, i) => (
                  <div key={i} className="hcard" onClick={() => {
                    setMode(h.mode); setTone(h.tone); setLang(h.lang);
                    setTimeout(() => { setPlatform(h.platform); setPrompt(h.prompt); }, 50);
                  }}>
                    <div className="hcard-mode">{MODES.find(m => m.id === h.mode)?.icon} {h.mode} · {h.platform}</div>
                    <div className="hcard-text">{h.prompt}</div>
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
