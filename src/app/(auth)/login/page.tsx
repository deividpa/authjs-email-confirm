import React from 'react'
import FormLogin from '@/components/form-login'

const LoginPage = async ({ 
  searchParams 
}: {
  searchParams: Promise<{ verified: string }>
}) => {
  const params = await searchParams;
  const isVerified = params.verified === 'true'

  return (
    <div>
      <FormLogin isVerified={isVerified} />
    </div>
  )
}

export default LoginPage