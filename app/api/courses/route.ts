import { NextResponse } from "next/server";
import { demoCourses } from "@/lib/lms-data";

export async function GET() {
  return NextResponse.json({ courses: demoCourses });
}
