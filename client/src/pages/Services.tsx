import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ServicesContainer from '../components/ServicesContainer';

const Tab2: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>AREA - services</IonTitle>
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

export default Tab2;
