import React, { useEffect, useState } from 'react';
import { client } from '../utils/ApolloClient';
import { gql } from '@apollo/client';
import {
    IonCardContent,
    IonSelect,
    IonSelectOption
} from '@ionic/react';

interface ContainerProps {
    allReact: any;
    serviceName: string;
}

const ActionsContainer: React.FC<ContainerProps> = ({ allReact, serviceName }) => {
    const [actions, setActions] = useState<any>([]);
    const [desc, setDesc] = useState<string>('');

    useEffect(() => {
        setActions(allReact.filter((react: any) => react.serviceName === serviceName));
    }, [allReact, serviceName]);
    return (
        <>
            <IonSelect placeholder='Select reaction' interface='popover' onIonChange={(e) => {setDesc(e.detail.value)}}>
                {actions.map((action: any) => (
                    <IonSelectOption key={action.reactionName} value={action.description}>{action.reactionName}</IonSelectOption>
                ))}
            </IonSelect>
            <IonCardContent>
                {desc}
            </IonCardContent>
        </>
    )
};

export default ActionsContainer;