import { useState, useRef, useEffect } from "react";
import Profile from "./Profile";
import { commentsData, followers, formatDate, timeAgo } from "../utils";
import {
  ArrowUturnCwRight,
  Heart,
  NodesRight,
  Persons,
  ThumbsUp,
  ThumbsUpFill,
  Comment,
  Eye,
  FloppyDisk,
  CircleFill,
} from "@gravity-ui/icons";
import { Button, Chip, Label, toast } from "@heroui/react";
import Follow from "./Follow";
import Image from "./Image";
import Input from "../../src/components/Inputs/Input";
import { useAuthStore } from "../store/useAuthStore";
import { profileSchema } from "../schemas/profileSchema";

const TabsAuthors = ({
  posts,
  following = followers,
  comments = commentsData,
  about,
  showPersonalInfo = false,
  showAbout = false,
}) => {
  const [activeTab, setActiveTab] = useState(showPersonalInfo ? "personalInfo" : "posts", showAbout ? "about" : "");
  const [sortBy, setSortBy] = useState("short");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", title: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const dropdownRef = useRef(null);
  const { user, loadUser } = useAuthStore();

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBlur = (field) => () => {
    const result = profileSchema.shape[field].safeParse(form[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: result.success
        ? undefined
        : result.error.issues.map((i) => i.message),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    const promise = (async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Error al actualizar el perfil");

      await loadUser();
      return data;
    })();

    toast.promise(promise, {
      loading: "Guardando cambios",
      success: "Perfil actualizado",
      error: (err) => err.message,
    });

    try {
      await promise;
    } catch {
      /* el toast ya mostró el error */
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        title: user.title || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const tabs = [
    ...(showPersonalInfo
    ? [
        {
          id: "personalInfo",
          label: "Personal Information",
          content: (
            <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 w-full text-sm font-medium text-gray-400">
                <div className="flex gap-1">
                  Full Name
                  <span className="text-red-500">*</span>
                </div>
                <div className="relative w-full">
                  <Input
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                    required
                    placeholder="Full name"
                    className="transition-all w-full rounded-full border outline-0 border-gray-200 bg-white py-3.5 pl-6 text-sm text-gray-700 dark:bg-zinc-900 dark:border dark:border-zinc-700 dark:text-gray-200 dark:outline-0"
                  />
                  {errors.name?.[0] && (
                    <p className="text-sm mt-3 ml-3 text-red-500">
                      {errors.name[0]}
                    </p>
                  )}
                </div>
              </label>

              <label className="flex flex-col gap-2 w-full text-sm font-medium text-gray-400">
                <div className="flex gap-1">
                  Title                 
                </div>
                <div className="relative w-full">
                  <Input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange("title")}
                    placeholder="Ej. Fotógrafo"
                    className="transition-all w-full rounded-full border outline-0 border-gray-200 bg-white py-3.5 pl-6 text-sm text-gray-700 dark:bg-zinc-900 dark:border dark:border-zinc-700 dark:text-gray-200 dark:outline-0"
                  />
                </div>
              </label>
            </div>

            <div className="">
              {/* Your Bio */}
              <label className="flex flex-col gap-2 text-sm font-medium text-gray-400">
                <div className="flex gap-1">Bio</div>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange("bio")}
                  rows={4}
                  placeholder="Cuéntanos sobre ti..."
                  className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-400 dark:bg-zinc-900 dark:border dark:border-zinc-700 dark:text-gray-200"
                />
              </label>

            </div>
              {/* button submit */}
              <Button isDisabled={saving} type="submit">
                <FloppyDisk />
                <span>{saving ? "Guardando..." : "Guardar"}</span>
              </Button>
            </form>
          ),
        },
      ]
    : []),
    {
      id: "posts",
      label: "Posts",
      content: (
        <div className="">
          {/* list uploaded blogs */}
          <ul className="flex flex-col gap-2">
            {posts &&
              posts.map((u) => (
                <li
                  key={u._id}
                  className="flex items-center justify-between my-2 mx-4 rounded-lg p-1"
                >
                  <div className="flex gap-4 items-center">
                    <Profile
                      user={u}
                      src={u?.coverImage}
                      className="rounded-lg"
                      size="lg"
                      isOpen={false}
                      title={u.title}
                      alt={u.title}
                    />

                    <div className="flex flex-col">
                      <Label className="line-clamp-2 text-xl max-w-2xl text-ellipsis">
                        {u?.title}
                      </Label>
                      <div className="text-lg font-light dark:text-gray-200">
                        {formatDate(u?.createdAt)}
                      </div>
                      <div className="flex justify-between mt-2 items-center">
                        <div className="flex items-center gap-5 text-lg">
                          <div className="flex gap-2">
                            <Eye className="size-4 text-gray-500" />
                            <span className="text-muted text-xs">
                              {u.views}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Heart className="size-4 text-gray-500" />
                            <span className="text-muted text-xs">
                              {u.likes}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Comment className="size-4 text-gray-500" />
                            <span className="text-muted text-xs">
                              {u.comments}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <NodesRight className="size-4 text-gray-500" />
                            <span className="text-muted text-xs">
                              {u.shares}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ),
    },
    ...(showAbout
      ? [
    {
      id: "about",
      label: "About",
      content: (
        <div className="flex flex-col my-4 gap-4">
          <h1 className="text-4xl font-semibold mb-4">About me</h1>

          {/* <Image
            className="object-cover rounded-2xl h-130 w-full mb-4"
            src="https://static.vecteezy.com/system/resources/previews/075/317/752/non_2x/a-man-sitting-at-a-desk-with-a-map-and-a-computer-photo.jpg"
          /> */}

          <p className="text-justify text-lg">{about}</p>

          {/* followers following */}
          <div className="flex items-center gap-2">
            <div className="flex text-muted items-center text-lg gap-2">
              <Persons />
              <span className="">5k Followers</span>
            </div>
            <span className="text-muted"> - </span>
            <div className="flex text-muted items-center text-lg gap-2">
              <Persons />
              <span className="">5k Following</span>
            </div>
          </div>
        </div>
      ),
    }] : []),
    {
      id: "following",
      label: "Following",
      content: (
        <>
          {following.map((f) => (
            <div className="flex justify-between my-8">
              <div className="flex items-start gap-5">
                <Profile
                  user={f}
                  src={f.imageProfile}
                  isOpen={false}
                  className="cursor-pointer rounded-full h-12 w-12 bg-blue-400 text-white"
                />
                <div className="flex flex-col gap-1 max-w-4xl">
                  <div className="text-xl font-semibold">{f.name}</div>
                  <div className="text-muted dark:text-gray-400">
                    <p className="text-justify">{f.description}</p>
                  </div>
                </div>
              </div>

              {/* follow */}
              <Follow className="button-outline-rounded" />
            </div>
          ))}
        </>
      ),
    },
    {
      id: "comments",
      label: "Comments",
      content: (
        <div className="flex flex-col gap-6 my-4">
          {comments.map((c) => (
            <div key={c.id} className="flex flex-col gap-2">
              {/* Header: profile + nombre + fecha */}
              <div className="flex gap-3 items-center">
                <Profile
                  user={c?.user}
                  src={c.user.avatar}
                  isOpen={false}
                  className="cursor-pointer bg-blue-400 text-white"
                />
                <span className="text-lg">{c?.user?.name}</span>
                <span className="text-xl text-green-400">•</span>
                <span className="text-lg text-gray-500">
                  {timeAgo(c?.createdAt)}
                </span>
              </div>

              {/* Comment */}
              <p className="text-justify dark:text-gray-300">{c?.text}</p>

              {/* Likes + Reply */}
              <div className="flex justify-between items-center text-gray-400">
                <div className="flex gap-4 items-center">
                  <span>{c?.likes} likes</span>
                  <div className="flex gap-1 items-center">
                    <Button variant="ghost" className="text-gray-400">
                      <ArrowUturnCwRight />
                      <span>Reply</span>
                    </Button>
                  </div>
                </div>

                <Button variant="ghost">
                  {c?.isLiked ? (
                    <>
                      <ThumbsUpFill className="size-6 text-blue-400 dark:text-blue-500" />
                      <span className="text-blue-400 dark:text-blue-500">
                        Liked
                      </span>
                    </>
                  ) : (
                    <>
                      <ThumbsUp className="size-6 text-gray-400" />
                      <span className="text-gray-400">Like</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Replies */}
              {c.replies?.length > 0 && (
                <div className="ml-12 mt-2 flex flex-col gap-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {c.replies.map((reply) => (
                    <div key={reply.id} className="flex flex-col gap-1">
                      <div className="flex gap-2 items-center">
                        <Profile
                          user={reply.user}
                          src={reply.user.avatar}
                          isOpen={false}
                          className="cursor-pointer bg-purple-400 text-white"
                        />
                        <span className="font-medium text-sm">
                          {reply.user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {timeAgo(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {reply.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ),
    },
  ];

  const sortOptions = [
    { id: "short", label: "Short by" },
    { id: "latest", label: "Latest" },
    { id: "popular", label: "Popular" },
  ];

  const currentSort = sortOptions.find((opt) => opt.id === sortBy);

  // Cerrar el dropdown si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full mt-8">
      <div className="flex w-full justify-between items-center border-b border-gray-200 dark:border-b dark:border-gray-700">
        {/* Lado Izquierdo: Pestañas */}
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 w-20 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>

        {/* Lado Derecho: Dropdown personalizado */}
        <div className="relative pb-2" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors focus:outline-none dark:hover:text-gray-300"
          >
            {currentSort.label}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Menú desplegable */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-150 dark:bg-zinc-900 dark:text-gray-100">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSortBy(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg mx-0 transition-colors ${
                    sortBy === option.id
                      ? "bg-gray-100 text-gray-900 font-medium dark:bg-zinc-800 dark:text-zinc-200"
                      : "text-gray-600 hover:bg-gray-200/20 dark:hover:bg-zinc-800/30"
                  }`}
                  style={{
                    width: "calc(100% - 8px)",
                    marginLeft: "4px",
                    marginRight: "4px",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="pt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default TabsAuthors;
