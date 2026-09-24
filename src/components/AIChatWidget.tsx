import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, RefreshCw, Terminal, Mail, Globe2, Code2, Cpu, ExternalLink, Sparkles } from "lucide-react";

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
  email: "Official Contact Email:\n**helpdesk@codes-inc.com**\n\nYou can reach out directly via email or use the Contact form at the bottom of the page.",
  mail: "Official Contact Email:\n**helpdesk@codes-inc.com**",
  contact: "Connect with @codesinc:\n- Email: **helpdesk@codes-inc.com**\n- Phone: **+92 312 6806286**\n- LinkedIn: [LinkedIn Page](https://www.linkedin.com/company/codesinc/posts/?feedView=all&viewAsMember=true)\n- WhatsApp: [Chat on WhatsApp](https://wa.me/923126806286)",
  phone: "You can call @codesinc directly at **+92 312 6806286**, or reach the regional offices listed under Global Presence.",
  office: "@codesinc's Global Offices:\n- **Pakistan**: Rahim Yar Khan (+92 301 3887598), Lahore (+92 331 0099811)\n- **Australia**: Melbourne (+61 386 460100)\n- **USA**: Bangor, Maine (+1 207 947-9333)\n- **France**: Toulouse (+33 6 21 33 76 27)",
  offices: "@codesinc's Global Offices:\n- **Pakistan**: Rahim Yar Khan (+92 301 3887598), Lahore (+92 331 0099811)\n- **Australia**: Melbourne (+61 386 460100)\n- **USA**: Bangor, Maine (+1 207 947-9333)\n- **France**: Toulouse (+33 6 21 33 76 27)",
  location: "@codesinc's Global Offices:\n- **Pakistan**: Rahim Yar Khan, Lahore\n- **Australia**: Melbourne\n- **USA**: Bangor, Maine\n- **France**: Toulouse",
  experience: "@codesinc has **more than 5 years of IT experience**, delivering technology solutions across multiple industries and markets.",
  stack: "@codesinc's Core Technology Stack:\n\n- Languages & Frameworks: **Python, TypeScript, JavaScript, React, Next.js, Node.js, Django, FastAPI**\n- AI & Distributed Systems: **LangChain, LangGraph, Docker, Redis, RabbitMQ, TensorFlow**\n- Databases & DevTools: **MongoDB, PostgreSQL, MySQL, Git, VS Code**",
  skills: "@codesinc's Specialized Service Domains:\n\n1. **Web, Mobile & Software Development**: Custom applications, ecommerce, and startup MVPs.\n2. **Artificial Intelligence**: AI-driven innovation and automation.\n3. **DevOps & Managed Cloud Hosting**: CI/CD automation and infrastructure management.\n4. **Business Intelligence, IT Resource Allocation & BPO**.\n5. **Digital Marketing**: Brand growth alongside the products we build.",
  services: "@codesinc's Core Services:\n\n1. **Web Design & Development**\n2. **Mobile App Development**\n3. **Software Development**\n4. **Startup Solution**\n5. **DevOps**\n6. **Artificial Intelligence**\n7. **Ecommerce Solution**\n8. **Managed Cloud Hosting**\n9. **IT Resource Allocation**\n10. **Business Intelligence**\n11. **Business Process Outsourcing**\n12. **Digital Marketing**",
  quote: "You can request a **free quote** using the **GET A FREE QUOTE** button in the top Hero section, or via the Contact form at the bottom of the page. You can also email **helpdesk@codes-inc.com** or call **+92 312 6806286** directly.",
};

const SUGGESTION_ITEMS = [
  { icon: Mail, label: "Email & Contact", query: "What is @codesinc's email?" },
  { icon: Globe2, label: "Global Offices", query: "Where are @codesinc's offices?" },
  { icon: Code2, label: "Our Services", query: "What are @codesinc's services?" },
  { icon: Cpu, label: "Tech Stack", query: "What is @codesinc's tech stack?" },
  { icon: Terminal, label: "Get a Free Quote", query: "How do I get a free quote from @codesinc?" },
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
      content: "Codesinc is a B2B technology company — World's Finest Technology Hub — with more than 5 years of IT experience and offices in Pakistan (Rahim Yar Khan, Lahore), Australia (Melbourne), USA (Bangor, Maine), and France (Toulouse). Core Services: Web Design & Development, Mobile App Development, Software Development, Startup Solution, DevOps, Artificial Intelligence, Ecommerce Solution, Managed Cloud Hosting, IT Resource Allocation, Business Intelligence, Business Process Outsourcing, Digital Marketing. Contact: helpdesk@codes-inc.com, +92 312 6806286."
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
      text: "Welcome. I am **@codesinc-assistant**.\n\nAsk about @codesinc's **services, global offices, technology stack, or how to get a free quote**.",
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

      const systemPrompt = `You are @codesinc-assistant. Respond in a clear, professional, well-structured, and complete editorial format based on the company context below.

COMPANY CONTEXT:
${context}

RULES:
- Always speak in third-person referring to @codesinc (e.g. "@codesinc's services", "@codesinc specializes in..."). Never use "I" or "my".
- Provide complete, rich, structured responses with clear line breaks (\\n) and bullet points. Never cut off details half-way.
- Include live links in markdown format [Label](url) when mentioning @codesinc's services or site.
- Bold key services and technologies using markdown format (**service**, **tech**).
- For contact, provide helpdesk@codes-inc.com and +92 312 6806286.`;

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
          text: `@codesinc is a **B2B technology company** — **World's Finest Technology Hub** — with more than **5 years of IT experience** specializing in **Web & Mobile Development, Software Engineering, AI, DevOps, and Digital Transformation**.\n\nGlobal Offices:\n- **Pakistan**: Rahim Yar Khan, Lahore\n- **Australia**: Melbourne\n- **USA**: Bangor, Maine\n- **France**: Toulouse\n\nContact: **helpdesk@codes-inc.com** | **+92 312 6806286**`,
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
        text: "Session cleared. Ask about @codesinc's **services, offices, or tech stack**.",
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
          aria-label="Toggle @codesinc-assistant"
        >
          {isOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden p-[1.5px] border border-white/20 shrink-0">
                <img 
                  src="/favicon.png" 
                  alt="Codesinc Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
          <span className="font-mono uppercase font-bold tracking-widest text-[11px] sm:text-xs">
            {isOpen ? "CLOSE" : "@CODESINC-ASSISTANT"}
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
                    alt="Codesinc Logo"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm text-white tracking-wide flex items-center gap-1.5 font-mono truncate">
                    <span className="truncate">@codesinc-assistant</span>
                    <span className="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20 uppercase tracking-wider shrink-0">
                      ONLINE
                    </span>
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-white/50 font-mono tracking-wider uppercase truncate">REAL-TIME COMPANY ASSISTANT</p>
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
                placeholder="Ask about @codesinc's services, offices..."
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
