const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('express-async-handler')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const { PDFDocument } = require("pdf-lib");
const PDFParser = require('pdf-parse');
const multer = require("multer");
const fs = require("fs");
const path = require('path');
const authMidleware = require("./src/middlerwares/authMiddleware.js")

const app = express();
app.use('/public/cv', express.static(path.join(__dirname, 'public/cv')));

const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
};

// Port
const PORT = process.env.PORT || 6868;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(cookieParser());

// Routers
const recruitmentPostRouter = require('./src/routers/recruitmentPostRouter.js');
const businessRouter = require('./src/routers/businessRouter.js');
const userRouter = require('./src/routers/userRouter.js');
const authRouter = require('./src/routers/authRouter.js');
const skillRouter = require('./src/routers/skillRouter.js')
const manageApplicationRouter = require('./src/routers/manageApplicationRouter.js');
const educationRouter = require('./src/routers/profileRouter/educationRouter.js');
const projectRouter = require('./src/routers/profileRouter/projectRouter.js');
const experienceRouter = require('./src/routers/profileRouter/experienceRouter.js');
const certificateRouter = require('./src/routers/profileRouter/certificateRouter.js');
const makeResumeRouter = require('./src/routers/profileRouter/makeResumeRouter.js');
const cvRouter = require('./src/routers/cvRouter.js');
const adminRouter = require('./src/routers/adminRouter.js');
const userInfor = require('./src/routers/profileRouter/userInforRouter.js')
const skillProfile = require('./src/routers/profileRouter/skillProfileRouter.js')
const jobPreference = require('./src/routers/criterionJobRouter.js')

const roleRouter = require('./src/routers/roleRouter.js');
const recruiterApplicationRouter = require('./src/routers/recruiterApplicationRouter.js');
const { postFile } = require('./src/controllers/file.js');

const uploadApplicationRouter = require('./src/routers/uploadApplicationRouter.js');

// Routes
app.use('/api/recruitmentPosts', recruitmentPostRouter);
app.use('/api/business', businessRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/skills', skillRouter)

app.use('/api/profile/certificate', certificateRouter);
app.use('/api/profile/education', educationRouter);
app.use('/api/profile/project', projectRouter);
app.use('/api/profile/experience', experienceRouter);
app.use('/api/profile/userInfor', userInfor);
app.use('/api/profile/skill', skillProfile)
app.use('/api/profile/makeCV', makeResumeRouter);
app.use('/api/manageCv', cvRouter);
app.use('/api/jobPreference', jobPreference);
app.use('/api/manageApplication', manageApplicationRouter);

app.use('/api/roles', roleRouter);
app.use('/api/admin',adminRouter);

app.use('/api/recruiterApplication', recruiterApplicationRouter);

app.use('/api/application', uploadApplicationRouter);

<<<<<<< HEAD
// const upload = multer({ dest: "uploads/" });// Thư mục lưu trữ tạm thời cho tệp tin
// app.post("/api/application/create-pdf", upload.single("file"), async (req, res) => {
//   const getTitleFromPDF = async (buffer) => {
//     const timestamp = Date.now();
//     try {
//       const data = await PDFParser(buffer);
//       const title = data.info.Title || `default-filename-${timestamp}.pdf`; //Lấy tiêu đề từ thông tin metadata hoặc sử dụng tên mặc định

//       return title;
//     } catch (error) {
//       console.error("Error reading PDF metadata:", error);
//       throw error;
//     }
//   };
//   try {
//     const { path } = req.file; // Đường dẫn tạm thời tới tệp tin đã tải lên
//     // Decode dữ liệu base64
//     const buffer = fs.readFileSync(path); // Đọc tệp tin vào buffer
//     fs.unlinkSync(path); // Xoá tệp tin tạm thời
//     const title = await getTitleFromPDF(buffer); // Lấy tiêu đề từ tệp PDF
//     const pdfDoc = await PDFDocument.load(buffer);
//     const pdfBytes = await pdfDoc.save();
//     const filePath = `public/cv/${title.replace(/\s+/g, "-")}`;
//     fs.writeFileSync(filePath, pdfBytes); // Ghi tệp PDF
//     res.json({ message: "PDF created successfully", pdfPath: filePath });
//   } catch (error) {
//     console.error("Error handling PDF:", error);
//     res.status(500).json({ error: "Error handling PDF" });
//   }
// });
=======
const upload = multer({ dest: "uploads/" }); // Thư mục lưu trữ tạm thời cho tệp tin
app.post("/api/application/create-pdf", authMidleware.isJobSeeker, upload.single("file"), async (req, res) => {
  const getTitleFromPDF = async (buffer) => {
    try {
      const data = await PDFParser(buffer);
      const title = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + req.file?.originalname;
      return title;
    } catch (error) {
      console.error("Error reading PDF metadata:", error);
      throw error;
    }
  };
  try {
    const { path } = req.file; // Đường dẫn tạm thời tới tệp tin đã tải lên
    // Decode dữ liệu base64
    const buffer = fs.readFileSync(path); // Đọc tệp tin vào buffer
    fs.unlinkSync(path); // Xoá tệp tin tạm thời
    const title = await getTitleFromPDF(buffer); // Lấy tiêu đề từ tệp PDF
    const pdfDoc = await PDFDocument.load(buffer);
    const pdfBytes = await pdfDoc.save();
    const filePath = `public/cv/${title}`;
    fs.writeFileSync(filePath, pdfBytes); // Ghi tệp PDF
    res.status(200).json({ message: "PDF created successfully", pdfPath: filePath });
  } catch (error) {
    console.error("Error handling PDF:", error);
    res.status(500).json({ error: "Error handling PDF" });
  }
});
>>>>>>> eba9730e12f2737d8022ba410d9a0215b13bebe0
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});