import { pusher } from "@/app/utils";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const { id, title, completed, lastUpdatedBy, creator } = await req.json();

    // Simulate updating the task in your data store
    const updatedTask = {
      id,
      title,
      completed,
      lastUpdatedBy,
      creator,
    };

    await pusher.trigger("tasks-channel", "task-updated", updatedTask);

    // Return the updated task
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
