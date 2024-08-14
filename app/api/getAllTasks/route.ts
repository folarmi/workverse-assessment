import { tasks } from "@/app/utils";
import { NextResponse } from "next/server";

const tasksJSON = JSON.stringify(tasks);
localStorage.setItem("tasks", tasksJSON);

// // Function to add a new task to the mock data
// export const addTask = (task: Task) => {
//   tasks.push(task);
// };

export async function GET() {
  try {
    return NextResponse.json(JSON.parse(tasksJSON));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { message: "Unable to fetch task" },
      { status: 500 }
    );
  }
}
