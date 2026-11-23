import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarBasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-12">
        <AvatarImage src="https://i.pravatar.cc/150?img=47" alt="Maya Chen" />
        <AvatarFallback>MC</AvatarFallback>
      </Avatar>
      <Avatar className="size-10">
        <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Leo Park" />
        <AvatarFallback>LP</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="Ines Duarte" />
        <AvatarFallback>ID</AvatarFallback>
      </Avatar>
      {/* A broken URL shows the fallback. */}
      <Avatar className="size-10">
        <AvatarImage src="/missing-avatar.png" alt="Sam Okafor" />
        <AvatarFallback>SO</AvatarFallback>
      </Avatar>
      <Avatar className="size-10 rounded-lg">
        <AvatarFallback className="rounded-lg">DU</AvatarFallback>
      </Avatar>
    </div>
  );
}
