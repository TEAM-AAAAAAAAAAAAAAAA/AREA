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
import LinkReactions from '../components/LinkReactions';

import ServicesContainer from '../components/Services';
import { client } from '../utils/ApolloClient';
import {
    gql
} from '@apollo/client';
import { useCookies } from 'react-cookie';
import jwt_decode from "jwt-decode";
import CreateReaction from '../components/CreateReaction';
import LinkAction from '../components/LinkAction';

const GET_SERVICES = gql`
  query Query($token: String!) {
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
    getUserFromToken(token: $token) {
        id
        name
    }
    allActions {
        actionName
        description
        serviceName
    }
  }
`;

const Services: React.FC = () => {
    const [data, setData] = useState<any>([]);
    const [cookie] = useCookies(['token']);

    useEffect(() => {
        let decoded: any = jwt_decode(cookie.token);
        client.query({ query: GET_SERVICES, variables: { token: decoded?.token } }).then((result) => {
            setData(result.data);
            console.log(result.data)
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
                    <IonButton id='create-reaction'>
                        Create Reaction
                    </IonButton>
                    <IonButton id='link-reactions'>
                        Link Reactions
                    </IonButton>
                    <IonButton id='link-action'>
                        Link Action
                    </IonButton>
                </IonGrid>
                <LinkAction data={data} />
                <CreateReaction data={data} />
                <LinkReactions data={data} />
                <ServicesContainer data={data} />
            </IonContent>
        </IonPage>
    );
};

export default Services;
