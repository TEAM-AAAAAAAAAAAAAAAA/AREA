import React, { useEffect, useState } from 'react';
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
} from '@ionic/react';
import ActionsContainer from './Actions';

interface ContainerProps {
    data: any;
};

const ServicesContainer: React.FC<ContainerProps> = ({ data }) => {
    return (
        <>
            {data.allServices?.map((service: any) => (
                <IonCard key={service.serviceName}>
                    <IonCardHeader>
                        <IonCardTitle>{service.serviceName}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <ActionsContainer serviceName={service.serviceName} allReact={data?.allReactions} />
                    </IonCardContent>
                </IonCard>
            ))}
        </>
    );
};

export default ServicesContainer;
