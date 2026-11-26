import { Link } from "react-router-dom";
import Profile from "./Profile"
import { Label } from "@heroui/react";
import { timeAgo } from "../utils";
import { Eye, Heart, Comment, NodesRight } from "@gravity-ui/icons";


const RelatedContent = ({post}) => {
    
  return (
    <div>
        <div className="flex flex-rows items-center justify-between gap-2">
          {post.map((u) => (
            <Link key={u._id} to={`/post/${u._id}`}>
              <div className="flex items-center justify-between my-2 mx-4 rounded-lg p-1">
                <div className="flex gap-4 items-start">
                  <Profile
                    className="rounded-lg mt-1 h-13 w-13"
                    size="lg"
                    title={u.title}
                    alt={u.title}
                    src={u?.coverImage}
                    isOpen={false}
                  />

                  <div className="flex flex-col">
                    <Label className="w-60 truncate font-bold cursor-pointer text-lg">
                      {u.title}
                    </Label>
                    <div className="text-sm font-semibold dark:text-gray-200">
                      {u?.author?.name}
                    </div>
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
              </div>
            </Link>
          ))}
        </div>
    </div>
  )
}

export default RelatedContent