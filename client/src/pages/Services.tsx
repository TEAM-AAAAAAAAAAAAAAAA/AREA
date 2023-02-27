import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';

import ServicesContainer from '../components/Services';

const Services: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Services</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Services</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <ServicesContainer name="Services page" />
            </IonContent>
        </IonPage>
    );
};

export default Services;
