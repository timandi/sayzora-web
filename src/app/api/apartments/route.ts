import { NextResponse } from "next/server";
import listingsData from "@/lib/listings_data.json";
export async function GET() {
  return NextResponse.json(listingsData);
}
