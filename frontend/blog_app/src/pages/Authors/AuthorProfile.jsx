import { SealCheck } from "@gravity-ui/icons";
import Banner from "../../assets/banner_author_profile.png";
import Profile from "../../components/Profile";
import Follow from "../../components/Follow";
import TabsAuthors from "../../components/TabsAuthors";
import Image from "../../components/Image";
import { usePostStore } from "../../store/usePostStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const AuthorProfile = () => {
 const {posts, fetchPosts} = usePostStore();

 const { id } = useParams();
 useEffect(() => { fetchPosts(); }, []);

    const myPost = posts.filter((p) => (p?.author?._id || p?.author) === id);
    const autor = posts.find((p) => (p?.author?._id || p?.author) === id)?.author;
    
  return (
    <div className="flex flex-col ml-5">
      {/* Banner */}
      <Image src={Banner} className="h-80 w-full object-cover" alt="Banner" />
      
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-4 px-8 -mt-16">
          <Profile
            user={autor}
            src={autor?.avatar}
            isOpen={false}
            className="w-32 h-32 ring-4 object-cover text-5xl ring-white rounded-full shrink-0"
          />
          <div className="flex flex-col pt-16 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <span className="text-3xl font-semibold">{autor?.name}</span>
                <SealCheck className="size-6 text-blue-500 mt-1"/>
              </div>
              
            </div>
            <span className="text-md font-light text-muted">{autor?.title}</span>
          </div>
        </div>

        <Follow className="button-outline-rounded"/>
      </div>

      {/* Tabs Authors */}
      <TabsAuthors posts={myPost} about={autor?.bio}/>
    </div>
  );
};

export default AuthorProfile;
