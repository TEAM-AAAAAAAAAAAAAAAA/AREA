import React from 'react';
import {
  IonContent
} from '@ionic/react';
import {
  useSession
} from "next-auth/react";
//import { env } from '../config/env';

interface ContainerProps {
  name: string;
}

const LoginContainer: React.FC<ContainerProps> = ({ name }) => {
  console.log("NEXTAUTH_URL 1: " + process.env.NEXTAUTH_URL);
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
