import { connectDB } from "@/lib/db"; // your MongoDB connection file
import Contact from "../../../../models/Contact"; // you will create this model below

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
