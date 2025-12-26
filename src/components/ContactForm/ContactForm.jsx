import { useEffect, useRef, useState } from "react";
import "./ContactForm.css";

const ContactForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // "success" | "error"
    const formRef = useRef(null);

    /* Animate on scroll */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            },
            { threshold: 0.2 }
        );

        if (formRef.current) observer.observe(formRef.current);
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch("https://api.staticforms.dev/submit", {
                method: "POST",
                body: new FormData(e.target),
            });

            if (res.ok) {
                setStatus("success");
                e.target.reset();
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="contact-section" id="appointment-form">
            <div className="contact-container animate-on-scroll" ref={formRef}>
                <h2 className="contact-title">Request an Appointment</h2>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <input type="hidden" name="apiKey" value={import.meta.env.VITE_STATIC_FORMS_XYZ_API_KEY} />
                    {/* Name */}
                    <div className="floating-group">
                        <input
                            type="text"
                            name="name"
                            placeholder=" "
                            required
                        />
                        <label>Your Name</label>
                    </div>

                    {/* Email */}
                    <div className="floating-group">
                        <input
                            type="email"
                            name="email"
                            placeholder=" "
                            required
                        />
                        <label>Your Email</label>
                    </div>

                    {/* Phone */}
                    <div className="floating-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder=" "
                            required
                        />
                        <label>Your Phone</label>
                    </div>

                    {/* Message */}
                    <div className="floating-group">
                        <textarea
                            name="message"
                            rows="4"
                            placeholder=" "
                            required
                        />
                        <label>Your Message</label>
                    </div>

                    {/* Status Messages */}
                    {status === "success" && (
                        <p className="form-success">
                            ✅ Thank you! Your message has been sent.
                        </p>
                    )}

                    {status === "error" && (
                        <p className="form-error">
                            ❌ Something went wrong. Please try again.
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={submitting}
                    >
                        {submitting ? "Sending..." : "Send Message"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
