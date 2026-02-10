"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { 
  ArrowUpRight, Sparkles, Brain, Workflow, 
  Mail, MapPin, Github, Linkedin,
  Award, Terminal, Cpu, Globe, ChevronRight, ExternalLink, Zap, Code2, Layers
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

// ============================================
// DATA
// ============================================
const professionalData = {
  name: "Andrej Podgorsek",
  title: "AI Solution Architect",
  tagline: "Building AI products that deliver real business value",
  description: "AI Architect, Engineer & Product Manager with 20+ years building AI-powered products across manufacturing, automotive, healthcare, banking, insurance, and telecommunications.",
  location: "Šentvid pri Stični, Slovenia",
  email: "andrej@podgorsek.de",
  website: "podgorsek.de",
  certifications: [
    { name: "AI Solution Architect Expert", year: "2026" },
    { name: "Databricks Machine Learning Professional", year: "2024" },
    { name: "ISAQB Software Architect Certified", year: "2017" },
    { name: "AWS Certified", year: "2023" },
    { name: "Azure Certified", year: "2023" },
    { name: "GCP Certified", year: "2024" }
  ],
  expertise: [
    { area: "AI Architecture", level: 95 },
    { area: "System Design", level: 90 },
    { area: "Product Management", level: 85 },
    { area: "Full-Stack Development", level: 88 },
    { area: "Cloud Infrastructure", level: 82 },
    { area: "AI/ML Engineering", level: 90 }
  ]
};

const projects = [
  {
    id: 1,
    title: "Code Review Agent",
    description: "AI-powered code review with inline suggestions and automated quality gates.",
    tags: ["TypeScript", "AI", "GitHub API"],
    metric: "40% faster reviews"
  },
  {
    id: 2,
    title: "Human-in-the-Loop",
    description: "Smart approval workflows with AI suggestions and human oversight controls.",
    tags: ["React", "Workflow", "AI"],
    metric: "3x throughput"
  },
  {
    id: 3,
    title: "Dev Environment",
    description: "AI-powered development environment management with automated provisioning.",
    tags: ["Docker", "Cloud", "Automation"],
    metric: "Zero setup time"
  },
  {
    id: 4,
    title: "Workflow Orchestrator",
    description: "Visual workflow builder with AI-assisted node configuration.",
    tags: ["React Flow", "Visual Editor", "AI"],
    metric: "80% less code"
  }
];

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const letterAnimation = {
  hidden: { y: 100, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
  }
};

// ============================================
// CUSTOM CURSOR
// ============================================
function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-cyan-400 rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: isHovering ? 2.5 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-cyan-400/50 rounded-full pointer-events-none z-[99] hidden md:block"
        style={{
          x: useSpring(cursorX, { stiffness: 150, damping: 15 }),
          y: useSpring(cursorY, { stiffness: 150, damping: 15 }),
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: isHovering ? 1.5 : 1, opacity: isHovering ? 0.5 : 1 }}
      />
    </>
  );
}

// ============================================
// LOADING SCREEN
// ============================================
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#0a0a0a] z-[200] flex items-center justify-center"
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center">
        <motion.div
          className="text-6xl md:text-8xl font-bold font-display mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
            AP
          </span>
        </motion.div>
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.p
          className="text-white/30 font-mono text-sm mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading experience... {Math.min(Math.round(progress), 100)}%
        </motion.p>
      </div>
    </motion.div>
  );
}

