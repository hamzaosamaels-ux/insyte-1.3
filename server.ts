import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const DB_FILE = path.join(process.cwd(), "db.json");

// Types for DB
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  avatar: string;
  xp: number;
  level: number;
  rank: string;
  joinedClasses: string[];
}

interface ClassCommunity {
  id: string;
  name: string;
  code: string;
  description: string;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
}

interface Lesson {
  id: string;
  classId: string;
  title: string;
  content: string;
  publishedAt: string;
}

interface TaskItem {
  id: string;
  classId: string;
  title: string;
  description: string;
  rewardXp: number;
  dueDate: string;
  type: "text" | "dragdrop";
  dragItems?: string[];
  dropZones?: string[];
  correctPairing?: Record<string, string>;
}

interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  content: string;
  submittedAt: string;
  isGraded: boolean;
  scoreXpEarned: number;
  feedback?: string;
}

interface Announcement {
  id: string;
  classId: string;
  title: string;
  content: string;
  authorName: string;
  publishedAt: string;
}

interface ChatMessage {
  id: string;
  classId: string;
  senderId: string;
  senderName: string;
  senderRole: "student" | "teacher";
  senderAvatar: string;
  text: string;
  timestamp: string;
}

interface ClassEvent {
  id: string;
  classId: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

interface DbSchema {
  students: UserProfile[];
  teacher: UserProfile;
  classes: ClassCommunity[];
  lessons: Lesson[];
  tasks: TaskItem[];
  announcements: Announcement[];
  chatMessages: ChatMessage[];
  events: ClassEvent[];
  submissions: TaskSubmission[];
}

// Initial Seed Data if DB_FILE doesn't exist yet
const seedData: DbSchema = {
  students: [
    {
      id: "student-1",
      name: "Alex Rivera",
      email: "alex@insyte.edu",
      role: "student",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
      xp: 2450,
      level: 3,
      rank: "Advanced Scholar",
      joinedClasses: ["class-1", "class-2"]
    },
    {
      id: "student-2",
      name: "Chloe Chen",
      email: "chloe@insyte.edu",
      role: "student",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe",
      xp: 3200,
      level: 4,
      rank: "Elite Scholar",
      joinedClasses: ["class-1"]
    },
    {
      id: "student-3",
      name: "Marcus Vance",
      email: "marcus@insyte.edu",
      role: "student",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus",
      xp: 1850,
      level: 2,
      rank: "Active Scholar",
      joinedClasses: ["class-1", "class-2"]
    },
    {
      id: "student-4",
      name: "Sophia Martinez",
      email: "sophia@insyte.edu",
      role: "student",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia",
      xp: 1200,
      level: 2,
      rank: "Active Scholar",
      joinedClasses: ["class-2"]
    }
  ],
  teacher: {
    id: "teacher-1",
    name: "Prof. Hamza",
    email: "hamza@insyte.edu",
    role: "teacher",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Hamza",
    xp: 0,
    level: 10,
    rank: "Master Educator",
    joinedClasses: ["class-1", "class-2"]
  },
  classes: [
    {
      id: "class-1",
      name: "Computer Science 101",
      code: "CS101",
      description: "Learn the fundamentals of software development, algorithms, and full-stack web applications.",
      teacherId: "teacher-1",
      teacherName: "Prof. Hamza",
      studentIds: ["student-1", "student-2", "student-3"]
    },
    {
      id: "class-2",
      name: "Creative Writing Workshop",
      code: "WRITE22",
      description: "Explore world-building, narrative pacing, character development, and critical literary feedback.",
      teacherId: "teacher-1",
      teacherName: "Prof. Hamza",
      studentIds: ["student-1", "student-3", "student-4"]
    }
  ],
  lessons: [
    {
      id: "lesson-1",
      classId: "class-1",
      title: "1. Introduction to Web Technologies",
      content: `## Welcome to Computer Science 101!\nIn this lesson, we will explore the three core technologies that power the modern web:\n\n### 1. HTML (HyperText Markup Language)\nHTML provides the **skeleton** and structure of any webpage. It uses tags like \`<h1>\`, \`<p>\`, and \`<div>\` to represent headings, paragraphs, and containers.\n\n### 2. CSS (Cascading Style Sheets)\nCSS acts as the **skin** and visual presentation layer. It defines layouts, colors, margins, and responsiveness using selectors.\n\n### 3. JavaScript\nJavaScript is the **brain** and programming layer of the browser. It enables interactive behaviors, data fetching, animations, and state transitions dynamically.\n\n### Summary\nThe web functions on a Client-Server architecture. The client (browser) requests documents, and the server serves HTML, CSS, and JS files which the browser renders.`,
      publishedAt: "2026-07-10T09:00:00Z"
    },
    {
      id: "lesson-2",
      classId: "class-1",
      title: "2. Exploring Variables and Functions",
      content: `## Programming Building Blocks\nTo write active applications, we must master the absolute core of coding: variables and functions.\n\n### Variables: Storing Information\nVariables are named storage containers for data. In modern JavaScript, we declare them with:\n- \`let\`: For values that can change.\n- \`const\`: For read-only values that remain constant.\n\n### Functions: Reusable Code Blocks\nA function is a grouped set of statements designed to perform a particular task.\n\`\`\`js\nfunction calculateXp(completedTasks) {\n  return completedTasks * 100;\n}\n\`\`\`\n\n### Quick Check\nAlways use descriptive names for variables to keep code maintainable!`,
      publishedAt: "2026-07-12T10:30:00Z"
    },
    {
      id: "lesson-3",
      classId: "class-2",
      title: "1. The Hero's Journey Narrative Arc",
      content: `## Crafting compelling stories\nThe **Hero's Journey** (or Monomyth) is a classic story template found in myths, novels, and films.\n\n### Three Primary Stages\n1. **Departure**: The hero leaves their ordinary world (The Call to Adventure, meeting the mentor).\n2. **Initiation**: The hero faces trials, enters the abyss, and undergoes a transformation.\n3. **Return**: The hero returns with a "boon" or new wisdom to share with the world.\n\n### Writing Prompt\nConsider your favorite protagonist. Do they follow this structure? Sketch their call to adventure in 3 sentences.`,
      publishedAt: "2026-07-11T14:00:00Z"
    }
  ],
  tasks: [
    {
      id: "task-1",
      classId: "class-1",
      title: "Web Core Component Matcher",
      description: "Pair the web technologies with their primary responsibility. Drag each technology block into its appropriate role category below.",
      rewardXp: 150,
      dueDate: "2026-07-20",
      type: "dragdrop",
      dragItems: ["HTML", "CSS", "JavaScript"],
      dropZones: ["Defines Layout & Colors", "Structures Document Skeleton", "Implements Live Interactivity"],
      correctPairing: {
        "CSS": "Defines Layout & Colors",
        "HTML": "Structures Document Skeleton",
        "JavaScript": "Implements Live Interactivity"
      }
    },
    {
      id: "task-2",
      classId: "class-1",
      title: "Create Your First JS Script",
      description: "Write a short JavaScript function named 'greetStudent(name)' that takes a student name string and returns a greeting like 'Welcome back, [name]!'. Explain what your function does in 1-2 sentences.",
      rewardXp: 200,
      dueDate: "2026-07-22",
      type: "text"
    },
    {
      id: "task-3",
      classId: "class-2",
      title: "The Portal Prompt",
      description: "Write a 150-word opening paragraph of a fantasy story where the protagonist finds an ancient, glowing key inside an ordinary school locker.",
      rewardXp: 250,
      dueDate: "2026-07-19",
      type: "text"
    }
  ],
  announcements: [
    {
      id: "ann-1",
      classId: "class-1",
      title: "Welcome to CS 101!",
      content: "Hi everyone! Professor Hamza here. I am thrilled to guide you through coding basics this semester. Check the Lessons tab to start reading, and don't forget to ask the Insyte AI Chat Buddy any questions you have!",
      authorName: "Prof. Hamza",
      publishedAt: "2026-07-10T09:00:00Z"
    },
    {
      id: "ann-2",
      classId: "class-2",
      title: "Locker Customization Live",
      content: "Hello writers! We have unlocked custom avatars in our locker profile settings. Earn XP by completing tasks to boost your standing on the Leaderboard!",
      authorName: "Prof. Hamza",
      publishedAt: "2026-07-11T14:15:00Z"
    }
  ],
  chatMessages: [
    {
      id: "msg-1",
      classId: "class-1",
      senderId: "teacher-1",
      senderName: "Prof. Hamza",
      senderRole: "teacher",
      senderAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Hamza",
      text: "Welcome to the Computer Science chat room! Ask your classmates for help here.",
      timestamp: "2026-07-10T09:05:00Z"
    },
    {
      id: "msg-2",
      classId: "class-1",
      senderId: "student-1",
      senderName: "Alex Rivera",
      senderRole: "student",
      senderAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
      text: "Thanks Prof! Stoked to learn JavaScript this term.",
      timestamp: "2026-07-10T11:20:00Z"
    },
    {
      id: "msg-3",
      classId: "class-1",
      senderId: "student-2",
      senderName: "Chloe Chen",
      senderRole: "student",
      senderAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Chloe",
      text: "Has anyone started the Web Core matcher task yet? It looks super fun!",
      timestamp: "2026-07-12T15:45:00Z"
    },
    {
      id: "msg-4",
      classId: "class-1",
      senderId: "student-3",
      senderName: "Marcus Vance",
      senderRole: "student",
      senderAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Marcus",
      text: "Yeah Chloe! It really helps visualize how CSS structures the colors.",
      timestamp: "2026-07-12T16:10:00Z"
    }
  ],
  events: [
    {
      id: "evt-1",
      classId: "class-1",
      title: "Virtual Coding Q&A Session",
      description: "Join Professor Hamza on a collaborative livestream to review variables, scope, and script writing.",
      date: "2026-07-18",
      time: "15:00"
    },
    {
      id: "evt-2",
      classId: "class-1",
      title: "Web Core Matcher Homework Due",
      description: "Complete your drag-and-drop matching assignment by tonight for XP rewards.",
      date: "2026-07-20",
      time: "23:59"
    },
    {
      id: "evt-3",
      classId: "class-2",
      title: "Live Story Peer Review",
      description: "Bring your fantasy story portal paragraph and swap feedback with classmates.",
      date: "2026-07-19",
      time: "10:00"
    }
  ],
  submissions: []
};

// Help helper to get database state
function readDb(): DbSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2), "utf8");
      return seedData;
    }
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database file. Reverting to initial seeds.", error);
    return seedData;
  }
}

