import React, { useEffect, useState } from 'react';
import { client } from '../utils/ApolloClient';
import { gql } from '@apollo/client';
import {
    IonContent,
    IonCardHeader,
    IonCardTitle,
    IonButton
} from '@ionic/react';

interface ContainerProps {
    allReact: any;
    serviceName: string;
}

const ActionsContainer: React.FC<ContainerProps> = ({ allReact, serviceName }) => {
    let actions: string[] = [];

    useEffect(() => {
        if (serviceName == undefined)
            return;
        actions = []
        for (let i = 0; i < allReact?.length; i++) {
            if (allReact[i]?.serviceName === serviceName) {
                actions.push(allReact[i].reactionName)
            }
        }
        console.log(actions)
    }, [allReact]);
    return (
        <>
            {actions.map((action: any) => {
                <IonButton>
                    {action}
                </IonButton>
            })
            }
        </>
    )
};

export default ActionsContainer;