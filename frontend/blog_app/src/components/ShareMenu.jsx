import { useState } from "react";
import { Button, Chip, Dropdown, toast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Check, Copy, NodesRight } from "@gravity-ui/icons";
import Image from "./Image";
import { usePostStore } from "../store/usePostStore";

const ShareMenu = ({ post }) => {
  const { sharePost } = usePostStore();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/post/${post?._id}`;
  const title = post?.title || "";

  const handleTrigger = async () => {
    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      try {
        await navigator.share({ title, text: title, url });
        await sharePost(post._id);
      } catch (error) {
        if (error?.name !== "AbortError") console.error(error);
      }
      return;
    }
    setIsOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado");
      await sharePost(post._id);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const socials = [
    {
      name: "WhatsApp",
      icon: "simple-icons:whatsapp",
      bg: "bg-[#25D366]",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
      name: "Facebook",
      icon: "simple-icons:facebook",
      bg: "bg-[#1877F2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "X",
      icon: "simple-icons:x",
      bg: "bg-black",
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      icon: "simple-icons:telegram",
      bg: "bg-[#229ED9]",
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ];

  const handleSocial = async (href) => {
    window.open(href, "_blank", "noopener,noreferrer");
    try {
      await sharePost(post._id);
    } catch (error) {
      console.error(error);
    }
    setIsOpen(false);
  };

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button variant="ghost" onPress={handleTrigger} aria-label="Compartir">
        <NodesRight className="size-6 text-gray-500" />
      </Button>
      <Dropdown.Popover
        placement="bottom right"
        className="w-[calc(100vw-2rem)] sm:w-96"
      >
        <div className="rounded-xl bg-white p-4 shadow-lg shadow-gray-800 border-2 text-zinc-900 dark:bg-zinc-900 dark:text-white">
          {/* Preview del post */}
          <div className="flex gap-3">
            {post?.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br from-green-500 to-emerald-700 text-2xl font-bold text-white">
                {title.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              {post?.category?.name && (
                <Chip size="sm" className="mb-1">
                  {post.category.name}
                </Chip>
              )}
              <p className="truncate font-semibold">{title}</p>
              <p className="truncate text-sm text-gray-600 dark:text-gray-400">
                {post?.author?.name}
              </p>
            </div>
          </div>

          {/* Barra del link con Copy */}
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-sm text-zinc-700 dark:text-gray-200">
              {url}
            </span>
            <Button
              size="sm"
              onPress={handleCopy}
              className={copied ? "bg-green-500 text-white" : ""}
            >
              {copied ? (
                <>
                  <Check /> Copied
                </>
              ) : (
                <>
                  <Copy /> Copy
                </>
              )}
            </Button>
          </div>

          {/* 4 redes en círculos */}
          <div className="mt-4 flex justify-around">
            {socials.map((s) => (
              <Button
                key={s.name}
                isIconOnly
                radius="full"
                aria-label={s.name}
                onPress={() => handleSocial(s.href)}
                className={`${s.bg} dark:text-white text-gray-800 ring-1 ring-white/20`}
              >
                <Icon icon={s.icon} className="size-5" />
              </Button>
            ))}
          </div>
        </div>
      </Dropdown.Popover>
    </Dropdown>
  );
};

export default ShareMenu;
