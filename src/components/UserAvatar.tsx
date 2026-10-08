import { Avatar } from "@chakra-ui/react";

// rondje met foto of initialen van een gebruiker
interface UserAvatarProps {
  name: string;
  src?: string | null;
  size?: "2xs" | "xs" | "sm" | "md" | "lg";
}

export default function UserAvatar({ name, src, size = "sm" }: UserAvatarProps) {
  return (
    <Avatar.Root colorPalette="purple" flexShrink={0} size={size} variant="subtle">
      <Avatar.Fallback name={name} />
      {src && <Avatar.Image src={src} />}
    </Avatar.Root>
  );
}
