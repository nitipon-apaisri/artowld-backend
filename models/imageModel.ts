import mongoose from "mongoose";
const { Schema } = mongoose;

const image = {
    _id: String,
    name: String,
    data: Buffer,
    contentType: String,
};

const imageSchema = new Schema(image, { timestamps: true });
const imageModel = mongoose.model("images", imageSchema);

export default imageModel;
