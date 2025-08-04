import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  avatarUrl?: string;
  displayName?: string;
  username?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UserAvatar = ({ 
  avatarUrl, 
  displayName, 
  username, 
  size = "md",
  className = ""
}: UserAvatarProps) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-10 h-10 text-base"
  };

  const name = displayName || username || 'Аноним';
  const initials = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={avatarUrl} alt={`${name} avatar`} />
      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};