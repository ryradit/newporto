import { AnimatedSection } from "@/components/animated-section";

export const metadata = {
  title: "Terms and Conditions | Ryan Radityatama",
  description: "Terms and conditions regarding the use of the AI Chatbot and portfolio website.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="max-w-3xl mx-auto bg-[#121212]/80 backdrop-blur-md border border-white/5 p-8 md:p-12 rounded-3xl shadow-2xl">
        <h1 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-white">Terms and Conditions</h1>
        <div className="space-y-6 text-white/70 leading-relaxed text-sm md:text-base">
          <p>
            Welcome to Ryan Radityatama's digital portfolio. By using this website and its features, you agree to the following terms and conditions.
          </p>

          <h2 className="text-xl font-semibold text-white/90 mt-8 mb-4">1. AI Assistant (Digital Twin) Usage</h2>
          <p>
            This website features an AI-powered Digital Twin / Chatbot. This chatbot uses <strong>Retrieval-Augmented Generation (RAG)</strong> technology combined with Large Language Models (LLMs) to answer questions based on my resume, projects, and skills.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Accuracy:</strong> While the AI is trained strictly on verified data regarding my professional experience, AI systems can occasionally hallucinate or misinterpret context. The information provided by the AI should be verified directly with me before making any formal hiring or business decisions.</li>
            <li><strong>Data Privacy:</strong> The chat interface is meant for professional inquiries. Please do not submit any sensitive, personal, or confidential information into the chat. Chat transcripts may be temporarily processed by third-party AI providers (such as Google Gemini) to generate responses.</li>
            <li><strong>Availability:</strong> The AI service is provided "as is" and may occasionally experience downtime, rate-limiting, or errors.</li>
          </ul>

          <h2 className="text-xl font-semibold text-white/90 mt-8 mb-4">2. Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to the design, text, projects, and source code excerpts, are the intellectual property of Ryan Radityatama unless otherwise stated. You may not copy, reproduce, or distribute any part of this portfolio without explicit permission.
          </p>

          <h2 className="text-xl font-semibold text-white/90 mt-8 mb-4">3. External Links</h2>
          <p>
            This website contains links to external websites (e.g., GitHub, LinkedIn, Google Drive). I am not responsible for the content, privacy policies, or practices of any third-party websites.
          </p>

          <h2 className="text-xl font-semibold text-white/90 mt-8 mb-4">4. Changes to Terms</h2>
          <p>
            I reserve the right to modify these terms at any time. Continued use of the website following any changes constitutes acceptance of those changes.
          </p>

          <div className="mt-12 pt-6 border-t border-white/10 text-sm text-white/50">
            Last updated: May 2026
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
