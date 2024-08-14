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
    await pusher.trigger("tasks-channel", "task-deleted", { id });
    console.log("trigger deletion");

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
