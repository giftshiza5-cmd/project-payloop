import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebase-admin";

export async function POST(request) {
  const db = getAdminDb();
  const payload = await request.json();

  if (!db) {
    return NextResponse.json({ ok: true, stored: false, reason: "Firebase Admin SDK is not configured." });
  }

  const report = {
    ...payload,
    createdAt: new Date().toISOString(),
  };

  const doc = await db.collection("meetingReports").add(report);
  return NextResponse.json({ ok: true, stored: true, id: doc.id });
}
