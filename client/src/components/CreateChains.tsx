import React, { useRef } from 'react';
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
    IonTitle,
    IonToolbar,
    useIonToast
} from '@ionic/react';
import {
    OverlayEventDetail
} from '@ionic/react/dist/types/components/react-component-lib/interfaces';

const CreateChains: React.FC = () => {
    const [present] = useIonToast();
    const modal = useRef<HTMLIonModalElement>(null);
    const input = useRef<HTMLIonInputElement>(null);

    function confirm() {
        modal.current?.dismiss(input.current?.value, 'confirm');
    }

    function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
        if (ev.detail.role === 'confirm') {
            if (ev.detail.data) {
                client.mutate({
                    mutation: gql`
                    mutation Mutation($name: String!) {
                        createService(name: $name)
                      }
                    `, variables: { name: ev.detail.data }
                }).then((result) => {
                    if (result.data?.createService === 200) {
                        present({
                            message: 'Service created successfully',
                            duration: 1500,
                            position: 'top',
                            color: 'success'
                        });
                    } else {
                        present({
                            message: 'Service creation failed',
                            duration: 1500,
                            position: 'top',
                            color: 'danger'
                        });
                    }
                });
            } else {
                present({
                    message: 'Service creation failed',
                    duration: 1500,
                    position: 'top',
                    color: 'danger'
                });
            }
        }
    }
    return (
        <IonModal ref={modal} onWillDismiss={(ev) => onWillDismiss(ev)} trigger='create-service'>
            <IonHeader>
                <IonToolbar className='ion-padding ion-text-center'>
                    <IonButtons slot='start'><IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton></IonButtons>
                    <IonTitle>Create Service</IonTitle>
                    <IonButtons slot='end'><IonButton strong={true} onClick={() => confirm()}>Create</IonButton></IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent class='ion-padding'>
                <IonItem>
                    <IonLabel class='modal-label'>Enter new service name :</IonLabel>
                    <IonInput ref={input} type="text" placeholder="..." />
                </IonItem>
            </IonContent>
        </IonModal>
    );
};

export default CreateChains;
