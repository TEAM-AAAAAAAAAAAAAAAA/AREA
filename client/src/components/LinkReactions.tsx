import React, { useEffect, useRef, useState } from 'react';
import { client } from '../utils/ApolloClient';
import { gql } from '@apollo/client';
import {
    IonButton,
    IonButtons,
    IonCardContent,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    useIonToast
} from '@ionic/react';
import {
    OverlayEventDetail
} from '@ionic/react/dist/types/components/react-component-lib/interfaces';

interface ContainerProps {
    data: any;
};

const LINK_REACTIONS = gql`
mutation CreateChainedReaction($actionId: Int!, $reactionId: Int!) {
    createChainedReaction(actionId: $actionId, reactionId: $reactionId)
}`

const LinkReactions: React.FC<ContainerProps> = ({ data }) => {
    const [present] = useIonToast();
    const [firstReaction, setFirstReaction] = useState<any>(null);
    const [secondReaction, setSecondReaction] = useState<any>(null);
    const modal = useRef<HTMLIonModalElement>(null);
    const firstWebhook = useRef<HTMLIonInputElement>(null);
    const secondWebhook = useRef<HTMLIonInputElement>(null);

    function confirm() {
        modal.current?.dismiss({ first: firstWebhook.current?.value, second: secondWebhook.current?.value }, 'confirm');
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            if (firstReaction && secondReaction) {
                client.mutate({
                    mutation: LINK_REACTIONS, variables: { actionId: firstReaction.reactionId, reactionId: secondReaction.reactionId }
                }).then((result) => {
                    if (result.data?.createChainedReaction === 200) {
                        present({
                            message: 'Link created successfully',
                            duration: 1500,
                            position: 'top',
                            color: 'success'
                        });
                    } else {
                        present({
                            message: 'Link creation failed',
                            duration: 1500,
                            position: 'top',
                            color: 'danger'
                        });
                    }
                });
            } else {
                present({
                    message: 'Link creation failed',
                    duration: 1500,
                    position: 'top',
                    color: 'danger'
                });
            }
        }
    }

    return (
        <IonModal ref={modal} onWillDismiss={(ev) => onWillDismiss(ev)} onWillPresent={() => { setFirstReaction(null); setSecondReaction(null) }} trigger='link-reactions'>
            <IonHeader>
                <IonToolbar className='ion-padding ion-text-center'>
                    <IonButtons slot='start'><IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton></IonButtons>
                    <IonTitle>Link Reactions</IonTitle>
                    <IonButtons slot='end'><IonButton strong={true} onClick={() => confirm()}>Create</IonButton></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent class='ion-padding'>
                <IonItem>
                    <IonLabel position='floating' >Choose first service's reaction :</IonLabel>
                    <IonSelect placeholder='Choose reaction' interface='popover' onIonChange={(e) => setFirstReaction(e.detail.value)}>
                        {data.allReactions?.filter((reaction: any) => reaction.reactionId != secondReaction?.reactionId).map((react: any) => (
                            <IonSelectOption key={react} value={react}>{react.reactionName} : {react.reactionId} from {react.serviceName}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position='floating' >Choose second service's reaction :</IonLabel>
                    <IonSelect placeholder='Choose reaction' interface='popover' onIonChange={(e) => { setSecondReaction(e.detail.value) }}>
                        {data.allReactions?.filter((reaction: any) => reaction.reactionId != firstReaction?.reactionId).map((react: any) => (
                            <IonSelectOption key={react} value={react}>{react.reactionName} : {react.reactionId} from {react.serviceName}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
            </IonContent>
        </IonModal>
    );
};

export default LinkReactions;
