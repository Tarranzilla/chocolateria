import axios from "axios";

export default async function handler(req, res) {
    const token = process.env.TOKEN_INSTAGRAM_JOAOTARRAN;
    const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username";
    const url = `https://graph.instagram.com/me/media?access_token=${token}&fields=${fields}`;

    try {
        const { data } = await axios.get(url);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
}
