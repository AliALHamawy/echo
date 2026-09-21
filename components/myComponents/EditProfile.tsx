"use client"

import AuthAlert from "@/components/myComponents/AuthAlert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { pb } from "@/lib/pocketbase"
import { ArrowLeft, ImagePlus, Save } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const EditProfile = () => {
    const user = pb.authStore.record
    const [name, setName] = useState(user?.name ?? "")
    const [bio, setBio] = useState(user?.bio ?? "")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [coverFile, setCoverFile] = useState<File | null>(null)
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | undefined>(undefined)
    const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | undefined>(undefined)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const currentAvatar = user?.avatar && user.collectionId
        ? pb.files.getURL(user, user.avatar)
        : undefined
    const currentCover = user?.cover && user.collectionId
        ? pb.files.getURL(user, user.cover)
        : undefined
    const displayName = name.trim() || "Your account"

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        setSuccess("")

        if (!user) {
            setError("You must be signed in to edit your profile.")
            return
        }

        if (!name.trim()) {
            setError("Please enter your name.")
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("name", name.trim())
            formData.append("bio", bio.trim())
            if (avatarFile) {
                formData.append("avatar", avatarFile)
            }
            if (coverFile) {
                formData.append("cover", coverFile)
            }

            const updatedUser = await pb.collection("users").update(user.id, formData)
            pb.authStore.save(pb.authStore.token, updatedUser)
            setSuccess("Profile updated.")
            setAvatarFile(null)
            setCoverFile(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to update your profile.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
            <div className="flex items-center gap-3">
                <Link
                    href="/profile"
                    aria-label="Back to profile"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold">Edit profile</h1>
                    <p className="text-sm text-muted-foreground">Update how people see you on Echo.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 border border-border p-5 sm:p-6">
                <div className="flex flex-col gap-3">
                    <span className="text-sm font-medium">Cover photo</span>
                    <div
                        className="flex h-32 items-center justify-center border border-border bg-muted bg-cover bg-center"
                        style={{ backgroundImage: coverPreviewUrl || currentCover ? `url(${coverPreviewUrl ?? currentCover})` : undefined }}
                    >
                        {!coverPreviewUrl && !currentCover && <span className="text-sm text-muted-foreground">No cover photo</span>}
                    </div>
                    <label className="inline-flex w-fit  items-center gap-2 rounded-none border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
                        <ImagePlus className="h-4 w-4" />
                        Add cover photo
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null
                                setCoverFile(file)
                                setCoverPreviewUrl(file ? URL.createObjectURL(file) : undefined)
                            }}
                        />
                    </label>
                </div>

                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20 rounded-none border border-border">
                        <AvatarImage src={avatarPreviewUrl ?? currentAvatar} className="object-cover" />
                        <AvatarFallback className="rounded-none text-xl font-semibold">
                            {displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <label className="inline-flex  items-center gap-2 rounded-none border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
                        <ImagePlus className="h-4 w-4" />
                        Add avatar
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(event) => {
                                const file = event.target.files?.[0] ?? null
                                setAvatarFile(file)
                                setAvatarPreviewUrl(file ? URL.createObjectURL(file) : undefined)
                            }}
                        />
                    </label>
                </div>

                <label className="flex flex-col gap-2 text-sm font-medium">
                    Name
                    <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        required
                        className="rounded-none"
                    />
                </label>

                <label className="flex flex-col gap-2 text-sm font-medium">
                    Bio
                    <Textarea
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        placeholder="Tell people a little about yourself"
                        maxLength={160}
                        className="min-h-28 rounded-none resize-none"
                    />
                    <span className="text-xs font-normal text-muted-foreground">{bio.length}/160</span>
                </label>

                <Button type="submit" disabled={isSubmitting} className="w-fit rounded-none">
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save profile"}
                </Button>
            </form>

            {error && <AuthAlert message={error} variant="error" />}
            {success && <AuthAlert message={success} variant="success" />}
        </div>
    )
}

export default EditProfile
