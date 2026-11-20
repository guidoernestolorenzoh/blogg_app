import {
  Camera,
  CircleFill,
  EllipsisVertical,
  SealCheck,
} from "@gravity-ui/icons";
import Banner from "../../assets/banner_author_profile.png";
import Profile from "../../components/Profile";
import TabsAuthors from "../../components/TabsAuthors";
import Image from "../../components/Image";
import { useAuthStore } from "../../store/useAuthStore";
import { usePostStore } from "../../store/usePostStore";
import { useEffect, useRef, useState } from "react";
import { Button, Chip, Dropdown, Label, toast } from "@heroui/react";

const ProfileInfo = () => {
  const { user } = useAuthStore();
  const { posts, fetchPosts } = usePostStore();
  const { loadUser } = useAuthStore();
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selectImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const promesa = uploadImage(file);
    toast.promise(promesa, {
      loading: "Subiendo imagen",
      success: "Avatar actualizado",
      error: (err) => err.message,
    });
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/auth/avatar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al subir la imagen");
    console.log(data);

    await loadUser();
    return data;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const myPost = posts.filter(
    (p) => (p?.author?._id || p?.author) === user?._id,
  );

  return (
    <div className="flex flex-col ml-5">
      {/* Banner */}
      <Image src={Banner} className="h-80 w-full object-cover" alt="Banner" />

      <div className="flex justify-between items-center">
        <div className="flex items-start relative gap-4 px-8 -mt-16">
          <div className="relative">
            <Profile
              user={user}
              src={user?.avatar}
              isOpen={false}
              className="w-32 h-32 ring-4 text-5xl object-cover ring-white rounded-full shrink-0"
            />
            <Button
              onPress={() => fileInputRef.current?.click()}
              className="w-8 h-8 absolute bottom-0 left-18.25 ring-2 text-5xl ring-white rounded-full shrink-0"
            >
              <Camera />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={selectImage}
              style={{ display: "none" }}
              aria-label="Seleccionar archivos para subir"
            />
          </div>
          <div className="flex flex-col pt-16 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <span className="text-3xl font-semibold">{user?.name}</span>
                <SealCheck className="size-6 text-blue-500 mt-1" />
              </div>
            </div>
            <span className="text-md font-light text-muted">{user?.title}</span>
            <span className="text-xs font-light text-muted">{user?.email}</span>
          </div>
        </div>

        <div className="flex items-center">
          <Chip
            variant="tertiary"
            className="text-accent-soft-foreground gap-1 border-3 mr-2 border-accent rounded-full"
          >
            <CircleFill width={6} className="animate-ping" />
            <Chip.Label className="text-sm capitalize">
              {user?.role || ""}
            </Chip.Label>
          </Chip>
          <Dropdown isOpen={open} onOpenChange={setOpen}>
            <Button isIconOnly aria-label="Menu" variant="secondary">
              <EllipsisVertical className="outline-none" />
            </Button>
            <Dropdown.Popover placement="bottom right">
              <Dropdown.Menu>
                <Dropdown.Item id="new-file" textValue="New file">
                  <Label>Change Password</Label>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      {/* Tabs My Profile */}
      <TabsAuthors showPersonalInfo about={user?.bio} posts={myPost} />
    </div>
  );
};

export default ProfileInfo;
