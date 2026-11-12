import { FileArrowUp, Xmark } from "@gravity-ui/icons";
import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextField,
  cn,
  toast,
  Select,
  ListBox,
  FieldError,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import TagInput from "./Inputs/TagInput";
import TextArea from "../Inputs/TextArea";
import { postSchema } from "../../schemas/postSchema";
import { usePostStore } from "../../store/usePostStore";
import { useCategoryStore } from "../../store/useCategoryStore";

const CreatePostModal = ({ className, nameButton, icon, headerTitle }) => {
  const { createPost } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();
  const fileInputRef = useRef(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    category: "",
    coverImage: "",
    status: "published",
    excerpt: "",
    tags: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setCoverImage("");
    setPostData((prev) => ({ ...prev, tags: [] }));
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e, close) => {
    e?.preventDefault?.();

    const datos = {
      title,
      content,
      category,
      tags: (postData.tags || [])
        .map((tag) => (typeof tag === "string" ? tag : tag.name))
        .filter(Boolean),
    };
    const result = postSchema.safeParse(datos);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const promise = createPost({
        ...result.data,
        status: "published",
        coverImage,
      });
      toast.promise(promise, {
        loading: "Creating post...",
        success: "Post created successfully",
        error: (err) => err.message,
      });
      await promise;
      resetForm();
      close();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    handleUploadFile(e.target.files);
  };

  const handleValueChange = (key, value) => {
    setPostData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleUploadFile = (file) => {
    const imageUpload = file;

    const newFile = imageUpload[0];
    setCoverImage(newFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleUploadFile(e.dataTransfer.files);
  };

  return (
    <Modal>
      <Button variant="secondary" className={className}>
        {icon}
        {nameButton}
      </Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="max-w-md sm:max-w-xl">
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <div className="flex gap-4 items-center">
                    <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                      {icon}
                    </Modal.Icon>
                    <Modal.Heading className="text-xl">
                      {headerTitle}
                    </Modal.Heading>
                  </div>
                  <p className="mt-1.5 text-sm leading-5 text-muted text-justify">
                    Llene el siguiente formulario para poder crear un nuevo
                    post.
                  </p>
                </Modal.Header>
                <Modal.Body>
                  <Surface variant="default">
                    <form
                      onSubmit={(e) => handleSubmit(e, close)}
                      noValidate
                      className="flex flex-col gap-4"
                    >
                      <Label>
                        Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter a title for the post"
                        className="inputs-rounded"
                      />
                      {errors.title?.[0] && (
                        <p className="text-sm text-red-500">
                          {errors.title[0]}
                        </p>
                      )}
                      <TextField>
                        <div
                          className={cn(
                            "rounded-lg border-2 border-dashed border-gray-400 p-[20px_16px] text-center h-auto",
                            isDragOver ? "bg-[#c4ccd4]" : "",
                          )}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <div className="flex justify-center flex-col gap-y-2 items-center">
                            <FileArrowUp
                              className="text-blue-900 dark:text-blue-400"
                              style={{ width: 45, height: 65 }}
                            />
                            <div className="font-medium flex flex-col dark:text-white">
                              <div className="flex justify-center items-center">
                                <span className="text-blue-900 font-bold dark:text-blue-400">
                                  Drag & Drop
                                </span>
                                <div className="mx-1">
                                  an image to show here
                                </div>
                              </div>
                              <div className="mx-1 text-gray-500 justify-center flex">
                                <span className="w-52 truncate">
                                  Image uploaded: {coverImage.name}
                                </span>
                                {coverImage && (
                                  <Xmark
                                    size="lg"
                                    className="-mr-0.5 mx-2 size-5 cursor-pointer dark:text-gray-400"
                                    onClick={() => setCoverImage("")}
                                  />
                                )}
                              </div>
                            </div>
                            <button
                              onClick={handleFileClick}
                              type="button"
                              className="bg-zinc-200 cursor-pointer p-2 rounded-lg font-medium dark:bg-zinc-700"
                            >
                              Choose Image
                            </button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                              aria-label="Seleccionar archivos para subir"
                            />
                          </div>
                        </div>
                      </TextField>
                      <TextField
                        className="w-full"
                        name="post"
                        variant="secondary"
                      >
                        <Label>
                          Content <span className="text-red-500">*</span>
                        </Label>
                        <TextArea
                          ariaLevel={4}
                          type="text"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          required
                          placeholder="Enter the content for the post"
                          className="text-area-rounded"
                        />
                        {errors.content?.[0] && (
                          <p className="text-sm text-red-500">
                            {errors.content[0]}
                          </p>
                        )}
                      </TextField>
                      <TextField>
                        <TagInput
                          tags={postData?.tags || []}
                          setTags={(data) => {
                            handleValueChange("tags", data);
                          }}
                        />
                      </TextField>

                      <TextField>
                        <Select
                          isRequired
                          className="w-full"
                          placeholder="Select a category"
                          selectedKey={category}
                          onSelectionChange={(key) => setCategory(key)}
                        >
                          <Label>Category</Label>
                          <Select.Trigger className="inputs-rounded">
                            <Select.Value />
                            <Select.Indicator />
                          </Select.Trigger>
                          <Select.Popover>
                            <ListBox>
                              {categories.map((cat) => (
                                <ListBox.Item id={cat._id} textValue={cat.name}>
                                  {cat.name}
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              ))}
                            </ListBox>
                          </Select.Popover>
                          <FieldError />
                        </Select>
                        {errors.category?.[0] && (
                          <p className="text-sm text-red-500">
                            {errors.category[0]}
                          </p>
                        )}
                      </TextField>
                    </form>
                  </Surface>
                </Modal.Body>
                <Modal.Footer className="w-auto flex justify-between">
                  <Button
                    slot="close"
                    onPress={resetForm}
                    variant="secondary"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => handleSubmit(null, close)}
                    isDisabled={loading}
                    className="w-full"
                  >
                    Post Article
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CreatePostModal;
