"use client";
import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setStatus(res.ok ? "ok" : "error");
    if (res.ok) (e.target as HTMLFormElement).reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">First Name</label>
          <input name="first_name" type="text" className="form-input" placeholder="Maria" required />
        </div>
        <div>
          <label className="form-label">Last Name</label>
          <input name="last_name" type="text" className="form-input" placeholder="García" required />
        </div>
      </div>
      <div>
        <label className="form-label">Email</label>
        <input name="email" type="email" className="form-input" placeholder="hello@example.com" required />
      </div>
      <div>
        <label className="form-label">Subject</label>
        <select name="subject" className="form-input">
          <option value="">Select a topic…</option>
          <option>Booking Enquiry</option>
          <option>Property Partnership</option>
          <option>Investment Opportunity</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label className="form-label">Message</label>
        <textarea name="message" rows={4} className="form-input resize-none" placeholder="Tell us how we can help…" required />
      </div>
      <button type="submit" disabled={status === "loading"} className={`btn btn-primary btn-md w-full ${status === "loading" ? "opacity-70 cursor-wait" : ""}`}>
        {status === "loading" ? "Sending…" : status === "ok" ? "✓ Message Sent!" : "Send Message"}
      </button>
      {status === "error" && <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>}
    </form>
  );
}
