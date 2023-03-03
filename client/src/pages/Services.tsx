import {
    IonButton,
    IonContent,
    IonGrid,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import { useEffect, useState } from 'react';
import CreateService from '../components/CreateService';
import LinkReactions from '../components/LinkReactions';

import ServicesContainer from '../components/Services';
import { client } from '../utils/ApolloClient';
import {
    gql
} from '@apollo/client';

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
    allReactions {
        reactionName
        serviceName
        reactionId
        react {
            reactionName
            description
        }
        enabled
    }
  }
`;

const Services: React.FC = () => {
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        client.query({ query: GET_SERVICES }).then((result) => {
            setData(result.data);
        });
    }, []);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className='ion-padding ion-text-center'>
                    <IonTitle>Services</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid class='create-grid'>
                    <IonButton id='create-service'>
                        Create Service
                    </IonButton>
                    <IonButton id='link-reactions'>
                        Link Reactions
                    </IonButton>
                </IonGrid>
                <CreateService />
                <LinkReactions data={data} />
                <ServicesContainer data={data} />
            </IonContent>
        </IonPage>
    );
};

export default Services;
