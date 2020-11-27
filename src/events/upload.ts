

import multer from 'multer'
 export const upload = multer({
  limits: {
      fileSize: 1000000
  },
  fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return  callback(new Error('Please upload a image'))
      }

     callback(null,true)
  }

})
