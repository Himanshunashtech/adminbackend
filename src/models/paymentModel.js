
import mongoose from 'mongoose';


const paymentSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true },
        adminCharge: { type: Number, required: true },
        stripeCharge: { type: Number, required: true },
        paymentType: { type: String, enum: ['Cash On Delivery', 'Stripe Gateway'], default: ' ', required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'transaction' },
        chargeId: { type: String },
        customerId: { type: String },
    },
    {
        timestamps: true
    }
)

export const payment = mongoose.model('payment', paymentSchema);    