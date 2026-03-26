import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Mail, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-3xl font-extrabold tracking-tight mb-2">
        Contact <span className="text-cric-red">Us</span>
      </h1>
      <p className="text-muted-foreground mb-10">
        Have a question, tip, or feedback? We'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-cric-red/10 flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-cric-red" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Email</p>
              <a
                href="mailto:support@cricflash.com"
                className="text-sm text-muted-foreground hover:text-cric-red transition-colors"
              >
                support@cricflash.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-cric-red/10 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-cric-red" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Location</p>
              <p className="text-sm text-muted-foreground">India</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-cric-red/10 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4 text-cric-red" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Response Time
              </p>
              <p className="text-sm text-muted-foreground">
                Within 24 hours on business days
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          {sent ? (
            <div
              className="flex flex-col items-center justify-center h-full gap-3 py-6"
              data-ocid="contact.success_state"
            >
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-foreground font-semibold">Message sent!</p>
              <p className="text-sm text-muted-foreground text-center">
                Thanks for reaching out. We'll get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  htmlFor="contact-name"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Your name"
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-cric-red transition-colors"
                  data-ocid="contact.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  htmlFor="contact-email"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-cric-red transition-colors"
                  data-ocid="contact.input"
                />
              </div>
              <div>
                <label
                  className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  htmlFor="contact-message"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="How can we help?"
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-cric-red transition-colors resize-none"
                  data-ocid="contact.textarea"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-cric-red hover:bg-cric-red/90 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                data-ocid="contact.submit_button"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
