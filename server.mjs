// server.js
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON from frontend


    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // app password if using Gmail
      },
    });

    
transporter.verify((error, success) => {
  if (error) console.log("Mailer Error:", error);
  else console.log("Server is ready to send emails", success);
});
app.post("/send-registration", async (req, res) => {
  try {
    const {
      name,
      email,
      equityExp,
      fnoExp,
      isFresher,
      totalLoss,
      totalProfit,
      occupation,
      reason,
    } = req.body;


    const mailOptions = {
      from: `"RR Vyapar Registration" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO, // your email where submissions go
      subject: `New Registration: ${name}`,
      html: `
        <h3>New RR Vyapar Registration</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Equity Exp:</strong> ${equityExp}</p>
        <p><strong>F&O Exp:</strong> ${fnoExp}</p>
        <p><strong>Fresher:</strong> ${isFresher ? "Yes" : "No"}</p>
        <p><strong>Total Loss:</strong> ${totalLoss || "N/A"}</p>
        <p><strong>Total Profit:</strong> ${totalProfit || "N/A"}</p>
        <p><strong>Occupation:</strong> ${occupation}</p>
        <p><strong>Reason:</strong> ${reason}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


