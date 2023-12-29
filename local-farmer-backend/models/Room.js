import mongoose from 'mongoose';

const roomSchema = mongoose.Schema(
  {
    lng: { type: Number, required: true },
    lat: { type: Number, required: true },
    price: { type: Number, min: 0, default: 0 },
    form: {type: String, required: true},
    formValue: {type: Number, required: true},
    currency: {type: String,required: true},
    title: { type: String, required: true, minLength: 5, maxLength: 150 },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 1000,
    },
    images: {
      type: [String],
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    uid: { type: String, required: true },
    uName: { type: String, required: true },
    uPhoto: { type: String, default: '' },
    category: {
      type: {
        mainCategory: String, // Main category
        subCategories: [String], // Array of subcategories
      },
    },
  },
  { timestamps: true }
);

const Room = mongoose.model('rooms', roomSchema);

export default Room;