export interface InterviewQuestionType {
    question: string;
    rationale: string;
}

export interface InterviewScriptType {
    openingRapportBuilding: InterviewQuestionType[];
    resumeSpecificProbes: InterviewQuestionType[];
    skillCompetencyValidation: InterviewQuestionType[];
    behavioralCulturalFit: InterviewQuestionType[];
    candidateMotivation: InterviewQuestionType[];
}

export const interviewScript: InterviewScriptType = {
    openingRapportBuilding: [
        {
            question: "Good morning/afternoon, Thanks for joining us today. Before we dive into specifics, could you briefly tell me what initially drew you to apply for this role at our company?",
            rationale: "Helps establish rapport, understand initial motivation, and assess their understanding of the company/role."
        }
    ],
    resumeSpecificProbes: [
        {
            question: "I noticed your professional experience dates, specifically for VIVAX, Zerosarena, and Kandid, are listed as 2025. Could you clarify the actual dates or current status of these roles, as it seems they are in the future?",
            rationale: "Directly addresses a major discrepancy in the resume to ensure accurate understanding of experience timelines."
        },
        {
            question: "Your 'AI-Based Health Assistant' project mentions TensorFlow and LangChain. Can you describe your specific role and contributions to the AI/ML aspects of this project? How did you integrate these technologies?",
            rationale: "Probes into the depth of knowledge for advanced technologies mentioned, clarifying specific contribution beyond general integration."
        },
        {
            question: "At Zerosarena, you're listed as a 'Technical Lead'. As someone still pursuing your B.Tech, what did 'technical leadership' entail in that context, and what were your key responsibilities and challenges in ensuring scalability and timely delivery?",
            rationale: "Clarifies the scope and nature of a 'Technical Lead' role at an early career stage, and assesses leadership potential and problem-solving in a real-world scenario."
        },
        {
            question: "In your 'NEOM E-Commerce Platform' project, you mentioned creating pixel-perfect UIs based on Figma guidelines. Can you walk me through your process of translating a Figma design into a functional, responsive component using Next.js and Tailwind CSS?",
            rationale: "Validates hands-on experience with a key front-end skill and common workflow, assessing attention to detail and practical application."
        },
        {
            question: "You secured 1st position in Code Charades 3.0. Can you tell me about a specific challenge you faced during that competition and how you approached solving it?",
            rationale: "Provides insight into problem-solving skills, creativity under pressure, and ability to articulate technical challenges and solutions."
        }
    ],
    skillCompetencyValidation: [
        {
            question: "Can you describe a time when you had to optimize the performance of a React or Next.js application? What specific techniques did you use, and what was the impact?",
            rationale: "Assesses practical experience with performance optimization, a critical skill for front-end development, and validates understanding of best practices."
        },
        {
            question: "You've listed Node.js and Express.js in your skills, but your projects lean heavily front-end. Could you describe a scenario where you've built or significantly contributed to a RESTful API backend using Node.js/Express.js, detailing the components you worked on?",
            rationale: "Validates the depth of claimed back-end skills and clarifies full-stack capabilities beyond just front-end integration."
        },
        {
            question: "How do you approach ensuring cross-browser and cross-device compatibility for the responsive UIs you build?",
            rationale: "Tests practical knowledge and methodology for a fundamental aspect of modern web development."
        },
        {
            question: "Can you explain the concept of server-side rendering (SSR) and client-side rendering (CSR) in Next.js, and when you would choose one over the other for a specific feature?",
            rationale: "Assesses foundational knowledge of Next.js core features and architectural decision-making."
        }
    ],
    behavioralCulturalFit: [
        {
            question: "Tell me about a time you faced a significant technical challenge in a project and how you overcame it. What did you learn from that experience?",
            rationale: "Uses the STAR method to understand problem-solving, resilience, and learning agility, which are crucial for a fast-growing company."
        },
        {
            question: "Describe a situation where you had to collaborate with designers or other developers on a complex feature. How did you ensure smooth communication and alignment?",
            rationale: "Evaluates teamwork, communication skills, and ability to work effectively in an Agile-like environment."
        },
        {
            question: "In a fast-paced environment like a SaaS company, priorities can shift. Can you describe a time when project requirements changed unexpectedly, and how you adapted to deliver successfully?",
            rationale: "Assesses adaptability, flexibility, and ability to manage changing demands, critical for a growth-stage company."
        }
    ],
    candidateMotivation: [
        {
            question: "Given you're still pursuing your B.Tech, what are your immediate career goals, and how does this role align with them?",
            rationale: "Clarifies their availability, commitment, and long-term aspirations, ensuring alignment with the company's needs."
        },
        {
            question: "What kind of challenges are you looking for in your next role, and how do you envision contributing to our team's success?",
            rationale: "Gauges their proactivity, understanding of the role's impact, and specific interests beyond just coding."
        },
        {
            question: "Do you have any questions for me about the role, the team, or our company?",
            rationale: "Provides an opportunity for the candidate to ask questions, demonstrating their engagement and curiosity, and helps address any unstated concerns."
        }
    ]
};