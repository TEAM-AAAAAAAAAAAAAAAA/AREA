import React from 'react';
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
    useQuery,
    gql,
    TypedDocumentNode
} from '@apollo/client';

const GET_ROCKET_INVENTORY = gql`
  query Query {
    allServices {
      serviceName
    }
  }
`;

interface ContainerProps {
    name: string;
}

client
    .query({
        query: gql`
      query Query {
        allServices {
          serviceName
        }
      }
    `,
    });

const ServicesContainer: React.FC<ContainerProps> = () => {
    const { loading, data } = useQuery(
        GET_ROCKET_INVENTORY
    );
    return (
        { data && data.rocketInventory.map(inventory => (
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{inventory.serviceName}</IonCardTitle>
                        <IonCardSubtitle>Service Type</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        Service Description
                    </IonCardContent>
                </IonCard>
            </IonContent>
        ))}

    );
};

export default ServicesContainer;
