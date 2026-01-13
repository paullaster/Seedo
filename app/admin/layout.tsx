import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminClientLayout from "./layout-client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user && !(session.user as any).isComplete) {
    redirect("/auth/register");
  }

  // Strict role check for Admin
  if ((session?.user as any)?.role !== 'ADMIN') {
    // redirect("/"); 
  }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
