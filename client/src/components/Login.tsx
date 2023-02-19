import React from 'react';
import {
  IonContent
} from '@ionic/react';
import {
  useSession
} from "next-auth/react";

interface ContainerProps {
  name: string;
}

const LoginContainer: React.FC<ContainerProps> = ({ name }) => {
  console.log("process.env.NEXTAUTH_URL : " + process.env.NEXTAUTH_URL);
  console.log("process.env.NEXT_PUBLIC_NEXTAUTH_URL : " + process.env.NEXT_PUBLIC_NEXTAUTH_URL);

  const { data: session } = useSession();
  if (session) {
    return (
      <IonContent>
        <>
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </>
      </IonContent>
    )
  }
  return (
    <IonContent>
      <>
      bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb

      </>
    </IonContent>
  )
};

export default LoginContainer;
