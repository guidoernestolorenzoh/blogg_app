import {
  CircleMinusFill,
  Comment,
  Eye,
  Heart,
  HeartFill,
} from "@gravity-ui/icons";
import { timeAgo } from "../../utils";
import { Button, Card, Chip, Label, Spinner } from "@heroui/react";
import Profile from "../../components/Profile";
import { Link, useNavigate } from "react-router-dom";
import { usePostStore } from "../../store/usePostStore";
import { useEffect, useState } from "react";
import Image from "../../components/Image";
import { useAuthStore } from "../../store/useAuthStore";
import ShareMenu from "../../components/ShareMenu";

const Blogs = () => {
  const { posts, fetchPosts, loading, likePost, hasMore } = usePostStore();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [likingId, setLikingId] = useState(null);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLike = async (postId) => {
    if (!token) return navigate("/login");
    if (likingId) return;
    setLikingId(postId);
    try {
      await likePost(postId);
    } catch (error) {
      console.error(error);
    } finally {
      setLikingId(null);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchPosts(page + 1);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const categoryColors = {
    "Enseñanzas Bíblicas": "bg-indigo-400",
    "Predicas": "bg-red-400",
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  if (posts.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <CircleMinusFill />
          <span>No hay posts para mostrar</span>
        </div>
      </div>
    );

  const blogsOrdenados = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  return (
    <div className="flex flex-col max-w-7xl mx-16">
      <h1 className="text-4xl font-semibold mt-2">Blogs</h1>
      <p className="mt-6 text-justify text-lg">
        Aquí están todos nuestros artículos publicados, puedes revisarlos, darle
        likes y recibir bendiciones a través de ellos.
      </p>

      <div className="flex items-center flex-col">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 mt-4">
          {blogsOrdenados.map((u) => {
            const liked = u.likedBy?.some(
              (id) => id.toString() === user?._id?.toString(),
            );
            return (
              <Card
                key={u._id}
                className="w-full overflow-hidden shadow-lg p-0"
              >
                {u?.coverImage ? (
                  <Image
                    src={u?.coverImage}
                    alt={u?.title}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 flex items-center justify-center bg-linear-to-br from-green-500 to-emerald-700 text-white text-6xl font-bold">
                    {u.title?.trim()?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex items-start flex-col justify-between m-2 rounded-lg px-4">
                  {u?.category?.name && (
                    <Chip
                      className={`text-md ${categoryColors[u?.category?.name]} text-white`}
                    >
                      {u?.category?.name}
                    </Chip>
                  )}

                  <div className="space-y-3">
                    <div>
                      <Label className="line-clamp-2 mt-3 cursor-pointer text-justify text-lg">
                        {u.title}
                      </Label>
                    </div>
                    <div className="text-xs my-2 text-muted font-light dark:text-gray-200">
                      {timeAgo(u?.createdAt)}
                    </div>
                    <div className="flex flex-col space-y-3">
                      <p className="text-md text-muted text-justify max-w-lg line-clamp-3">
                        {u?.excerpt}
                      </p>
                      <Link to={`/post/${u._id}`}>
                        <span className="text-green-400 cursor-pointer">
                          See more...
                        </span>
                      </Link>
                    </div>

                    <div className="flex items-center mt-4 gap-4">
                      <Profile
                        user={u?.author}
                        src={u?.author?.avatar}
                        isOpen={false}
                      />
                      <div className="flex flex-col">
                        <span className="text-lg">{u?.author?.name}</span>
                        <span className="text-sm text-muted">
                          {u?.author?.title}
                        </span>
                      </div>
                    </div>
                    {/* views likes shares */}
                    <div className="flex flex-col mt-2 ">
                      <div className="flex items-center justify-evenly gap-1 text-lg">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:opacity-100"
                          >
                            <Eye className="size-5 text-gray-500" />
                          </Button>
                          <span className="text-sm text-muted">{u?.views}</span>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            onPress={() => handleLike(u._id)}
                            isDisabled={likingId === u._id}
                            className="hover:bg-transparent hover:opacity-100"
                          >
                            {liked ? (
                              <HeartFill className="size-6 text-red-500" />
                            ) : (
                              <Heart className="size-6 text-gray-500" />
                            )}
                          </Button>
                          <span className="text-sm text-muted">{u?.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:opacity-100"
                          >
                            <Comment className="size-5 text-gray-500" />
                          </Button>
                          <span className="text-sm text-muted">
                            {u?.comments}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <ShareMenu post={u} />
                          <span className="text-sm text-muted">
                            {u?.shares}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            className="border mt-6 right-2 border-blue-500  text-blue-500"
            onPress={handleLoadMore}
            isDisabled={loadingMore}
          >
            {loadingMore ? "Cargando..." : "Cargar más"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Blogs;
