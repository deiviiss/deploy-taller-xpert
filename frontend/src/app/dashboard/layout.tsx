import { getUserSessionServer } from "@/actions";
import { Sidebar, TopMenu } from "@/components";
import { redirect } from "next/navigation";

export default async function RootAuth({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserSessionServer()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <main className="flex bg-white">
      <Sidebar />
      <div className="w-full">
        <TopMenu />
        <div className="p-8 pl-[17px]">
          {children}
        </div>
      </div>
    </main>
  );
}
