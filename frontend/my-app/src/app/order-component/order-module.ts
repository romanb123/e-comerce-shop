export interface Order {
    products: [
        {
          product:String,
          quantity: Number
        }
      ],
      user: {
        name: {
          type: String,
          required: true
        },
        userId:String,
      }
}