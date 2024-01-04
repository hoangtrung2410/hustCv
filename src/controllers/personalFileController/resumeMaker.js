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
        const id = 5;
        const userSkill = await personalFile.findByPk(req.userId,{
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
        const userProfile = await personalFile.findAll({where: {id: id}});
        const infor = {
            
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
        <h1>LE VAN MINH</h1>
      </header>
    
      <div class="container">
        <div class="section">
          <h2>Contact Information</h2>
          <p>Email: your.email@example.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>LinkedIn: linkedin.com/in/yourname</p>
          <p>GitHub: github.com/yourusername</p>
        </div>
    
        <div class="section">
          <h2>Summary</h2>
          <p>A motivated and skilled professional with experience in web development. Passionate about creating efficient
            and scalable solutions.</p>
        </div>
    
        <div class="section experience">
          <h2>Work Experience</h2>
          <ul>
            <li>
              <h3>Web Developer</h3>
              <p>ABC Company - City, Country - January 2020 to Present</p>
              <p>Developed and maintained company websites using HTML, CSS, and JavaScript.</p>
            </li>
            <!-- Add more work experience entries as needed -->
          </ul>
        </div>
    
        <div class="section education">
          <h2>Education</h2>
          <ul>
            <li>
              <h3>Bachelor of Science in Computer Science</h3>
              <p>University Name - City, Country - Graduated May 2019</p>
            </li>
            <!-- Add more education entries as needed -->
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