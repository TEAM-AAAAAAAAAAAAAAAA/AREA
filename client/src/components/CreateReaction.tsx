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

const CREATE_REACTION = gql`
mutation CreateReaction($reactionName: String!, $serviceName: String!, $userId: String!, $outgoingWebhook: String) {
    createReaction(reactionName: $reactionName, serviceName: $serviceName, userId: $userId, outgoingWebhook: $outgoingWebhook)
}`;

const CreateReaction: React.FC<ContainerProps> = ({ data }) => {
    const [present] = useIonToast();
    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);
    const [service, setService] = useState<string>('');
    const [reacts, setReacts] = useState<string[]>([]);
    const [react, setReact] = useState<string>('');

    function confirm() {
        modal.current?.dismiss(input.current?.value, 'confirm');
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            if (react != '' && service != '') {
                if ((service === 'Discord' && !ev.detail.data) || (service === 'TeamScript' && !ev.detail.data)) {
                    present({
                        message: 'Reaction creation failed',
                        duration: 1500,
                        position: 'top',
                        color: 'danger'
                    });
                    return;
                }
                client.mutate({
                    mutation: CREATE_REACTION, variables: { reactionName: react, serviceName: service, userId: data?.getUserFromToken.id, outgoingWebhook: ev.detail.data }
                }).then((result) => {
                    if (result.data?.createReaction === 200) {
                        present({
                            message: 'Reaction created successfully',
                            duration: 1500,
                            position: 'top',
                            color: 'success'
                        });
                    } else {
                        present({
                            message: 'Reaction creation failed',
                            duration: 1500,
                            position: 'top',
                            color: 'danger'
                        });
                    }
                });
            } else {
                present({
                    message: 'Reaction creation failed',
                    duration: 1500,
                    position: 'top',
                    color: 'danger'
                });
            }
        }
    }

    useEffect(() => {
        if (service) {
            setReacts(data?.allReact?.filter((react: any) => react.serviceName === service));
        }
    }, [service]);

    return (
        <IonModal ref={modal} onWillDismiss={(ev) => onWillDismiss(ev)} trigger='create-reaction'>
            <IonHeader>
                <IonToolbar className='ion-padding ion-text-center'>
                    <IonButtons slot='start'><IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton></IonButtons>
                    <IonTitle>Create Reaction</IonTitle>
                    <IonButtons slot='end'><IonButton strong={true} onClick={() => confirm()}>Create</IonButton></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent class='ion-padding'>
                <IonItem>
                    <IonLabel position='floating'>Service</IonLabel>
                    <IonSelect placeholder='Choose service' interface='popover' onIonChange={(e) => { setService(e.detail.value!); setReact('') }}>
                        {data.allServices?.map((service: any) => (
                            <IonSelectOption key={service.serviceName} value={service.serviceName}>{service.serviceName}</IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>
                {reacts.length > 0 && (
                    <IonItem>
                        <IonLabel position='floating'>Reaction</IonLabel>
                        <IonSelect placeholder='Choose reaction' interface='popover' onIonChange={(e) => setReact(e.detail.value!)}>
                            {reacts.map((react: any) => (
                                <IonSelectOption key={react.reactionName} value={react.reactionName}>{react.reactionName}</IonSelectOption>
                            ))}
                        </IonSelect>
                    </IonItem>
                )}
                {react && (
                    <>
                        {service === 'Discord' && (
                            <IonItem>
                                <IonLabel position='floating'>Channel id : </IonLabel>
                                <IonInput ref={input} placeholder='Channel id' />
                            </IonItem>
                        )}
                        {service === 'TeamScript' && (
                            <IonItem>
                                <IonLabel position='floating'>TeamScript Hook + Link to doc : </IonLabel>
                                <IonInput ref={input} placeholder='Webhook url' />
                            </IonItem>
                        )}
                    </>
                )}
            </IonContent>
        </IonModal>
    );
};

export default CreateReaction;
