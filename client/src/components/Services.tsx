import React, { useEffect, useState } from 'react';
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonItem
} from '@ionic/react';
import ActionsContainer from './Actions';

interface ContainerProps {
    data: any;
};

const ServicesContainer: React.FC<ContainerProps> = ({ data }) => {
    const [reaction, setReaction] = useState<any>();

    return (
        <>
            {data.allServices?.map((service: any) => (
                <IonCard key={service.serviceName}>
                    <IonCardHeader>
                        <IonCardTitle>{service.serviceName}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <ActionsContainer serviceName={service.serviceName} allReact={data?.allReactions} setReaction={setReaction} />
                        <IonButton>Activate</IonButton>
                        <IonButton>Deactivate</IonButton>
                        <IonButton>Dismiss</IonButton>
                    </IonCardContent>
                </IonCard>
            ))}
        </>
    );
};

export default ServicesContainer;
