import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const token = searchParams.get('token')

  if(!token) {
    return new Response('Token not found', { status: 400 })
  }

  // Verify if the token exists in the database
  const verifyEmailToken = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });

  if (!verifyEmailToken) {
    return new Response('Token not found', { status: 400 })
  }

  // Verify if the token is expired
  if (verifyEmailToken.expires < new Date()) {
    return new Response('Token expired', { status: 400 })
  }

  // Verify if the email was already verified
  const user = await prisma.user.findUnique({
    where: {
      email: verifyEmailToken.identifier,
    },
  });

  if (user?.emailVerified) {
    return new Response('Email already verified', { status: 400 })
  }

  // Update the user emailVerified field
  await prisma.user.update({
    where: {
      email: verifyEmailToken.identifier,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  // Delete the token
  await prisma.verificationToken.delete({
    where: {
      identifier: verifyEmailToken.identifier,
    },
  });

  redirect('/login?verified=true')
}