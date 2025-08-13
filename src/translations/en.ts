const en = {
  menu: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    chatRoom: 'Live Chat',
    contact: 'Contact'
  },
  hero: {
    title: 'Ryan Radityatama',
    taglines: {
      aiEngineer: 'AI Engineer',
      nlpSpecialist: 'NLP Specialist',
      softwareEngineer: 'Software Engineer'
    },
    description: 'Welcome to my portfolio! I\'m glad you\'re here. I specialize in building intelligent solutions that make technology more human-friendly. Let\'s explore how we can create something amazing together.',
    skills: 'My Skills'
  },
  about: {
    title: 'About Me',
    role: 'Hi! I blend AI with human-centered software solutions',
    paragraphs: [
      'Thank you for taking the time to visit my portfolio! I\'m a Software Engineer who loves turning complex challenges into elegant, user-friendly solutions. My journey in tech has been driven by a passion for creating applications that make a real difference in people\'s lives.',
      'Through my experience with modern tools like React and Node.js, I\'ve had the privilege of building applications that bridge the gap between advanced AI and everyday users. My Master\'s degree from Beijing Institute of Technology allowed me to dive deep into how AI can make a positive impact, particularly in mental health support through Indonesian language models.',
      'What excites me most is the opportunity to collaborate on projects that push boundaries. Whether it\'s optimizing system performance, leading development teams, or innovating with AI, I believe in creating technology that\'s not just powerful, but also accessible and meaningful to its users.'
    ],
    downloadCV: 'Download CV',
    professionalExperience: 'Professional Experience',
    education: 'Education',
    careerHistory: [
      {
        title: 'AI ENGINEER',
        company: 'Trymerra AI Ltd.',
        location: 'London, United Kingdom (Remote)',
        period: 'March 2025 – July 2025',
        companyLogo: '/imagess/merra (2).png',
        responsibilities: [
          'Developed a minimum viable product (MVP) for an AI-driven recruitment platform, handling the entire development process from UI/UX design to full-stack implementation. The goal was to create a seamless experience for both candidates and recruiters.',
          'Built the frontend using React and developed backend APIs to handle core logic and data operations. Integrated Appwrite as the backend-as-a-service solution for authentication, database management, and cloud functions.',
          'Integrated advanced conversational AI features, including CV parsing and automated interview simulations, to automate and personalize the candidate screening process. These features significantly reduced manual workload and improved efficiency.',
          'Focused on optimizing system performance to ensure a responsive, real-time user experience. Applied best practices in frontend responsiveness and backend speed, while continuously testing for stability across user flows.'
        ]
      },
      {
        title: 'AI & ALGORITHM ENGINEER',
        company: 'PT. Digital SawitPRO',
        location: 'Jakarta, Indonesia',
        period: 'Jan 2025 – Feb 2025',
        companyLogo: '/imagess/sawitpro2.png',
        responsibilities: [
          'Managed the development of an AI-based computer vision system to automatically detect palm trees from drone and satellite imagery. This helped eliminate manual counting, significantly increasing efficiency and accuracy in plantation monitoring.',
          'Built and fine-tuned deep learning models using PyTorch, focusing on object detection and image segmentation methods suited for dense agricultural layouts. The algorithm was optimized to handle varying image quality and environmental conditions.',
          'Worked closely with the engineering and product teams to integrate the detection system into a scalable pipeline, enabling real-time analysis and supporting decision-making in palm plantation management.'
        ]
      },
      {
        title: 'AI ENGINEER',
        company: 'BIT\'s NLPIR Research Lab',  
        location: 'Beijing, China',
        period: 'April 2023 - April 2024',
        companyLogo: '/imagess/bit.png',
        responsibilities: [
          'Conducted research and development to fine-tune large language models (LLMs) for the Indonesian language, focusing on improving performance for low-resource NLP tasks such as sentiment analysis, intent classification, and text generation.',
          'Preprocessed and curated large-scale Indonesian datasets, applying tokenization, cleaning, and annotation strategies to enhance model training quality and relevance. Evaluated model outputs using benchmarks and human feedback'
        ]
      },
      {
        title: 'SENIOR INFORMATION TECHNOLOGY SOLUTIONS',
        company: 'Universitas Mercu Buana',
        location: 'Jakarta, Indonesia',
        period: 'Oct 2022 – Feb 2023', 
        companyLogo: '/imagess/mercu.png',
        responsibilities: [
          'Led a small IT team to ensure the smooth operation and availability of campus-wide IT infrastructure, maintaining system reliability and addressing technical issues promptly to support academic and administrative activities.',
          'Initiated and implemented several IT system optimizations, resulting in a 15% increase in operational efficiency through improved workflows, upgraded systems, and better integration of internal processes.',
          'Oversaw key IT projects including system upgrades, cloud migration, and security protocol enhancements.'
        ]
      },
      {
        title: 'IT SOLUTIONS & INTERNATIONAL OPERATIONS OFFICER',
        company: 'Universitas Mercu Buana',
        location: 'Jakarta, Indonesia',
        period: 'Sep 2019 – Oct 2022',
        companyLogo: '/imagess/mercu.png',
        responsibilities: [
          'Managed the development and integration of databases for international academic initiatives, ensuring accurate data management and smooth information flow across departments and global partners.',
          'Provided technical support and hands-on training to administrative staff, improving system usage and productivity. System upgrades and automation processes contributed to a 20% increase in overall efficiency.',
          'Coordinated international programs such as student exchanges and joint degrees, while maintaining and updating the international relations website to align with institutional branding and support cloud-based integration.'
        ]
      }
    ],
    educationHistory: [
      {
        institution: 'BEIJING INSTITUTE OF TECHNOLOGY',
        location: 'Beijing, China',
        degree: 'Master Degree of Computer Science and Technology',
        period: '2022 - 2024',
        institutionLogo: '/imagess/bit.png',
        details: [
          'Awards: Recipient of Chinese Government Scholarship',
          'Thesis: Research on Indonesian Large Language Models Fine-Tuning for Mental Health',
          'Participate as a Chair of Election Voting Section, Indonesian Embassy Beijing (Feb–Mar 2024): Oversaw overseas election operations, coordinated with Officials Indonesia Embassy and Election Commission.'
        ]
      },
      {
        institution: 'UNIVERSITAS MERCU BUANA',
        location: 'Jakarta, Indonesia',
        degree: 'Bachelor of Informatics Engineering',
        period: '2015 - 2019',
        institutionLogo: '/imagess/mercu.png',
        details: [
          'Awards: Nominated as Cum-laude Graduate in Faculty, Cumulative GPA: 3.88/4.0',
          'Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online'
        ]
      },
      {
        institution: 'BEIJING INSTITUTE OF TECHNOLOGY',
        location: 'Beijing, China',
        degree: 'Bachelor Degree of Computer Science and Technology',
        period: '2015 - 2019',
        institutionLogo: '/imagess/bit.png',
        details: [
          'Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online'
        ]
      }
    ]
  },
  projects: {
    title: 'Projects',
    viewProject: 'View Project',
    techStack: 'Tech Stack',
    liveDemo: 'Live Demo',
    sourceCode: 'Source Code'
  },
  contact: {
    title: 'Get In Touch',
    description: "Have a question, a project idea, or just want to connect? Feel free to reach out. I'm always open to discussing new opportunities and collaborations.",
    name: 'Full Name',
    email: 'Email Address',
    message: 'Message',
    send: 'Send Message',
    success: 'Message sent successfully!',
    error: 'Error sending message. Please try again.'
  },
  chatRoom: {
    title: 'Live Chat',
    liveChat: 'Live Chat',
    assistant: '',
    description: "Share your thoughts, ideas, or just say hello! This is an open space for conversation and connecting with others. Feel free to join in and express yourself.",
    welcome: "Hello! I'm Ryan's AI assistant. Please provide your name and your first message to start our chat.",
    yourName: 'Your Name',
    namePlaceholder: 'Enter your name',
    company: 'Company / Organization',
    companyOptional: '(Optional)',
    companyPlaceholder: 'Your company or Individual',
    messageLabel: 'Your Message',
    messageLabelAs: 'Your Message (as {name})',
    firstMessage: 'Your First Message',
    messagePlaceholder: 'Type your message here...',
    send: 'Send Message',
    assistantTyping: 'Assistant is typing...',
    error: "Sorry, I encountered an error. Please try again or contact Ryan directly."
  },
  footer: {
    rights: '© 2025 Ryan Radityatama. All rights reserved.'
  },
  smartTalk: {
    button: 'Smart Talk'
  }
};

export default en;
