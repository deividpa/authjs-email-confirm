import { Resend } from 'resend';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: "NextAuth js <onboarding@resend.dev>",
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}">here</a> to verify your email</p>`,
    });

    return {
      success: true,
    }
  } catch (error) {
    console.error(error);
    return {
      error: true,
    }
  }
}

