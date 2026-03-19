import { useState, useEffect, useRef, useMemo } from "react";
import {
  profile,
  stats,
  education,
  experience,
  projects,
  skills,
} from "./data";
import {
  THEME_IDS,
  THEME_LABELS,
  getThemeStyle,
  getThemeLabel,
} from "./themes";

/** Custom animated cursor: dot + ring that follows the mouse and scales over interactive elements */
function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
      const target = e.target as HTMLElement;
      const interactive = target?.closest?.("a, button, [role='button'], [tabindex='0'], .cursor-pointer, [data-cursor-hover]");
      setHover(!!interactive);
    };
    const onLeave = () => setVisible(false);
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [visible]);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const loop = () => {
      const ring = ringRef.current;
      if (ring) {
        ringPos.current.x = lerp(ringPos.current.x, pos.x, 0.12);
        ringPos.current.y = lerp(ringPos.current.y, pos.y, 0.12);
        ring.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, [pos.x, pos.y]);

  useEffect(() => {
    if (reducedMotion) return;
    document.body.classList.add("custom-cursor-active");
    return () => document.body.classList.remove("custom-cursor-active");
  }, [reducedMotion]);

  // Don't show custom cursor if user prefers reduced motion or cursor hasn't moved yet
  if (reducedMotion || !visible) return null;

  return (
    <div className="custom-cursor" aria-hidden>
      <div
        className="custom-cursor-dot"
        style={{
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${hover ? "custom-cursor-ring--hover" : ""}`}
        style={{
          left: 0,
          top: 0,
          transform: `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%, -50%)`,
        }}
      />
    </div>
  );
}

const THEME_STORAGE_KEY = "aryan-portfolio-theme";
const ZOOM_STORAGE_KEY = "aryan-portfolio-zoom";

const ZOOM_LEVELS = [0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5] as const;
const DEFAULT_ZOOM = 1;

type FileId =
  | "readme"
  | "home"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact"
  | "resume";

const FILES: { id: FileId; label: string; icon: string; path: string }[] = [
  { id: "home", label: "home.tsx", icon: "tsx", path: "src/" },
  { id: "about", label: "about.html", icon: "html", path: "src/" },
  { id: "projects", label: "projects.js", icon: "js", path: "src/" },
  { id: "skills", label: "skills.json", icon: "json", path: "data/" },
  { id: "experience", label: "experience.ts", icon: "ts", path: "src/" },
  { id: "contact", label: "contact.css", icon: "css", path: "src/" },
  { id: "readme", label: "README.md", icon: "md", path: "./" },
  { id: "resume", label: "Aryan_Resume.pdf", icon: "pdf", path: "assets/" },
];

// VS Code–style icons (simplified)
const IconExplorer = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h8v2H3V3zm0 4h8v2H3V7zm0 4h8v2H3v-2zm12-4h2v2h-2V7zm0 4h2v2h-2v-2zM3 15h8v2H3v-2zm12-4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
  </svg>
);
const IconSearch = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);
const IconSourceControl = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17v-2h2v2H8zm0-4v-2h2v2H8zm0-4V7h2v2H8zm4 8v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4V7h2v2h-2zm4 8v-2h2v2h-2zm0-4v-2h2v2h-2zm0-4V7h2v2h-2z" />
  </svg>
);
const IconExtensions = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 8h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v4H4c-1.11 0-2 .89-2 2v4c0 1.11.89 2 2 2h4v4c0 1.11.89 2 2 2h4c1.11 0 2-.89 2-2v-4h4c1.11 0 2-.89 2-2v-4c0-1.11-.89-2-2-2zM14 20h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4z" />
  </svg>
);
const IconPortfolio = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
  </svg>
);
const IconAIAssistant = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L13.09 6.26L18 7L13.09 7.74L12 13L10.91 7.74L6 7L10.91 6.26L12 1zM5 14l1.09 3.63L10 19l-3.91 1.37L5 24L3.91 20.37L0 19L3.91 17.63L5 14zm14 0l1.09 3.63L24 19l-3.91 1.37L19 24l-1.09-3.63L14 19l3.91-1.37L19 14z" />
  </svg>
);
const IconSettings = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);
const IconAccount = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const LogoGitHub = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.41 1.02.005 2.04.14 3 .41 2.295-1.545 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LogoLinkedIn = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const LogoLeetCode = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);
const LogoEmail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconFolder = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const IconPerson = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconEnvelope = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconArrowUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);
const IconGraduation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function App() {
  const [activeFile, setActiveFile] = useState<FileId>("readme");
  const [openTabs, setOpenTabs] = useState<FileId[]>(["readme"]);
  const [activeSidebar, setActiveSidebar] = useState<"explorer" | "search">("explorer");
  const [themeId, setThemeId] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && THEME_IDS.includes(saved)) return saved;
    } catch (_) {}
    return "aryan-dark";
  });
  const [zoom, setZoom] = useState(() => {
    try {
      const saved = localStorage.getItem(ZOOM_STORAGE_KEY);
      if (saved) {
        const n = parseFloat(saved);
        if (Number.isFinite(n) && n >= ZOOM_LEVELS[0] && n <= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]) return n;
      }
    } catch (_) {}
    return DEFAULT_ZOOM;
  });
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const editorContentRef = useRef<HTMLDivElement>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandPaletteQuery, setCommandPaletteQuery] = useState("");
  const [commandPaletteSelectedIndex, setCommandPaletteSelectedIndex] = useState(0);
  const commandPaletteInputRef = useRef<HTMLInputElement>(null);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [copilotInput, setCopilotInput] = useState("");
  const copilotScrollRef = useRef<HTMLDivElement>(null);
  const COPILOT_MSG_LIMIT = 10; // demo limit for "X msgs left"

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactUsedMailto, setContactUsedMailto] = useState(false);

  const isCompactLayout = useMediaQuery("(max-width: 1023px)");
  const [mobileFilesOpen, setMobileFilesOpen] = useState(false);

  useEffect(() => {
    if (isCompactLayout) setZoom(DEFAULT_ZOOM);
  }, [isCompactLayout]);

  useEffect(() => {
    if (!mobileFilesOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileFilesOpen]);

  useEffect(() => {
    if (!mobileFilesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileFilesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileFilesOpen]);

  const filteredFiles = useMemo(() => {
    const q = commandPaletteQuery.trim().toLowerCase();
    if (!q) return FILES;
    return FILES.filter((f) => f.label.toLowerCase().includes(q));
  }, [commandPaletteQuery]);

  const totalPaletteItems = 1 + filteredFiles.length; // 1 = Copilot row
  const selectedIndex = Math.min(commandPaletteSelectedIndex, Math.max(0, totalPaletteItems - 1));

  const openCommandPalette = () => {
    setMobileFilesOpen(false);
    setCommandPaletteOpen(true);
    setCommandPaletteQuery("");
    setCommandPaletteSelectedIndex(0);
    setTimeout(() => commandPaletteInputRef.current?.focus(), 0);
  };

  const closeCommandPalette = () => {
    setCommandPaletteOpen(false);
  };

  const openCopilot = () => {
    setMobileFilesOpen(false);
    setCopilotOpen(true);
  };

  const closeCopilot = () => {
    setCopilotOpen(false);
  };

  const getCopilotReply = (userMessage: string): string => {
    const q = userMessage.toLowerCase();
    if (q.includes("about aryan") || q.includes("tell me about aryan") || q.includes("who is aryan")) {
      return `${profile.name} is a ${profile.title} (${profile.subtitle}) ${profile.company}. ${profile.tagline} He's a B.Tech student in Information Technology at GGSIPU, New Delhi, with experience in full-stack development and mobile (iOS) development.`;
    }
    if (q.includes("project") || q.includes("built")) {
      const list = projects.map((p) => `**${p.name}**: ${p.description.slice(0, 80)}...`).join("\n\n");
      return `Here are some projects Aryan has built:\n\n${list}\n\nCheck the Projects section for links to GitHub repos.`;
    }
    if (q.includes("experience") || q.includes("work")) {
      const list = experience.map((e) => `**${e.company}** (${e.period}): ${e.role} — ${e.location}. ${e.points[0]}`).join("\n\n");
      return `Aryan's experience:\n\n${list}`;
    }
    if (q.includes("tech stack") || q.includes("skill")) {
      return `Aryan's tech stack includes:\n\n**Languages:** ${skills.languages.join(", ")}\n**Web:** ${skills.web.join(", ")}\n**Tools & DBs:** ${skills.tools.join(", ")}\n**Fundamentals:** ${skills.fundamentals.join(", ")}`;
    }
    if (q.includes("contact") || q.includes("reach") || q.includes("email")) {
      return `You can contact Aryan via:\n\n📧 Email: ${profile.email}\n📱 Phone: ${profile.phone}\n\nLinkedIn: ${profile.links.linkedin}\nGitHub: ${profile.links.github}\nLeetCode: ${profile.links.leetcode}\n\nOpen the Contact section or use the links above to get in touch.`;
    }
    if (q.includes("support") || q.includes("help")) {
      return `You can support Aryan by:\n\n• Connecting on LinkedIn and sharing relevant opportunities\n• Starring or forking his GitHub projects\n• Reaching out for collaboration or full-time roles\n• Sharing feedback on his portfolio\n\nThanks for your interest! 🙏`;
    }
    return `I'm Aryan's Copilot. Try asking about his projects, experience, tech stack, or how to contact him. You can also use the suggestion buttons above for quick answers.`;
  };

  const sendCopilotMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { role: "user" as const, content: trimmed };
    setCopilotMessages((prev) => [...prev, userMsg]);
    setCopilotInput("");
    const reply = getCopilotReply(trimmed);
    setTimeout(() => {
      setCopilotMessages((prev) => [...prev, { role: "assistant" as const, content: reply }]);
      copilotScrollRef.current?.scrollTo({ top: copilotScrollRef.current.scrollHeight, behavior: "smooth" });
    }, 400);
  };

  const copilotMessagesLeft = Math.max(0, COPILOT_MSG_LIMIT - copilotMessages.filter((m) => m.role === "user").length);

  const selectPaletteItem = (index: number) => {
    if (index === 0) {
      openCopilot();
      closeCommandPalette();
    } else {
      const file = filteredFiles[index - 1];
      if (file) {
        if (file.id === "resume") {
          handleResumeDownload();
        } else {
          openTab(file.id);
        }
        closeCommandPalette();
      }
    }
  };

  useEffect(() => {
    if (!commandPaletteOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCommandPalette();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCommandPaletteSelectedIndex((i) => (i + 1) % totalPaletteItems);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCommandPaletteSelectedIndex((i) => (i - 1 + totalPaletteItems) % totalPaletteItems);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        selectPaletteItem(selectedIndex);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commandPaletteOpen, totalPaletteItems, selectedIndex]);

  useEffect(() => {
    setCommandPaletteSelectedIndex(0);
  }, [commandPaletteQuery]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        setFileMenuOpen(false);
        openCommandPalette();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "t") {
        e.preventDefault();
        openNewTab();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "w") {
        e.preventDefault();
        if (openTabs.length > 1) closeTab(activeFile);
      }
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        openCopilot();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openTabs.length, activeFile]);

  useEffect(() => {
    if (!copilotOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCopilot();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [copilotOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch (_) {}
  }, [themeId]);

  useEffect(() => {
    try {
      localStorage.setItem(ZOOM_STORAGE_KEY, String(zoom));
    } catch (_) {}
  }, [zoom]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isZoom = e.ctrlKey || e.metaKey;
      if (!isZoom) return;
      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        setZoom((z) => {
          const next = ZOOM_LEVELS.find((l) => l > z);
          return next ?? z;
        });
      } else if (e.key === "-") {
        e.preventDefault();
        setZoom((z) => {
          const next = [...ZOOM_LEVELS].reverse().find((l) => l < z);
          return next ?? z;
        });
      } else if (e.key === "0") {
        e.preventDefault();
        setZoom(DEFAULT_ZOOM);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const zoomIn = () => {
    setZoom((z) => {
      const next = ZOOM_LEVELS.find((l) => l > z);
      return next ?? z;
    });
  };
  const zoomOut = () => {
    setZoom((z) => {
      const next = [...ZOOM_LEVELS].reverse().find((l) => l < z);
      return next ?? z;
    });
  };
  const zoomReset = () => setZoom(DEFAULT_ZOOM);

  const openTab = (id: FileId) => {
    setActiveFile(id);
    if (!openTabs.includes(id)) setOpenTabs([...openTabs, id]);
    setMobileFilesOpen(false);
  };

  const closeTab = (id: FileId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = openTabs.filter((t) => t !== id);
    setOpenTabs(next);
    if (activeFile === id) setActiveFile(next[next.length - 1] ?? "readme");
  };

  const closeAllTabs = () => {
    setOpenTabs(["home"]);
    setActiveFile("home");
    setFileMenuOpen(false);
  };

  const openNewTab = () => {
    setOpenTabs(["home"]);
    setActiveFile("home");
    setFileMenuOpen(false);
  };

  const fileMenuOpenFile = () => {
    setFileMenuOpen(false);
    openCommandPalette();
  };

  const fileMenuCloseTab = () => {
    if (openTabs.length > 1) closeTab(activeFile);
    setFileMenuOpen(false);
  };

  const resumeFullUrl =
    profile.resumePdfUrl.startsWith("http")
      ? profile.resumePdfUrl
      : `${window.location.origin}${profile.resumePdfUrl.startsWith("/") ? "" : "/"}${profile.resumePdfUrl}`;

  const handleResumeDownload = () => {
    setMobileFilesOpen(false);
    if (profile.resumePdfUrl.startsWith("http")) {
      window.open(resumeFullUrl, "_blank", "noopener,noreferrer");
      return;
    }
    fetch(resumeFullUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Resume not found");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Aryan_Resume.pdf";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        window.open(resumeFullUrl, "_blank", "noopener,noreferrer");
      });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = profile.contactFormEndpoint?.trim();
    const name = contactName.trim();
    const email = contactEmail.trim();
    const subject = contactSubject.trim();
    const message = contactMessage.trim();

    if (!endpoint) {
      // Fallback: open default email client with form data pre-filled
      const body = `Hi,\n\n${message}\n\n— ${name} (${email})`;
      const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setContactUsedMailto(true);
      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
      return;
    }

    setContactUsedMailto(false);

    setContactStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _replyto: email,
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setContactUsedMailto(false);
      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactSubject("");
      setContactMessage("");
    } catch {
      setContactStatus("error");
    }
  };

  const openRecentFileIds: FileId[] = ["home", "about", "projects", "skills"];

  const editMenuFind = () => {
    setEditMenuOpen(false);
    openCommandPalette();
  };

  const editMenuSelectAll = () => {
    setEditMenuOpen(false);
    editorContentRef.current?.focus();
    const sel = window.getSelection();
    if (sel && editorContentRef.current) {
      const range = document.createRange();
      range.selectNodeContents(editorContentRef.current);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const editMenuCopy = () => {
    setEditMenuOpen(false);
    document.execCommand("copy");
  };

  const badgeColors: Record<string, string> = {
    React: "bg-[#61dafb]/20 text-[#61dafb]",
    TypeScript: "bg-[#3178c6]/20 text-[#3178c6]",
    "Next.js": "bg-zinc-200/20 text-zinc-200",
    "Node.js": "bg-[#339933]/20 text-[#339933]",
    Python: "bg-[#3776ab]/20 text-[#3776ab]",
    JavaScript: "bg-[#f7df1e]/20 text-[#f7df1e]",
    default: "bg-zinc-600/30 text-zinc-300",
  };
  const badge = (name: string) =>
    badgeColors[name] ?? badgeColors.default;

  const themeStyle = getThemeStyle(themeId);

  return (
    <div
      className="theme-root flex min-h-[100dvh] flex-col font-sans text-[13px] antialiased"
      style={{
        ...themeStyle,
        backgroundColor: "var(--root-bg)",
        color: "var(--root-text)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <CustomCursor />
      <div
        className="zoom-wrapper flex min-h-0 flex-1 flex-col overflow-auto"
        style={{ minHeight: 0 }}
      >
        <div
          className="zoom-inner flex min-h-0 flex-1 flex-col"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
            width: `${100 / zoom}%`,
            minHeight: `${100 / zoom}%`,
          }}
        >
      {/* Title bar */}
      <header
        className="flex h-12 min-h-12 shrink-0 items-center gap-2 border-b px-2 sm:px-3 lg:pl-3 lg:pr-4"
        style={{
          borderColor: "var(--title-bar-border)",
          backgroundColor: "var(--title-bar-bg)",
          paddingTop: "max(0px, env(safe-area-inset-top))",
        }}
      >
        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
          <div className="hidden gap-2 sm:flex">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] sm:h-3 sm:w-3" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f] sm:h-3 sm:w-3" />
          </div>
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md hover:bg-white/10 lg:hidden"
            style={{ color: "var(--title-bar-text)" }}
            aria-label="Open file explorer"
            aria-expanded={mobileFilesOpen}
            onClick={() => setMobileFilesOpen((o) => !o)}
          >
            <IconMenu />
          </button>
          <div className="hidden gap-1 text-[12px] lg:flex" style={{ color: "var(--title-bar-text)" }}>
            {["File", "Edit", "View", "Go", "Run", "Terminal", "Help", "Copilot"].map((m) =>
              m === "File" ? (
                <div
                  key={m}
                  role="button"
                  tabIndex={0}
                  className="relative cursor-pointer px-2 py-1 rounded hover:bg-white/10"
                  style={{ color: "var(--title-bar-text)" }}
                  onClick={() => { setViewMenuOpen(false); setEditMenuOpen(false); setHelpMenuOpen(false); setFileMenuOpen((o) => !o); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFileMenuOpen((o) => !o);
                    }
                  }}
                >
                  {m}
                  {fileMenuOpen && (
                    <div
                      className="absolute left-0 top-full mt-0.5 z-50 min-w-[220px] rounded border py-1 shadow-lg font-mono text-[13px]"
                      style={{
                        backgroundColor: "var(--sidebar-bg)",
                        borderColor: "var(--sidebar-border)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={openNewTab}
                      >
                        <span>New Tab</span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Ctrl+T</span>
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={fileMenuOpenFile}
                      >
                        <span>Open File...</span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Ctrl+P</span>
                      </button>
                      <div className="my-1 border-t" style={{ borderColor: "var(--sidebar-border)" }} />
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10 disabled:opacity-50"
                        onClick={fileMenuCloseTab}
                        disabled={openTabs.length <= 1}
                      >
                        <span>Close Tab</span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Ctrl+W</span>
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={closeAllTabs}
                      >
                        <span>Close All Tabs</span>
                      </button>
                      <div className="my-1 border-t" style={{ borderColor: "var(--sidebar-border)" }} />
                      <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--sidebar-header-text)" }}>
                        Open Recent
                      </div>
                      {openRecentFileIds.map((id) => {
                        const f = FILES.find((x) => x.id === id)!;
                        return (
                          <button
                            key={id}
                            type="button"
                            className="flex w-full items-center px-3 py-1.5 text-left hover:bg-white/10"
                            onClick={() => { openTab(id); setFileMenuOpen(false); }}
                          >
                            {f.label}
                          </button>
                        );
                      })}
                      <div className="my-1 border-t" style={{ borderColor: "var(--sidebar-border)" }} />
                      <button
                        type="button"
                        className="flex w-full items-center px-3 py-1.5 text-left hover:bg-white/10"
                        style={{ color: "inherit" }}
                        onClick={() => {
                          setFileMenuOpen(false);
                          handleResumeDownload();
                        }}
                      >
                        Download Resume
                      </button>
                    </div>
                  )}
                </div>
              ) : m === "Edit" ? (
                <div
                  key={m}
                  role="button"
                  tabIndex={0}
                  className="relative cursor-pointer px-2 py-1 rounded hover:bg-white/10"
                  style={{ color: "var(--title-bar-text)" }}
                  onClick={() => { setFileMenuOpen(false); setEditMenuOpen((o) => !o); setViewMenuOpen(false); setHelpMenuOpen(false); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setEditMenuOpen((o) => !o);
                    }
                  }}
                >
                  {m}
                  {editMenuOpen && (
                    <div
                      className="absolute left-0 top-full mt-0.5 z-50 min-w-[200px] rounded border py-1 shadow-lg font-mono text-[13px]"
                      style={{
                        backgroundColor: "var(--sidebar-bg)",
                        borderColor: "var(--sidebar-border)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={editMenuFind}
                      >
                        <span>Find...</span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Ctrl+P</span>
                      </button>
                      <div className="my-1 border-t" style={{ borderColor: "var(--sidebar-border)" }} />
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={editMenuSelectAll}
                      >
                        <span>Select All</span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Ctrl+A</span>
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={editMenuCopy}
                      >
                        <span>Copy</span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Ctrl+C</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : m === "View" ? (
                <div
                  key={m}
                  role="button"
                  tabIndex={0}
                  className="relative cursor-pointer px-2 py-1 rounded hover:bg-white/10"
                  style={{ color: "var(--title-bar-text)" }}
                  onClick={() => { setFileMenuOpen(false); setEditMenuOpen(false); setViewMenuOpen((o) => !o); setHelpMenuOpen(false); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setViewMenuOpen((o) => !o);
                    }
                  }}
                >
                  {m}
                  {viewMenuOpen && (
                    <div
                      className="absolute left-0 top-full mt-0.5 z-50 min-w-[180px] rounded border py-1 shadow-lg"
                      style={{
                        backgroundColor: "var(--sidebar-bg)",
                        borderColor: "var(--sidebar-border)",
                      }}
                    >
                      <div className="px-3 py-1.5 text-left text-sm font-medium" style={{ color: "var(--sidebar-header-text)" }}>
                        Color Theme
                      </div>
                      {THEME_IDS.map((id) => (
                        <button
                          key={id}
                          type="button"
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-opacity-80"
                          style={{
                            color: themeId === id ? "var(--text-primary)" : "var(--text-muted)",
                            backgroundColor: themeId === id ? "var(--sidebar-selected-bg)" : "transparent",
                          }}
                          onClick={() => {
                            setThemeId(id);
                            setViewMenuOpen(false);
                          }}
                        >
                          {THEME_LABELS[id]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : m === "Help" ? (
                <div
                  key={m}
                  role="button"
                  tabIndex={0}
                  className="relative cursor-pointer px-2 py-1 rounded hover:bg-white/10"
                  style={{ color: "var(--title-bar-text)" }}
                  onClick={() => { setFileMenuOpen(false); setEditMenuOpen(false); setViewMenuOpen(false); setHelpMenuOpen((o) => !o); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setHelpMenuOpen((o) => !o);
                    }
                  }}
                >
                  {m}
                  {helpMenuOpen && (
                    <div
                      className="absolute left-0 top-full mt-0.5 z-50 min-w-[200px] rounded border py-1 shadow-lg font-mono text-[13px]"
                      style={{
                        backgroundColor: "var(--sidebar-bg)",
                        borderColor: "var(--sidebar-border)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={() => { setHelpMenuOpen(false); openCommandPalette(); }}
                      >
                        <span>Keyboard Shortcuts</span>
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Ctrl+P</span>
                      </button>
                      <div className="my-1 border-t" style={{ borderColor: "var(--sidebar-border)" }} />
                      <button
                        type="button"
                        className="flex w-full items-center px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={() => { setHelpMenuOpen(false); openCopilot(); }}
                      >
                        Open Copilot
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center px-3 py-1.5 text-left hover:bg-white/10"
                        onClick={() => { setHelpMenuOpen(false); openTab("about"); }}
                      >
                        About
                      </button>
                    </div>
                  )}
                </div>
              ) : m === "Copilot" ? (
                <button
                  key={m}
                  type="button"
                  className="px-2 py-1 rounded hover:bg-white/10"
                  onClick={openCopilot}
                >
                  {m}
                </button>
              ) : (
                <button
                  key={m}
                  type="button"
                  className="px-2 py-1 rounded hover:bg-white/10"
                >
                  {m}
                </button>
              )
            )}
          </div>
        </div>
        <button
          type="button"
          className="mx-auto flex min-h-11 min-w-0 max-w-xl flex-1 items-center justify-center gap-1.5 rounded px-2 py-2 hover:opacity-90 sm:gap-2 sm:px-3 sm:py-1.5"
          style={{ backgroundColor: "var(--command-palette-bg)", color: "var(--title-bar-text)" }}
          onClick={openCommandPalette}
          title="Quick Open (Ctrl+P)"
        >
          <span className="truncate" style={{ color: "var(--text-primary)" }}>aryan-gupta</span>
          <span className="shrink-0">:</span>
          <span className="truncate">portfolio</span>
          <span className="ml-1 hidden shrink-0 text-[11px] opacity-70 sm:ml-2 sm:inline">Ctrl+P</span>
        </button>
        <div className="hidden w-8 shrink-0 lg:block lg:w-32" />
      </header>
      {(fileMenuOpen || editMenuOpen || viewMenuOpen || helpMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setFileMenuOpen(false); setEditMenuOpen(false); setViewMenuOpen(false); setHelpMenuOpen(false); }}
          aria-hidden
        />
      )}

      {/* Command Palette / Quick Open */}
      {commandPaletteOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={closeCommandPalette}
            aria-hidden
          />
          <div
            className="fixed left-4 right-4 top-[10%] z-[101] max-h-[min(70dvh,32rem)] max-w-2xl overflow-hidden rounded-lg border shadow-2xl sm:left-1/2 sm:right-auto sm:top-[20%] sm:w-full sm:max-w-2xl sm:-translate-x-1/2"
            style={{
              backgroundColor: "var(--sidebar-bg)",
              borderColor: "var(--sidebar-border)",
              color: "var(--root-text)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center gap-2 border-b px-3 py-2"
              style={{ borderColor: "var(--sidebar-border)" }}
            >
              <span className="text-[var(--text-muted)]">&gt;</span>
              <input
                ref={commandPaletteInputRef}
                type="text"
                placeholder="Go to file or run command..."
                value={commandPaletteQuery}
                onChange={(e) => setCommandPaletteQuery(e.target.value)}
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:opacity-70"
                style={{ color: "var(--text-primary)" }}
              />
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Esc</span>
            </div>
            <div className="max-h-[60vh] overflow-auto py-1">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 border-t px-3 py-2.5 text-left text-sm"
                style={{
                  borderColor: "var(--sidebar-border)",
                  backgroundColor: selectedIndex === 0 ? "var(--sidebar-selected-bg)" : "transparent",
                  color: "var(--text-primary)",
                }}
                onClick={() => selectPaletteItem(0)}
                onMouseEnter={() => setCommandPaletteSelectedIndex(0)}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base" aria-hidden>✨</span>
                  <span>Open Aryan&apos;s Copilot</span>
                </span>
                <span className="shrink-0 text-[11px]" style={{ color: "var(--text-muted)" }}>Ctrl+Shift+C</span>
              </button>
              <div className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--sidebar-header-text)" }}>
                Files
              </div>
              {filteredFiles.map((f, i) => {
                const idx = i + 1;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={f.id}
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[13px]"
                    style={{
                      backgroundColor: isSelected ? "var(--sidebar-selected-bg)" : "transparent",
                      color: "var(--text-primary)",
                    }}
                    onClick={() => selectPaletteItem(idx)}
                    onMouseEnter={() => setCommandPaletteSelectedIndex(idx)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{f.icon === "tsx" ? "⚛" : f.icon === "md" ? "📄" : f.icon === "pdf" ? "📕" : "▤"}</span>
                      <span>{f.label}</span>
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>{f.path}</span>
                  </button>
                );
              })}
            </div>
            <div
              className="flex flex-col gap-1 border-t px-3 py-1.5 text-[11px] sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "var(--sidebar-border)", color: "var(--text-muted)" }}
            >
              <span className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>Esc close</span>
              </span>
              <span className="hidden sm:inline">Tip: type &apos;copilot&apos; to open AI chat</span>
            </div>
          </div>
        </>
      )}

      {/* Aryan's AI Assistant panel */}
      {copilotOpen && (
        <>
          <div
            className="fixed inset-0 z-[98] bg-black/30 backdrop-blur-[2px]"
            onClick={closeCopilot}
            aria-hidden
          />
          <aside
            className="fixed right-0 top-0 z-[99] flex h-full w-full max-w-lg flex-col shadow-2xl"
            style={{
              backgroundColor: "var(--editor-bg)",
              borderLeftColor: "var(--sidebar-border)",
              borderLeftWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex shrink-0 items-center justify-between border-b px-4 py-3"
              style={{ borderColor: "var(--sidebar-border)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: "#8b5cf6" }}
                  aria-hidden
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h2v2H7v-2zm4 0h2v2h-2v-2zm-2 4h2v2h-2v-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    Aryan&apos;s AI Assistant
                  </h2>
                  <div
                    className="mt-0.5 flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]"
                    style={{ borderColor: "var(--tab-active-border)", color: "var(--text-muted)" }}
                  >
                    <span>●</span>
                    <span>portfolio</span>
                    <span>•</span>
                    <span>aryan-gupta</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded p-2 hover:opacity-80"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Edit"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={closeCopilot}
                  className="rounded p-2 hover:opacity-80"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div
              ref={copilotScrollRef}
              className="flex-1 overflow-auto px-4 py-6"
            >
              {copilotMessages.length === 0 ? (
                <>
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="mb-4 flex h-20 w-20 items-center justify-center rounded-full text-[40px]"
                      style={{ backgroundColor: "#8b5cf6" }}
                      aria-hidden
                    >
                      🙂
                    </div>
                    <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                      Hi! I&apos;m Aryan&apos;s Copilot 👋
                    </h3>
                    <p className="mt-2 max-w-sm text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      Ask me anything about his projects, skills, experience, or achievements.
                    </p>
                  </div>
                  <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      "Tell me about Aryan?",
                      "What projects has Aryan built?",
                      "Tell me about his work experience",
                      "What's his tech stack?",
                      "How can I contact Aryan?",
                      "How can I support Aryan?",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[13px] transition-colors hover:opacity-90"
                        style={{
                          borderColor: "var(--card-border)",
                          backgroundColor: "var(--card-bg)",
                          color: "var(--text-primary)",
                        }}
                        onClick={() => sendCopilotMessage(prompt)}
                      >
                        <span className="text-[#8b5cf6]" aria-hidden>◆</span>
                        {prompt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {copilotMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[85%] rounded-lg px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap"
                        style={{
                          backgroundColor: msg.role === "user" ? "var(--sidebar-selected-bg)" : "var(--card-bg)",
                          color: "var(--text-primary)",
                          borderColor: "var(--card-border)",
                          borderWidth: msg.role === "assistant" ? 1 : 0,
                        }}
                      >
                        {msg.content.split("\n\n").map((para, j) => (
                          <p key={j} className={j > 0 ? "mt-2" : ""}>
                            {para.split("**").map((part, k) => (k % 2 === 1 ? <strong key={k}>{part}</strong> : part))}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat input */}
            <div
              className="shrink-0 border-t px-4 py-3"
              style={{ borderColor: "var(--sidebar-border)" }}
            >
              <div
                className="flex items-end gap-2 rounded-lg border p-2"
                style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}
              >
                <textarea
                  placeholder="Ask about Aryan's projects, experience, ..."
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendCopilotMessage(copilotInput);
                    }
                  }}
                  rows={2}
                  className="min-h-[44px] flex-1 resize-none bg-transparent text-[13px] outline-none placeholder:opacity-60"
                  style={{ color: "var(--text-primary)" }}
                />
                <button
                  type="button"
                  onClick={() => sendCopilotMessage(copilotInput)}
                  disabled={!copilotInput.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded transition-opacity disabled:opacity-40"
                  style={{ backgroundColor: "#8b5cf6", color: "white" }}
                  aria-label="Send"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                <span>{copilotMessagesLeft} msg{copilotMessagesLeft !== 1 ? "s" : ""} left</span>
                <span className="max-w-[240px] text-right">AI can make mistakes · Contact Aryan directly for important info</span>
              </div>
            </div>

            {/* Mini status bar */}
            <div
              className="flex shrink-0 items-center justify-end gap-4 border-t px-4 py-1.5 text-[11px]"
              style={{ borderColor: "var(--status-bar-border)", backgroundColor: "var(--status-bar-bg)", color: "var(--status-bar-text)" }}
            >
              <span>UTF-8</span>
              <span>Prettier</span>
              <span>{getThemeLabel(themeId)}</span>
              <span>{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
            </div>
          </aside>
        </>
      )}

      <div className="relative flex min-h-0 flex-1">
        {/* Mobile file drawer */}
        {mobileFilesOpen && (
          <>
            <div
              className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileFilesOpen(false)}
              aria-hidden
            />
            <aside
              className="fixed inset-y-0 left-0 z-[86] flex max-h-[100dvh] w-[min(20rem,92vw)] flex-col border-r shadow-2xl lg:hidden"
              style={{
                borderColor: "var(--sidebar-border)",
                backgroundColor: "var(--sidebar-bg)",
                paddingLeft: "max(0px, env(safe-area-inset-left))",
                paddingTop: "max(0px, env(safe-area-inset-top))",
              }}
              role="dialog"
              aria-modal="true"
              aria-label="File explorer"
            >
              <div
                className="flex h-12 shrink-0 items-center justify-between border-b px-3"
                style={{ borderColor: "var(--sidebar-border)" }}
              >
                <span
                  className="text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: "var(--sidebar-header-text)" }}
                >
                  Portfolio
                </span>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md text-lg leading-none hover:bg-white/10"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Close file explorer"
                  onClick={() => setMobileFilesOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="flex gap-1 border-b px-2 py-2" style={{ borderColor: "var(--sidebar-border)" }}>
                <button
                  type="button"
                  className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md border px-2 text-[12px] font-medium hover:opacity-90"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-primary)",
                  }}
                  onClick={() => {
                    setMobileFilesOpen(false);
                    openCommandPalette();
                  }}
                >
                  <IconSearch />
                  Search
                </button>
                <button
                  type="button"
                  className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-md border px-2 text-[12px] font-medium hover:opacity-90"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-primary)",
                  }}
                  onClick={() => {
                    setMobileFilesOpen(false);
                    openCopilot();
                  }}
                >
                  <IconAIAssistant />
                  Copilot
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-auto py-1">
                {FILES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      if (f.id === "resume") {
                        handleResumeDownload();
                      } else {
                        openTab(f.id);
                      }
                    }}
                    className={`sidebar-file flex min-h-11 w-full items-center gap-2 px-3 py-2.5 text-left ${f.id === "resume" ? "opacity-90" : ""}`}
                    style={{
                      backgroundColor: activeFile === f.id ? "var(--sidebar-selected-bg)" : "transparent",
                      color: activeFile === f.id ? "var(--text-primary)" : undefined,
                    }}
                  >
                    <span className="text-[16px] font-medium text-amber-500/90">
                      {f.icon === "tsx" ? "⚛" : f.icon === "md" ? "📄" : f.icon === "pdf" ? "📕" : "▤"}
                    </span>
                    <span className="truncate text-[13px]">{f.label}</span>
                  </button>
                ))}
              </div>
            </aside>
          </>
        )}

        {/* Activity bar */}
        <aside
          className="hidden w-12 shrink-0 flex-col items-center border-r py-2 lg:flex"
          style={{ borderColor: "var(--activity-bar-border)", backgroundColor: "var(--activity-bar-bg)" }}
        >
          <button
            onClick={() => setActiveSidebar("explorer")}
            className="flex h-10 w-10 items-center justify-center rounded hover:opacity-90"
            style={{
              backgroundColor: activeSidebar === "explorer" ? "var(--activity-bar-active-bg)" : "transparent",
              color: activeSidebar === "explorer" ? "var(--text-primary)" : "var(--activity-bar-text)",
            }}
            title="Explorer"
          >
            <IconExplorer />
          </button>
          <button
            onClick={() => {
              setActiveSidebar("search");
              openCommandPalette();
            }}
            className="flex h-10 w-10 items-center justify-center rounded hover:opacity-90"
            style={{
              backgroundColor: activeSidebar === "search" ? "var(--activity-bar-active-bg)" : "transparent",
              color: activeSidebar === "search" ? "var(--text-primary)" : "var(--activity-bar-text)",
            }}
            title="Search (Quick Open)"
          >
            <IconSearch />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded hover:opacity-90"
            style={{ color: "var(--activity-bar-text)" }}
            title="Source Control"
          >
            <IconSourceControl />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded hover:opacity-90"
            style={{ color: "var(--activity-bar-text)" }}
            title="Extensions"
          >
            <IconExtensions />
          </button>
          <button
            className="mt-4 flex h-10 w-10 items-center justify-center rounded hover:opacity-90"
            style={{ color: "var(--activity-bar-text)" }}
            title="Portfolio"
          >
            <IconPortfolio />
          </button>
          <button
            onClick={openCopilot}
            className="flex h-10 w-10 items-center justify-center rounded hover:opacity-90"
            style={{
              backgroundColor: copilotOpen ? "var(--activity-bar-active-bg)" : "transparent",
              color: copilotOpen ? "var(--text-primary)" : "var(--activity-bar-text)",
            }}
            title="AI Assistant (Ctrl+Shift+C)"
          >
            <IconAIAssistant />
          </button>
          <div className="mt-auto flex flex-col gap-1">
            <button className="flex h-10 w-10 items-center justify-center rounded hover:opacity-90" style={{ color: "var(--activity-bar-text)" }}>
              <IconSettings />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded hover:opacity-90" style={{ color: "var(--activity-bar-text)" }}>
              <IconAccount />
            </button>
          </div>
        </aside>

        {/* Sidebar */}
        <aside
          className="hidden w-56 shrink-0 flex-col border-r lg:flex"
          style={{ borderColor: "var(--sidebar-border)", backgroundColor: "var(--sidebar-bg)" }}
        >
          <div
            className="flex h-10 items-center justify-between border-b px-3 uppercase tracking-wider text-[11px]"
            style={{ borderColor: "var(--sidebar-border)", color: "var(--sidebar-header-text)" }}
          >
            Portfolio
          </div>
          <div className="flex-1 overflow-auto py-1">
            {FILES.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  if (f.id === "resume") {
                    handleResumeDownload();
                  } else {
                    openTab(f.id);
                  }
                }}
                className={`sidebar-file flex w-full items-center gap-2 px-3 py-1.5 text-left ${f.id === "resume" ? "opacity-90" : ""}`}
                style={{
                  backgroundColor: activeFile === f.id ? "var(--sidebar-selected-bg)" : "transparent",
                  color: activeFile === f.id ? "var(--text-primary)" : undefined,
                }}
              >
                <span className="text-[16px] font-medium text-amber-500/90">{f.icon === "tsx" ? "⚛" : f.icon === "md" ? "📄" : f.icon === "pdf" ? "📕" : "▤"}</span>
                <span className="truncate text-[13px]">{f.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Editor area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Tabs */}
          <div
            className="tabs-scroll flex shrink-0 items-end overflow-x-auto overflow-y-hidden border-b"
            style={{ borderColor: "var(--tab-bar-border)", backgroundColor: "var(--tab-bar-bg)" }}
            onClick={() => setMobileFilesOpen(false)}
          >
            {openTabs.map((id) => {
              const f = FILES.find((x) => x.id === id)!;
              const isActive = activeFile === id;
              return (
                <div
                  key={id}
                  onClick={() => setActiveFile(id)}
                  className="group flex shrink-0 cursor-pointer items-center gap-2 border-r px-3 py-2"
                  style={{
                    borderColor: "var(--tab-bar-border)",
                    borderBottomWidth: isActive ? 2 : 0,
                    borderBottomColor: isActive ? "var(--tab-active-border)" : "transparent",
                    backgroundColor: isActive ? "var(--tab-active-bg)" : "var(--tab-bar-bg)",
                    color: isActive ? "var(--tab-text-active)" : "var(--tab-text)",
                  }}
                >
                  <span className="shrink-0 text-[14px]">{f.icon === "md" ? "📄" : "▤"}</span>
                  <span className="max-w-[72px] truncate sm:max-w-[120px]">{f.label}</span>
                  <button
                    type="button"
                    onClick={(e) => closeTab(id, e)}
                    className="ml-1 min-h-8 min-w-8 shrink-0 rounded p-1 opacity-100 hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                    style={{ backgroundColor: "var(--close-tab-hover-bg)" }}
                    aria-label={`Close ${f.label}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          <div
            className="flex min-w-0 shrink-0 items-center gap-1 overflow-x-auto border-b px-3 py-1 text-[12px]"
            style={{ borderColor: "var(--tab-bar-border)", backgroundColor: "var(--breadcrumb-bg)", color: "var(--breadcrumb-text)" }}
            onClick={() => setMobileFilesOpen(false)}
          >
            <span>aryan-gupta</span>
            <span>&gt;</span>
            <span className="min-w-0 truncate" style={{ color: "var(--breadcrumb-text-active)" }}>{FILES.find((f) => f.id === activeFile)?.label}</span>
          </div>

          {/* Editor content */}
          <div
            ref={editorContentRef}
            tabIndex={-1}
            className="flex-1 overflow-auto p-4 pb-6 outline-none sm:p-6"
            style={{ backgroundColor: "var(--editor-bg)" }}
          >
            {activeFile === "readme" && (
              <div className="max-w-3xl space-y-6">
                <h1 className="break-words text-xl font-semibold sm:text-2xl" style={{ color: "var(--text-primary)" }}>
                  {profile.title} @ {profile.company.replace("@ ", "")} • India 🇮🇳
                </h1>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Next.js", "Node.js", "Python", "JavaScript"].map(
                    (t) => (
                      <span key={t} className={`rounded px-2 py-0.5 text-xs font-medium ${badge(t)}`}>
                        {t}
                      </span>
                    )
                  )}
                </div>
                <div>
                  <h2 className="mb-2 text-lg font-medium" style={{ color: "var(--text-primary)" }}>About</h2>
                  <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>{profile.tagline}</p>
                  <p className="mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    B.Tech in Information Technology @ GGSIPU. I build full-stack apps and enjoy
                    clean APIs and responsive UIs.
                  </p>
                </div>
                <div>
                  <h2 className="mb-2 text-lg font-medium" style={{ color: "var(--text-primary)" }}>Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {["Languages", "Web", "Tools", "Fundamentals"].map((cat) => (
                      <span
                        key={cat}
                        className="rounded px-3 py-1.5 text-sm"
                        style={{ backgroundColor: "var(--card-bg)", color: "var(--text-secondary)", borderColor: "var(--card-border)", borderWidth: 1 }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="mb-2 text-lg font-medium" style={{ color: "var(--text-primary)" }}>Connect</h2>
                  <a href={profile.links.email} className="link-theme">{profile.email}</a>
                  <span style={{ color: "var(--text-muted)" }}> · </span>
                  <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link-theme">GitHub</a>
                  <span style={{ color: "var(--text-muted)" }}> · </span>
                  <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-theme">LinkedIn</a>
                  <span style={{ color: "var(--text-muted)" }}> · </span>
                  <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="link-theme">LeetCode</a>
                </div>
              </div>
            )}

            {activeFile === "home" && (
              <div className="mx-auto max-w-4xl space-y-10">
                <p className="font-mono text-[13px]" style={{ color: "var(--link-color)" }}>
                  // hello world — welcome to my portfolio
                </p>
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    <span style={{ color: "var(--text-primary)" }}>{profile.name.split(" ")[0]}</span>
                    <span className="ml-2" style={{ color: "var(--link-color)" }}>{profile.name.split(" ")[1]}</span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--link-color)", borderColor: "var(--card-border)", borderWidth: 1 }}>
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--link-color)" }} />
                      {profile.title}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-secondary)", borderColor: "var(--card-border)", borderWidth: 1 }}>
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--text-muted)" }} />
                      {profile.subtitle}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: "var(--card-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)", borderWidth: 1 }}>
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--tab-active-border)" }} />
                      {profile.company}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}>
                  <p className="text-base leading-relaxed sm:text-lg" style={{ color: "var(--text-secondary)" }}>
                    {profile.tagline.split(" ").map((word, i) => {
                      const lower = word.toLowerCase().replace(/[.,]/g, "");
                      const bold = ["scalable", "full-stack", "clean", "user", "experiences"].includes(lower);
                      return bold ? (
                        <span key={i} style={{ color: "var(--link-color)", fontWeight: 600 }}> {word}</span>
                      ) : (
                        <span key={i}> {word}</span>
                      );
                    })}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openTab("projects")}
                    className="flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: "var(--tab-active-border)", color: "var(--sidebar-bg)" }}
                  >
                    <IconFolder />
                    Projects
                  </button>
                  <button
                    type="button"
                    onClick={() => openTab("about")}
                    className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                    style={{ borderColor: "var(--sidebar-border)", color: "var(--text-primary)", backgroundColor: "var(--card-bg)" }}
                  >
                    <IconPerson />
                    About Me
                  </button>
                  <button
                    type="button"
                    onClick={() => openTab("contact")}
                    className="flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                    style={{ borderColor: "var(--sidebar-border)", color: "var(--text-primary)", backgroundColor: "var(--card-bg)" }}
                  >
                    <IconEnvelope />
                    Contact
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stats.map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-col rounded-xl border p-4 transition-colors"
                      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)" }}
                    >
                      <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--link-color)" }}>{s.value}</span>
                      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</span>
                      {s.label === "Learning" && (
                        <span className="mt-1 inline-block" style={{ color: "var(--text-muted)" }}><IconArrowUp /></span>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Connect</p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={profile.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                      title="GitHub"
                    >
                      <LogoGitHub />
                      GitHub
                    </a>
                    <a
                      href={profile.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                      title="LinkedIn"
                    >
                      <LogoLinkedIn className="text-[#0a66c2]" />
                      LinkedIn
                    </a>
                    <a
                      href={profile.links.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                      title="LeetCode"
                    >
                      <LogoLeetCode className="text-[#ffa116]" />
                      LeetCode
                    </a>
                    <a
                      href={profile.links.email}
                      className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                      title="Email"
                    >
                      <span style={{ color: "var(--link-color)" }}><LogoEmail /></span>
                      Email
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeFile === "about" && (
              <div className="mx-auto max-w-4xl space-y-10">
                <section>
                  <h2 className="mb-4 text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>About</h2>
                  <div className="rounded-xl border p-5 sm:p-6" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)", borderLeftWidth: 4, borderLeftColor: "var(--link-color)" }}>
                    <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      I'm a B.Tech student in Information Technology at GGSIPU, New Delhi. I enjoy
                      building full-stack applications, from backend APIs to responsive UIs, and have
                      experience across web and mobile development.
                    </p>
                  </div>
                </section>
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    <span style={{ color: "var(--link-color)" }}><IconGraduation /></span>
                    Education
                  </h3>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div
                        key={edu.school}
                        className="flex gap-4 rounded-xl border p-4 sm:p-5 transition-colors"
                        style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--sidebar-selected-bg)", color: "var(--link-color)" }}>
                          <IconGraduation />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>{edu.school}</h4>
                            <span className="shrink-0 text-sm" style={{ color: "var(--text-muted)" }}>{edu.period}</span>
                          </div>
                          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>{edu.degree}</p>
                          <span className="mt-2 inline-block rounded-md px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: "var(--sidebar-selected-bg)", color: "var(--link-color)" }}>
                            {edu.detail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeFile === "experience" && (
              <div className="max-w-3xl space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Experience</h2>
                {experience.map((job) => (
                  <div key={job.company} className="rounded border p-4" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {"logo" in job && job.logo && (
                          <img src={job.logo} alt={`${job.company} logo`} className="h-10 w-10 shrink-0 rounded object-contain" />
                        )}
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{job.company} · {job.role}</span>
                      </div>
                      <span className="text-sm shrink-0" style={{ color: "var(--text-muted)" }}>{job.period}</span>
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{job.location}</p>
                    <ul className="mt-3 list-inside list-disc space-y-1" style={{ color: "var(--text-secondary)" }}>
                      {job.points.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {activeFile === "projects" && (
              <div className="mx-auto max-w-4xl space-y-8">
                <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>Projects</h2>
                <div className="space-y-5">
                  {projects.map((proj) => (
                    <div
                      key={proj.name}
                      className="group rounded-xl border p-5 transition-all hover:border-opacity-80 sm:p-6"
                      style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: "var(--sidebar-selected-bg)", color: "var(--link-color)" }}>
                            <IconFolder />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{proj.name}</h3>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {proj.stack.split(", ").map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-md px-2 py-0.5 font-mono text-[11px] font-medium"
                                  style={{ backgroundColor: "var(--sidebar-selected-bg)", color: "var(--text-muted)" }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          {"live" in proj && proj.live && (
                            <a
                              href={proj.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
                              style={{ borderColor: "var(--card-border)", color: "var(--text-primary)", backgroundColor: "var(--editor-bg)" }}
                            >
                              <span aria-hidden>🔗</span>
                              Live
                            </a>
                          )}
                          <a
                            href={proj.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:scale-[1.02]"
                            style={{ borderColor: "var(--card-border)", color: "var(--text-primary)", backgroundColor: "var(--editor-bg)" }}
                          >
                            <LogoGitHub />
                            GitHub
                          </a>
                        </div>
                      </div>
                      <p className="mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeFile === "skills" && (
              <div className="max-w-3xl space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Technical Skills</h2>
                <pre className="max-w-full overflow-x-auto rounded border p-3 text-[11px] sm:p-4 sm:text-[13px]" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)", color: "var(--text-secondary)" }}>
{JSON.stringify(skills, null, 2)}
                </pre>
              </div>
            )}

            {activeFile === "contact" && (
              <div className="max-w-3xl space-y-6">
                <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>Contact</h2>
                <p style={{ color: "var(--text-secondary)" }}>Open to internships and full-time opportunities.</p>
                <div className="flex flex-wrap gap-3">
                  <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link-theme">GitHub</a>
                  <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link-theme">LinkedIn</a>
                  <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" className="link-theme">LeetCode</a>
                  <a href={profile.links.email} className="link-theme">Email</a>
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{profile.email} · {profile.phone}</p>

                <div className="rounded-lg border p-4" style={{ borderColor: "var(--card-border)", backgroundColor: "var(--card-bg)" }}>
                  <h3 className="mb-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>Send a message / requirements</h3>
                  {profile.contactFormEndpoint ? null : (
                    <p className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
                      Clicking &quot;Send message&quot; will open your email client with the form pre-filled. To receive submissions in your inbox without opening mail, set <code className="rounded px-1" style={{ backgroundColor: "var(--sidebar-bg)" }}>contactFormEndpoint</code> in <code className="rounded px-1" style={{ backgroundColor: "var(--sidebar-bg)" }}>src/data.ts</code> (free at{" "}
                      <a href="https://formspree.io" target="_blank" rel="noopener noreferrer" className="link-theme">formspree.io</a>).
                    </p>
                  )}
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="contact-name" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Name *</label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your name"
                        className="w-full rounded border px-3 py-2 text-[13px] outline-none placeholder:opacity-60"
                        style={{ borderColor: "var(--card-border)", backgroundColor: "var(--sidebar-bg)", color: "var(--text-primary)" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Email *</label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full rounded border px-3 py-2 text-[13px] outline-none placeholder:opacity-60"
                        style={{ borderColor: "var(--card-border)", backgroundColor: "var(--sidebar-bg)", color: "var(--text-primary)" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Subject / Requirements *</label>
                      <input
                        id="contact-subject"
                        type="text"
                        required
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="e.g. Project inquiry, collaboration, job opportunity"
                        className="w-full rounded border px-3 py-2 text-[13px] outline-none placeholder:opacity-60"
                        style={{ borderColor: "var(--card-border)", backgroundColor: "var(--sidebar-bg)", color: "var(--text-primary)" }}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="mb-1 block text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Message *</label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Describe your requirements or how you'd like to work together..."
                        className="w-full resize-y rounded border px-3 py-2 text-[13px] outline-none placeholder:opacity-60"
                        style={{ borderColor: "var(--card-border)", backgroundColor: "var(--sidebar-bg)", color: "var(--text-primary)" }}
                      />
                    </div>
                    {contactStatus === "success" && (
                      <p className="text-sm" style={{ color: "var(--accent)" }}>
                        {contactUsedMailto
                          ? "Your email client should open with this message—send it from there to reach me."
                          : "Thanks! Your message has been sent. I'll get back to you soon."}
                      </p>
                    )}
                    {contactStatus === "error" && (
                      <p className="text-sm" style={{ color: "var(--error-text, #e11d48)" }}>
                        Something went wrong. Please try again or email directly at {profile.email}.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={contactStatus === "sending"}
                      className="rounded px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg, white)" }}
                    >
                      {contactStatus === "sending" ? "Sending..." : "Send message"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeFile === "resume" && (
              <div className="max-w-3xl space-y-4">
                <p style={{ color: "var(--text-muted)" }}>Put your resume file at <code className="rounded px-1" style={{ backgroundColor: "var(--card-bg)" }}>public/Aryan_Resume.pdf</code> in this project, or set <code className="rounded px-1" style={{ backgroundColor: "var(--card-bg)" }}>resumePdfUrl</code> in <code className="rounded px-1" style={{ backgroundColor: "var(--card-bg)" }}>data.ts</code> to a full URL (e.g. Google Drive link).</p>
                <button
                  type="button"
                  onClick={handleResumeDownload}
                  className="link-theme inline-block rounded px-4 py-2"
                  style={{ backgroundColor: "var(--sidebar-selected-bg)" }}
                >
                  Download Aryan_Resume.pdf
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <footer
        className="relative flex min-h-8 shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t px-2 py-1 text-[11px] sm:h-7 sm:flex-nowrap sm:px-3 sm:text-[12px]"
        style={{ borderColor: "var(--status-bar-border)", backgroundColor: "var(--status-bar-bg)", color: "var(--status-bar-text)" }}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-4">
          <span className="flex shrink-0 items-center gap-1">
            <span>◆</span> main
          </span>
          <span className="hidden sm:inline">↻</span>
          <span className="min-w-0 truncate max-sm:max-w-[40vw]">Aryan&apos;s Portfolio</span>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-4">
          <span className="hidden sm:inline">Copilot</span>
          <span className="hidden md:inline">Markdown</span>
          <span className="hidden lg:inline">UTF-8</span>
          <span className="hidden lg:inline">Prettier</span>
          <button
            type="button"
            onClick={() => setThemePickerOpen((o) => !o)}
            className="rounded px-1 py-0.5 hover:bg-white/15"
            title="Change color theme"
          >
            {getThemeLabel(themeId)}
          </button>
          {themePickerOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setThemePickerOpen(false)} aria-hidden />
              <div
                className="absolute bottom-full right-0 z-50 mb-1 min-w-[160px] rounded border py-1 shadow-lg"
                style={{
                  backgroundColor: "var(--sidebar-bg)",
                  borderColor: "var(--sidebar-border)",
                  color: "var(--root-text)",
                }}
              >
                <div className="border-b px-3 py-1.5 text-[11px] font-medium" style={{ borderColor: "var(--sidebar-border)", color: "var(--sidebar-header-text)" }}>
                  Color Theme
                </div>
                {THEME_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/10"
                    style={{
                      color: themeId === id ? "var(--text-primary)" : "var(--text-muted)",
                      backgroundColor: themeId === id ? "var(--sidebar-selected-bg)" : "transparent",
                    }}
                    onClick={() => {
                      setThemeId(id);
                      setThemePickerOpen(false);
                    }}
                  >
                    {THEME_LABELS[id]}
                  </button>
                ))}
              </div>
            </>
          )}
          <span className="tabular-nums">{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
          <span className="hidden items-center gap-1 lg:flex" title="Zoom (Ctrl+Plus / Ctrl+Minus / Ctrl+0)">
            <button type="button" onClick={zoomOut} className="rounded px-1 py-0.5 hover:bg-white/15" aria-label="Zoom out" disabled={zoom <= ZOOM_LEVELS[0]}>−</button>
            <button type="button" onClick={zoomReset} className="min-w-[3ch] rounded px-1 py-0.5 hover:bg-white/15" title="Reset zoom">{Math.round(zoom * 100)}%</button>
            <button type="button" onClick={zoomIn} className="rounded px-1 py-0.5 hover:bg-white/15" aria-label="Zoom in" disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}>+</button>
          </span>
        </div>
      </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
