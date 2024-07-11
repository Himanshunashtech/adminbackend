import multer from "multer";
import path from 'path'
    
// const AWS=require ("aws-sdk")
// const s3= new AWS.S3();



// s3.client.putObject({
//     Bucket: bucketName,
//     Key: 'Folder/image.jpg',
//     Body: data
// }, function (res) {
//         console.log('Successfully uploaded file.');
//     })




const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //  return   cb(null, "./public/temp"); 
    // },
    // filename: function (req, file, cb) {
    //  return  cb(null, file.originalname); 
    // }
});

export const upload = multer({ storage: storage });







const mediaHandler = () => {
  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        
     
          if (file.mimetype === 'video/mp4') {
              cb(null, 'public/videos');
          } else {
              cb(null, 'public/images');
          }
      },
      filename: function (req, file, cb) {
        
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          let filename = uniqueSuffix + path.extname(file.originalname);
          console.log("filenameanme",filename)

          // if (file.originalname.includes("avatar")) {
          //   console.log("1")
          //     filename = "avatar-" + filename;
          // } else if (file.originalname.includes("banner")) {
          //   console.log("2")
          //     filename = "banner-" + filename;
          // }

        //   if (file.originalname.includes("news")) {
        //     console.log("3")

        //     filename = "news-" + filename;
        //     console.log("3",filename)
        // } else if (file.originalname.includes("logo")) {
        //     console.log("4")
        //     filename = "logo-" + filename;
        //     console.log("4",filename)
        // }

        //   console.log("Generated filename:", filename);
          cb(null, filename);
      }
  });

  return multer({ storage: storage });
};

export { mediaHandler };





















// const mediaHandler = () => {
//     // console.log(directory , "kklklks")
//       const storage = multer.diskStorage({
//           destination: function (req, file, cb) {
//             cb(null, `public/temp`)
//           },
//           destination: function (req, file, cb) {
//             cb(null, `public/videos`)
//           },
//           filename: function (req, file, cb) {
//             const uniqueSuffix = Date.now() + '-' + Math.random(Math.random() * 1e9)
//             const filename = uniqueSuffix + path.extname(file.originalname);
//             cb(null,filename)
//           }
//         })
  
//         return multer({storage : storage})
//   }
  
//   export { mediaHandler}
  