'use client';

import { AnimatedSection } from "@/components/animated-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timeline } from "@/components/ui/timeline";
import { EducationTimeline } from "@/components/ui/education-timeline";
import { useLanguage } from "@/contexts/language-context";
import { translate } from "@/translations";

export function AboutSection() {
  const { language } = useLanguage();
  
  const educationHistory = [
    {
      institution: "BEIJING INSTITUTE OF TECHNOLOGY",
      location: "Beijing, China",
      degree: "Master Degree of Computer Science and Technology",
      period: "2022 - 2024",
      institutionLogo: "/imagess/bit.png",
      details: [
        "Awards: Recipient of Chinese Government Scholarship",
        "Thesis: Research on Indonesian Large Language Models Fine-Tuning for Mental Health",
        "Participate as a Chair of Election Voting Section, Indonesian Embassy Beijing (Feb–Mar 2024): Oversaw overseas election operations, coordinated with Officials Indonesia Embassy and Election Commission."
      ]
    },
    {
      institution: "UNIVERSITAS MERCU BUANA",
      location: "Jakarta, Indonesia",
      degree: "Bachelor of Informatics Engineering",
      period: "2015 - 2019",
      institutionLogo: "/imagess/mercu.png",
      details: [
        "Awards: Nominated as Cum-laude Graduate in Faculty, Cumulative GPA: 3.88/4.0",
        "Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online"
      ]
    },
    {
      institution: "BEIJING INSTITUTE OF TECHNOLOGY",
      location: "Beijing, China",
      degree: "Bachelor Degree of Computer Science and Technology",
      period: "2015 - 2019",
      institutionLogo: "/imagess/bit.png",
      details: [
        "Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online"
      ]
    }
  ];
  
  const careerHistory = [
    {
      title: "AI ENGINEER",
      company: "Trymerra AI Ltd.",
      location: "London, United Kingdom (Remote)",
      period: "March 2025 – July 2025",
      companyLogo: "/imagess/merra (2).png",
      responsibilities: [
        "Developed a minimum viable product (MVP) for an AI-driven recruitment platform, handling the entire development process from UI/UX design to full-stack implementation. The goal was to create a seamless experience for both candidates and recruiters.",
        "Built the frontend using React and developed backend APIs to handle core logic and data operations. Integrated Appwrite as the backend-as-a-service solution for authentication, database management, and cloud functions.",
        "Integrated advanced conversational AI features, including CV parsing and automated interview simulations, to automate and personalize the candidate screening process. These features significantly reduced manual workload and improved efficiency.",
        "Focused on optimizing system performance to ensure a responsive, real-time user experience. Applied best practices in frontend responsiveness and backend speed, while continuously testing for stability across user flows."
      ]
    },
    {
      title: "AI & ALGORITHM ENGINEER",
      company: "PT. Digital SawitPRO",
      location: "Jakarta, Indonesia",
      period: "Jan 2025 – Feb 2025",
      companyLogo: "/imagess/sawitpro2.png",
      responsibilities: [
        "Managed the development of an AI-based computer vision system to automatically detect palm trees from drone and satellite imagery. This helped eliminate manual counting, significantly increasing efficiency and accuracy in plantation monitoring.",
        "Built and fine-tuned deep learning models using PyTorch, focusing on object detection and image segmentation methods suited for dense agricultural layouts. The algorithm was optimized to handle varying image quality and environmental conditions.",
        "Worked closely with the engineering and product teams to integrate the detection system into a scalable pipeline, enabling real-time analysis and supporting decision-making in palm plantation management."
      ]
    },
    {
      title: "AI ENGINEER",
      company: "BIT's NLPIR Research Lab",  
      location: "Beijing, China",
      period: "April 2023 - April 2024",
      companyLogo: "/imagess/bit.png",
      responsibilities: [
        "Conducted research and development to fine-tune large language models (LLMs) for the Indonesian language, focusing on improving performance for low-resource NLP tasks such as sentiment analysis, intent classification, and text generation.",
        "Preprocessed and curated large-scale Indonesian datasets, applying tokenization, cleaning, and annotation strategies to enhance model training quality and relevance. Evaluated model outputs using benchmarks and human feedback"
      ]
    },
    {
      title: "SENIOR INFORMATION TECHNOLOGY SOLUTIONS",
      company: "Universitas Mercu Buana",
      location: "Jakarta, Indonesia",
      period: "Oct 2022 – Feb 2023", 
      companyLogo: "/imagess/mercu.png",
      responsibilities: [
        "Led a small IT team to ensure the smooth operation and availability of campus-wide IT infrastructure, maintaining system reliability and addressing technical issues promptly to support academic and administrative activities.",
        "Initiated and implemented several IT system optimizations, resulting in a 15% increase in operational efficiency through improved workflows, upgraded systems, and better integration of internal processes.",
        "Oversaw key IT projects including system upgrades, cloud migration, and security protocol enhancements."
      ]
    },
    {
      title: "IT SOLUTIONS & INTERNATIONAL OPERATIONS OFFICER",
      company: "Universitas Mercu Buana",
      location: "Jakarta, Indonesia",
      period: "Sep 2019 – Oct 2022",
      companyLogo: "/imagess/mercu.png",
      responsibilities: [
        "Managed the development and integration of databases for international academic initiatives, ensuring accurate data management and smooth information flow across departments and global partners.",
        "Provided technical support and hands-on training to administrative staff, improving system usage and productivity. System upgrades and automation processes contributed to a 20% increase in overall efficiency.",
        "Coordinated international programs such as student exchanges and joint degrees, while maintaining and updating the international relations website to align with institutional branding and support cloud-based integration."
      ]
    }
  ];

  return (
    <AnimatedSection id="about" className="py-12 md:py-16 bg-background/50">
      <div className="container pl-8 pr-4 md:pl-12">
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-left text-primary mb-8">
          {translate('about.title', language)}
        </h2>
        <Card className="overflow-hidden mb-12 max-w-3xl bg-transparent border-0 shadow-none">
          <div className="p-0">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-headline text-2xl text-primary text-left">
                {translate('about.role', language)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-0">
              {translate<string[]>('about.paragraphs', language).map((paragraph: string, index: number) => (
                <p key={index} className="text-sm text-foreground/80 leading-relaxed tracking-wide text-left max-w-3xl">
                  {paragraph}
                </p>
              ))}
              <div className="mt-6 flex justify-start">
                <Button 
                  className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-violet-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
                  asChild
                >
                  <a href="https://drive.google.com/file/d/1Khi4BYPEInY6-oxs5OOyo2gsQgDepyxR/view?usp=drivesdk" download className="flex items-center gap-2 relative overflow-hidden">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span className="transform transition-transform duration-300 group-hover:translate-y-0.5">
                      Download CV
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
                  </a>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="max-w-3xl">
          <h3 className="font-headline text-2xl md:text-3xl font-bold text-left text-primary mb-8">
            Professional Experience
          </h3>
          <Timeline items={careerHistory} />
          
          <h3 className="font-headline text-2xl md:text-3xl font-bold text-left text-primary mb-8 mt-16">
            Education
          </h3>
          <EducationTimeline items={educationHistory} />
        </div>
      </div>
    </AnimatedSection>
  );
}
