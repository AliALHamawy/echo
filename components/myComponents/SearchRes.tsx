import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export interface SearchUser {
    id: string;
    name: string;
    username: string;
    avatar: string;
}

export const mockUsers: SearchUser[] = [
    {
        id: "user-1",
        name: "Alex Johnson",
        username: "alexj",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    },
    {
        id: "user-2",
        name: "Sarah Miller",
        username: "sarah_dev",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    },
    {
        id: "user-3",
        name: "David Chen",
        username: "davidc_ui",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    },
    {
        id: "user-4",
        name: "Emma Watson",
        username: "emma_design",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop",
    },
    {
        id: "user-5",
        name: "Michael Brown",
        username: "mbrown_tech",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    },
];

const SearchRes = () => {
    return (
        <>
            <div className="flex flex-col gap-3 w-full items-start">
                {mockUsers.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                        <Avatar className="w-13 h-13">
                            <AvatarImage src={item.avatar} alt={item.name} />
                            <AvatarFallback>{item.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1 items-start justify-center">
                            <span className="text-sm text-primary">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.username}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SearchRes