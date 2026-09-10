import Account from "@/components/myComponents/Account";
import Logo from "@/components/myComponents/Logo";
import MobileNav from "@/components/myComponents/MobileNav";
import Navigations from "@/components/myComponents/Navigations";
import LayoutHeader from "@/components/myComponents/LayoutHeader";
import RightSidebar from "@/components/myComponents/RightSidebar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full max-w-350 mx-auto h-dvh overflow-hidden relative">
            <MobileNav />
            
            <aside className="hidden sm:flex flex-col justify-between py-5 px-2 md:px-4 w-16 md:w-64 shrink-0 border-e border-border transition-all duration-300">
                <div className="flex flex-col gap-8 w-full items-center md:items-start">
                    <Logo />
                    <Navigations />
                </div>
                <div className="w-full flex justify-center md:justify-start">
                    <Account />
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <LayoutHeader />
                <div className="flex-1 min-h-0 w-full flex flex-col overflow-y-auto [scrollbar-width:none] relative">
                    {children}
                </div>
            </main>
            
            <RightSidebar />
        </div>
    );
}