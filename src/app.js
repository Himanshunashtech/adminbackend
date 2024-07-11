

import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors'
import cookieParser from "cookie-parser";
import router from "./routes/userRoutes.js";
import fileuploader from "./routes/galleryRoutes.js";
import contentuploader from "./routes/contentmanagementRoutes.js";
import uploadlinks from "./routes/sociallinksRoutes.js";
import contactUs from "./routes/contactusRoutes.js";
import pressRouter from "./routes/pressManagementRoutes.js";
// import bodyparser from "body-parser"
import paymentRoute from "./routes/paymentRoutes.js";
import customErrorHandler from "./utils/ResposeHandler.js";




dotenv.config({
    path: "./.env",
});

const app = express();



const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
  
    // Handle Mongoose CastError (Invalid MongoDB ID)
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      err = new ErrorHandler(message, 400);
      statusCode = 400;
    }
  
    // Handle Mongoose duplicate key error (E11000)
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      err = new ErrorHandler(message, 400);
      statusCode = 400;
    }
  
    // Handle JsonWebTokenError (Wrong JWT)
    if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid. Try again.`;
      err = new ErrorHandler(message, 400);
      statusCode = 400;
    }
  
    // Handle TokenExpiredError (JWT Expired)
    if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is expired. Try again.`;
      err = new ErrorHandler(message, 400);
      statusCode = 400;
    }
  
    // Send JSON response with error details
    res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  };
  
  // Apply error middleware to the app
  app.use(errorMiddleware);



const serverConnection = async () => {



    app.use(cors())
    app.use((req,res,next)=> {
      if(req.originalUrl == '/api/payment/webhook'){
      express.raw({type: 'application/json'})(req,res,next);
  } else {
      express.json()(req,res,next);
  }
});
    app.use(express.json());
    app.use(express.urlencoded({ extended: true, }));
    app.use(cookieParser());
    app.use(express.static("public"));
    // Register middleware
    app.use(customErrorHandler);


    // app.use(bodyparser.json())


    app.use("/api/user", router)
    app.use("/api/files", fileuploader)
    app.use("/api/content", contentuploader)
    app.use("/api/press",pressRouter )
    app.use("/api/links", uploadlinks)
    app.use("/api/query",contactUs)
    app.use("/api/payment", paymentRoute)



    

    app.listen(process.env.PORT, () => {
        console.log("server is running  http://localhost:8000");
    });
};
export { serverConnection };
