import { Button, Separator, Spinner } from "@heroui/react";
import Follow from "../../components/Follow";
import Profile from "../../components/Profile";
import { Heart, Comment, NodesRight, CircleMinusFill } from "@gravity-ui/icons";
import Image from "../../components/Image";
import { usePostStore } from "../../store/usePostStore";
import { timeAgo } from "../../utils";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const {posts, fetchPosts, loading} = usePostStore();

  useEffect(() => {
    fetchPosts()
  }, [])
  
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
    if (!posts)
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex gap-2">
            <CircleMinusFill />
            <span>No hay posts para mostrar</span>
          </div>
        </div>
      );
  return (
    <>
      {posts.map((p) => (
        <div key={p._id} className="flex flex-col  mx-auto px-4">
          <div className="flex justify-between max-w-7xl mx-16 items-center">
            <div className="flex flex-col">
              <div className="flex items-center my-5 gap-2">
                <div className="flex items-center gap-4">
                  <Profile
                    user={p?.author}
                    src={p?.author?.avatar}
                    isOpen={false}
                  />
                  <span className="text-lg">{p?.author?.name}</span>
                </div>
                <span className="text-xl text-green-400">•</span>
                <span className="text-lg text-gray-500">{timeAgo(p.createdAt)}</span>
              </div>
            </div>

            <Follow />
          </div>

          <div className="my-2">
            {/* title */}
            <div className="flex flex-col mx-16 ">
              <h1 className="text-3xl font-bold mb-5">{p?.title}</h1>

              <p className="text-xl text-justify mb-5">
                {p?.excerpt}
                <Link to={`/post/${p._id}`}>
                  <span className="text-green-400 mx-2 cursor-pointer">
                    (See more...)
                  </span>
                </Link>
              </p>

              {p.coverImage && (
              <Image
                src={p?.coverImage}
                className="h-105 rounded-4xl"
                alt={p?.title}
              />)}

              <div className="flex justify-between mt-2 items-center">
                <div className="flex items-center gap-1 text-lg">
                  <Button variant="ghost">
                    <Heart className="size-6 text-gray-500" />
                  </Button>
                  <Button variant="ghost">
                    <Comment className="size-6 text-gray-500" />
                  </Button>
                  <Button variant="ghost">
                    <NodesRight className="size-6 text-gray-500" />
                  </Button>
                </div>
                <div className="flex items-center text-gray-400 gap-2">
                  <span>{p?.likes} likes</span>
                  <span className="text-xl">•</span>
                  <span>{p?.comments} comments</span>
                  <span className="text-xl">•</span>
                  <span>{p?.shares} shares</span>
                </div>
              </div>
              <Separator className="mt-4" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Home;
