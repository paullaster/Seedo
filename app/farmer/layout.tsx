import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FarmerClientLayout from "./layout-client";

export default async function FarmerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  // Enforce profile completion
  // We use 'as any' because isComplete is a custom property added in auth.ts
  if (session?.user && !(session.user as any).isComplete) {
    redirect("/auth/register");
  }

  return (
    <FarmerClientLayout>
      {children}
    </FarmerClientLayout>
  );
}
