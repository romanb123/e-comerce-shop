const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  datecreated: { type: Date, required: true },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },

  },
  addres: {
    city: { type: String, required: true },
    street: { type: String, required: true },
    date: { type: String, required: true }
  },
  creditcart: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);