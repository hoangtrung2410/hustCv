const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();

// Port
const PORT = process.env.PORT || 6868;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(cookieParser());

// Routers
const recruitmentPostRouter = require('./src/routers/recruitmentPostRouter.js');
const businessRouter = require('./src/routers/businessRouter.js');
const userRouter = require('./src/routers/userRouter.js');
const authRouter = require('./src/routers/authRouter.js');

// Routes
app.use('/api/recruitmentPosts', recruitmentPostRouter);
app.use('/api/business', businessRouter);
app.use('/api/users', userRouter);
app.use('/api/auths', authRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
