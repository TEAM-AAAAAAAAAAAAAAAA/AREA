import {
    IonButton,
    IonContent,
    IonGrid,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
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
            <IonContent fullscreen>
                <IonGrid class='create-grid'>
                    <IonButton id='create-service'>
                        Create Service
                    </IonButton>
                </IonGrid>
                <CreateService />
                <IonHeader collapse='condense'>
                    <IonToolbar>
                        <IonTitle size='large'>Services</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <ServicesContainer name='Services page' />
            </IonContent>
        </IonPage>
    );
};

export default Services;
