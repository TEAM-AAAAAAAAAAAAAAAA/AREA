import React, { useEffect, useState } from 'react';
import { client } from '../utils/ApolloClient';
import { gql } from '@apollo/client';
import {
    IonButton,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    useIonToast
} from '@ionic/react';

interface ContainerProps {
    allReact: any;
    serviceName: string;
}

const ACTIVATE = gql`mutation EnableReaction($reactionId: Int!) {
    enableReaction(reactionId: $reactionId)
  }`;

const DEACTIVATE = gql`mutation DisableReaction($reactionId: Int!) {
    disableReaction(reactionId: $reactionId)
  }`;

const ActionsContainer: React.FC<ContainerProps> = ({ allReact, serviceName }) => {
    const [actions, setActions] = useState<any>([]);
    const [reaction, setReaction] = useState<any>(null);
    const [desc, setDesc] = useState<string>('');
    const [present] = useIonToast();

    const activate = () => {
        client.mutate({
            mutation: ACTIVATE, variables: {reactionId: reaction.reactionId}
        }).then((result) => {
            if (result.data?.enableReaction == 200) {
                present({
                    message: 'Reaction activated',
                    duration: 1500,
                    position: 'top',
                    color: 'success'
                });
            } else {
                present({
                    message: 'Reaction failed',
                    duration: 1500,
                    position: 'top',
                    color: 'danger'
                });
            }
        });
    };

    const deactivate = () => {
        client.mutate({
            mutation: DEACTIVATE, variables: {reactionId: reaction.reactionId}
        }).then((result) => {
            if (result.data?.disableReaction == 200) {
                present({
                    message: 'Reaction deactivated',
                    duration: 1500,
                    position: 'top',
                    color: 'success'
                });
            } else {
                present({
                    message: 'Reaction failed',
                    duration: 1500,
                    position: 'top',
                    color: 'danger'
                });
            }
        });
    };

    useEffect(() => {
            setActions(allReact.filter((react: any) => react.serviceName === serviceName));
        }, [allReact, serviceName]);
        return (
            <>
                <IonSelect placeholder='Select reaction' interface='popover' onIonChange={(e) => { setDesc(e.detail?.value.react.description); setReaction(e.detail?.value) }}>
                    {actions.map((action: any) => (
                        <IonSelectOption key={action.reactionName} value={action}>{action.reactionName}</IonSelectOption>
                    ))}
                </IonSelect>
                <IonCardContent>
                    {desc}
                </IonCardContent>
                {reaction && (
                    <>
                        <IonButton onClick={activate}>Activate</IonButton>
                        <IonButton onClick={deactivate}>Deactivate</IonButton>
                    </>
                )}
            </>
        )
    };

    export default ActionsContainer;