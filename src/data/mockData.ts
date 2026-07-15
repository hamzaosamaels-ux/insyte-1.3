import { UserProfile, ClassCommunity, Lesson, TaskItem, Announcement, ChatMessage, ClassEvent } from "../types";

export const initialStudents: UserProfile[] = [
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
];

export const initialTeacher: UserProfile = {
  id: "teacher-1",
  name: "Prof. Hamza",
  email: "hamza@insyte.edu",
  role: "teacher",
  avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Hamza",
  xp: 0,
  level: 10,
  rank: "Master Educator",
  joinedClasses: ["class-1", "class-2"]
};

export const initialClasses: ClassCommunity[] = [
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
];

export const initialLessons: Lesson[] = [
  {
    id: "lesson-1",
    classId: "class-1",
    title: "1. Introduction to Web Technologies",
    content: `## Welcome to Computer Science 101!
In this lesson, we will explore the three core technologies that power the modern web:

### 1. HTML (HyperText Markup Language)
HTML provides the **skeleton** and structure of any webpage. It uses tags like \`<h1>\`, \`<p>\`, and \`<div>\` to represent headings, paragraphs, and containers.

### 2. CSS (Cascading Style Sheets)
CSS acts as the **skin** and visual presentation layer. It defines layouts, colors, margins, and responsiveness using selectors.

### 3. JavaScript
JavaScript is the **brain** and programming layer of the browser. It enables interactive behaviors, data fetching, animations, and state transitions dynamically.

### Summary
The web functions on a Client-Server architecture. The client (browser) requests documents, and the server serves HTML, CSS, and JS files which the browser renders.`,
    publishedAt: "2026-07-10T09:00:00Z"
  },
  {
    id: "lesson-2",
    classId: "class-1",
    title: "2. Exploring Variables and Functions",
    content: `## Programming Building Blocks
To write active applications, we must master the absolute core of coding: variables and functions.

### Variables: Storing Information
Variables are named storage containers for data. In modern JavaScript, we declare them with:
- \`let\`: For values that can change.
- \`const\`: For read-only values that remain constant.

### Functions: Reusable Code Blocks
A function is a grouped set of statements designed to perform a particular task.
\`\`\`js
function calculateXp(completedTasks) {
  return completedTasks * 100;
}
\`\`\`

### Quick Check
Always use descriptive names for variables to keep code maintainable!`,
    publishedAt: "2026-07-12T10:30:00Z"
  },
  {
    id: "lesson-3",
    classId: "class-2",
    title: "1. The Hero's Journey Narrative Arc",
    content: `## Crafting compelling stories
The **Hero's Journey** (or Monomyth) is a classic story template found in myths, novels, and films.

### Three Primary Stages
1. **Departure**: The hero leaves their ordinary world (The Call to Adventure, meeting the mentor).
2. **Initiation**: The hero faces trials, enters the abyss, and undergoes a transformation.
3. **Return**: The hero returns with a "boon" or new wisdom to share with the world.

### Writing Prompt
Consider your favorite protagonist. Do they follow this structure? Sketch their call to adventure in 3 sentences.`,
    publishedAt: "2026-07-11T14:00:00Z"
  }
];

export const initialTasks: TaskItem[] = [
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
];

export const initialAnnouncements: Announcement[] = [
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
];

export const initialChatMessages: ChatMessage[] = [
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
];

export const initialEvents: ClassEvent[] = [
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
];
