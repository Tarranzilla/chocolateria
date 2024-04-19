import axios from "axios";

import { useEffect, useState } from "react";
import Image from "next/image";

const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username";

type FeedItem = {
    id: string;
    caption: string;
    media_type: string;
    media_url: string;
    permalink: string;
    thumbnail_url: string;
    timestamp: string;
    username: string;
};

export default function InstaFeed() {
    const [feedList, setFeedList] = useState<FeedItem[]>([]);

    async function getInstagramPosts() {
        const { data } = await axios.get("/api/instagram");
        console.log(data.data);
        setFeedList(data.data);
    }

    useEffect(() => {
        getInstagramPosts();
    }, []);

    return (
        <div>
            <div className="Feed_Wrapper">
                {feedList.map((item) => (
                    <div className="Feed_Item" key={item.id}>
                        {item.media_type === "VIDEO" && (
                            <video controls>
                                <source src={item.media_url} type="video/mp4" />
                            </video>
                        )}

                        {item.media_type === "IMAGE" && <Image width={400} height={400} src={item.media_url} alt={item.caption} />}
                        {item.media_type === "CAROUSEL_ALBUM" && <Image width={400} height={400} src={item.media_url} alt={item.caption} />}
                    </div>
                ))}
            </div>
        </div>
    );
}
