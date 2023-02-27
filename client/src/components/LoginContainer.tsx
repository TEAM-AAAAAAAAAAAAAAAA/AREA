import React from 'react';
import {
  IonContent
} from '@ionic/react';

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
