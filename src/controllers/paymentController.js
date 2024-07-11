import { payment } from '../models/paymentModel.js';
import { transaction } from '../models/transactionModel.js';
import { Users } from '../models/usersModel.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const { Secret_Key, webhook_Sign } = process.env;
import stripes from 'stripe';
const stripe = stripes(Secret_Key);


const validateId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.json({status:501, success: false, message: "Invalid ID" });
    }
    return true; // Valid ID
};


const makePayment = asyncHandler(async (req, res) => {
    let Transaction;
    const userId = req.user._id
    if (!validateId(userId)) {
        return res.json({status:501, success: false, message: "Invalid ID" });
    }
    const { stripetoken } = req.body;
    try {
       
        //Create a new Transaction
        Transaction = await transaction.create({
            amount: req.body.amount,
            cardType: req.body.cardType,
            platformType: req.body.platformType,
            transactionStatus: 'Pending',
            productId:userId
        })
        return await stripe.customers.create({
            email:userId.email,
            source: stripetoken,
            name: 'Testing Payments',
        }).then((customer) => {
            return stripe.charges.create({
                amount: Transaction.amount * 100,
                currency: 'INR',
                customer: customer.id,
                description: "Sample Charge",
            });
            // console.log(customer.id);
        }).then(async (charge) => {
            Transaction.transactionStatus = 'Success';
            await Transaction.save();
            const stripeCharge = Transaction.amount * 0.029 + 10;
            const adminCharge = 30;
            await payment.create({
                amount: Transaction.amount,
                adminCharge: adminCharge,
                stripeCharge: stripeCharge,
                paymentType: 'Stripe Gateway',
                userId: userId,
                transactionId: Transaction._id,
                chargeId: charge.id,
                customerId: charge.customer,
            });
            return res.status(200).json({
                success: true,
                message: "Payment Successful"
            });
        })
    } catch (error) {
        console.error("Payment Error:" + " " + error);
        //update transaction status in case of failure
        if (Transaction) {
            Transaction.transactionStatus = 'Fail';
            await Transaction.save();
        }
        return res.json({status:500, success: false, message: "Payment Error: " + " " + error.message });
    }
});


const showPaymentHistory = asyncHandler(async (req, res) => {
    try {
        const payHistory = await payment.find();
        if (!payHistory) {
            return res.status(400).json({
                success: false,
                message: "No trasaction found with this User"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                payHistory
            })
        }
    }
    catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }
})

const showTransactionHistory = asyncHandler(async (req, res) => {
    try {
        const TransHistory = await transaction.find();
        if (!TransHistory) {
            res.status(400).json({
                success: false,
                message: "No trasaction found with this User"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                TransHistory
            })
        }
    }
    catch (error) {
        return res.json({ status:500, success: false, message: "Internal server error" });

    }
})

const refundPayment = asyncHandler(async (req, res) => {

    const {transactionId} = req.body;
    if (!validateId(transactionId)) {
        return res.json({status:501, success: false, message: "Invalid ID" });
    }

    try {
        const findTransaction = await transaction.findById(transactionId);
        if (!findTransaction) {
            return res.status(400).json({ message: "No transaction found with this id" });
        }
        if (findTransaction.transactionStatus !== 'Success') {
            return res.status(400).json({ message: "Payment with this transaction id is already refunded, pending or failed" });
        }

        const findPayment = await payment.findOne({ transactionId: findTransaction._id });
        if (!findPayment) {
            return res.status(400).json({ message: "Payment not found with this transaction id" });
        }
        else {
            await stripe.refunds.create({
                charge: findPayment.chargeId,
            });
            findTransaction.transactionStatus = 'Refund';
            findTransaction.refunded = true;
            await findTransaction.save();

            return res.status(200).json({ success: true, message: "Refund Successful" });
        }
    } catch (error) {
        console.log('Refund error :' + ' ' + error);
        return res.json({ status:500, success: false, message: "Internal server error"+ error });
    }
})

const handleWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhook_Sign);

        switch (event.type) {
            case 'payment_intent.succeeded': const paymentIntentSuccess = event.data.object;
                console.log('PaymentIntent was successful : ', paymentIntentSuccess);
                break;
            case 'charge.refunded': const charge = event.data.object;
                console.log('Charge was refunded : ', charge);
                break;
            case 'payment_intent.payment_failed': const paymentIntentFailed = event.data.object;
                console.log('PaymentIntent was failed :', paymentIntentFailed);
                break;
            case 'payment_intent.canceled': const paymentIntentCanceled = event.data.object;
                console.log('Payment was canceled : ', paymentIntentCanceled);
                break;
            default: console.log(`Unhandled event type ${event.type}`);
        }
        return res.status(200).json({received: true});
    }
    catch (error) {
        return res.json({status:500, sucess:false, message: "Internal server error"+ error.message });

    }
})


export { makePayment, showPaymentHistory, showTransactionHistory, refundPayment, handleWebhook }
