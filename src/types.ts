export type UserRole = 'student' | 'teacher';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  xp: number;
  level: number;
  rank: string;
  joinedClasses: string[]; // List of classIds
}

export interface ClassCommunity {
  id: string;
  name: string;
  code: string; // Used to join class
  description: string;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
}

export interface Lesson {
  id: string;
  classId: string;
  title: string;
  content: string; // Markdown supported
  publishedAt: string;
}

export type TaskType = 'text' | 'dragdrop';

export interface TaskItem {
  id: string;
  classId: string;
  title: string;
  description: string;
  rewardXp: number;
  dueDate: string;
  type: TaskType;
  // Drag and drop specific
  dragItems?: string[]; // E.g., ['2', '+', '2'] or ['HTML', 'CSS', 'JS']
  dropZones?: string[]; // E.g., ['Input', 'Style', 'Action'] or empty boxes
  correctPairing?: Record<string, string>; // Maps drag item to target drop zone
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  content: string; // Text answer or drag pairings JSON
  isGraded: boolean;
  scoreXpEarned?: number;
  submittedAt: string;
  feedback?: string;
}

export interface Announcement {
  id: string;
  classId: string;
  title: string;
  content: string;
  authorName: string;
  publishedAt: string;
}

export interface ChatMessage {
  id: string;
  classId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface ClassEvent {
  id: string;
  classId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}
