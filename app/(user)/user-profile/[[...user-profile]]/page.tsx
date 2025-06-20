import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  return (
    <div className=" my-20 flex flex-col items-center justify-center h-screen">
      <UserProfile />
    </div>
  );
}