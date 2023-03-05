import React, { useEffect } from 'react';
import {
    IonButton,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {
    cubeOutline,
    logoDiscord,
    logoGithub,
    logoGoogle,
    logoMicrosoft,
} from 'ionicons/icons';
import {
    loginWithDiscord,
} from './Login';
import HackTheBoxSetupContainer from '../components/HackTheBoxSetup';
import { useCookies } from 'react-cookie';
import GithubSetupContainer from '../components/GithubSetup';

const Setup: React.FC = () => {
    const [
        cookies,
        setCookie,
    ] = useCookies(['token', 'google_access_token', 'google_refresh_token']);

    const loginWithGithub = () => {
        window.location.replace('templink');
    };

    const loginWithTeams = () => {
        window.location.replace('templink');
    };

    useEffect(() => {
        const authCode = new URLSearchParams(window.location.search).get('code');

        if (!authCode)
            return;
        if (!cookies?.google_refresh_token || !cookies?.google_access_token) {
            fetch(`http://${process.env.SERVER_IP}:8080/auth/google/get_oauth_tokens`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + cookies?.token
                },
                body: JSON.stringify({ code: authCode })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setCookie('google_access_token', data?.tokens?.access_token, { path: '/' });
                setCookie('google_refresh_token', data?.tokens?.refresh_token, { path: '/' });
            })
            .catch(err => console.log(err));
        }
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + cookies?.google_access_token
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data?.error?.code)
                return;
            return fetch(`http://${process.env.SERVER_IP}:8080/auth/google/google_oauth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + cookies?.token
                },
                body: JSON.stringify({ accessToken: cookies.google_access_token, refreshToken: cookies.google_refresh_token, userData: data })
            });
        })
        .then(res => res?.json())
        .then(data => {
            console.log(data);
        })
    });

    return (
        <IonPage>
            <HackTheBoxSetupContainer token={cookies.token} />
            <GithubSetupContainer token={cookies.token} />
            <IonHeader>
                <IonToolbar className="ion-padding ion-text-center">
                    <IonTitle>Setup</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse='condense'>
                    <IonToolbar>
                        <IonTitle size='large'>Setup</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid class='setup-grid'>
                    <IonButton expand='block' fill='solid' onClick={loginWithDiscord} color='discord'>Login With Discord<IonIcon class='button-icon' icon={logoDiscord} size='large' /></IonButton>
                    <IonButton expand='block' id='githubconfigtrigger' fill='solid' color='github'>Login With Github<IonIcon class='button-icon' icon={logoGithub} size='large' /></IonButton>
                    <IonButton expand='block' fill='solid' onClick={loginWithTeams} color='teams'>Login With Teams<IonIcon class='button-icon' icon={logoMicrosoft} size='large' /></IonButton>
                    <IonButton expand='block' id='htbconfigtrigger' fill='solid' color='htb'>Configure HackTheBox<IonIcon class='button-icon' icon={cubeOutline} size='large' /></IonButton>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Setup;