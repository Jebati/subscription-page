import {
    IconCheck,
    IconCloudDownload,
    IconDownload,
    IconError404,
    IconError404Off,
    IconInfoCircle,
    IconInfoOctagon,
    IconInfoSmall,
    IconInfoSquare,
    IconInfoTriangle,
    IconStar
} from '@tabler/icons-react'
import { Box, Button, Group, Text, ThemeIcon, Timeline } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { IAppConfig } from '@shared/constants/apps-config/interfaces/app-list.interface'
import { useClipboard } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'

export interface IBaseGuideProps extends IPlatformGuideProps {
    firstStepTitle: string
    platform:
        | 'ios'
        | 'android'
        | 'windows'
        | 'macos'
        | 'linux'
        | 'androidtv'
        | 'appletv'
        | 'steamdeck'
        | 'router'
    renderFirstStepButton: (app: IAppConfig) => React.ReactNode
    currentLang: 'en' | 'fa' | 'ru'
}

export const BaseInstallationGuideWidget = (props: IBaseGuideProps) => {
    const { t } = useTranslation()
    const {
        openDeepLink,
        getAppsForPlatform,
        platform,
        firstStepTitle,
        renderFirstStepButton,
        currentLang
    } = props

    const platformApps = getAppsForPlatform(platform)
    const [activeTabId, setActiveTabId] = useState<string>('')
    
    const { subscription } = useSubscriptionInfoStoreInfo()

    useEffect(() => {
        if (platformApps.length > 0) {
            setActiveTabId(platformApps[0].id)
        }
    }, [platform, platformApps])

    const handleTabChange = (appId: string) => {
        setActiveTabId(appId)
    }

    const clipboard = useClipboard({ timeout: 10000 })

    if (!subscription) return null

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleCopy = () => {
        notifications.show({
            title: t('subscription-link.widget.link-copied'),
            message: t('subscription-link.widget.link-copied-to-clipboard'),
            color: 'teal'
        })
        clipboard.copy(subscriptionUrl)
    }

    const selectedApp =
        (activeTabId && platformApps.find((app) => app.id === activeTabId)) ||
        (platformApps.length > 0 ? platformApps[0] : null)

    const formattedTitle = selectedApp
        ? firstStepTitle.replace(/{appName}/g, selectedApp.name)
        : firstStepTitle

    const getAppDescription = (
        app: IAppConfig | null,
        step: 'addSubscriptionStep' | 'connectAndUseStep' | 'installationStep'
    ) => {
        if (!app) return ''

        const stepData = app[step]
        if (!stepData) return ''

        return stepData.description[currentLang] || stepData.description[currentLang] || ''
    }

    const getButtonText = (button: { buttonText: { en: string; fa: string; ru: string } }) => {
        return button.buttonText[currentLang] || button.buttonText[currentLang] || ''
    }

    const getStepTitle = (
        stepData: { title?: { en: string; fa: string; ru: string } },
        defaultTitle: string
    ) => {
        if (!stepData || !stepData.title) return defaultTitle

        return stepData.title[currentLang] || stepData.title[currentLang] || defaultTitle
    }

    return (
        <Box>
            {platformApps.length > 0 && (
                <Group gap="xs" mb="lg">
                    {platformApps.map((app: IAppConfig) => {
                        const isActive = app.id === activeTabId
                        return (
                            <Button
                                color={isActive ? 'cyan' : 'gray'}
                                key={app.id}
                                leftSection={
                                    app.isFeatured ? <IconStar color="gold" size={16} /> : undefined
                                }
                                onClick={() => handleTabChange(app.id)}
                                styles={{
                                    root: {
                                        padding: '8px 12px',
                                        height: 'auto',
                                        lineHeight: '1.5',
                                        minWidth: 0,
                                        flex: '1 0 auto'
                                    }
                                }}
                                variant={isActive ? 'outline' : 'light'}
                            >
                                {app.name}
                            </Button>
                        )
                    })}
                </Group>
            )}

            <Timeline active={1} bulletSize={32} color="teal" lineWidth={2}>
                <Timeline.Item
                    bullet={
                        <ThemeIcon color="teal.5" radius="xl" size={26}>
                            <IconDownload size={16} />
                        </ThemeIcon>
                    }
                    title={formattedTitle}
                >
                    <Text c="dimmed" mb={16} size="sm" style={{ whiteSpace: 'pre-line' }}>
                        {selectedApp ? getAppDescription(selectedApp, 'installationStep') : ''}
                    </Text>
                    {selectedApp && renderFirstStepButton(selectedApp)}
                </Timeline.Item>

                {selectedApp && selectedApp.additionalBeforeAddSubscriptionStep && (
                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconInfoCircle size={20} />
                            </ThemeIcon>
                        }
                        title={getStepTitle(
                            selectedApp.additionalBeforeAddSubscriptionStep,
                            'Additional step title is not set'
                        )}
                    >
                        <Text c="dimmed" mb={16} size="sm" style={{ whiteSpace: 'pre-line' }}>
                            {selectedApp.additionalBeforeAddSubscriptionStep.description[
                                currentLang
                            ] || selectedApp.additionalBeforeAddSubscriptionStep.description.en}
                        </Text>
                        <Group>
                            {selectedApp.additionalBeforeAddSubscriptionStep.buttons.map(
                                (button, index) => (
                                    <Button
                                        component="a"
                                        href={button.buttonLink}
                                        key={index}
                                        target="_blank"
                                        variant="light"
                                    >
                                        {getButtonText(button)}
                                    </Button>
                                )
                            )}
                        </Group>
                    </Timeline.Item>
                )}

                <Timeline.Item
                    bullet={
                        <ThemeIcon color="teal.5" radius="xl" size={26}>
                            <IconCloudDownload size={16} />
                        </ThemeIcon>
                    }
                    title={t('installation-guide.widget.add-subscription')}
                >
                    <Text c="dimmed" mb={16} size="sm" style={{ whiteSpace: 'pre-line' }}>
                        {selectedApp
                            ? getAppDescription(selectedApp, 'addSubscriptionStep')
                            : 'Add subscription description is not set'}
                    </Text>
                    {selectedApp && !selectedApp?.addSubscriptionStep?.isCopyButton && (
                        <Button
                            onClick={() =>
                                openDeepLink(
                                    selectedApp.urlScheme,
                                    selectedApp.isNeedBase64Encoding
                                )
                            }
                            variant="filled"
                        >
                            {t('installation-guide.widget.add-subscription-button')}
                        </Button>
                    )}
                    {selectedApp && selectedApp?.addSubscriptionStep?.isCopyButton && (
                        <Button onClick={handleCopy}>
                            {t('subscription-link.widget.copy-link')}
                        </Button>
                    )}
                </Timeline.Item>

                {selectedApp && selectedApp.additionalAfterAddSubscriptionStep && (
                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="teal.5" radius="xl" size={26}>
                                <IconStar size={16} />
                            </ThemeIcon>
                        }
                        title={getStepTitle(
                            selectedApp.additionalAfterAddSubscriptionStep,
                            'Additional step title is not set'
                        )}
                    >
                        <Text c="dimmed" mb={16} size="sm" style={{ whiteSpace: 'pre-line' }}>
                            {selectedApp.additionalAfterAddSubscriptionStep.description[
                                currentLang
                            ] || selectedApp.additionalAfterAddSubscriptionStep.description.en}
                        </Text>
                        <Group>
                            {selectedApp.additionalAfterAddSubscriptionStep.buttons.map(
                                (button, index) => (
                                    <Button
                                        component="a"
                                        href={button.buttonLink}
                                        key={index}
                                        target="_blank"
                                        variant="light"
                                    >
                                        {getButtonText(button)}
                                    </Button>
                                )
                            )}
                        </Group>
                    </Timeline.Item>
                )}

                <Timeline.Item
                    bullet={
                        <ThemeIcon color="teal.5" radius="xl" size={26}>
                            <IconCheck size={16} />
                        </ThemeIcon>
                    }
                    title={t('installation-guide.widget.connect-and-use')}
                >
                    <Text c="dimmed" size="sm" style={{ whiteSpace: 'pre-line' }}>
                        {selectedApp
                            ? getAppDescription(selectedApp, 'connectAndUseStep')
                            : 'Connect and use description is not set'}
                    </Text>
                </Timeline.Item>

                {selectedApp && selectedApp.additionalAfterConnectAndUseStep && (
                    <Timeline.Item
                        bullet={
                            <ThemeIcon color="orange.2" radius="xl" size={26}>
                                <IconInfoSmall size={26} />
                            </ThemeIcon>
                        }
                        title={getStepTitle(
                            selectedApp.additionalAfterConnectAndUseStep,
                            'Additional step title is not set'
                        )}
                    >
                        <Text c="dimmed" mb={16} size="sm" style={{ whiteSpace: 'pre-line' }}>
                            {selectedApp.additionalAfterConnectAndUseStep.description[
                                currentLang
                            ] || selectedApp.additionalAfterConnectAndUseStep.description.en}
                        </Text>
                        <Group>
                            {selectedApp.additionalAfterConnectAndUseStep.buttons.map(
                                (button, index) => (
                                    <Button
                                        component="a"
                                        href={button.buttonLink}
                                        key={index}
                                        target="_blank"
                                        variant="light"
                                    >
                                        {getButtonText(button)}
                                    </Button>
                                )
                            )}
                        </Group>
                        <Button onClick={handleCopy} size="xs">
                            {t('subscription-link.widget.copy-link')}
                        </Button>
                    </Timeline.Item>
                )}
            </Timeline>
        </Box>
    )
}
