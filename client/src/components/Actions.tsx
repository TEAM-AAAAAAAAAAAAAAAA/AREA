import React, { useEffect, useState } from 'react';
import { client } from '../utils/ApolloClient';
import { gql } from '@apollo/client';
import {
    IonSelect,
    IonSelectOption
} from '@ionic/react';

interface ContainerProps {
    allReact: any;
    serviceName: string;
}

const ActionsContainer: React.FC<ContainerProps> = ({ allReact, serviceName }) => {
    const [actions, setActions] = useState<any>([]);

    useEffect(() => {
        setActions(allReact.filter((react: any) => react.serviceName === serviceName));
    }, [allReact, serviceName]);
    return (
        <>
            {actions.length > 1 &&
                <IonSelect placeholder='Select reaction' interface='popover'>
                    {actions.map((action: any) => (
                        <IonSelectOption key={action.reactionName}>{action.reactionName}</IonSelectOption>
                    ))}
                </IonSelect>
            }
        </>
    )
};

export default ActionsContainer;