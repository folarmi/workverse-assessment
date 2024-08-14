import { pusher } from "@/app/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { task } = await req.json();

    if (!task) {
      return NextResponse.json(
        { message: "Task is required" },
        { status: 400 }
      );
    }

    // Trigger a Pusher event
    await pusher.trigger("tasks-channel", "task-added", task);

    return NextResponse.json({ message: "Task added successfully" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
