import React from 'react';
import {
  IonContent
} from '@ionic/react';
import {
  useSession,
  signOut,
  signIn
} from "next-auth/react"

interface ContainerProps {
  name: string;
}

const LoginContainer: React.FC<ContainerProps> = ({ name }) => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
};

export default LoginContainer;
