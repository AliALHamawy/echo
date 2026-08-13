'use client'
import Account from "@/components/myComponents/Account";
import EchoIcon from "@/components/myComponents/echo-icon";
import Logo from "@/components/myComponents/Logo";
import Navigations from "@/components/myComponents/Navigations";



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="flex md:grid grid-cols-8 xl:grid-cols-10 w-full max-w-350 m-auto min-h-screen">
                <div className="flex flex-col col-span-1 md:col-span-2 justify-between py-5 px-5 overflow-hidden">
                    <div className="flex flex-col gap-10">
                        <Logo/>
                        <Navigations/>
                    </div>
                    <Account />
                </div>
                <div className="flex flex-col col-span-7 md:col-span-6 border-x border-border">
                    <section>{children}</section>
                </div>
                <div className="hidden col-span-2 xl:flex flex-col">
                    ss
                </div>
            </div>
        </>
    )
}