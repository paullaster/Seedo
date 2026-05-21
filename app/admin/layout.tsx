import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminClientLayout from "./layout-client";
import { User } from "../lib/types";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session) {
    const search = new URLSearchParams({ redirect: '/admin' });
    redirect(`/auth/login?${search}`,);
  }
  if (session?.user && !(session.user as User).isComplete) {
    redirect("/auth/register");
  }

  if (!['ADMIN', 'SUPER_ADMIN'].includes((session?.user as User)?.role)) {
    redirect("/"); 
  }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
