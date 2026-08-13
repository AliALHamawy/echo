'use client'
import Account from "@/components/myComponents/Account";
import Navigations from "@/components/myComponents/Navigations";



export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="grid grid-cols-5 w-350 m-auto min-h-screen">
                <div className="flex flex-col justify-between py-15 px-5">
                    <div className="flex flex-col ">
                        <div className="logoContainer flex items-center">
                            echo
                        </div>
                        <Navigations/>
                    </div>
                    <Account />
                </div>
                <div className="flex flex-col  col-span-3 bg-[#f5f5f5] border-x border-[#000]">
                    <section>{children}</section>
                </div>
                <div className="flex flex-col ">
                    ss
                </div>
            </div>
        </>
    )
}