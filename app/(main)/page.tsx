import MyCard from "@/components/myComponents/MyCard";
import QuickPost from "@/components/myComponents/QuickPost";


export default function Home() {
  return (
    <>
      <div className="flex flex-col p-3 gap-3">
        <QuickPost />
        <div className="flex flex-col overflow-y-auto">
        {initialPostsData.map((item: Post) => (
          <MyCard key={item.id} post={item} />
        ))}
        </div>
      </div>
    </>
  );
}

export interface Post {
  id: string;
  name: string;
  userName: string;
  userAvatar: string;
  postDescription: string;
  postImage?: string;
  createdAt: string;
  numberOfLikes: number;
  numberOfComments: number;
  numberOfShares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  repost: number;
}

export const initialPostsData: Post[] = [
  {
    id: "post-1",
    name: "Ali Al-Hamawy",
    userName: "@alialhamawy",
    userAvatar: "https://github.com/shadcn.png",
    postDescription: "Just finished refactoring the navigation bar layout with custom Framer Motion hover effects and circular view transitions! 🚀✨",
    createdAt: "10 mins ago",
    numberOfLikes: 34,
    numberOfComments: 6,
    numberOfShares: 2,
    isLiked: true,
    isBookmarked: false,
    repost: 33,
  },
  {
    id: "post-2",
    name: "Mohammed Al-Hamawy",
    userName: "@mohammed_dev",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    postDescription: "Working on Next.js 15 App Router architecture with Redux Toolkit. Building scalable state slices makes dashboard management so much cleaner! 🔥",
    createdAt: "2 hours ago",
    numberOfLikes: 89,
    numberOfComments: 14,
    numberOfShares: 8,
    isLiked: false,
    isBookmarked: true,
    repost: 30,
  },
  {
    id: "post-3",
    name: "Sarah Jenkins",
    userName: "@sarah_design",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    postDescription: "Minimalist dark mode UIs with subtle borders and clean typography will always be my favorite design trend. What do you think?",
    createdAt: "5 hours ago",
    numberOfLikes: 156,
    numberOfComments: 23,
    numberOfShares: 12,
    isLiked: false,
    isBookmarked: false,
    repost: 10,
  },
  {
    id: "post-4",
    name: "Tech Pulse",
    userName: "@techpulse",
    userAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
    postDescription: "Tailwind CSS v4 is bringing native CSS variable integration and lightning-fast build performance with Rust-powered engine performance! ⚡",

    createdAt: "1 day ago",
    numberOfLikes: 312,
    numberOfComments: 45,
    numberOfShares: 54,
    isLiked: true,
    isBookmarked: true,
    repost: 100,
  },
  {
    id: "post-5",
    name: "Tech Pulse",
    userName: "@techpulse",
    userAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
    postDescription: "Tailwind CSS v4 is bringing native CSS variable integration and lightning-fast build performance with Rust-powered engine performance! ⚡",

    createdAt: "1 day ago",
    numberOfLikes: 312,
    numberOfComments: 45,
    numberOfShares: 54,
    isLiked: true,
    isBookmarked: true,
    repost: 100,
  }
];