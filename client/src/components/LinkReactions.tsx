import React, { useEffect, useRef, useState } from 'react';
import { client } from '../utils/ApolloClient';
import { gql } from '@apollo/client';
import {
    IonButton,
    IonButtons,
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
        modal.current?.dismiss({first: firstWebhook.current?.value, second: secondWebhook.current?.value}, 'confirm');
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            if (ev.detail.data) {
                console.log(ev.detail.data);
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
        <IonModal ref={modal} onWillDismiss={(ev) => onWillDismiss(ev)} trigger='link-reactions'>
            <IonHeader>
                <IonToolbar className='ion-padding ion-text-center'>
                    <IonButtons slot='start'><IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton></IonButtons>
                    <IonTitle>Link Reactions</IonTitle>
                    <IonButtons slot='end'><IonButton strong={true} onClick={() => confirm()}>Create</IonButton></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent class='ion-padding'>
                <IonItem>
                    <IonLabel class='modal-label'>Choose first service :</IonLabel>
                    <IonSelect placeholder='Choose service' interface='popover' onIonChange={(e) => {setFirstService(e.detail.value); setFirstReact('')}}>
                        {data.allServices?.map((service: any) => (
                            <IonSelectOption key={service.serviceName} value={service.serviceName}>{service.serviceName}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                {firstService !== '' && (
                    <IonItem>
                        <IonLabel class='modal-label'>Choose first service's reaction :</IonLabel>
                        <IonSelect placeholder='Choose reaction' interface='popover' onIonChange={(e) => setFirstReact(e.detail.value)}>
                            {firstReacts?.map((react: any) => (
                                <IonSelectOption key={react.reactionName} value={react.reactionName}>{react.reactionName}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                )
                }
                {firstReact !== '' && firstService !== '' && (
                    <IonItem>
                        <IonLabel class='modal-label'>Input first reaction's webhook :</IonLabel>
                        <IonInput ref={firstWebhook} placeholder='Input webhook' />
                    </IonItem>
                )}
                <IonItem>
                    <IonLabel class='modal-label'>Choose second service :</IonLabel>
                    <IonSelect placeholder='Choose service' interface='popover' onIonChange={(e) => {setSecondService(e.detail.value); setSecondReact('')}}>
                        {data.allServices?.map((service: any) => (
                            <IonSelectOption key={service.serviceName} value={service.serviceName}>{service.serviceName}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                {secondService !== '' && (
                    <IonItem>
                        <IonLabel class='modal-label'>Choose second service's reaction :</IonLabel>
                        <IonSelect placeholder='Choose reaction' interface='popover' onIonChange={(e) => {setSecondReact(e.detail.value)}}>
                            {secondReacts?.map((react: any) => (
                                <IonSelectOption key={react.reactionName} value={react.reactionName}>{react.reactionName}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                )}
                {secondReact !== '' && secondService !== '' && (
                    <IonItem>
                        <IonLabel class='modal-label'>Input second reaction's webhook :</IonLabel>
                        <IonInput ref={secondWebhook} placeholder='Input webhook' />
                    </IonItem>
                )}
            </IonContent>
        </IonModal>
    );
};

export default LinkReactions;
