import {
    IonButton,
    IonContent,
    IonGrid,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { useState } from 'react';
import CreateService from '../components/CreateService';

import ServicesContainer from '../components/Services';

const Services: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className='ion-padding ion-text-center'>
                    <IonTitle>Services</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid class='create-grid'>
                    <IonButton id='create-service'>
                        Create Service
                    </IonButton>
                </IonGrid>
                <CreateService />
                <ServicesContainer />
            </IonContent>
        </IonPage>
    );
};

export default Services;
