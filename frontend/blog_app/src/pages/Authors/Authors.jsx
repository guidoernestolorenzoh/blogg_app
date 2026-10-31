import {
  Button,
  Description,
  Label,
  Spinner
} from "@heroui/react";
import { Persons, PencilToLine, HeartFill } from "@gravity-ui/icons";
import Follow from "../../components/Follow";
import Profile from "../../components/Profile";
import { usePostStore } from "../../store/usePostStore";
import { useEffect } from "react";



const Authors = () => {
  const { posts, loading, fetchPosts } = usePostStore();
  const autores = [...new Map(
    posts
      .filter((p) => p.author)
      .map((p) => [p.author._id, p.author])
  ).values()];

  useEffect(() => {
    fetchPosts();
  }, []);
  

  

  return (
    <div className="flex flex-col ml-10">
      <h1 className="text-4xl font-semibold mt-2">Authors</h1>
      <p className="mt-6 text-justify text-lg">
        Aquí están nuestros autores, puedes seguirlos para q no te pierdas
        ningunos de sus artículos, puede ser que hoy recibas alimento a tu alma.
      </p>

      <div className="flex justify-center items-center">
        <ul className="flex flex-wrap gap-2 mt-4">
          {autores.map((author) => {
             const postsDelAutor = posts.filter((p) => p.author?._id === author._id);
             const numPosts = postsDelAutor.length;
             const totalLikes = postsDelAutor.reduce((acc, p) => acc + (p.likes || 0), 0);
            return (
            <li
              key={author._id}
              className="flex items-center justify-between shrink-0 bg-zinc-100 max-w-lg rounded-4xl my-2 mx-4 px-8 py-6 dark:text-gray-300 dark:bg-zinc-900 border bg-linear-to-br from-accent/5 via-surface to-surface-secondary shadow-lg shadow-accent/5 dark:border-accent/10 dark:from-accent/10 dark:via-surface dark:to-accent/8 dark:shadow-accent/5"
            >
              <div className="flex gap-4 items-center">
                <div className="flex flex-col items-center space-y-4">
                  <Profile user={author} src={author?.avatar} isOpen={false} className="text-5xl bg-blue-400 size-40 rounded-full text-white cursor-pointer"/>

                  {/* Follow Button */}
                  <div className="flex gap-2">
                    <Follow className="w-20 px-4 py-2 max-w-36 bg-zinc-100 text-accent border border-blue-500 dark:bg-accent/10 dark:text-blue-400"/>
                    <Button className="w-20 bg-zinc-100 text-accent border border-blue-500 dark:bg-accent/10 dark:text-blue-400">Ver Perfil</Button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <Label className="text-3xl w-64 overflow-hidden text-ellipsis whitespace-nowrap">
                    {author?.name}
                  </Label>
                  <Description>{author?.email}</Description>
                  <span className="my-2 text-lg">{author?.role}</span>
                  <div className="flex items-center justify-evenly text-lg gap-2">
                    <div className="flex text-[#5893f1] items-center text-lg gap-2">
                      <Persons />
                      <span className="">6k</span>
                    </div>
                    <div className="flex text-[#EF4444] items-center text-lg gap-2">
                      <HeartFill />
                      <span className="">{totalLikes}</span>
                    </div>
                    <div className="flex text-[#6d3799] items-center text-lg gap-2">
                      <PencilToLine />
                      <span className="">{numPosts}</span>
                    </div>
                  </div>
                  <p className="my-2 text-sm text-justify">{`${author?.name} es un siervo de Dios comprometido con compartir el amor de Cristo. A través de sus escritos busca inspirar, enseñar y fortalecer la fe de quienes lo leen.`}</p>
                </div>
              </div>
            </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Authors;

