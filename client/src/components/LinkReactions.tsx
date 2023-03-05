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

const LinkReactions: React.FC<ContainerProps> = ({ data }) => {
    const [present] = useIonToast();
    const [firstService, setFirstService] = useState<string>('');
    const [firstReacts, setFirstReacts] = useState<string[]>([]);
    const [firstReact, setFirstReact] = useState<string>('');
    const [secondService, setSecondService] = useState<string>('');
    const [secondReacts, setSecondReacts] = useState<string[]>([]);
    const [secondReact, setSecondReact] = useState<string>('');
    const modal = useRef<HTMLIonModalElement>(null);
    const firstWebhook = useRef<HTMLIonInputElement>(null);
    const secondWebhook = useRef<HTMLIonInputElement>(null);

    function confirm() {
        modal.current?.dismiss({ first: firstWebhook.current?.value, second: secondWebhook.current?.value }, 'confirm');
    }

    function getDesc(list: any, name: string) {
        for (let i = 0; i < list.length; i++) {
            if (list[i].reactionName === name) {
                return list[i].description;
            }
        }
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            if (firstReact && secondReact && firstService && secondService) {
                client.mutate({
                    mutation: gql`
                    mutation Mutation($actionName: String!, $actionService: String!, $reactionName: String!, $reactionService: String!, $reactionOutgoingWebhook: String, $actionOutgoingWebhook: String) {
                        createChainedReaction(actionName: $actionName, actionService: $actionService, reactionName: $reactionName, reactionService: $reactionService, reactionOutgoingWebhook: $reactionOutgoingWebhook, actionOutgoingWebhook: $actionOutgoingWebhook)
                    }`, variables: { actionName: firstReact, actionService: firstService, reactionName: secondReact, reactionService: secondService, reactionOutgoingWebhook: ev.detail.data.second, actionOutgoingWebhook: ev.detail.data.first }
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
    useEffect(() => {
        setFirstReacts(data?.allReact?.filter((react: any) => react.serviceName === firstService));
        if (firstService === secondService) {
            setFirstReacts(data?.allReact?.filter((react: any) => react.serviceName === firstService && react.reactionName != secondReact));
        }
    }, [firstService]);

    useEffect(() => {
        if (firstService === secondService)
            setSecondReacts(data?.allReact?.filter((react: any) => react.serviceName === secondService && react.reactionName != firstReact));
    }, [firstReact]);

    useEffect(() => {
        if (firstService === secondService)
            setFirstReacts(data?.allReact?.filter((react: any) => react.serviceName === firstService && react.reactionName != secondReact));
    }, [secondReact]);

    useEffect(() => {
        setSecondReacts(data?.allReact?.filter((react: any) => react.serviceName === secondService));
        if (firstService === secondService)
            setSecondReacts(data?.allReact?.filter((react: any) => react.serviceName === secondService && react.reactionName != firstReact));
    }, [secondService]);

    return (
        <IonModal ref={modal} onWillDismiss={(ev) => onWillDismiss(ev)} onWillPresent={() => { setFirstService(''); setFirstReacts([]); setFirstReact(''); setSecondService(''); setSecondReacts([]); setSecondReact('') }} trigger='link-reactions'>
            <IonHeader>
                <IonToolbar className='ion-padding ion-text-center'>
                    <IonButtons slot='start'><IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton></IonButtons>
                    <IonTitle>Link Reactions</IonTitle>
                    <IonButtons slot='end'><IonButton strong={true} onClick={() => confirm()}>Create</IonButton></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent class='ion-padding'>
                <IonItem>
                    <IonLabel position='floating' >Choose first service :</IonLabel>
                    <IonSelect placeholder='Choose service' interface='popover' onIonChange={(e) => { setFirstService(e.detail.value); setFirstReact('') }}>
                        {data.allServices?.map((service: any) => (
                            <IonSelectOption key={service.serviceName} value={service.serviceName}>{service.serviceName}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                {firstService !== '' && (
                    <IonItem>
                        <IonLabel position='floating' >Choose first service's reaction :</IonLabel>
                        <IonSelect placeholder='Choose reaction' interface='popover' onIonChange={(e) => setFirstReact(e.detail.value)}>
                            {firstReacts?.map((react: any) => (
                                <IonSelectOption key={react.reactionName} value={react.reactionName}>{react.reactionName}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                )
                }
                {firstReact !== '' && firstService !== '' && (
                    <>
                        <IonItem>
                            Reaction Description : {getDesc(firstReacts, firstReact)}
                        </IonItem>
                        {firstService === 'Discord' && (
                            <IonItem>
                                <IonLabel position='floating'>Channel id : </IonLabel>
                                <IonInput ref={firstWebhook} placeholder='Channel id' />
                            </IonItem>
                        )}
                        {firstService === 'TeamScript' && (
                            <IonItem>
                                <IonLabel position='floating'>TeamScript Hook + Link to doc : </IonLabel>
                                <IonInput ref={firstWebhook} placeholder='Webhook url' />
                            </IonItem>
                        )}

                    </>
                )}
                <IonItem>
                    <IonLabel position='floating' >Choose second service :</IonLabel>
                    <IonSelect placeholder='Choose service' interface='popover' onIonChange={(e) => { setSecondService(e.detail.value); setSecondReact('') }}>
                        {data.allServices?.map((service: any) => (
                            <IonSelectOption key={service.serviceName} value={service.serviceName}>{service.serviceName}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                {secondService !== '' && (
                    <IonItem>
                        <IonLabel position='floating' >Choose second service's reaction :</IonLabel>
                        <IonSelect placeholder='Choose reaction' interface='popover' onIonChange={(e) => { setSecondReact(e.detail.value) }}>
                            {secondReacts?.map((react: any) => (
                                <IonSelectOption key={react.reactionName} value={react.reactionName}>{react.reactionName}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                )}
                {secondReact !== '' && secondService !== '' && (
                    <>
                        <IonItem>
                            Reaction Description : {getDesc(secondReacts, secondReact)}
                        </IonItem>
                        {secondService === 'Discord' && (
                            <IonItem>
                                <IonLabel position='floating'>Channel id : </IonLabel>
                                <IonInput ref={secondWebhook} placeholder='Channel id' />
                            </IonItem>
                        )}
                        {secondService === 'TeamScript' && (
                            <IonItem>
                                <IonLabel position='floating'>TeamScript Hook + Link to doc : </IonLabel>
                                <IonInput ref={secondWebhook} placeholder='Webhook url' />
                            </IonItem>
                        )}

                    </>
                )}
            </IonContent>
        </IonModal>
    );
};

export default LinkReactions;
