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

interface ContainerProps {
    name: string;
}


const ServicesContainer: React.FC<ContainerProps> = () => {
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        client.query({ query: GET_SERVICES }).then((result) => {
            setData(result.data);
        });
    });

    return (
        <IonContent>
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
        </IonContent>

    );
};

export default ServicesContainer;
