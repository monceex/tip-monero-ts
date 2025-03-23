import { Navbar } from "@/components/navbar";
import { TitleProvider } from "@/context/TitleContext";
import { NavbarButtonProvider } from '@/context/NavbarButtonContext';
import { LoadingProvider } from "@/context/LoadingContext";
import { NotificationProvider } from "@/context/NotificationContext";

export default function DefaultLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoadingProvider>
      <NotificationProvider>
    <TitleProvider>
      <NavbarButtonProvider>
    <div className="relative flex flex-col max-h-screen">
      <Navbar />
      <main className="container mx-auto max-w-[1024px] px-6 flex-grow overflow-hidden">
        {children}
      </main>
    </div>
    </NavbarButtonProvider>
    </TitleProvider>
    </NotificationProvider>
    </LoadingProvider>
  );
}
