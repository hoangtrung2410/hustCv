
const db = require('../models')
const jwt = require('jsonwebtoken');
const Admins = db.admin
const User = db.user;
const registerAdmins = async(req,res) =>{
    try{
        if(!req.body){
            return res.status(400).json({error:"Bad request: Missing request body"})
        }
        const inf = {
            userName: req.body.userName,
            passWord: req.body.passWord,
            fullName: req.body.fullName,
            email: req.body.email
        }
        const admin = await Admins.create(inf)
        console.log(admin)
        const token = jwt.sign({ userId: admin.id, userName: admin.userName }, 'LuckyAndPower', { expiresIn: '24h' });
        return res.status(201).json({ token, message: 'Register Success' })
    }catch(error){
        console.log(error);
        // Handle SequelizeUniqueConstraintError
        if (error.name === 'SequelizeUniqueConstraintError') {
            let customMessage = 'Tai Khoan Da Ton Tai';
            return res.status(409).json({ error: customMessage });
        }
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const loginAdmins = async(req, res) => {
    try {
        const { userName, passWord } = req.body;

        const admin = await Admins.findOne({ where: { userName,passWord } });

        if (!admin) {
            return res.status(401).json('Incorrect UserName or PassWord');
        }

        const token = jwt.sign({ userId: admin.id, userName: admin.userName }, 'LuckyAndPower', { expiresIn: '100h' });
        return res.json({token,message:'Login Success'});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const checkToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        // Tách phần "Bearer " khỏi token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, 'LuckyAndPower');
        if (decoded) {
            const userName = decoded.userName;
            console.log('User Name:', userName);

            // Truy vấn tất cả thông tin trừ mật khẩu từ userName trong cơ sở dữ liệu
            const admin = await Admins.findOne({
                where: { userName: userName },
                attributes: { exclude: ['passWord'] }
            });

            if (admin) {
                res.status(200).json({ admin: admin, message: "Success" });
            } else {
                res.status(404).json({ error: "Admin not found for the given userName" });
            }
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAdminPassword = async (userName) => {
    try {
        const admin = await Admins.findOne({
            where: { userName: userName },
        });

        return admin ? admin.passWord : null;
    } catch (error) {
        return res.status(404).json({ error: "Admin not found" });
    }
};


// Middleware to extract and verify the token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    // Tách phần "Bearer " khỏi token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
    }
    // console.log(token)
    jwt.verify(token, 'LuckyAndPower', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
        }
        req.userName = decoded.userName;
        next();
    });
};

const updatePassword = async(req, res) => {
    try {
        const userName = req.userName;
        const { oldPassword, newPassword } = req.body;

        const currentPassword = await getAdminPassword(userName);

        if (oldPassword === currentPassword) {
            // console.log(newPassword)
            const [updatedRowsCount, updatedPassword] = await Admins.update(
                {passWord: newPassword  },
                { where: { userName }, returning: true }
            );
            if (updatedRowsCount === 0) {
                res.status(404).json({ error: "Cập nhật mật khẩu không thành công" });
                return;
            }
            res.status(200).json({ message: "Thay đổi mật khẩu thành công" });
        } else {
            res.status(400).json({ error: "Mật khẩu cũ không đúng" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Find user by username
  const getUserByUsername = async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ where: { username } });
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Find user by email
  const getUserByEmail = async (req, res) => {
    const { email } = req.params;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status  (404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  const getUserByPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.params;
  
    try {
      const user = await User.findOne({ where: { phoneNumber } });
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports={
    registerAdmins,
    loginAdmins,
    checkToken,
    updatePassword,
    verifyToken,
    getAllUsers,
}