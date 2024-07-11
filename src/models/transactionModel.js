
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
{
    amount: {type:Number , required: true},
    cardType: {type:String, enum: ['Credit Card' , 'Debit Card'] , default:' ' , required: true},
    platformType: {type:String , enum: ['Mobile Application' , 'Web Application'] , default: 'Web App' , required: true},
    transactionStatus: {type:String , enum:['Pending' , 'Success' , 'Fail' , 'Refund'] , default: 'Pending'},
    productId: {type:mongoose.Types.ObjectId , ref: 'Users'},
    refunded: {type:Boolean , default: false},
},
{
    timestamps:true
}
)

export const transaction = mongoose.model('transaction', transactionSchema);