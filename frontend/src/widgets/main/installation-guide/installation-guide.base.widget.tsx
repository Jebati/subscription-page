import {
    IconCheck,
    IconCloudDownload,
    IconDownload,
    IconError404,
    IconError404Off,
    IconEyeStar,
    IconHelp,
    IconHelpSmall,
    IconInfoCircle,
    IconInfoOctagon,
    IconInfoSmall,
    IconInfoSquare,
    IconInfoTriangle,
    IconStar,
    IconStarFilled,
    IconStarHalf
} from '@tabler/icons-react'
import {
    Alert,
    Anchor,
    Box,
    Button,
    Group,
    Input,
    Paper,
    Text,
    TextInput,
    ThemeIcon,
    Timeline,
    Title
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { IAppConfig } from '@shared/constants/apps-config/interfaces/app-list.interface'
import { useClipboard } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import HappTVCode from './happ-tv-code'

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

                        if (app.isRouter) {
                            return (
                                <Box maw={800} mx="auto" p="md">
                                    <Alert color="green.5" icon={<IconInfoCircle />} mb="xl">
                                        <Text>
                                            Мы предлагаем{' '}
                                            <Text span fw={600}>
                                                уже настроенный роутер
                                            </Text>{' '}
                                            с нашим VPN за{' '}
                                            <Text span fw={700} c="blue">
                                                8.000₽
                                            </Text>{' '}
                                            –{' '}
                                            <Anchor
                                                href="https://t.me/silvpn_info/23"
                                                target="_blank"
                                            >
                                                подробнее здесь
                                            </Anchor>
                                        </Text>
                                    </Alert>

                                    <Text mb="xl">
                                        Если вы хотите настроить VPN вручную, наш сервис использует
                                        протокол{' '}
                                        <Text
                                            span
                                            ff="monospace"
                                            bg="gray.1"
                                            style={{ borderRadius: 2 }}
                                        >
                                            Xray VLESS+REALITY
                                        </Text>
                                        , который можно установить на:
                                    </Text>

                                    <Paper withBorder p="md" mb="md" radius="md">
                                        <Title order={3} mb="sm">
                                            Роутеры Keenetic<br></br>(с USB-разъемом под флешку)
                                        </Title>
                                        <Text>
                                            Используйте скрипт{' '}
                                            <Anchor
                                                href="https://github.com/pegakmop/neofit"
                                                target="_blank"
                                            >
                                                NeoFit
                                            </Anchor>{' '}
                                            для установки
                                        </Text>
                                    </Paper>

                                    <Paper withBorder p="md" radius="md">
                                        <Title order={3} mb="sm">
                                            Роутеры с прошивкой OpenWRT (или совместимые, от 16 МБ
                                            свободного места)
                                        </Title>
                                        <Text>
                                            Используйте скрипт{' '}
                                            <Anchor
                                                href="https://github.com/itdoginfo/podkop"
                                                target="_blank"
                                            >
                                                Podkop
                                            </Anchor>{' '}
                                            для установки
                                        </Text>
                                    </Paper>

                                    <Text mt="xl" c="dimmed">
                                        Оба скрипта принимают прямые VLESS-ссылки, которые можно
                                        получить на этой страницу по кнопке «Получить ссылку» ➜
                                        «Прямые ссылки»
                                    </Text>
                                </Box>
                            )
                        }

                        return (
                            <Button
                                color={isActive ? 'cyan' : 'gray'}
                                key={app.id}
                                leftSection={
                                    app.isFeatured ? (
                                        <IconStarFilled color="gold" size={16} />
                                    ) : undefined
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
                {selectedApp && !selectedApp.isRouter && (
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
                )}

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

                {selectedApp && !selectedApp.isRouter && (
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
                        {selectedApp &&
                            !selectedApp?.addSubscriptionStep?.isCopyButton &&
                            !selectedApp?.addSubscriptionStep?.isHappTV && (
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
                        {selectedApp && selectedApp?.addSubscriptionStep?.isHappTV && (
                            <div>
                                <HappTVCode
                                    selectedApp={selectedApp}
                                    subscriptionData={subscriptionUrl}
                                />
                            </div>
                        )}
                    </Timeline.Item>
                )}

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

                {selectedApp && !selectedApp.isRouter && (
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
                )}

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
                                        size="sm"
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

                <Timeline.Item
                    bullet={
                        <ThemeIcon color="cyan.5" radius="xl" size={26}>
                            <IconHelpSmall size={26} />
                        </ThemeIcon>
                    }
                    title="Остались вопросы?"
                >
                    <Text c="dimmed" mb={16} size="sm" style={{ whiteSpace: 'pre-line' }}>
                        Что-то не вышло или остались вопросы?<br></br>
                        Не стесняйся, напиши нам и мы обязательно поможем
                    </Text>
                    <Button component="a" size="xs" target="_blank" href="https://t.me/silvpn_help">
                        Написать в поддержку
                    </Button>
                </Timeline.Item>
            </Timeline>
        </Box>
    )
}
