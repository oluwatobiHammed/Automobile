import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { BodyStyles } from '../events/types/BodyStyles';
import { SellingCondition } from '../events/types/SellingCondition';
import { Transmission } from '../events/types/Transmission';
import { Order, OrderStatus } from './order';

interface VehicleAttrs {
  id?: string
  make: string;
  year: number;
  price: number;
  color: string;
  condition: SellingCondition;
  carRating: number;
  bodyStyles: BodyStyles;
  transmission: Transmission;
  userId?: string;


}

export interface VehicleDoc extends mongoose.Document {
  make: string;
  year: number;
  price: number;
  color: string;
  condition: SellingCondition;
  carRating: number;
  bodyStyles: BodyStyles;
  transmission: Transmission;
  id?: string
  userId?: string;
  version: number;
  orderId?: string;
  isReserved(): Promise<boolean>;
}

interface VehicleModel extends mongoose.Model<VehicleDoc> {
  build(attrs: VehicleAttrs): VehicleDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<VehicleDoc | null>;
}

const vehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,

    },
    year: {
      type: Number,
      required: true,
      trim: true
    },
    color: {
      type: String,
      trim: true
    },
    condition: {
      type: String,
      required: true,
      enum: Object.values(SellingCondition),
      trim: true,
    },
    carRating: {
      type: Number,
    },
    bodyStyles: {
      type: String,
      required: true,
      enum: Object.values(BodyStyles),
      trim: true
    },
    transmission: {
      type: String,
      required: true,
      enum: Object.values(Transmission),
      trim: true
    },
    userId: {
      type: String,
    },
    avatar: {
      type: Buffer
    },
    orderId: {
      type: String,
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
vehicleSchema.set('versionKey', 'version');
vehicleSchema.plugin(updateIfCurrentPlugin);
vehicleSchema.set('timestamps', true)
vehicleSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Vehicle.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

vehicleSchema.statics.build = (attrs: VehicleAttrs) => {
  return new Vehicle({
    _id:  attrs.id,
    make: attrs.make,
    price: attrs.price,
    color: attrs.color,
    condition: attrs.condition,
    carRating: attrs.carRating,
    bodyStyles: attrs.bodyStyles,
    transmission: attrs.transmission,
    year: attrs.year,
    userId: attrs.userId
  });
};

vehicleSchema.methods.isReserved = async function () {
  // this === the vehicle document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    vehicle: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Vehicle = mongoose.model<VehicleDoc, VehicleModel>('Vehicle', vehicleSchema);

export { Vehicle };
