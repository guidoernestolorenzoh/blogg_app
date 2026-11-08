
import { Avatar, Button, Dropdown, Label, cn } from "@heroui/react";
import { AVATARITEMS } from "../utils";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";


const Profile = ({ user, theme, isOpen, className, onOpenChange, alt, size, title, src }) => {
  
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  const isAdmin = user?.role === "admin";
  const items = AVATARITEMS.filter((item) => {
    if (item.label === "Admin Panel") return isAdmin;
    return true;
  });

  const getColor = (a) => {
    if (a.isAdmin  || a.label === "Admin Panel" && isAdmin) return "text-orange-300";
    if (a.label === "Log out") return "text-red-500";
     return theme === "dark" ? "text-gray-300" : "text-gray-800"    
  }

  const handleAction = (item) => {
    if (item.label === "My Profile") {
      if (!user?._id && !user?.id) return;
    navigate(`/my-profile/${user?._id || user?.id}`);
    return;
    }
    if (item.label === "Log out") {
      logout();
    }
  }
  const fallbackLetter = (title || user?.name)?.trim()?.[0]?.toUpperCase();

  return (
    <Dropdown isOpen={isOpen} onOpenChange={onOpenChange}>
      <Dropdown.Trigger className="rounded-full">
      <Avatar className={cn("w-10 h-10 shrink-0", className)}>
          <Avatar.Image alt={alt} src={src} className={className}/>
          <Avatar.Fallback className={className}  delayMs={600}>{fallbackLetter}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className={`px-3 pt-3 pb-1 `}>
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image alt={alt} src={src} className={className} />
              <Avatar.Fallback className="bg-blue-400 text-white" delayMs={600}>{fallbackLetter}</Avatar.Fallback>
            </Avatar>
            <div className={`flex flex-col gap-0 `}>
              <p className="text-lg leading-5 font-medium">{user?.name}</p>
              <p className="text-sm leading-none text-muted">{user?.email}</p>
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          {items.map((a) => (
            <Dropdown.Item id={a.id} key={a.id} textValue={a.label} className={cn(getColor(a))}>
              <Button 
                variant="ghost"
                className={`flex w-full items-center justify-between gap-2 ${cn(getColor(a))}`}
                onClick={() => handleAction(a)}
              >
                <Label
                  className={`${cn(getColor(a))} text-sm`}
                >
                  {a.label}
                </Label>
                {a.icon && typeof a.icon === "function" && <a.icon />}
              </Button>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default Profile;