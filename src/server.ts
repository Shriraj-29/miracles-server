import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const PORT = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { name, mobile, email, selection, message, toEmail } = req.body;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Contact <onboarding-miracles@resend.dev>',
      to: [toEmail],
      subject: `Contact Form: ${selection}`,
      html: `
        <h2>New Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${selection}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});