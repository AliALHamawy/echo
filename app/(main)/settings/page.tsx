"use client"
import ApperanceSettings from "@/components/myComponents/ApperanceSettings";
import GeneralSettings from "@/components/myComponents/GeneralSettings";
import NotificationsSettings from "@/components/myComponents/NotificationsSettings";
import SecuritySettings from "@/components/myComponents/SecuritySettings";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from 'react'
import { twMerge } from 'tailwind-merge';

type FilterTab = "General" | "Apperance" | "Notifications" | "Security";

const Settings = () => {
  const [tab, setTab] = useState<FilterTab>("General");

  return (
    <>
      <div className='flex flex-col justify-center items-center py-10 px-4'>
        <div className='max-w-168.75 w-full flex flex-col gap-4'>
          <div className="flex flex-col">
            <span className="text-xl font-bold">Settings</span>
            <span className="text-xs text-muted-foreground">Manage your account preferences and app configurations.</span>
          </div>
          <div className="flex rounded-2xl p-1 border border-muted w-fit  bg-background">
            {(["General", "Apperance", "Notifications", "Security"] as FilterTab[]).map((myTab) => {
              const isActive = tab === myTab;
              return (
                <button
                  key={myTab}
                  onClick={() => setTab(myTab)}
                  className={twMerge(
                    "relative text-sm px-3 py-1 rounded-xl transition-colors duration-200 capitalize select-none font-medium z-10",
                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="relative z-10">
                    {myTab === "General" ? "General" : myTab}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId={`settings-active-pill`}
                      className="absolute inset-0 bg-foreground rounded-xl z-0"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <span className="text-xs uppercase text-muted-foreground m-0 p-0 ">{tab}</span>
            { tab != "Security" &&<div className="flex flex-col w-full border border-muted">
              <motion.div className="flex flex-col w-full divide-y divide-border">
                {tab === "General" && <GeneralSettings />}
                {tab === "Apperance" && <ApperanceSettings />}
                {tab === "Notifications" && <NotificationsSettings />}
                <Button className="w-25 m-3 rounded-none self-end text-xs">Save changes</Button>
              </motion.div>
            </div>}
                {tab === "Security" && <SecuritySettings />}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default Settings