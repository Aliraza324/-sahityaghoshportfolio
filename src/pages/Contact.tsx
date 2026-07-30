import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Video, Info, CheckCircle2 } from "lucide-react";
import { MeetingModal } from "../components/MeetingModal";

const EMAILJS_SERVICE_ID = "service_nac6b4f";
const EMAILJS_TEMPLATE_ID = "template_hljp9hu";
const EMAILJS_PUBLIC_KEY = "95xsgamMlxHg8Y9sk";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [meetingTab, setMeetingTab] = useState<"calendar" | "jitsi">("calendar");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            to_email: "sahityaghosh350@gmail.com",
            subject: formData.subject,
            message: formData.message,
          },
        }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus("error");
    }
  };

  const openMeetingModal = (tab: "calendar" | "jitsi") => {
    setMeetingTab(tab);
    setIsMeetingModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <>
      <section className="min-h-screen w-full bg-white text-black font-sans px-4 md:px-8 lg:px-12 py-12 xs:py-16 md:py-20 lg:py-24 flex items-center justify-center relative overflow-y-visible">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-16 max-w-[1400px] w-full mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-between lg:h-full py-2 space-y-6">
            <motion.div variants={itemVariants} className="mb-4 lg:mb-0">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tight text-left">
                Contact <br />
                Me <span className="inline-block ml-2">→</span>
              </h1>
            </motion.div>

            {/* Meeting & Video Action Suite */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-black/60 font-mono">
                Direct Scheduling & Video Call
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => openMeetingModal("calendar")}
                  className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-black text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-black/80 transition-all cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Book 30-min Meeting</span>
                </button>

                <button
                  type="button"
                  onClick={() => openMeetingModal("jitsi")}
                  className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-full bg-black/10 border border-black/20 text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Instant Video Call</span>
                </button>
              </div>

              {/* How Meetings Work Note */}
              <div className="p-3.5 rounded-xl bg-black/5 border border-black/10 space-y-1.5 max-w-lg text-left text-xs font-sans">
                <div className="flex items-center gap-1.5 font-bold font-mono uppercase text-[11px] text-black">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>Meeting & Video Call Guide:</span>
                </div>
                <p className="text-black/70 text-[11px] leading-relaxed font-sans">
                  • <strong>Instant Video Call:</strong> Click Join Call → Enter your Name & First login (via Google/GitHub) when prompted by Jitsi to join the room.<br />
                  • <strong>30-Min Calendar Meeting:</strong> Pick any 24h slot or custom time to send a meeting invite to Sahitya & receive an instant email copy then login (via Google/GitHub).
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Premium Minimalist Underline Form */}
          <motion.div className="lg:col-span-5 flex flex-col justify-center" variants={itemVariants}>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-xl font-extrabold uppercase tracking-widest text-black font-mono">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    className="w-full bg-transparent border-b border-black pb-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors rounded-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-xl font-extrabold uppercase tracking-widest text-black font-mono">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="w-full bg-transparent border-b border-black pb-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors rounded-none font-sans"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xl font-extrabold uppercase tracking-widest text-black font-mono">
                  Email Address 
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full bg-transparent border-b border-black pb-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors rounded-none font-sans"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-xl font-extrabold uppercase tracking-widest text-black font-mono">
                  Subject 
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Project Inquiry / Job Opportunity"
                  className="w-full bg-transparent border-b border-black pb-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors rounded-none font-sans"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xl font-extrabold uppercase tracking-widest text-black font-mono">
                  Message 
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Tell me about your project or inquiry..."
                  className="w-full bg-transparent border-b border-black pb-2 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors resize-none rounded-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-black text-white font-mono text-xs font-bold uppercase tracking-widest py-4 rounded-none hover:bg-black/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 mt-2"
              >
                {status === "sending" ? (
                  <span>Sending Message...</span>
                ) : status === "success" ? (
                  <span className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-4 h-4" /> Message Sent Successfully!
                  </span>
                ) : (
                  <span>Send Message →</span>
                )}
              </button>

              {status === "error" && (
                <p className="text-xs text-red-600 font-mono text-center">
                  Failed to send message. Please try emailing directly at sahityaghosh350@gmail.com
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </section>

      {/* Meeting Booking & Video Call Modal */}
      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        initialTab={meetingTab}
      />
    </>
  );
};

export default Contact;
