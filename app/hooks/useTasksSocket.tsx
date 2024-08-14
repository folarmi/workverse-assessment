import { useEffect } from "react";
import Pusher from "pusher-js";
import { Task } from "../utils";

interface UseTasksSocketProps {
  onTaskAdded: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: string) => void;
}

export const useTasksSocket = ({
  onTaskAdded,
  onTaskUpdated,
  onTaskDeleted,
}: UseTasksSocketProps) => {
  useEffect(() => {
    const pusher = new Pusher("fb1a7949e4d0e8b353e1", {
      cluster: "eu",
    });

    const channel = pusher.subscribe("tasks-channel");

    channel.bind("task-added", onTaskAdded);
    channel.bind("task-updated", onTaskUpdated);
    channel.bind("task-deleted", onTaskDeleted);

    return () => {
      channel.unbind("task-added", onTaskAdded);
      channel.unbind("task-updated", onTaskUpdated);
      channel.unbind("task-deleted", onTaskDeleted);
      pusher.unsubscribe("tasks-channel");
    };
  }, [onTaskAdded, onTaskUpdated, onTaskDeleted]);
};
