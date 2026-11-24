import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePostStore } from "../../store/usePostStore";
import {
  CircleMinusFill,
  Heart,  
  Comment,
  CircleFill,
  Eye,
  HeartFill,
  EllipsisVertical,
  PaperPlane,
  PencilToSquare,
} from "@gravity-ui/icons";
import {
  Button,
  Chip,
  cn,
  Dropdown,
  Label,
  Separator,
  Spinner,
  toast,
} from "@heroui/react";
import Profile from "../../components/Profile";
import { timeAgo } from "../../utils";
import Image from "../../components/Image";
import { useAuthStore } from "../../store/useAuthStore";
import CreatePostModal from "../../components/Modals/CreatePostModal";
import ShareMenu from "../../components/ShareMenu";

const MyPosts = () => {
  const { loading, likePost, fetchMyPosts, myPosts, publishPost } =
    usePostStore();
  const { token, user } = useAuthStore();
  const [likingId, setLikingId] = useState(null);
  const [publishingId, setPublishingId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const navigate = useNavigate();

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

  const handlePublish = async (postId) => {
    if (!token) return navigate("/login");
    if (publishingId) return;
    setPublishingId(postId);

    try {
      const promise = publishPost(postId);
      toast.promise(promise, {
        loading: "Publishing post...",
        success: "Post published successfully",
        error: (err) => err.message,
      });
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setPublishingId(null);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  if (myPosts.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex justify-center items-center gap-2">
          <CircleMinusFill />
          <span>No hay artículos para mostrar</span>
        </div>
      </div>
    );

  return (
    <>
      {myPosts.map((p) => {
        const liked = p.likedBy?.some(
          (id) => id.toString() === user?._id?.toString(),
        );
        return (
          <div key={p._id} className="flex flex-col mx-auto px-4">
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
                  <span className="text-lg text-gray-500">
                    {timeAgo(p.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 max-w-7xl  my-2">
                <Chip
                  className={cn(
                    `rounded-full  px-4 py-2 gap-2 ${p?.status === "draft" ? "bg-orange-300 text-white dark:bg-warning-soft dark:text-warning-soft-foreground" : "bg-lime-600 text-white dark:bg-success-soft dark:text-success-soft-foreground"}`,
                  )}
                >
                  <CircleFill width={7} />
                  <Chip.Label className="text-sm">
                    {p?.status === "draft" ? "Draft" : "Published"}
                  </Chip.Label>
                </Chip>
                {p.status === "draft" && (
                  <Button
                    isDisabled={publishingId === p._id}
                    onPress={() => handlePublish(p._id)}
                  >
                    <PaperPlane />
                    Publish
                  </Button>
                )}
                <Dropdown>
                  <Button isIconOnly variant="secondary">
                    <EllipsisVertical />
                  </Button>
                  <Dropdown.Popover placement="bottom right">
                    <Dropdown.Menu>
                      <Dropdown.Item
                        id="edit-post"
                        textValue="Edit Post"
                        onPress={() => {
                          setEditingPost(p);
                          setIsEditOpen(true);
                        }}
                      >
                        <Label>Edit Post</Label>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
            </div>

            <div className="my-2">
              {/* title */}
              <div className="flex flex-col mx-16 ">
                <h1 className="text-3xl font-bold mb-5">{p?.title}</h1>

                <p className="text-xl text-justify mb-5">
                  {p?.excerpt}
                  <Link to={`/post/${p._id}`}>
                    <span className="text-green-400 mx-2 cursor-pointer">
                      {p.status === "published"
                        ? "(See more...)"
                        : "(Preview...)"}
                    </span>
                  </Link>
                </p>

                {p.coverImage && (
                  <Image
                    src={p?.coverImage}
                    className="h-105 rounded-4xl"
                    alt={p?.title}
                  />
                )}

                <div className="flex justify-between mt-2 items-center">
                  <div className="flex items-center gap-1 text-lg">
                    <Button variant="ghost">
                      <Eye className="size-6 text-gray-500" />
                    </Button>

                    <Button
                      variant="ghost"
                      onPress={() => handleLike(p._id)}
                      isDisabled={likingId === p._id}
                    >
                      {liked ? (
                        <HeartFill className="size-6 text-red-500" />
                      ) : (
                        <Heart className="size-6 text-gray-500" />
                      )}
                    </Button>
                    <Button variant="ghost">
                      <Comment className="size-6 text-gray-500" />
                    </Button>
                    {p.status === "published" && <ShareMenu post={p} />}
                  </div>
                  <div className="flex items-center text-gray-400 gap-2">
                    <span>{p?.views} views</span>
                    <span className="text-xl">•</span>
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
        );
      })}
      <CreatePostModal
        post={editingPost}
        icon={<PencilToSquare />}
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        headerTitle="Edit Post"
      />
    </>
  );
};

export default MyPosts;
