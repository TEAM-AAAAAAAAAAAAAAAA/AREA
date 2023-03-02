import React, { useEffect, useState } from 'react';
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton
} from '@ionic/react';
import {
    client
} from '../utils/ApolloClient';
import {
    gql
} from '@apollo/client';
import ActionsContainer from './Actions';

const GET_SERVICES = gql`
  query Query {
    allServices {
        serviceName
    }
    allReact {
        reactionName
        serviceName
        description
    }
  }
`;

const ServicesContainer: React.FC = () => {
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        client.query({ query: GET_SERVICES }).then((result) => {
            setData(result.data);
        });
    }, []);

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
