"use client";

import * as React from "react";
import { Check, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHoverCard, type ProfileUser } from "@/components/dusk/hover-card/profile-hover-card";

const ada: ProfileUser = {
  name: "Ada Kim",
  handle: "adakim",
  avatarUrl: "https://i.pravatar.cc/150?img=47",
  verified: true,
  bio: "Design engineer. Spring physics, variable fonts and very small details.",
  location: "Berlin",
  joined: "Joined March 2021",
  stats: [
    { label: "Followers", value: "12.4k" },
    { label: "Following", value: "318" },
    { label: "Components", value: "64" },
  ],
};

const leo: ProfileUser = {
  name: "Leo Park",
  handle: "leopark",
  // No avatar: the initials show instead.
  bio: "Frontend at a small studio. Writes about accessibility and motion.",
  location: "Seoul",
  stats: [
    { label: "Followers", value: "2,091" },
    { label: "Following", value: "77" },
  ],
};

function FollowButton() {
  const [following, setFollowing] = React.useState(false);
  return (
    <Button
      size="sm"
      variant={following ? "outline" : "default"}
      aria-pressed={following}
      onClick={() => setFollowing((f) => !f)}
    >
      {following ? <Check /> : <UserPlus />}
      {following ? "Following" : "Follow"}
    </Button>
  );
}

const mention =
  "rounded-sm font-medium text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50";

export default function ProfileHoverCardDemo() {
  return (
    <p className="max-w-md text-center text-sm leading-7 text-muted-foreground">
      Reviewed by{" "}
      <ProfileHoverCard user={ada} action={<FollowButton />}>
        <a href="#" className={mention}>
          @adakim
        </a>
      </ProfileHoverCard>{" "}
      and{" "}
      <ProfileHoverCard user={leo} action={<FollowButton />}>
        <a href="#" className={mention}>
          @leopark
        </a>
      </ProfileHoverCard>
      . Hover or focus a name to see their profile.
    </p>
  );
}
