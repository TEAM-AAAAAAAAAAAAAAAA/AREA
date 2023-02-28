import React from 'react';
import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent
} from '@ionic/react';

import {
    ApolloClient,
    InMemoryCache,
    gql
} from '@apollo/client';

interface ContainerProps {
    name: string;
}

const client = new ApolloClient({
    uri: 'http://localhost:4000/',
    cache: new InMemoryCache(),
});

client
    .query({
        query: gql`
      query Query {
        allServices {
          serviceName
        }
      }
    `,
    })
    .then((result) => console.log(result));

const ServicesContainer: React.FC<ContainerProps> = () => {
    return (
        <IonContent>
            <IonCard>
                <IonCardHeader>
                    <IonCardTitle>Service Name</IonCardTitle>
                    <IonCardSubtitle>Service Type</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                    Service Description
                </IonCardContent>
            </IonCard>
        </IonContent>
    );
};

export default ServicesContainer;
