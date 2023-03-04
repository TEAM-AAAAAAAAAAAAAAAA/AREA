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
// import {
//     personCircle,
//     logoDiscord
// } from "ionicons/icons";
import {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonAlert,
    IonImg
} from '@ionic/react';
import {
    useCookies
} from 'react-cookie';

//function validateEmail(email: string) {
//  const re = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
//  return re.test(String(email).toLowerCase());
//}

const LoginWithDiscord: React.FC = () => {
    const [
        email,
        setEmail
    ] = useState<string>('');

    const [
        password,
        setPassword
    ] = useState<string>('');

    const [
        name,
        setName
    ] = useState<string>('');

    let OAuthTokens = {
        accessToken: '',
        refreshToken: ''
    };

    const [
        iserror,
        setIserror
    ] = useState<boolean>(false);

    const [
        message,
        setMessage
    ] = useState<string>('');

    const [
        userAvatar,
        setUserAvatar
    ] = useState<string>('');

    const [
        cookies,
        setCookies
    ] = useCookies(['token']);

    const handleLogin = async () => {
        let OAuthUserData: Object;
        if (!email) {
            setMessage('enter email');
            setIserror(true);
            return;
        }
        if (!password || password.length < 6) {
            setMessage('enter pw');
            setIserror(true);
            return;
        }
        let accessToken = OAuthTokens.accessToken;
        let refreshToken = OAuthTokens.refreshToken;

        fetch('https://discord.com/api/v10/users/@me', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
            .then((response) => response.json())
            .then((data) => {
                OAuthUserData = data;
                return fetch('http://localhost:8080/auth/discord_oauth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ accessToken, refreshToken, email, password, name, userData: OAuthUserData })
                })
            })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data?.error) {
                setMessage(data?.error);
                setIserror(true);
            } else {
                console.log(data?.token);
                setCookies('token', data?.token, { path: '/' });
                window.location.href = '/services';
            }
        });
    };

    useEffect(() => {
        const access_token = window.location.hash.split('#')[1].split('&')[1].split('=')[1];
        function getUserInfos() {
            OAuthTokens.accessToken = access_token;
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
                    setName(data?.username);
                });
        }
        if (access_token)
            getUserInfos();
    });
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-padding ion-text-center">
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
                                header={'Error!'}
                                message={message}
                                buttons={['Dismiss']}
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
                                <IonLabel position="floating"> Username</IonLabel>
                                <IonInput
                                    type="email"
                                    value={name}
                                    onIonChange={(e) => setName(e.detail.value!)}
                                >
                                </IonInput>
                            </IonItem>
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
                            <p style={{ fontSize: 'medium' }}>
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