// Help helper to write database state
function writeDb(data: DbSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write to local database file:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Ensure DB file exists at boot
  readDb();

  // -----------------------------------------------------
  // REST BACKEND API ENDPOINTS
  // -----------------------------------------------------

  // Get complete educational portal data state
  app.get("/api/data", (req, res) => {
    const db = readDb();
    res.json(db);
  });

  // Create a brand new student profile
  app.post("/api/students", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required." });
    }

    const db = readDb();
    const newStudent: UserProfile = {
      id: `student-${Date.now()}`,
      name,
      email,
      role: "student",
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      xp: 0,
      level: 1,
      rank: "Freshman Scholar",
      joinedClasses: db.classes.map(cl => cl.id) // Join all current classes by default
    };

    db.students.push(newStudent);
    
    // Also add this student to all classroom lists
    db.classes = db.classes.map(cl => ({
      ...cl,
      studentIds: Array.from(new Set([...cl.studentIds, newStudent.id]))
    }));

    writeDb(db);
    res.status(201).json({ student: newStudent, allStudents: db.students, allClasses: db.classes });
  });

  // Award study XP points and trigger level up + ranking updates
  app.post("/api/students/add-xp", (req, res) => {
    const { studentId, xpAmount } = req.body;
    if (!studentId || typeof xpAmount !== "number") {
      return res.status(400).json({ error: "studentId and a numeric xpAmount are required." });
    }

    const db = readDb();
    let updatedStudent: UserProfile | null = null;

    db.students = db.students.map(stud => {
      if (stud.id === studentId) {
        const updatedXp = stud.xp + xpAmount;
        const updatedLvl = Math.floor(updatedXp / 1000) + 1;

        let rank = "Freshman Scholar";
        if (updatedLvl >= 4) rank = "Elite Scholar";
        else if (updatedLvl >= 3) rank = "Advanced Scholar";
        else if (updatedLvl >= 2) rank = "Active Scholar";

        updatedStudent = {
          ...stud,
          xp: updatedXp,
          level: updatedLvl,
          rank
        };
        return updatedStudent;
      }
      return stud;
    });

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found." });
    }

    writeDb(db);
    res.json({ student: updatedStudent, allStudents: db.students });
  });

  // Create a brand new Class Community
  app.post("/api/classes", (req, res) => {
    const { name, code, description, teacherId, teacherName } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: "Class name and code are required." });
    }

    const db = readDb();
    const newClass: ClassCommunity = {
      id: `class-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      description: description || "",
      teacherId: teacherId || db.teacher.id,
      teacherName: teacherName || db.teacher.name,
      studentIds: db.students.map(s => s.id) // Automatically enroll all active student profiles
    };

    db.classes.push(newClass);

    // Update students joined classes array
    db.students = db.students.map(stud => ({
      ...stud,
      joinedClasses: Array.from(new Set([...stud.joinedClasses, newClass.id]))
    }));

    writeDb(db);
    res.status(201).json({ class: newClass, allClasses: db.classes, allStudents: db.students });
  });

  // Publish a new lesson guide
  app.post("/api/lessons", (req, res) => {
    const { classId, title, content } = req.body;
    if (!classId || !title || !content) {
      return res.status(400).json({ error: "classId, title, and content are required." });
    }

    const db = readDb();
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      classId,
      title,
      content,
      publishedAt: new Date().toISOString()
    };

    db.lessons.unshift(newLesson); // Prepend so most recent appears first
    writeDb(db);
    res.status(201).json(newLesson);
  });

  // Publish a new homework assignment task
  app.post("/api/tasks", (req, res) => {
    const { classId, title, description, rewardXp, dueDate, type, dragItems, dropZones, correctPairing } = req.body;
    if (!classId || !title || !description || !rewardXp || !dueDate || !type) {
      return res.status(400).json({ error: "Missing required task fields." });
    }

    const db = readDb();
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      classId,
      title,
      description,
      rewardXp: Number(rewardXp),
      dueDate,
      type,
      dragItems,
      dropZones,
      correctPairing
    };

    db.tasks.unshift(newTask);
    writeDb(db);
    res.status(201).json(newTask);
  });

  // Broadcast peer classroom chat logs
  app.post("/api/classroom-chat", (req, res) => {
    const { classId, senderId, senderName, senderRole, senderAvatar, text } = req.body;
    if (!classId || !senderId || !text) {
      return res.status(400).json({ error: "classId, senderId, and text are required." });
    }

    const db = readDb();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      classId,
      senderId,
      senderName,
      senderRole,
      senderAvatar,
      text,
      timestamp: new Date().toISOString()
    };

    db.chatMessages.push(newMsg);
    writeDb(db);
    res.status(201).json({ message: newMsg, allChatMessages: db.chatMessages });
  });

  // Broadcast high priority Announcements bulletins
  app.post("/api/announcements", (req, res) => {
    const { classId, title, content, authorName } = req.body;
    if (!classId || !title || !content) {
      return res.status(400).json({ error: "classId, title, and content are required." });
    }

    const db = readDb();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      classId,
      title,
      content,
      authorName: authorName || db.teacher.name,
      publishedAt: new Date().toISOString()
    };

    db.announcements.unshift(newAnn);
    writeDb(db);
    res.status(201).json(newAnn);
  });

  // Schedule collaborative calendar events
  app.post("/api/events", (req, res) => {
    const { classId, title, description, date, time } = req.body;
    if (!classId || !title || !date || !time) {
      return res.status(400).json({ error: "classId, title, date, and time are required." });
    }

    const db = readDb();
    const newEvt: ClassEvent = {
      id: `evt-${Date.now()}`,
      classId,
      title,
      description: description || "",
      date,
      time
    };

    db.events.push(newEvt);
    writeDb(db);
    res.status(201).json(newEvt);
  });

  // Submit student Homework essays or matcher games
  app.post("/api/submissions", (req, res) => {
    const { taskId, taskTitle, studentId, studentName, studentAvatar, content } = req.body;
    if (!taskId || !studentId || !content) {
      return res.status(400).json({ error: "taskId, studentId, and content are required." });
    }

    const db = readDb();
    const newSubmission: TaskSubmission = {
      id: `sub-${Date.now()}`,
      taskId,
      taskTitle,
      studentId,
      studentName,
      studentAvatar,
      content,
      submittedAt: new Date().toISOString(),
      isGraded: false,
      scoreXpEarned: 0
    };

    db.submissions.push(newSubmission);
    writeDb(db);
    res.status(201).json({ submission: newSubmission, allSubmissions: db.submissions });
  });

  // Grade student Homework task submission (and award study XP)
  app.post("/api/submissions/grade", (req, res) => {
    const { submissionId, scoreXp, feedback } = req.body;
    if (!submissionId || typeof scoreXp !== "number") {
      return res.status(400).json({ error: "submissionId and scoreXp are required parameters." });
    }

    const db = readDb();
    let targetStudentId = "";
    let updatedSubmission: TaskSubmission | null = null;

    db.submissions = db.submissions.map(sub => {
      if (sub.id === submissionId) {
        targetStudentId = sub.studentId;
        updatedSubmission = {
          ...sub,
          isGraded: true,
          scoreXpEarned: scoreXp,
          feedback: feedback || ""
        };
        return updatedSubmission;
      }
      return sub;
    });

    if (!updatedSubmission) {
      return res.status(404).json({ error: "Submission item not found." });
    }

    // Award the XP to the student
    if (targetStudentId) {
      db.students = db.students.map(stud => {
        if (stud.id === targetStudentId) {
          const updatedXp = stud.xp + scoreXp;
          const updatedLvl = Math.floor(updatedXp / 1000) + 1;

          let rank = "Freshman Scholar";
          if (updatedLvl >= 4) rank = "Elite Scholar";
          else if (updatedLvl >= 3) rank = "Advanced Scholar";
          else if (updatedLvl >= 2) rank = "Active Scholar";

          return {
            ...stud,
            xp: updatedXp,
            level: updatedLvl,
            rank
          };
        }
        return stud;
      });
    }

    writeDb(db);
    res.json({ 
      submission: updatedSubmission, 
      allSubmissions: db.submissions, 
      allStudents: db.students 
    });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Gemini Study Buddy Chat endpoint (Securely Proxied)
  app.post("/api/chat", async (req, res) => {
    try {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(400).json({
          error: "GEMINI_API_KEY environment variable is not configured. Please add your Gemini API Key in Settings > Secrets."
        });
      }

      const { messages, systemPrompt } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid 'messages' format. Must be an array." });
      }

      // Initialize GoogleGenAI with custom headers for telemetry
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Map roles from UI structure (user / assistant) to Gemini SDK structure (user / model)
      const contents = messages.map((msg: any) => ({
        role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text || msg.content }]
      }));

      // Request content generation from Gemini 3.5-flash
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction: systemPrompt || "You are a helpful educational tutor named Insyte AI.",
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error communicating with Gemini API:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred while communicating with the AI Study Buddy."
      });
    }
  });

  // Vite integration and Asset serving
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving compiled assets...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Insyte Server] Ready! Access it at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start the Express server:", err);
  process.exit(1);
});
