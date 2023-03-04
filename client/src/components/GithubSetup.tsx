import React, { useRef, useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonModal,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonInput,
    IonItem,
    IonIcon
} from '@ionic/react';
import { OverlayEventDetail } from '@ionic/core';
import { logoGithub } from 'ionicons/icons';

interface GithubSetupProps {
    token: string;
}

const GithubSetupContainer: React.FC<GithubSetupProps> = (cookies) => {
    const modalConfig = useRef<HTMLIonModalElement>(null);
    const appTokenInput = useRef<HTMLIonInputElement>(null);

    function confirm(){
        modalConfig.current?.dismiss(appTokenInput.current?.value, 'submit');
    }

    function onWillDismiss(e: CustomEvent<OverlayEventDetail>){
        if (e.detail.role === 'submit'){
            if (e.detail.data){
                if (!(cookies as any).token){
                    console.error("Cookies not set, please login again");
                    return;
                }
                console.dir(cookies);
                fetch('http://localhost:8080/auth/github_config', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + cookies.token
                    },
                    body: JSON.stringify({ GithubAppToken: e.detail.data })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                })
                .catch(err => console.error(err));
            }
        }
    }

    return (
        <IonModal ref={modalConfig} trigger="githubconfigtrigger" onWillDismiss={(e)=>{onWillDismiss(e)}}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={()=>{modalConfig.current?.dismiss()}}>Close</IonButton>
                    </IonButtons>
                    <IonTitle>Github Token Setup<IonIcon icon={logoGithub} size="large"></IonIcon></IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={()=>{confirm()}}>Confirm</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='ion-padding'>
                <IonItem>Enter your Github API token:</IonItem>
                <IonInput ref={appTokenInput} clearInput={true} type='text' placeholder='Github API Token' />
            </IonContent>
        </IonModal>
    );
};

export default GithubSetupContainer;