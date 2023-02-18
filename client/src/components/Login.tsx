import React from 'react';
import {
  IonContent
} from '@ionic/react';
import {
  useSession
} from "next-auth/react";
import {
  nextConfig
} from '../next.config.js';

interface ContainerProps {
  name: string;
}

const LoginContainer: React.FC<ContainerProps> = ({ name }) => {
  console.log(nextConfig);
  console.log("hey");
  console.log(process.env.NEXTAUTH_URL);
  console.log(process.env.NEXT_PUBLIC_NEXTAUTH_URL);
//  console.log("NEXT_PUBLIC_NEXTAUTH_URL 1: " + env.NEXT_PUBLIC_NEXTAUTH_URL);
//  console.log({env.NEXTAUTH_URL});
  //console.log("NEXTAUTH_URL 2: " + env.NEXTAUTH_URL);

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
