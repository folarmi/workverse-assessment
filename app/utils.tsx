import Pusher from "pusher";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  creator: string | null;
  lastUpdatedBy?: string;
}

export const pusher = new Pusher({
  appId: process.env.NEXT_APP_ID || "",
  key: process.env.NEXT_PUSHER_KEY || "",
  secret: process.env.NEXT_PUSHER_SECRET || "",
  cluster: "eu",
  useTLS: true,
});

export const tasks = [
  { id: "1", title: "Task 1", completed: false, creator: "Fola" },
  { id: "2", title: "Task 2", completed: false, creator: "Sample User" },
  { id: "3", title: "Task 3", completed: false, creator: "Fola" },
  { id: "4", title: "Task 4", completed: false, creator: "Sample User" },
];
