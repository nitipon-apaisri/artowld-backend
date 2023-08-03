import axios from "axios";

export const getHelloworld = async () => {
    const response = await axios.get(`YOUR_URL`);
    return response.data;
};
