import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@sgtickets/common';
import { VehicleDoc } from './Vehicle';

export { OrderStatus };

interface OrderAttrs {
  id?: string;
  version?: number;
  userId: string;
  status: OrderStatus;
  expiresAt?: Date;
  price: number;
  vehicle?: VehicleDoc;
}

interface OrderDoc extends mongoose.Document {
  id?: string;
  userId: string;
  status: OrderStatus;
  version?: number;
  price: number;
  expiresAt?: Date;
  vehicle?: VehicleDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
     type: Number,
     required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
    },
    
  },
 
  
  {
    
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }

 
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.set('timestamps', true)
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    status: attrs.status,
    expiresAt: attrs?.expiresAt,
    vehicle: attrs?.vehicle,
    price: attrs.price
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
