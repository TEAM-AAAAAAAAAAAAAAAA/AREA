import React, { useEffect, useRef, useState } from 'react';
import { client } from '../utils/ApolloClient';
import { gql } from '@apollo/client';
import {
    IonButton,
    IonButtons,
    IonCard,
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
    useIonAlert,
    useIonToast
} from '@ionic/react';
import {
    OverlayEventDetail
} from '@ionic/react/dist/types/components/react-component-lib/interfaces';

interface ContainerProps {
    data: any;
};

const LINK_ACTION = gql`
mutation LinkActionWebhook($reactionId: Int!, $userId: String!, $actionName: String!, $serviceName: String!) {
    linkActionWebhook(reactionId: $reactionId, userId: $userId, actionName: $actionName, serviceName: $serviceName)
}`;

const GET_WEBHOOK = gql`
query GetWebhook($reactionId: Int!) {
    getWebhook(reactionId: $reactionId) {
      webhookId
    }
}`;
const SET_DISCORD_WEBHOOK = gql`
mutation CreateDiscordBotWebhook($command: String!, $userId: String!, $serverId: String!, $webhookId: String) {
    createDiscordBotWebhook(command: $command, userId: $userId, serverId: $serverId, webhookId: $webhookId)
  }`;

const LinkAction: React.FC<ContainerProps> = ({ data }) => {
    const [present] = useIonToast();
    const services = ['Discord', 'TeamScript'];
    const serverId = useRef<HTMLIonInputElement>(null);
    const [actionService, setActionService] = useState<string>('');
    const [reactionService, setReactionService] = useState<string>('');
    const [action, setAction] = useState<any>();
    const [actions, setActions] = useState<string[]>([]);
    const [reaction, setReaction] = useState<any>();
    const [reactions, setReactions] = useState<string[]>([]);
    const modal = useRef<HTMLIonModalElement>(null);
    const ts_modal = useRef<HTMLIonModalElement>(null);
    const [update, setUpdate] = useState<boolean>(false);
    const [tsLink, setTsLink] = useState<string>('');

    function confirm() {
        modal.current?.dismiss(serverId.current?.value, 'confirm');
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            if (actionService != '' && reactionService != '' && action && reaction) {
                client.mutate({
                    mutation: LINK_ACTION, variables: { reactionId: reaction.reactionId, userId: data?.getUserFromToken.id, actionName: action.actionName, serviceName: actionService }
                }).then((result) => {
                    if (result.data?.linkActionWebhook === 200) {
                        present({
                            message: 'Linking successful',
                            duration: 1500,
                            position: 'top',
                            color: 'success'
                        });
                        client.query({ query: GET_WEBHOOK, variables: { reactionId: reaction.reactionId } }).then((result) => {
                            if (actionService === 'Discord') {
                                client.mutate({
                                    mutation: SET_DISCORD_WEBHOOK, variables: {
                                        command: action.actionName,
                                        userId: data?.getUserFromToken.id,
                                        serverId: ev.detail?.data,
                                        webhookId: result.data?.getWebhook.webhookId
                                    }
                                })
                            } else {
                                setTsLink(`/hook/${data?.getUserFromToken.id}/${result.data?.getWebhook.webhookId}`);
                                ts_modal.current?.present();
                            }
                        });
                    } else {
                        present({
                            message: 'Linking failed',
                            duration: 1500,
                            position: 'top',
                            color: 'danger'
                        });
                    }
                });
            } else {
                present({
                    message: 'Linking failed',
                    duration: 1500,
                    position: 'top',
                    color: 'danger'
                });
            }
        }
        setActionService('');
        setReactionService('');
        setAction('');
        setReaction('');
        setReactions([]);
        setActions([]);
    }

    useEffect(() => {
        setActions(data?.allActions?.filter((action: any) => action.serviceName === actionService));
    }, [actionService]);

    useEffect(() => {
        setReactions(data?.allReactions?.filter((reaction: any) => reaction.serviceName === reactionService));
    }, [reactionService]);

    useEffect(() => {
        if (actionService === 'TeamScript') {
        }
    }, [update]);

    return (
        <>
            <IonModal ref={ts_modal} >
                <IonHeader>
                    <IonToolbar className='ion-padding ion-text-center'>
                        <IonButtons slot='start'><IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton></IonButtons>
                        <IonTitle>TeamScript</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent class='ion-padding'>
                    <IonItem>
                        <IonLabel position='stacked'>Instructions :</IonLabel>
                        <IonCardContent>
                                Go to the following link in order to set up your webhook
                        </IonCardContent>
                    </IonItem>
                    <IonItem>
                        <IonLabel position='stacked'>Link :</IonLabel>
                        <IonCardContent>{tsLink}</IonCardContent>
                    </IonItem>
                    <IonItem>
                        <IonLabel position='stacked'>Doc :</IonLabel>
                        <IonCardContent>Put the link to the doc</IonCardContent>
                    </IonItem>
                    </IonContent>
            </IonModal>
            <IonModal ref={modal} onWillDismiss={(ev) => onWillDismiss(ev)} trigger='link-action'>
                <IonHeader>
                    <IonToolbar className='ion-padding ion-text-center'>
                        <IonButtons slot='start'><IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton></IonButtons>
                        <IonTitle>Link Actions</IonTitle>
                        <IonButtons slot='end'><IonButton strong={true} onClick={() => confirm()}>Create</IonButton></IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent class='ion-padding'>
                    <IonItem>
                        <IonLabel position='floating'>Action Service</IonLabel>
                        <IonSelect placeholder='Choose service' interface='popover' onIonChange={(e) => { setActionService(e.detail.value!); setAction('') }}>
                            {services.map((service: any) => (
                                <IonSelectOption key={service} value={service}>{service}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                    {actionService && actions && (
                        <>
                            <IonItem>
                                <IonLabel position='floating'>Action</IonLabel>
                                <IonSelect placeholder='Choose action' interface='popover' onIonChange={(e) => { setAction(e.detail.value!) }}>
                                    {actions.map((action: any) => (
                                        <IonSelectOption key={action.actionName} value={action}>{action.actionName}</IonSelectOption>
                                    ))}
                                </IonSelect>
                                {action && (
                                    <IonCardContent>
                                        {action.description}
                                    </IonCardContent>
                                )}
                            </IonItem>
                            {actionService === 'Discord' && (
                                <IonItem>
                                    <IonLabel position='floating'>Server ID</IonLabel>
                                    <IonInput ref={serverId} placeholder='Server ID' />
                                </IonItem>
                            )}
                        </>
                    )
                    }
                    <IonItem>
                        <IonLabel position='floating'>Reaction Service</IonLabel>
                        <IonSelect placeholder='Choose service' interface='popover' onIonChange={(e) => { setReactionService(e.detail.value!); setReaction('') }}>
                            {data.allServices?.map((service: any) => (
                                <IonSelectOption key={service.serviceName} value={service.serviceName}>{service.serviceName}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                    {reactionService && reactions && (
                        <IonItem>
                            <IonLabel position='floating'>Reaction</IonLabel>
                            <IonSelect placeholder='Choose reaction' interface='popover' onIonChange={(e) => { setReaction(e.detail.value!) }}>
                                {reactions.map((reaction: any) => (
                                    <IonSelectOption key={reaction.reactionName} value={reaction}>{reaction.reactionName}</IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                    )}
                </IonContent>
            </IonModal>
        </>
    );
};

export default LinkAction;
