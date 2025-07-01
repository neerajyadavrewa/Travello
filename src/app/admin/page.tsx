import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminPageClientComponent from "@/components/AdminPageClientComponent";
export default async function AdminPageWrapper() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/"); // or show 403 page
  }

  return <AdminPageClientComponent />;
}
   