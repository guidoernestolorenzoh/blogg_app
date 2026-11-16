import { Button, Card, Label, Spinner } from "@heroui/react";
import {
  Persons,
  PencilToLine,
  CircleMinusFill,
  Eye,
  Heart,
  SealCheck,
} from "@gravity-ui/icons";
import { usePostStore } from "../../store/usePostStore";
import { useEffect } from "react";
import Image from "../../components/Image";
import { Link } from "react-router-dom";

const Authors = () => {
  const { posts, loading, fetchPosts } = usePostStore();
  const autores = [
    ...new Map(
      posts.filter((p) => p.author).map((p) => [p.author._id, p.author]),
    ).values(),
  ];

  useEffect(() => {
    fetchPosts();
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
          <span>No hay autores para mostrar</span>
        </div>
      </div>
    );
  return (
    <div className="flex flex-col max-w-7xl mx-16">
      <h1 className="text-4xl font-semibold mt-2">Authors</h1>
      <p className="mt-6 text-justify text-lg">
        Aquí están nuestros autores, puedes seguirlos para q no te pierdas
        ningunos de sus artículos, puede ser que hoy recibas alimento a tu alma.
      </p>

      <div className="flex justify-center items-center">
        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 mt-4">
          {autores.map((author) => {
            const postsDelAutor = posts.filter(
              (p) => p.author?._id === author._id,
            );
            const numPosts = postsDelAutor.length;
            const totalLikes = postsDelAutor.reduce(
              (acc, p) => acc + (p.likes || 0),
              0,
            );
            const totalViews = postsDelAutor.reduce(
              (acc, p) => acc + (p.views || 0),
              0,
            );
            return (
              <Card key={author._id} className="shadow-lg p-0">
                <div className="flex items-center flex-col justify-between my-4 rounded-lg px-4">
                  {author?.avatar ? (
                    <Image
                      src={author?.avatar}
                      alt={author?.name}
                      className="text-5xl ring-2 ring-white bg-blue-400 size-40 object-cover rounded-full text-white cursor-pointer"
                    />
                  ) : (
                    <div className="size-40 rounded-full flex items-center justify-center bg-linear-to-br from-green-500 to-emerald-700 text-white text-6xl font-bold">
                      {author?.name?.trim()?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="space-y-3 flex justify-center items-center flex-col">
                    <div className="mt-3 flex items-center gap-3">
                      <Label className="cursor-pointer text-justify text-3xl font-bold">
                        {author.name}
                      </Label>
                      <SealCheck className="size-6 text-blue-500 mt-1" />
                    </div>
                    <div className="flex gap-2">
                      {/* Follow */}
                      <div className="flex gap-3 cursor-pointer text-sm text-green-500 dark:text-green-300">
                        <Button className="flex" variant="secondary">
                          <Persons />
                          <span>Follow</span>
                        </Button>
                      </div>

                      {/* View Profile */}
                      <Link
                        to={`/author/${author._id}`}
                        className="w-full cursor-pointer text-sm text-green-500 dark:text-green-300"
                      >
                        <Button
                          className="flex flex-wrap gap-3"
                          variant="secondary"
                        >
                          <Eye />
                          <span>View Profile</span>
                        </Button>
                      </Link>
                    </div>

                    <div className="flex flex-col space-y-3">
                      <p className="text-md text-muted text-justify max-w-lg px-4 line-clamp-3">
                        {author?.bio}
                      </p>
                    </div>

                    {/* views likes shares */}
                    <div className="flex flex-col mt-2 ">
                      <div className="flex items-center justify-evenly gap-1 text-lg">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:opacity-100"
                          >
                            <Persons className="size-5 text-gray-500" />
                          </Button>
                          <span className="text-sm text-muted">0</span>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:opacity-100"
                          >
                            <Eye className="size-5 text-gray-500" />
                          </Button>
                          <span className="text-sm text-muted">
                            {totalViews}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:opacity-100"
                          >
                            <Heart className="size-6 text-gray-500" />
                          </Button>
                          <span className="text-sm text-muted">
                            {totalLikes}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:opacity-100"
                          >
                            <PencilToLine className="size-5 text-gray-500" />
                          </Button>
                          <span className="text-md text-muted">{numPosts}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Authors;