// ============================================
// COMPONENTS
// ============================================
function AnimatedText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span className={`inline-flex overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={letterAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={i}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

function GlowingButton({ children, href, onClick, variant = "primary" }: { children: React.ReactNode; href?: string; onClick?: () => void; variant?: "primary" | "secondary" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const ButtonContent = (
    <>
      <motion.span 
        className={`absolute inset-0 bg-gradient-to-r ${variant === "primary" ? "from-cyan-400 via-fuchsia-500 to-amber-400" : "from-white/10 to-white/5"} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
        animate={{ scale: isHovered ? 1.2 : 1 }}
      />
      <motion.span 
        className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100"
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      <span className="relative flex items-center gap-2 text-sm font-medium tracking-widest uppercase">
        {children}
        <motion.span
          animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <ArrowUpRight className="w-4 h-4" />
        </motion.span>
      </span>
    </>
  );

  const className = `group relative px-8 py-4 ${variant === "primary" ? "bg-white/5 border-white/10 hover:border-cyan-400/50" : "bg-transparent border-white/20 hover:border-white/40"} border transition-all duration-300 overflow-hidden`;

  const motionProps = {
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: handleMouseLeave,
    style: { x: useSpring(x, { stiffness: 150, damping: 15 }), y: useSpring(y, { stiffness: 150, damping: 15 }) },
    whileTap: { scale: 0.98 }
  };

  if (href) {
    return (
      <motion.a href={href} className={className} {...motionProps}>
        {ButtonContent}
      </motion.a>
    );
  }

  return (
    <motion.button onClick={onClick} className={className} {...motionProps}>
      {ButtonContent}
    </motion.button>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const glowX = useTransform(x, [-100, 100], ["0%", "100%"]);
  const glowY = useTransform(y, [-100, 100], ["0%", "100%"]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] as const }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: useSpring(rotateX, { stiffness: 300, damping: 30 }), rotateY: useSpring(rotateY, { stiffness: 300, damping: 30 }) }}
      className="group relative perspective-1000"
    >
      {/* Animated gradient border */}
      <motion.div 
        className="absolute -inset-px rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(300px circle at ${glowX} ${glowY}, rgba(34, 211, 238, 0.4), transparent 60%)`
        }}
      />
      
      {/* Card content */}
      <div className="relative p-8 border border-white/5 hover:border-cyan-400/30 transition-all duration-500 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden">
        {/* Background gradient on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-fuchsia-500/5 to-amber-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Floating particles */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.div
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -30], x: [0, 10] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{ top: "20%", right: "20%" }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-fuchsia-400 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -40], x: [0, -15] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                style={{ bottom: "30%", left: "15%" }}
              />
            </>
          )}
        </AnimatePresence>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <motion.span 
              className="text-xs font-mono text-white/30 tracking-widest"
              animate={{ color: isHovered ? "rgba(34, 211, 238, 0.6)" : "rgba(255, 255, 255, 0.3)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
            <motion.span 
              className="text-xs font-mono px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {project.metric}
            </motion.span>
          </div>
          
          <motion.h3 
            className="text-2xl font-bold mb-3 font-display"
            animate={{ color: isHovered ? "#22d3ee" : "#ffffff" }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>
          
          <p className="text-white/50 leading-relaxed mb-6 group-hover:text-white/70 transition-colors">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, tagIndex) => (
              <motion.span 
                key={tag} 
                className="px-3 py-1 text-xs font-mono bg-white/5 text-white/50 border border-white/10 rounded-full group-hover:bg-white/10 group-hover:border-cyan-400/30 group-hover:text-cyan-300 transition-all"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + tagIndex * 0.05 }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
          
          {/* View project link */}
          <motion.div 
            className="mt-6 flex items-center gap-2 text-sm text-white/30 group-hover:text-cyan-400 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <span>Explore project</span>
            <ExternalLink className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function SkillBar({ skill, index }: { skill: typeof professionalData.expertise[0]; index: number }) {
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onViewportEnter={() => setIsInView(true)}
      className="group"
    >
      <div className="flex justify-between items-baseline mb-3">
        <motion.span 
          className="text-sm font-medium text-white/70 group-hover:text-white transition-colors flex items-center gap-2"
          whileHover={{ x: 5 }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{ scale: isInView ? [1, 1.5, 1] : 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
          />
          {skill.area}
        </motion.span>
        <motion.span 
          className="text-xs font-mono text-white/30 group-hover:text-cyan-400 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 1 : 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isInView ? `${skill.level}%` : 0 }}
          transition={{ duration: 1.2, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0 rounded-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 rounded-full" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================
// ANIMATED BACKGROUND MESH
// ============================================
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: ["-20%", "30%", "-20%"],
          y: ["10%", "30%", "10%"],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(232, 121, 249, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
          right: "-10%",
          top: "20%",
        }}
        animate={{
          x: ["0%", "-20%", "0%"],
          y: ["0%", "20%", "0%"],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
          left: "20%",
          bottom: "10%",
        }}
        animate={{
          x: ["0%", "30%", "0%"],
          y: ["0%", "-20%", "0%"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      <CustomCursor />
      <ScrollProgress />
      <AnimatedBackground />
      
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Custom Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap');
        
        :root {
          --color-cyan: #22d3ee;
          --color-fuchsia: #e879f9;
          --color-amber: #fbbf24;
        }
        
        .font-display {
          font-family: 'Clash Display', 'Space Grotesk', system-ui, sans-serif;
        }

        .perspective-1000 {
          perspective: 1000px;
        }
        
        .noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 50;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-6 mix-blend-difference">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-mono tracking-widest"
          >
            AP
          </motion.span>
          <div className="flex gap-8 text-xs font-mono tracking-widest">
            {["Work", "About", "Contact"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-cyan-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div 
          style={{ y, opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <motion.span 
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-widest text-cyan-400 border border-cyan-400/20 bg-cyan-400/5 rounded-full"
              whileHover={{ scale: 1.05, borderColor: "rgba(34, 211, 238, 0.5)" }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3 h-3" />
              </motion.span>
              AVAILABLE FOR PROJECTS
            </motion.span>
          </motion.div>

          {/* Main Headline with character animation */}
          <div className="overflow-hidden mb-8">
            <motion.h1 
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-9xl font-bold leading-[0.9] tracking-tighter font-display"
            >
              <motion.span 
                className="block"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                AI
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                SOLUTION
              </motion.span>
              <motion.span 
                className="block"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                ARCHITECT
              </motion.span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {professionalData.tagline}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <GlowingButton href="#work">
              View Projects
            </GlowingButton>
            <GlowingButton href="#contact" variant="secondary">
              Get in Touch
            </GlowingButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-white/30 tracking-widest">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1"
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-cyan-400 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="work" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <span className="text-xs font-mono text-white/30 tracking-widest mb-4 block">SELECTED WORK</span>
            <h2 className="text-4xl md:text-6xl font-bold font-display">
              Projects that<br />
              <span className="text-white/30">define impact</span>
            </h2>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-px bg-white/5">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-6 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "20+", label: "Years Experience", icon: Brain },
              { value: "50+", label: "Projects Delivered", icon: Layers },
              { value: "6", label: "Industries", icon: Globe },
              { value: "100%", label: "Client Satisfaction", icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-white/5 border border-white/10 group-hover:border-cyan-400/30 group-hover:bg-cyan-400/10 transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="w-5 h-5 text-cyan-400" />
                </motion.div>
                <motion.div
                  className="text-4xl md:text-5xl font-bold font-display bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-white/40 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                className="text-xs font-mono text-cyan-400 tracking-widest mb-4 block"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                ABOUT ME
              </motion.span>
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-8 leading-tight">
                20+ years building<br />
                <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                  AI-powered products
                </span>
              </h2>
              <p className="text-white/50 leading-relaxed mb-8 text-lg">
                {professionalData.description}
              </p>
              
              {/* Quick links */}
              <div className="flex flex-wrap gap-4 mb-8">
                <a href={`mailto:${professionalData.email}`} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:border-cyan-400/30 hover:bg-cyan-400/10 transition-all">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  {professionalData.email}
                </a>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
                  <MapPin className="w-4 h-4 text-fuchsia-400" />
                  {professionalData.location}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Skills */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <span className="text-xs font-mono text-white/30 tracking-widest mb-4 block">EXPERTISE</span>
              {professionalData.expertise.map((skill, index) => (
                <SkillBar key={skill.area} skill={skill} index={index} />
              ))}
            </motion.div>
          </div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-32 pt-20 border-t border-white/5"
          >
            <span className="text-xs font-mono text-white/30 tracking-widest mb-8 block">CERTIFICATIONS</span>
            <div className="grid md:grid-cols-3 gap-px bg-white/5">
              {professionalData.certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-[#0a0a0a] group hover:bg-white/5 transition-colors"
                >
                  <Award className="w-5 h-5 text-cyan-400/60 mb-4" />
                  <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                    {cert.name}
                  </p>
                  <p className="text-xs font-mono text-white/30 mt-1">{cert.year}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-fuchsia-500/5 to-amber-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-6xl text-cyan-400/30 font-display mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              "
            </motion.div>
            <blockquote className="text-2xl md:text-4xl font-display font-medium leading-relaxed mb-8">
              <span className="text-white/80">The best time to start with AI was yesterday.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                The second best time is now.
              </span>
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-400" />
              <span className="text-sm font-mono text-white/40 tracking-widest">LET'S BUILD THE FUTURE</span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-fuchsia-500" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs font-mono text-white/30 tracking-widest mb-4 block">LET'S CONNECT</span>
            <h2 className="text-5xl md:text-7xl font-bold font-display mb-8">
              Ready to build<br />
              something <span className="text-cyan-400">extraordinary</span>?
            </h2>
            <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto">
              I'm always interested in hearing about new projects and opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <GlowingButton href={`mailto:${professionalData.email}`}>
                Start a Conversation
              </GlowingButton>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-8">
              {[
                { icon: Github, href: "https://github.com/AnPod", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/in/drejc", label: "LinkedIn" },
                { icon: Globe, href: "https://podgorsek.de", label: "Website" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-white/30 hover:text-white transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                  <span className="text-sm font-mono">{social.label}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p 
            className="text-xs font-mono text-white/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} Andrej Podgorsek
          </motion.p>
          <motion.p 
            className="text-xs font-mono text-white/20 flex items-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Built with Next.js & Framer Motion
          </motion.p>
        </div>
      </footer>
    </div>
    </>
  );
}
