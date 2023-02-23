import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { useState } from 'react';
import {
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import {
  personCircle,
  logoDiscord
} from "ionicons/icons";
import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonAlert
} from '@ionic/react';
import LoginContainer from '../components/Login';

//function validateEmail(email: string) {
//  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
//  return re.test(String(email).toLowerCase());
//}

const Login: React.FC = () => {
  const [
    email,
    setEmail
  ] = useState<string>("majent4@majent4.dev");

  const [
    password,
    setPassword
  ] = useState<string>("");

  const [
    iserror,
    setIserror
  ] = useState<boolean>(false);

  const [
    message,
    setMessage
  ] = useState<string>("");

  const loginWithDiscord = () => {
    console.log(process.env);
  }

  const handleLogin = () => {

    if (!email) {
      setMessage("enter email");
      setIserror(true);
      return;
    }

    //    if (validateEmail(email) === false) {
    //      setMessage("invalid email");
    //      setIserror(true);
    //      return;
    //    }

    if (!password || password.length < 6) {
      setMessage("enter pw");
      setIserror(true);
      return;
    }

    //    const loginData = {
    //      "email": email,
    //      "password": password
    //    }
  };
  const session: any = null;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding ion-text-center">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonAlert
                isOpen={iserror}
                onDidDismiss={() => setIserror(false)}
                cssClass="my-custom-class"
                header={"Error!"}
                message={message}
                buttons={["Dismiss"]}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonIcon
                style={{ fontSize: "70px", color: "#0040ff" }}
                icon={personCircle}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating"> Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value!)}
                >
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating"> Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value!)}
                >
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={handleLogin}>Login</IonButton>
              <p style={{ fontSize: "medium" }}>
                <a href=".">sign-up</a>
              </p>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton expand="block" fill="solid" color="discord" onClick={loginWithDiscord}>Login With Discord<IonIcon icon={logoDiscord} size="large"></IonIcon></IonButton>
              </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>

  );
};

export default Login;
