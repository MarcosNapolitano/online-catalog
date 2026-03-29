import { IProduct } from "@/app/_data/types"
import { getList } from "@/app/_services/list_utils";
import { NextResponse } from "next/server";

export async function GET() {
  const list = await getList(1);

  if(!list) return Response.json("No data received");

  return new NextResponse(list.new.replaceAll("\n\n", "\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="minorista.txt"',
    },
  });

}
