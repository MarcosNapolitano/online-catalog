import { IProduct } from "@/app/_data/types"
import { getList } from "@/app/_services/list_utils";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

  const { searchParams } = new URL(req.url);
  const ID = searchParams.get("id");
  if (!ID) return Response.json("No ID")

  const listID = parseInt(ID);
  if (listID < 1 || listID > 2) return Response.json("Invalid ID");

  const list = await getList(listID as 1 | 2);
  const name = listID === 1 ? "mayorista" : "minorista";

  if (!list) return Response.json("No data received");

  return new NextResponse(list.new.replaceAll("\n\n", "\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${name}.txt`,
    },
  });

}
