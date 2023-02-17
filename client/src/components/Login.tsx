import React from 'react';
import {
  IonContent
} from '@ionic/react';
import {
  useSession
} from "next-auth/react"

interface ContainerProps {
  name: string;
}

const LoginContainer: React.FC<ContainerProps> = ({ name }) => {
  console.log("Coucou");
  const { data: session } = useSession();
  //console.log(session);
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
