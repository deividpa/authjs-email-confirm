import { auth } from '@/auth'
import LogoutButton from '@/components/logout-button';
import React from 'react'

const AdminPage = async () => {

  const session = await auth();

  if(!session) {
    return null;
  }

  if(session?.user?.role !== 'ADMIN') {
    return (
      <div>You are not an admin</div>
  );
  }

  return (
    <div className="container">
      <LogoutButton />
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}

export default AdminPage