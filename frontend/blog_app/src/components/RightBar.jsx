import Search from "./Search";
import { useTheme } from "../store/useThemeStore";
import {
  Description,
  Label,
  Separator,
  Button,
  Tooltip,
  Chip,
} from "@heroui/react";
import {
  CircleMinusFill,
  CirclePlus,
  Heart,
  Comment,
  NodesRight,
  Eye,
} from "@gravity-ui/icons";
import { timeAgo } from "../utils";
import Profile from "./Profile";
import { usePostStore } from "../store/usePostStore";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const RightBar = () => {
  const { theme } = useTheme();
  const { posts, fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  const totalLikesPorAutor = (autor) =>
    posts
      .filter((p) => (p.author?._id || p.author) === autor._id)
      .reduce((suma, p) => suma + (p.likes || 0), 0);

  const autores = [
    ...new Map(
      posts.filter((p) => p.author).map((p) => [p.author._id, p.author]),
    ).values(),
  ]
    .sort((a, b) => totalLikesPorAutor(b) - totalLikesPorAutor(a))
    .slice(0, 4);

  const categorias = [
    ...new Map(
      posts.filter((p) => p.category).map((p) => [p.category._id, p.category]),
    ).values(),
  ];

  const blogsOrdenados = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  if (!posts)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <CircleMinusFill />
          <span>No hay posts para mostrar</span>
        </div>
      </div>
    );

  return (
    <aside className="h-full w-96 bg-white shrink-0 text-black shadow-md flex flex-col px-6 pt-6 z-30 dark:bg-[#121212] border-l border-gray-100 overflow-y-auto min-h-0 dark:border-gray-800">
      <div className="flex flex-col">
        {/* search */}
        <Search
          theme={theme}
          placeholder="Search here..."
          iconPosition="top-[20px] left-[12PX]"
          inputClassName="bg-white text-black border border-gray-200 dark:text-white dark:bg-zinc-800 dark:border-zinc-700"
        />

        {/* recommended you follow */}
        <div className="mx-2 mt-6 mb-2">
          <p className="font-semibold w-full text-lg text-gray-700 dark:text-white">
            Recommended you follow
          </p>
        </div>

        {/* list followers */}
        <ul className="flex flex-col gap-2">
          {autores.map((f) => (
            <li
              key={f._id}
              className="flex items-center justify-between my-2 mx-4 rounded-lg p-1"
            >
              <div className="flex gap-4 items-center">
                <Profile
                  user={f}
                  src={f?.avatar}
                  isOpen={false}
                  className="object-cover"
                />

                <div className="flex flex-col min-w-44 max-w-44">
                  <Label>{f.name}</Label>
                  <Description className="line-clamp-2">{f.bio}</Description>
                </div>

                <Tooltip delay={0}>
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-gray-800 cursor-pointer dark:text-gray-200"
                  >
                    <CirclePlus className="size-6" />
                  </Button>
                  <Tooltip.Content showArrow>
                    <Tooltip.Arrow />
                    <p className="m-1">Follow</p>
                  </Tooltip.Content>
                </Tooltip>
              </div>
            </li>
          ))}
        </ul>

        {/* see more */}
        <div className="mx-2 mt-2 mb-5">
          <Link
            to="/authors"
            className="w-full cursor-pointer text-sm text-green-500 dark:text-green-300"
          >
            See more authors...
          </Link>
        </div>

        <Separator />

        {/* recent uploaded posts */}
        <div className="mx-2 mt-6 mb-2">
          <p className="font-semibold w-full text-lg text-gray-700 dark:text-white">
            Recent uploaded posts
          </p>
        </div>

        {/* list uploaded posts */}
        <ul className="flex flex-col gap-2">
          {blogsOrdenados.map((u) => (
            <Link key={u._id} to={`/post/${u._id}`}>
              <li className="flex items-center justify-between my-2 mx-4 rounded-lg p-1">
                <div className="flex gap-4 items-start">
                  <Profile
                    className="rounded-lg mt-1 h-13 w-13"
                    size="lg"
                    title={u.title}
                    alt={u.title}
                    user={u}
                    src={u?.coverImage}
                    isOpen={false}
                  />

                  <div className="flex flex-col">
                    <Label className="line-clamp-2 cursor-pointer text-md">
                      {u.title}
                    </Label>
                    <div className="text-sm font-light dark:text-gray-200">
                      {timeAgo(u?.createdAt)}
                    </div>

                    <div className="flex justify-between mt-2 items-center">
                      <div className="flex items-center gap-5 text-lg">
                        <div className="flex gap-2">
                          <Eye className="size-4 text-gray-500" />
                          <span className="text-muted text-xs">{u.views}</span>
                        </div>
                        <div className="flex gap-2">
                          <Heart className="size-4 text-gray-500" />
                          <span className="text-muted text-xs">{u.likes}</span>
                        </div>
                        <div className="flex gap-2">
                          <Comment className="size-4 text-gray-500" />
                          <span className="text-muted text-xs">
                            {u.comments}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <NodesRight className="size-4 text-gray-500" />
                          <span className="text-muted text-xs">{u.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
        {/* see more */}
        <div className="mx-2 mt-2 mb-5">
          <Link
            to="/blogs"
            className="w-full cursor-pointer text-sm text-green-500 dark:text-green-300"
          >
            See more posts...
          </Link>
        </div>

        <Separator />

        {/* recommended topics */}
        <div className="mx-2 mt-6 mb-2">
          <p className="font-semibold w-full text-lg text-gray-700 dark:text-white">
            Categorias
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10">
          {categorias.map((p) => (
            <Link key={p._id} to={`/category/${p.slug}`}>
              <Chip                
                variant="primary"
                size="lg"
                className="cursor-pointer"
              >
                <Chip.Label>{p.name}</Chip.Label>
              </Chip>            
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightBar;
