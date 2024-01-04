const pdf = require('html-pdf');

const db = require('../../models');

const skill = db.skill
const personalFile = db.personalFile;
const study = db.study;
const project = db.project;
const experience = db.experience;
const certificate = db.certificate;

const makeResume = async (req, res) => {
    try {
        // const id = req.userId;
        const id = 20;
        const userInfor = await personalFile.findByPk(id,{
            include: [{
                model: skill,
                through: { attributes: [] },
                attributes: ['id', 'name'],
            }]
        })
        const userStudy = await study.findAll({where: {personalFileId: id}});
        const userProject = await project.findAll({where: {personalFileId: id}});
        const userCertificate = await certificate.findAll({where: {personalFileId: id}});
        const userExperience = await experience.findAll({where: {personalFileId: id}});
        const infor = {
            profile: userInfor.profile,
            education: userStudy,
            experience: userExperience,
            skill: userInfor.skills,
            project: userProject,
            certificate: userCertificate
        };
        pdf.create(dynamicResume(infor)).toBuffer((error, buffer) => {
            if (error) {
                res.status(500).send("Internal Server Error");
                return;
            }
    
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=generated-resume.pdf');
            res.send(buffer);
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const dynamicResume= (infor)=>{
    return `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your CV</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
    
        header {
          background-color: #333;
          color: #fff;
          padding: 1em 0;
        }

        header h1 {
            color: white; /* Set text color to white */
            margin-left: 20px; /* Add a left margin for spacing */
          }

        .container {
          max-width: 800px;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    
        h1,
        h2,
        h3 {
          color: #333;
        }
    
        .section {
          margin-bottom: 20px;
        }
    
        .section h2 {
          border-bottom: 2px solid #333;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
    
        .experience,
        .education {
          margin-top: 10px;
        }
    
        ul {
          list-style-type: none;
          padding: 0;
        }
    
        ul li {
          margin-bottom: 5px;
        }
      </style>
    </head>
    
    <body>
    
      <header>
        <h1>${infor.profile?.split('*/')[0].toUpperCase()}</h1>
      </header>
    
      <div class="container">
        <div class="section">
          <h2>Thông tin liên hệ</h2>
          <p>Email: ${infor.profile?.split('*/')[1]}</p>
          <p>Số điện thoại: ${infor.profile?.split('*/')[3]}</p>
          <p>Giới tính: ${infor.profile?.split('*/')[4]}</p>
          <p>Ngày sinh: ${infor.profile?.split('*/')[2].split('T')[0]}</p>
        </div>
    
        <div class="section">
          <h2>Summary</h2>
          <p>A motivated and skilled professional with experience in web development. Passionate about creating efficient
            and scalable solutions.</p>
        </div>
    
        <div class="section education">
          <h2>Học vấn</h2>
          <ul>
            ${infor.education?.map((value) => `
              <li>
                <h3>Trường: ${value.name.split('*/')[0]}</h3>
                <p>Ngành: ${value.name.split('*/')[1]}</p>
                <p>${value.name.split('*/')[2].split('-')[1]}/${value.name.split('*/')[2].split('-')[0]} - ${value.name.split('*/')[3] == 'Hiện tại' ? 'Hiện tại' : `${value.name.split('*/')[3].split('-')[1]}/${value.name.split('*/')[3].split('-')[0]}`}</p>
              </li>
            `).join('')}
          </ul>
        </div>
    
        <div class="section experience">
          <h2>Kinh nghiệm làm việc</h2>
          <ul>
            ${infor.experience?.map((value) => `
              <li>
                <h3>Công ty: ${value.name.split('*/')[0]}</h3>
                <p>Chức vụ: ${value.name.split('*/')[1]}</p>
                <p>${value.name.split('*/')[2].split('-')[1]}/${value.name.split('*/')[2].split('-')[0]} - ${value.name.split('*/')[3] == 'Hiện tại' ? 'Hiện tại' : `${value.name.split('*/')[3].split('-')[1]}/${value.name.split('*/')[3].split('-')[0]}`}</p>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="section skill">
          <h2>Kỹ năng</h2>
          <p>${infor.skill?.map((value) => {return ' ' + value.name})}</p>
      </div>
      <div class="section project">
        <h2>Dự án</h2>
        <ul>
          ${infor.project?.map((value) => `
            <li>
              <h3>Tên dự án: ${value.name.split('*/')[0]}</h3>
              <p>${value.name.split('*/')[1].split('-')[1]}/${value.name.split('*/')[1].split('-')[0]} - ${value.name.split('*/')[2] == 'Hiện tại' ? 'Hiện tại' : `${value.name.split('*/')[2].split('-')[1]}/${value.name.split('*/')[2].split('-')[0]}`}</p>
            </li>
          `).join('')}
        </ul>
      </div>
      <div class="section certificate">
        <h2>Chứng chỉ</h2>
          <ul>
            ${infor.certificate?.map((value) => `
              <li>
                <h3>Tên chứng chỉ: ${value.name.split('*/')[0]}</h3>
                <p>Tổ chức: ${value.name.split('*/')[1]}</p>
                <p>${value.name.split('*/')[2].split('-')[1]}/${value.name.split('*/')[2].split('-')[0]}</p>
              </li>
            `).join('')}
          </ul>
      </div>
      </div>
    
    </body>
    
    </html>
    `;
}


module.exports = {
    makeResume,
}