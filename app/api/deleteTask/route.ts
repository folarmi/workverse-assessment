import { pusher } from "@/app/utils";
import { NextResponse } from "next/server";

// export async function DELETE(req: Request) {
//   try {
//     const { id } = await req.json();

//     await pusher.trigger("tasks-channel", "task-deleted", { id });

//     return NextResponse.json({ message: "Task deleted successfully" });
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Internal Server Error", error },
//       { status: 500 }
//     );
//   }
// }

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // console.log("DELETE API called with id:", id);

    // Trigger the Pusher event to notify other clients
    await pusher.trigger("tasks-channel", "task-deleted", { id });

    // console.log("Pusher event triggered for task-deleted with id:", id);

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE API:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
