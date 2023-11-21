import admin from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const listUsersResult = await getAuth().listUsers();
    console.log(listUsersResult);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      photoURL: userRecord.photoURL,
      displayName: userRecord.displayName,
    }));

    revalidatePath("/api/firebase-admin");
    return NextResponse.json(users);
  } catch (error) {
    console.log("Error listing users:", error);
    res.status(500).end("Internal Server Error");
  }
}
