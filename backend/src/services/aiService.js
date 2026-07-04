const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Gemini API Client initialized successfully.");
  } catch (error) {
    console.warn("Failed to initialize Gemini API client:", error.message);
  }
} else {
  console.log("No GEMINI_API_KEY configured. Running AI Service in Mock/Simulated mode.");
}

// Resilient parsing helper
function cleanAndParseJSON(text) {
  let cleaned = text.trim();
  // Strip markdown triple backticks code block wrappers if present
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/, "").replace(/```$/, "").trim();
  }
  return JSON.parse(cleaned);
}

const aiService = {
  async generateSummary(skills) {
    if (!model) {
      return `Experienced developer with strong hands-on expertise in ${skills || "modern tech stacks"}. Proven track record of building performant, scalable web applications and delivering exceptional user experiences through clean, optimized code.`;
    }

    try {
      const prompt = `Generate a professional, compelling, and ATS-friendly 2-3 sentence resume summary for a candidate with the following skills: "${skills}". Do NOT include any intro or outro, return ONLY the paragraph text.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text.trim();
    } catch (error) {
      console.error("Gemini API Error (generateSummary):", error.message);
      throw new Error("Failed to generate summary using Gemini.");
    }
  },

  async generateProject(projectName, techStack) {
    if (!model) {
      return `• Engineered and deployed "${projectName || "Web App"}" utilizing ${techStack || "modern APIs"}, optimizing system performance by 25%.\n• Designed interactive interfaces and integrated state management to improve user engagement metrics.\n• Formulated robust database indexing and API endpoint architecture to ensure high security and reliability.`;
    }

    try {
      const prompt = `Create a professional, ATS-friendly resume project description (3 bullet points) for a project named "${projectName}" using the tech stack: "${techStack}". Use strong action verbs and detail the impact. Return ONLY the bullet points, one per line, each starting with "•".`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text.trim();
    } catch (error) {
      console.error("Gemini API Error (generateProject):", error.message);
      throw new Error("Failed to generate project description.");
    }
  },

  async generateSkills(skillsInput) {
    if (!model) {
      return `${skillsInput ? skillsInput + ", " : ""}TypeScript, Redux, RESTful APIs, Docker, CI/CD, Git, Jest, Tailwind CSS`;
    }

    try {
      const prompt = `Given the candidate's initial skills: "${skillsInput}", recommend 6-10 other highly relevant technical skills or industry-standard tools that would enhance this resume. Return ONLY a single comma-separated list of these suggested skills (no numbering, no intro, no comments).`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text.trim();
    } catch (error) {
      console.error("Gemini API Error (generateSkills):", error.message);
      throw new Error("Failed to suggest skills.");
    }
  },

  async atsScore(resumeData) {
    const fallbackData = {
      score: 78,
      strengths: ["Clean template layout with clear navigation", "Covers essential details like Education and Contact details", "Use of industry terms"],
      weaknesses: ["Missing quantified metrics or achievements", "Skills list could be expanded with more modern frameworks", "Summary is too generic"],
      suggestions: ["Add numbers to describe experience impact (e.g. optimized load time by 30%)", "Add certificates and portfolios to boost credibility", "Include a GitHub profile link"],
      missingKeywords: ["CI/CD", "TypeScript", "Jest Testing", "REST APIs"]
    };

    if (!model) {
      return fallbackData;
    }

    try {
      const prompt = `You are an expert ATS (Applicant Tracking System) screening tool. Evaluate the following resume details for formatting, keywords, readability, and score them out of 100.
      
      Resume JSON details:
      ${JSON.stringify(resumeData)}
      
      You must respond with a raw, valid JSON object ONLY. Do not write a markdown block. Use this exact schema:
      {
        "score": 85,
        "strengths": ["string", "string"],
        "weaknesses": ["string", "string"],
        "suggestions": ["string", "string"],
        "missingKeywords": ["string", "string"]
      }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      try {
        return cleanAndParseJSON(text);
      } catch (err) {
        console.error("Failed to parse Gemini ATS output as JSON. Raw output:", text);
        return fallbackData;
      }
    } catch (error) {
      console.error("Gemini API Error (atsScore):", error.message);
      return fallbackData;
    }
  },

  async improveResume(resumeData) {
    if (!model) {
      return "Suggestions: 1. Quantify achievements (e.g., 'improved page speed by 40%'). 2. List specific tools used in projects. 3. Ensure contact links like GitHub and LinkedIn are active.";
    }

    try {
      const prompt = `Analyze the resume data below and offer 3 clear, actionable feedback points to significantly improve its presentation and ATS pass-rate.
      
      Resume JSON:
      ${JSON.stringify(resumeData)}
      
      Return the feedback as a simple, human-readable list.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text.trim();
    } catch (error) {
      console.error("Gemini API Error (improveResume):", error.message);
      throw new Error("Failed to fetch improvement suggestions.");
    }
  }
};

module.exports = aiService;
