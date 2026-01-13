import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AgentClientLayout from "./layout-client";

export default async function AgentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user && !(session.user as any).isComplete) {
    redirect("/auth/register");
  }

  // Also enforce role if needed, but middleware handles basic protection
  if ((session?.user as any)?.role !== 'AGENT') {
    // redirect("/unauthorized"); // Optional: strict role check
  }

  return (
    <AgentClientLayout>
      {children}
    </AgentClientLayout>
  );
}
