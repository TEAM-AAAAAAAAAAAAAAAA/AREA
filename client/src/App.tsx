import { Redirect, Route } from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { diamond, ellipse, triangle } from 'ionicons/icons';
import Login from './pages/Login';
import Setup from './pages/Setup';
import Services from './pages/Services';
import LoginWithDiscord from './pages/LoginWithDiscord';
import SetupGoogle from './pages/SetupGoogle';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonTabs>
                <IonRouterOutlet>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/services">
                        <Services />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/login" />
                    </Route>
                    <Route path="/auth/discord/cb">
                        <LoginWithDiscord />
                    </Route>
                    <Route exact path="/auth/google/cb">
                        <SetupGoogle />
                    </Route>
                    <Route exact path="/setup">
                        <Setup />
                    </Route>
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                    <IonTabButton tab="login" href="/login">
                        <IonIcon icon={triangle} />
                        <IonLabel>Login</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="services" href="/services">
                        <IonIcon icon={ellipse} />
                        <IonLabel>Services</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="setup" href="/setup">
                        <IonIcon icon={diamond} />
                        <IonLabel>Setup</IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonTabs>
        </IonReactRouter>
    </IonApp>
);

export default App;