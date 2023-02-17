import React from 'react';
import {
  IonContent,
  IonButton
} from '@ionic/react';
import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';

interface ContainerProps {
  name: string;
}

const LoginContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <IonContent>
    </IonContent>
  );
};

export default LoginContainer;
