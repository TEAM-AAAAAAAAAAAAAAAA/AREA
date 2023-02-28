import React from 'react';
import { IonButton, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { cubeOutline, logoDiscord, logoGithub, logoMicrosoft, logoSoundcloud } from 'ionicons/icons';

const Setup: React.FC = () => {

    const loginWithDiscord = () => {
        window.location.replace('https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A8081%2Fauth%2Fdiscord%2Fcb&response_type=token&scope=identify%20email');
    };

    const loginWithGithub = () => {
        window.location.replace('templink');
    };

    const loginWithTeams = () => {
        window.location.replace('templink');
    };

    const loginWithSoundcloud = () => {
        window.location.replace('templink');
    };

    const loginWithHtb = () => {
        window.location.replace('templink');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-padding ion-text-center">
                    <IonTitle>AREA - setup</IonTitle>
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
                    <IonButton expand='block' fill='solid' onClick={loginWithSoundcloud} color='soundcloud'>Login With Soundcloud<IonIcon class='button-icon' icon={logoSoundcloud} size='large' /></IonButton>
                    <IonButton expand='block' fill='solid' onClick={loginWithHtb} color='htb'>Login With HackTheBox<IonIcon class='button-icon' icon={cubeOutline} size='large' /></IonButton>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Setup;