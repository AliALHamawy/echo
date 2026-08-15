'use client';

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { twMerge } from "tailwind-merge";

export interface User {
    id: number;
    name: string;
    userName: string;
    followingState: boolean;
    image: string;
}

export const initialUsers: User[] = [
    {
        id: 1,
        name: "Ines Marchetti",
        userName: "Design systems",
        followingState: false,
        image: "https://avatar.iran.liara.run/username?username=Ines+Marchetti",
    },
    {
        id: 2,
        name: "Kai Lund",
        userName: "Infra & edge",
        followingState: true,
        image: "https://avatar.iran.liara.run/username?username=Kai+Lund",
    },
    {
        id: 3,
        name: "Tomas Reyes",
        userName: "Type & motion",
        followingState: false,
        image: "https://avatar.iran.liara.run/username?username=Tomas+Reyes",
    },
];

const FollowingCard = () => {
    const [usersList, setUsersList] = useState<User[]>(initialUsers);

    const toggleFollow = (id: number) => {
        setUsersList((prev) =>
            prev.map((user) =>
                user.id === id
                    ? { ...user, followingState: !user.followingState }
                    : user
            )
        );
    };

    return (
        <Card className="rounded-xl bg-background border overflow-hidden w-full max-w-sm p-0 gap-0">
            <div className="flex items-center px-3.5 py-2 border-b uppercase text-[11px] font-semibold text-muted-foreground select-none">
                Suggested connections
            </div>

            <ul className="flex flex-col divide-y divide-border/50 m-0 p-0 pt-1">
                {usersList.map((item) => (
                    <li
                        key={item.id}
                        className="flex items-center justify-between px-3.5 py-3 w-full hover:bg-muted/30 transition-colors"
                    >
                        <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={item.image} alt={item.name} />
                                <AvatarFallback className="text-[11px] font-semibold">
                                    {item.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-center">
                                <span className="text-xs font-semibold text-foreground leading-tight">
                                    {item.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground leading-tight">
                                    {item.userName}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleFollow(item.id)}
                            className={twMerge(
                                "px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 select-none shrink-0",
                                item.followingState
                                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                    : "border border-border bg-transparent text-foreground hover:bg-accent"
                            )}
                        >
                            {item.followingState ? "Following" : "Follow"}
                        </button>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default FollowingCard;