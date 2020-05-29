import * as mongoose from 'mongoose';
const { Schema } = mongoose;
import { languages } from '../../shared/constans';

const getProductLangInfo = (): {[lang: string]: {}} => {
  return languages
    .reduce((prev, lang) => ({...prev,
      [lang]:
      { title: String,
        description: String,
        descriptionFull: [],
        regularPrice: Number,
        salePrice: Number,
        onSale: Boolean,
        stock: String,
        visibility: Boolean,
        shipping: String
      }}),
    {});
};

const ProductSchema = new Schema({
  titleUrl: String,
  quantity: Number,
  mainImage: {
    url: { type: String, trim: true },
    name: { type: String, trim: true },
  },
  images: [],
  tags: [],
  _user: { type: Schema.Types.ObjectId, ref: 'user' },
  dateAdded: Date,
  ...getProductLangInfo()
});

export default ProductSchema;
