import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RefreshCw, Terminal, Mail, GraduationCap, Code2, Cpu, ExternalLink, Sparkles } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isInstant?: boolean;
}

// 8.50

// Fixed Instant FAQ Dictionary (0ms API latency, complete structured info)
const FAQ_DATABASE: Record<string, string> = {
  email: "Official Contact Email:\n**sahityaghosh350@gmail.com**\n\nYou can reach out directly via email or use the Contact form at the bottom of the page.",
  mail: "Official Contact Email:\n**sahityaghosh350@gmail.com**",
  contact: "Connect with @sahitya:\n- Email: **sahityaghosh350@gmail.com**\n- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/sahitya-ghosh-9ba098292/)\n- GitHub: [GitHub Profile](https://github.com/SAHITYA350)",
  study: "@sahitya's Academic Background:\n- Institution: **National Institute of Technology (NIT) Bhubaneswar**\n- Degree: **B.Tech in Engineering**\n- Performance: **8.50 CGPA**",
  college: "@sahitya's Academic Background:\n- Institution: **National Institute of Technology (NIT) Bhubaneswar**\n- Degree: **B.Tech in Engineering**\n- Performance: **8.50 CGPA**",
  university: "@sahitya's Academic Background:\n- Institution: **National Institute of Technology (NIT) Bhubaneswar**\n- Performance: **8.50 CGPA**",
  nit: "@sahitya's Academic Background:\n- Institution: **National Institute of Technology (NIT) Bhubaneswar**\n- Performance: **8.50 CGPA**",
  cgpa: "@sahitya maintains a high academic standing of **8.50 CGPA** at National Institute of Technology (NIT) Bhubaneswar.",
  gpa: "@sahitya maintains a high academic standing of **8.50 CGPA** at National Institute of Technology (NIT) Bhubaneswar.",
  stack: "@sahitya's Core Engineering Stack:\n\n- Languages: **Python, TypeScript, JavaScript, SQL**\n- Frontend: **React, Next.js, Redux-Toolkit, Tailwind CSS, Framer Motion**\n- Backend & APIs: **Node.js, Express, FastAPI, Django, REST APIs**\n- Databases: **MongoDB, PostgreSQL, Redis, ChromaDB**\n- AI & ML: **LangChain, LangGraph, Mistral AI, Gemini AI, Vector Embeddings**\n- Infrastructure: **Docker, Git, Microservices Architecture**",
  skills: "@sahitya's Specialized Engineering Domains:\n\n1. **Production RAG Pipelines**: Multi-modal vector search, knowledge graphs, and hybrid retrieval.\n2. **Agentic AI Workflows**: Autonomous multi-agent systems using LangGraph & Tavily Search.\n3. **Distributed Microservices**: Scalable backend architectures with lower REST API latency.\n4. **Full-Stack SaaS Development**: Modern MERN and Python web platforms.",
  projects: "@sahitya's Featured Production Projects:\n\n1. **Vault-AI** — Knowledge Graph & RAG Platform\nStack: Python / Django / LangChain / LangGraph / Mistral AI / Docker\nLinks: [Live Demo](https://vaultai-jnof.onrender.com) | [GitHub](https://github.com/SAHITYA350/Vault-AI)\n\n2. **ResearchMind AI OS** — Multi-Agent System\nStack: Python / FastAPI / LangGraph / Streamlit / Tavily Search / ChromaDB\nLinks: [Live Demo](https://researchmind-ai-os.onrender.com) | [GitHub](https://github.com/SAHITYA350/ResearchMind-AI-OS)\n\n3. **AI Food Delivery Ecosystem**\nStack: React / Node.js / Express / MongoDB / Google Gemini AI\nLinks: [Live Demo](https://bitebox-food.onrender.com) | [GitHub](https://github.com/SAHITYA350/AI-Food-Delivery)\n\n4. **SG Interview Prep AI Platform**\nStack: React / Express / MongoDB / LangChain / Gemini AI\nLinks: [Live Demo](https://sg-interview-prep-ai.onrender.com) | [GitHub](https://github.com/SAHITYA350/SG-Interview-Prep-AI)\n\n5. **Media Search Application**\nStack: React / Redux-Toolkit / Framer Motion / DaisyUI\nLinks: [Live Demo](https://mediasearch-app.onrender.com) | [GitHub](https://github.com/SAHITYA350/MediaSearch-App)",
  vault: "**Vault-AI** — Knowledge Graph & RAG Platform\n\n- Overview: Converts 6 document formats into vector embeddings & interactive knowledge graphs with real-time multi-agent reasoning.\n- Tech Stack: **Python, Django, LangChain, LangGraph, Docker, Mistral AI, Razorpay**.\n- Links: [Live Demo](https://vaultai-jnof.onrender.com) | [GitHub](https://github.com/SAHITYA350/Vault-AI)",
  researchmind: "**ResearchMind AI OS** — Multi-Agent Research System\n\n- Overview: Autonomous research assistant orchestrating web search, academic retrieval, and automated report generation.\n- Tech Stack: **Python, FastAPI, LangGraph, Streamlit, Tavily Search, ChromaDB**.\n- Links: [Live Demo](https://researchmind-ai-os.onrender.com) | [GitHub](https://github.com/SAHITYA350/ResearchMind-AI-OS)",
  certificates: "@sahitya holds **18 verified technical certificates**, including:\n\n- **Generative AI** by Microsoft & LinkedIn\n- **Deep Learning Specialization**\n- **Machine Learning & Data Science**\n- **Full-Stack Web Engineering**\n- Cloud Computing & DevOps credentials",
  certificate: "@sahitya holds **18 verified technical certificates**, including:\n\n- **Generative AI** by Microsoft & LinkedIn\n- **Deep Learning Specialization**\n- **Machine Learning & Data Science**\n- **Full-Stack Web Engineering**",
  resume: "You can view or download @sahitya's resume using the **RESUME ↗** button in the top Hero section, or request a direct copy via email at **sahityaghosh350@gmail.com**.",
};

