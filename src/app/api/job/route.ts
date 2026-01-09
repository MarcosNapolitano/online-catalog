import { redirect } from "next/navigation";
import { Task } from '@/app/_data/types';

const TASKS: Map<string, Task> = new Map();

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const jobID = searchParams.get("id");

  if (!jobID) return new Response("No Id Provided", { status: 400 })

  const task = TASKS.get(jobID);

  if (!task) return new Response("No task Found", { status: 404 })
  if (task.done) return new Response(JSON.stringify(task))

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {

      // we open the connection with the browser
      controller.enqueue(encoder.encode(`data: connected\n\n`));

      // we want to stall the start function to keep the connection alive
      while(!task.done){
        await new Promise(r => setTimeout(r, 500));

        controller.enqueue(
          encoder.encode(`data: ${TASKS.get(jobID)?.status}\n\n`)
        );
      }

      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  })
};

export async function POST(req: Request) {

  const data = await req.json()

  TASKS.set(data.id, { progress: 0, status: "pending" });

  return new Response("Job Created Successfully", { status: 200 })
}

export async function PUT(req: Request) {

  const { searchParams } = new URL(req.url);
  const jobID = searchParams.get("id");
  const data = await req.json()

  if (!jobID || !data) return;

  TASKS.set(jobID, { progress: data.progress, status: data.status });

  if (data.done)
    TASKS.set(jobID, { progress: data.progress, status: data.status, done: true });

  return new Response("Job Updated Successfully", { status: 200 })
}
