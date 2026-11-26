import {
  Button,
  Chip,
  Dropdown,
  Label,
  Separator,
  Spinner,
  toast,
} from "@heroui/react";
import {
  CircleFill,
  Comment,
  EllipsisVertical,
  Eye,
  Heart,
  HeartFill,
  PaperPlane,
  Pencil,
  PencilToLine,
  TrashBin,
} from "@gravity-ui/icons";
import Follow from "../../components/Follow";
import Profile from "../../components/Profile";
import Image from "../../components/Image";
import { usePostStore } from "../../store/usePostStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { timeAgo } from "../../utils";
import { useAuthStore } from "../../store/useAuthStore";
import CreatePostModal from "../../components/Modals/CreatePostModal";
import DeleteDialog from "../../components/Modals/DeleteDialog";
import ShareMenu from "../../components/ShareMenu";
import RelatedContent from "../../components/relatedContent";

const PostPage = () => {
  const {
    post,
    loading,
    fetchPostById,
    likePost,
    publishPost,
    relatedPosts,
    fetchRelatedPosts,
    deletePost,
  } = usePostStore();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  const { id } = useParams();
  const [liking, setLiking] = useState(false);
  const [publishingId, setPublishingId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const liked = post?.likedBy?.some(
    (id) => id.toString() === user?._id?.toString(),
  );

  const canEdit =
    user?.role === "admin" ||
    (user?.role === "writer" &&
      post?.author?._id?.toString() === user?._id?.toString());

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
    fetchPostById(id);
    fetchRelatedPosts(id);
  }, [id]);

  const handleLike = async () => {
    if (!token) return navigate("/login");
    if (liking) return;
    setLiking(true);
    try {
      await likePost(post._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return navigate("/login");

    try {
      const promise = deletePost(post._id);
      toast.promise(promise, {
        loading: "Deleting post...",
        success: "Post deleted successfully",
        error: (err) => err.message,
      });
      await promise;
      setIsDeleteOpen(false);
      navigate("/my-posts");
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Post no encontrado</span>
      </div>
    );

  const paragraphs = post.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      <div className="flex flex-col max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center my-5 gap-2">
              <div className="flex items-center gap-4">
                <Profile
                  user={post.author}
                  src={post?.author?.avatar}
                  isOpen={false}
                />
                <span className="text-lg">{post?.author?.name}</span>
              </div>
              <span className="text-xl text-green-400">•</span>
              <span className="text-lg text-gray-500">
                {timeAgo(post.createdAt)}
              </span>
            </div>
          </div>

          <div className="items-center flex gap-2">
            {user && post.author?._id?.toString() !== user._id?.toString() && (
              <Follow />
            )}

            {post.status === "draft" && (
              <Chip
                size="sm"
                className="rounded-full  px-4 py-1.5 gap-2 bg-orange-300 text-white dark:bg-warning-soft dark:text-warning-soft-foreground"
              >
                <CircleFill width={7} />
                <Chip.Label>Draft</Chip.Label>
              </Chip>
            )}

            {post.status === "draft" && (
              <Button
                size="sm"
                isDisabled={publishingId === post._id}
                onPress={() => handlePublish(post._id)}
                className="font-medium"
              >
                <PaperPlane className="size-4" />
                Publish
              </Button>
            )}

            {canEdit && (
              <Dropdown isOpen={open} onOpenChange={setOpen}>
                <Button
                  isIconOnly
                  size="lg"
                  aria-label="Menu"
                  variant="secondary"
                  className="bg-transparent"
                >
                  <EllipsisVertical className="outline-none" />
                </Button>
                <Dropdown.Popover placement="bottom right">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      id="edit-post"
                      textValue="Edit Post"
                      onPress={() => setIsEditOpen(true)}
                    >
                      <Pencil/>
                      <Label>Edit Post</Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="delete-post"
                      textValue="Delete Post"
                      className="text-red-500"
                      onPress={() => setIsDeleteOpen(true)}
                    >
                      <TrashBin/>
                      <Label className="text-red-500">Delete Post</Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            )}
            <CreatePostModal
              icon={<PencilToLine />}
              post={post}
              isOpen={isEditOpen}
              onOpenChange={setIsEditOpen}
              headerTitle="Edit Post"
            />
            <DeleteDialog
              isOpen={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              post={post}
              onConfirm={handleDelete}
            />
          </div>
        </div>

        <div className="my-2">
          {/* title */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-5">{post?.title}</h1>

            {post.coverImage && (
              <Image
                src={post?.coverImage}
                className="h-105 rounded-4xl"
                alt={post.title}
              />
            )}

            <div className="mt-6">
              {paragraphs.map((parrafo, index) => (
                <p
                  key={index}
                  className="text-xl text-justify mb-5 leading-relaxed"
                >
                  {parrafo}
                </p>
              ))}
            </div>

            <div className="flex justify-between mt-2 items-center">
              <div className="flex items-center gap-1 text-lg">
                <Button variant="ghost">
                  <Eye className="size-6 text-gray-500" />
                </Button>

                <Button
                  onPress={handleLike}
                  isDisabled={liking}
                  variant="ghost"
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
                <ShareMenu post={post} />
              </div>
              <div className="flex items-center text-gray-400 gap-2">
                <span>{post?.views} views</span>
                <span className="text-xl">•</span>
                <span>{post?.likes} likes</span>
                <span className="text-xl">•</span>
                <span>{post?.comments} comments</span>
                <span className="text-xl">•</span>
                <span>{post?.shares} shares</span>
              </div>
            </div>
            <Separator className="mt-4" />
            {relatedPosts.length > 0 && (
              <div className="flex flex-col">
                <h2 className="text-3xl my-6">Sugerencias para tí</h2>
                <RelatedContent post={relatedPosts} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
