import Pusher from "pusher";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  creator: string | null;
  lastUpdatedBy?: string;
}

export const pusher = new Pusher({
  appId: "1006631",
  key: "fb1a7949e4d0e8b353e1",
  secret: "4abcf4de2a1b9167e292",
  cluster: "eu",
  useTLS: true,
});

export const tasks = [
  { id: "1", title: "Task 1", completed: false, creator: "Fola" },
  { id: "2", title: "Task 2", completed: false, creator: "Sample User" },
  { id: "3", title: "Task 3", completed: false, creator: "Fola" },
  { id: "4", title: "Task 4", completed: false, creator: "Sample User" },
];
