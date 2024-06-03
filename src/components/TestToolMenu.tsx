import React from 'react';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import useWindowDimensions from '@hooks/useWindowDimensions';
import * as ApiUtils from '@libs/ApiUtils';
import compose from '@libs/compose';
import Navigation from '@libs/Navigation/Navigation';
import variables from '@styles/variables';
import * as Network from '@userActions/Network';
import * as Report from '@userActions/Report';
import * as Session from '@userActions/Session';
import * as User from '@userActions/User';
import CONFIG from '@src/CONFIG';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';
import type {Network as NetworkOnyx, User as UserOnyx} from '@src/types/onyx';
import Button from './Button';
import {withNetwork} from './OnyxProvider';
import Switch from './Switch';
import TestToolRow from './TestToolRow';
import Text from './Text';

type TestToolMenuOnyxProps = {
    /** User object in Onyx */
    user: OnyxEntry<UserOnyx>;
};

type TestToolMenuProps = TestToolMenuOnyxProps & {
    /** Network object in Onyx */
    network: OnyxEntry<NetworkOnyx>;
};
const USER_DEFAULT: UserOnyx = {shouldUseStagingServer: undefined, isSubscribedToNewsletter: false, validated: false, isFromPublicDomain: false, isUsingExpensifyCard: false};

function TestToolMenu({user = USER_DEFAULT, network}: TestToolMenuProps) {
    const shouldUseStagingServer = user?.shouldUseStagingServer ?? ApiUtils.isUsingStagingApi();
    const styles = useThemeStyles();
    const {isSmallScreenWidth} = useWindowDimensions();
    const {translate} = useLocalize();

    return (
        <>
            <Text
                style={[styles.textLabelSupporting, styles.mb4]}
                numberOfLines={1}
            >
                {translate('initialSettingsPage.troubleshoot.testingPreferences')}
            </Text>
            {/* Option to switch between staging and default api endpoints.
        This enables QA, internal testers and external devs to take advantage of sandbox environments for 3rd party services like Plaid and Onfido.
        This toggle is not rendered for internal devs as they make environment changes directly to the .env file. */}
            {!CONFIG.IS_USING_LOCAL_WEB && (
                <TestToolRow title={translate('initialSettingsPage.troubleshoot.useStagingServer')}>
                    <Switch
                        accessibilityLabel="Use Staging Server"
                        isOn={shouldUseStagingServer}
                        onToggle={() => User.setShouldUseStagingServer(!shouldUseStagingServer)}
                    />
                </TestToolRow>
            )}

            {/* When toggled the app will be forced offline. */}
            <TestToolRow title={translate('initialSettingsPage.troubleshoot.forceOffline')}>
                <Switch
                    accessibilityLabel="Force offline"
                    isOn={!!network?.shouldForceOffline}
                    onToggle={() => Network.setShouldForceOffline(!network?.shouldForceOffline)}
                />
            </TestToolRow>

            {/* When toggled all network requests will fail. */}
            <TestToolRow title={translate('initialSettingsPage.troubleshoot.simulatFailingNetworkRequests')}>
                <Switch
                    accessibilityLabel="Simulate failing network requests"
                    isOn={!!network?.shouldFailAllRequests}
                    onToggle={() => Network.setShouldFailAllRequests(!network?.shouldFailAllRequests)}
                />
            </TestToolRow>

            {/* Instantly invalidates a user's local authToken. Useful for testing flows related to reauthentication. */}
            <TestToolRow title={translate('initialSettingsPage.troubleshoot.authenticationStatus')}>
                <Button
                    small
                    text={translate('initialSettingsPage.troubleshoot.invalidate')}
                    onPress={() => Session.invalidateAuthToken()}
                />
            </TestToolRow>

            {/* Invalidate stored user auto-generated credentials. Useful for manually testing sign out logic. */}
            <TestToolRow title={translate('initialSettingsPage.troubleshoot.deviceCredentials')}>
                <Button
                    small
                    text={translate('initialSettingsPage.troubleshoot.destroy')}
                    onPress={() => Session.invalidateCredentials()}
                />
            </TestToolRow>

            {/* Navigate to the new Search Page. This button is temporary and should be removed after passing QA tests. */}
            <TestToolRow title="New Search Page">
                <Button
                    small
                    text="Navigate"
                    onPress={() => {
                        Navigation.navigate(ROUTES.SEARCH.getRoute(CONST.TAB_SEARCH.ALL));
                    }}
                />
            </TestToolRow>
            {/* Navigate to the Explanation Modal. This button is temporary to test Explanation Modal flow without HybridApp native module. */}
            <TestToolRow title="Explanation modal">
                <Button
                    small
                    text="Navigate"
                    onPress={() => {
                        Navigation.dismissModal();
                        if (isSmallScreenWidth) {
                            Navigation.navigate(ROUTES.HOME);
                        } else {
                            Report.navigateToConciergeChat();
                        }
                        setTimeout(() => {
                            Navigation.navigate(ROUTES.EXPLANATION_MODAL_ROOT);
                        }, variables.welcomeVideoDelay);
                    }}
                />
            </TestToolRow>
        </>
    );
}

TestToolMenu.displayName = 'TestToolMenu';

export default compose(
    withOnyx<TestToolMenuProps, TestToolMenuOnyxProps>({
        user: {
            key: ONYXKEYS.USER,
        },
    }),
    withNetwork(),
)(TestToolMenu);
