import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendCredentialsEmailParams {
  to: string;
  name: string;
  password: string;
  role: "student" | "teacher";
}

export async function sendCredentialsEmail({ to, name, password, role }: SendCredentialsEmailParams) {
  const { error } = await resend.emails.send({
    from: "Success Academy <onboarding@resend.dev>",
    to,
    subject: "Your Success Academy account",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Welcome to Success Academy, ${name}!</h2>
        <p>An account has been created for you as a <strong>${role}</strong>.</p>
        <p><strong>Email:</strong> ${to}<br/>
        <strong>Temporary password:</strong> ${password}</p>
        <p>Please log in and contact your school administrator if you have any issues.</p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Email sending failed: ${error.message}`);
  }
}