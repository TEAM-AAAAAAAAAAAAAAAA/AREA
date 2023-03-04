import React from 'react';
import {
    IonButton,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonPage,
    IonRedirect,
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

const loginWithGithub = () => {
    window.location.replace('templink');
};

const loginWithTeams = () => {
    window.location.replace('templink');
};

const loginWithGoogle = () => {
    window.location.replace(process.env.REACT_APP_GOOGLE_LOGIN_URL || '/login');
};

const Setup: React.FC = () => {

    const loginWithGithub = () => {
        return;
    };

    const loginWithTeams = () => {
        return;
    };

    const loginWithGoogle = () => {
        fetch('http://localhost:8080/auth/google/get_oauth_url', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + cookies?.token
            }
        })
        .then(res => res.json())
        .then(data => {
            window.location.href = data?.url || '/login';
        });
    };

    const [
        cookies,
        setCookie,
    ] = useCookies(['token']);

    if (!cookies?.token) {
        window.location.href = '/login';
        return (
            <div></div>
        );
    }

    return (
        <IonPage>
            <HackTheBoxSetupContainer token={cookies.token} />
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
                    <IonButton expand='block' fill='solid' onClick={loginWithGithub} color='github'>Login With Github<IonIcon class='button-icon' icon={logoGithub} size='large' /></IonButton>
                    <IonButton expand='block' fill='solid' onClick={loginWithTeams} color='teams'>Login With Teams<IonIcon class='button-icon' icon={logoMicrosoft} size='large' /></IonButton>
                    <IonButton expand='block' fill='solid' onClick={loginWithGoogle}>Login With Google<IonIcon class='button-icon' icon={logoGoogle} size='large' /></IonButton>
                    <IonButton expand='block' id='htbconfigtrigger' fill='solid' color='htb'>Configure HackTheBox<IonIcon class='button-icon' icon={cubeOutline} size='large' /></IonButton>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Setup;
