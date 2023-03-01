import React, { useEffect, useState } from 'react';
import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent
} from '@ionic/react';
import {
    client
} from '../utils/ApolloClient';
import {
    gql
} from '@apollo/client';

const GET_SERVICES = gql`
  query Query {
    allServices {
      serviceName
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
                        Service Description
                    </IonCardContent>
                </IonCard>
            ))}
        </>

    );
};

export default ServicesContainer;
