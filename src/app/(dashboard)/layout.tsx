// src/app/(dashboard)/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen flex">
      <DashboardNav user={session.user} />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
