import React, { useEffect, useState } from 'react';
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton
} from '@ionic/react';
import ActionsContainer from './Actions';

interface ContainerProps {
    data: any;
};

const ServicesContainer: React.FC<ContainerProps> = ({data}) => {
    return (
        <>
            {data.allServices?.map((service: any) => (
                <IonCard key={service.serviceName}>
                    <IonCardHeader>
                        <IonCardTitle>{service.serviceName}</IonCardTitle>
                        <IonCardSubtitle>Service Type</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <ActionsContainer serviceName={service.serviceName} allReact={data?.allReact} />
                    </IonCardContent>
                    <IonButton>activate</IonButton>
                </IonCard>
            ))}
        </>
    );
};

export default ServicesContainer;
