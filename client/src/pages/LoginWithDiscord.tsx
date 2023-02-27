import {
    IonAvatar,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
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
    IonAlert,
    IonImg
} from '@ionic/react';

import LoginContainer from '../components/Login';

//function validateEmail(email: string) {
//  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
//  return re.test(String(email).toLowerCase());
//}

const LoginWithDiscord: React.FC = () => {
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

    const [
        userAvatar,
        setUserAvatar
    ] = useState<string>("");

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

    useEffect(() => {
        const access_token = window.location.hash.split('#')[1].split('&')[1].split('=')[1];
        function getUserInfos() {
            fetch('https://discord.com/api/v10/users/@me', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            })
            .then((response) => response.json())
            .then((data) => {
                setUserAvatar(`https://cdn.discordapp.com/avatars/${data?.id}/${data?.avatar}.png`);
                setEmail(data?.email);
            })
        }
        if (access_token)
            getUserInfos();
    });

    const session: any = null;
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Finalize your profile</IonTitle>
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
                            <IonAvatar class="ion-discord-avatar" ><IonImg src={userAvatar} /></IonAvatar>
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
                </IonGrid>
            </IonContent>
        </IonPage>

    );
};

export default LoginWithDiscord;