const SUGGESTION_ITEMS = [
  { icon: Mail, label: "Email & Contact", query: "What is @sahitya's email?" },
  { icon: GraduationCap, label: "NIT Bhubaneswar", query: "Where does @sahitya study?" },
  { icon: Code2, label: "Featured Projects", query: "What are @sahitya's top projects?" },
  { icon: Cpu, label: "Tech Stack", query: "What is @sahitya's tech stack?" },
  { icon: Terminal, label: "Vault-AI Architecture", query: "Explain @sahitya's Vault-AI architecture" },
];

// Ephemeral DOM Scraper & Mini-Retriever
function scrapePortfolioDOM(): { id: string; content: string }[] {
  const elements = document.querySelectorAll("[data-ai], section, #about, #work, #what-i-do, #philosophy, #credentials, #contact");
  const docs: { id: string; content: string }[] = [];

  elements.forEach((el, index) => {
    const aiId = (el as HTMLElement).dataset?.ai || el.id || `section-${index}`;
    const text = (el as HTMLElement).innerText || "";
    if (text.trim().length > 20) {
      const cleanText = text.replace(/\s+/g, " ").trim();
      docs.push({ id: aiId, content: cleanText });
    }
  });

  if (docs.length === 0) {
    docs.push({
      id: "summary",
      content: "@sahitya is an AI & Full-Stack Engineer studying at NIT Bhubaneswar (8.50 CGPA). Core Stack: Python, React, TypeScript, Node.js, Express, MongoDB, FastAPI, LangChain, LangGraph, Docker, Mistral AI, Gemini AI. Featured Projects: Vault-AI (Live: https://vaultai-jnof.onrender.com, Code: https://github.com/SAHITYA350/Vault-AI), ResearchMind AI OS (Live: https://researchmind-ai-os.onrender.com, Code: https://github.com/SAHITYA350/ResearchMind-AI-OS), AI Food Delivery (Live: https://bitebox-food.onrender.com), SG Interview Prep AI (Live: https://sg-interview-prep-ai.onrender.com). Holds 18 verified certificates including Generative AI by Microsoft & LinkedIn."
    });
  }

  return docs;
}

