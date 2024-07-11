import {Router} from 'express'
const paymentRoute = Router();
import { auth } from '../middlewares/auth.js';
import {makePayment , showPaymentHistory , showTransactionHistory, refundPayment, handleWebhook } from '../controllers/paymentController.js';
import { AdminAuth } from "../utils/adminAuth.js"


paymentRoute.post("/make_payment" , auth, makePayment);
paymentRoute.get("/show_payment" ,auth,AdminAuth, showPaymentHistory);
paymentRoute.get("/show_transaction" ,auth,AdminAuth, showTransactionHistory);
paymentRoute.patch("/refund" ,auth,AdminAuth, refundPayment);
paymentRoute.post("/webhook",  handleWebhook)

export default paymentRoute;    