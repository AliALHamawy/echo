"use client"
import ApperanceSettings from "@/components/myComponents/ApperanceSettings";
import GeneralSettings from "@/components/myComponents/GeneralSettings";
import NotificationsSettings from "@/components/myComponents/NotificationsSettings";
import SecuritySettings from "@/components/myComponents/SecuritySettings";
import { Button } from "@/components/ui/button";
import { pb } from "@/lib/pocketbase";
import { applyTheme, type ThemePreference } from "@/lib/theme";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge';

type FilterTab = "General" | "Apperance" | "Notifications" | "Security";

type SettingsState = {
  accountPrivacy: string
  followRequests: string
  country: string
  theme: string
  reducedMotion: boolean
  compactFeed: boolean
  notifications: {
    enabled: boolean
    messages: boolean
    mentions: boolean
    comments: boolean
    interactions: boolean
  }
}

const defaultSettings: SettingsState = {
  accountPrivacy: "public",
  followRequests: "direct_follow",
  country: "US",
  theme: "dark",
  reducedMotion: false,
  compactFeed: false,
  notifications: {
    enabled: true,
    messages: true,
    mentions: true,
    comments: true,
    interactions: true,
  },
}

const Settings = () => {
  const [tab, setTab] = useState<FilterTab>("General");
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      await Promise.resolve();
      const userSettings = pb.authStore.record?.settings as Partial<SettingsState> | undefined;
      setSettings({
        ...defaultSettings,
        ...userSettings,
        notifications: {
          ...defaultSettings.notifications,
          ...userSettings?.notifications,
        },
      });
      setIsLoading(false);
    };

    void loadSettings();
  }, []);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    if (key === "theme") {
      applyTheme(value as ThemePreference);
    }
    setSaved(false);
  };

  const saveSettings = async () => {
    const user = pb.authStore.record;
    if (!user) {
      setError("You must be signed in to save settings.");
      return;
    }

    setError("");
    setSaved(false);
    setIsSaving(true);

    try {
      const updatedUser = await pb.collection("users").update(user.id, { settings });
      pb.authStore.save(pb.authStore.token, updatedUser);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

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
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          ) : <AnimatePresence mode="wait">
            <span className="text-xs uppercase text-muted-foreground m-0 p-0 ">{tab}</span>
            {tab === "Security" ?( <SecuritySettings key="security" />):(
  <div className="flex flex-col w-full border border-muted" key="settings">
              <motion.div className="flex flex-col w-full divide-y divide-border">
                {tab === "General" && <GeneralSettings
                  accountPrivacy={settings.accountPrivacy}
                  followRequests={settings.followRequests}
                  country={settings.country}
                  onAccountPrivacyChange={(value) => updateSetting("accountPrivacy", value)}
                  onFollowRequestsChange={(value) => updateSetting("followRequests", value)}
                  onCountryChange={(value) => updateSetting("country", value)}
                />}
                {tab === "Apperance" && <ApperanceSettings
                  theme={settings.theme}
                  reducedMotion={settings.reducedMotion}
                  compactFeed={settings.compactFeed}
                  onThemeChange={(value) => updateSetting("theme", value)}
                  onReducedMotionChange={(value) => updateSetting("reducedMotion", value)}
                  onCompactFeedChange={(value) => updateSetting("compactFeed", value)}
                />}
                {tab === "Notifications" && <NotificationsSettings
                  notifications={settings.notifications}
                  onChange={(key, value) => updateSetting("notifications", { ...settings.notifications, [key]: value })}
                />}
                <div className="flex items-center justify-end gap-3 m-3">
                  {saved && <span className="text-xs text-muted-foreground">Saved</span>}
                  <Button onClick={() => void saveSettings()} disabled={isSaving} className="w-25 rounded-none text-xs">
                    {isSaving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </motion.div>
            </div>
)}
          </AnimatePresence>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </div>
    </>
  )
}
export default Settings