function retrieveTopChunks(query: string, docs: { id: string; content: string }[], topK = 3): string {
  const queryWords = query.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").filter(w => w.length > 2);
  if (queryWords.length === 0) return docs.slice(0, topK).map(d => d.content).join("\n\n");

  const scoredDocs = docs.map(doc => {
    const textLower = doc.content.toLowerCase();
    let score = 0;
    queryWords.forEach(word => {
      if (textLower.includes(word)) {
        const occurrences = (textLower.match(new RegExp(word, "g")) || []).length;
        score += occurrences + 1;
      }
    });
    return { ...doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);
  return scoredDocs.slice(0, topK).map(d => `[Section: ${d.id}]\n${d.content}`).join("\n\n");
}

export const AIChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Welcome. I am **@sahitya-assistant**.\n\nAsk about @sahitya's **architecture, projects, engineering stack, credentials, or contact details**.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInstant: true,
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    // Step 1: Check instant FAQ lookup
    const lowerQuery = query.toLowerCase();
    let matchedFaqKey: string | null = null;

    for (const key of Object.keys(FAQ_DATABASE)) {
      if (lowerQuery.includes(key)) {
        matchedFaqKey = key;
        break;
      }
    }

    if (matchedFaqKey && FAQ_DATABASE[matchedFaqKey]) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: FAQ_DATABASE[matchedFaqKey!],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isInstant: true,
          }
        ]);
        setIsLoading(false);
      }, 100);
      return;
    }

    // Step 2: Ephemeral DOM RAG + Mistral API Call
    try {
      const docs = scrapePortfolioDOM();
      const context = retrieveTopChunks(query, docs, 4);

      const systemPrompt = `You are @sahitya-assistant. Respond in a clear, professional, well-structured, and complete editorial format based on the portfolio context below.

PORTFOLIO CONTEXT:
${context}

RULES:
- Always speak in third-person referring to @sahitya (e.g. "@sahitya's projects", "@sahitya specializes in..."). Never use "I" or "my".
- Provide complete, rich, structured responses with clear line breaks (\\n) and bullet points. Never cut off details half-way.
- Include live links in markdown format [Label](url) when mentioning @sahitya's projects.
- Bold key technologies and names using markdown format (**tech**, **project**).
- For contact, provide sahityaghosh350@gmail.com.`;

      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer YY3M8ETLoB4kjCD873yf1T5S0rWpToPt`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query }
          ],
          temperature: 0.2,
          max_tokens: 350
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content?.trim();
        if (replyText) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: "ai",
              text: replyText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ]);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Mistral API call error, using local fallback synthesis:", err);
    }

    // Fallback response synthesizer
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: `@sahitya is an **AI & Full-Stack Engineer** studying at **NIT Bhubaneswar (8.50 CGPA)** specializing in **RAG Pipelines, Agentic AI Workflows, Python, React, and Microservices**.\n\nFeatured Projects:\n- **Vault-AI**: [Live Demo](https://vaultai-jnof.onrender.com) | [GitHub](https://github.com/SAHITYA350/Vault-AI)\n- **ResearchMind AI OS**: [Live Demo](https://researchmind-ai-os.onrender.com) | [GitHub](https://github.com/SAHITYA350/ResearchMind-AI-OS)\n\nContact: **sahityaghosh350@gmail.com**`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setIsLoading(false);
    }, 300);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: "Session cleared. Ask about @sahitya's **projects, architecture, or tech stack**.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isInstant: true,
      }
    ]);
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");

    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          const parts = [];
          let lastIndex = 0;
          let match;

          while ((match = linkRegex.exec(line)) !== null) {
            const [fullMatch, label, url] = match;
            const matchIndex = match.index;

            if (matchIndex > lastIndex) {
              parts.push({ type: "text", text: line.substring(lastIndex, matchIndex) });
            }

            parts.push({ type: "link", label, url });
            lastIndex = matchIndex + fullMatch.length;
          }

          if (lastIndex < line.length) {
            parts.push({ type: "text", text: line.substring(lastIndex) });
          }

          return (
            <div key={lineIdx} className="block">
              {parts.map((part, pIdx) => {
                if (part.type === "link") {
                  return (
                    <a
                      key={pIdx}
                      href={part.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 my-0.5 mx-1 rounded-md bg-white/10 hover:bg-white hover:text-black text-white border border-white/20 text-[11px] font-mono transition-all duration-200 font-semibold"
                    >
                      <span>{part.label}</span>
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </a>
                  );
                }

                return (
                  <span key={pIdx}>
                    {part.text.split("**").map((chunk, cIdx) =>
                      cIdx % 2 === 1 ? (
                        <strong key={cIdx} className="font-bold text-white">
                          {chunk}
                        </strong>
                      ) : (
                        chunk
                      )
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Monochromatic Trigger Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999]">
        <motion.button
          onClick={() => setIsOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-full bg-black text-white font-mono text-xs tracking-wider border border-white/40 shadow-[0_10px_30px_rgba(255,255,255,0.12)] hover:border-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer overflow-hidden"
          aria-label="Toggle @sahitya-assistant"
        >
          {isOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden p-[1.5px] border border-white/20 shrink-0">
                <img 
                  src="/favicon.png" 
                  alt="Sahitya Logo" 
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
          <span className="font-mono uppercase font-bold tracking-widest text-[11px] sm:text-xs">
            {isOpen ? "CLOSE" : "@SAHITYA-ASSISTANT"}
          </span>
        </motion.button>
      </div>

      {/* Floating Glassmorphic Monochromatic Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="fixed bottom-16 right-2 sm:bottom-24 sm:right-6 z-[9999] w-[calc(100vw-16px)] sm:w-[420px] md:w-[450px] h-[calc(100vh-80px)] max-h-[500px] sm:max-h-[580px] bg-[#050505]/95 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden font-sans text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-4 border-b border-white/10 bg-white/5 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/40 bg-white p-[1.5px] overflow-hidden flex items-center justify-center shadow-md shrink-0">
                  <img 
                    src="/favicon.png" 
                    alt="Sahitya Logo" 
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-white tracking-wide flex items-center gap-1.5 font-mono truncate">
                    <span className="truncate">@sahitya-assistant</span>
                    <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20 uppercase tracking-wider shrink-0">
                      ONLINE
                    </span>
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-white/50 font-mono tracking-wider uppercase truncate">REAL-TIME PORTFOLIO ASSISTANT</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0 ml-1">
                <button
                  onClick={handleClear}
                  title="Clear session"
                  className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close window"
                  className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div 
              data-lenis-prevent 
              className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 menu-overlay-scroller"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[90%] px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-white text-black font-semibold rounded-br-xs shadow-md"
                        : "bg-[#111113] text-white/90 border border-white/15 rounded-bl-xs shadow-inner"
                    }`}
                  >
                    {renderFormattedContent(msg.text)}
                  </div>
                  <span className="text-[9px] text-white/35 font-mono mt-1 px-1 uppercase tracking-widest">
                    {msg.timestamp} {msg.isInstant && "• ONLINE"}
                  </span>
                </div>
              ))}

              {isLoading && (
                <div className="flex flex-col items-start">
                  <div className="bg-[#111113] border border-white/15 px-3.5 py-2.5 rounded-2xl rounded-bl-xs text-xs text-white/70 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white/70">Scraping DOM & reasoning...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-2.5 py-2 border-t border-white/10 bg-white/[0.02] flex items-center gap-1.5 overflow-x-auto menu-overlay-scroller shrink-0">
              {SUGGESTION_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.query)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 whitespace-nowrap text-[10px] sm:text-xs font-mono px-2.5 py-1.5 rounded-full bg-white/5 hover:bg-white hover:text-black border border-white/15 text-white/80 hover:border-white transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Icon className="w-3 h-3 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 sm:p-3 border-t border-white/10 bg-black flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about @sahitya's projects, stack..."
                className="flex-1 bg-white/5 border border-white/20 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white transition-colors font-sans min-w-0"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 sm:p-2.5 rounded-xl bg-white text-black hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-white transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
