import {
    IconBrandAndroid,
    IconBrandApple,
    IconBrandDebian,
    IconBrandSteam,
    IconBrandUbuntu,
    IconBrandWindows,
    IconDeviceTv,
    IconExternalLink,
    IconRouter
} from '@tabler/icons-react'
import { Box, Button, Group, Select, Text } from '@mantine/core'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOs } from '@mantine/hooks'

import {
    IAppConfig,
    IPlatformConfig
} from '@shared/constants/apps-config/interfaces/app-list.interface'
import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'

import { BaseInstallationGuideWidget } from './installation-guide.base.widget'
import { FaLinux } from 'react-icons/fa6'

export const InstallationGuideWidget = ({ appsConfig }: { appsConfig: IPlatformConfig }) => {
    const { t, i18n } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()

    const os = useOs()

    const [currentLang, setCurrentLang] = useState<'en' | 'fa' | 'ru'>('ru')
    const [defaultTab, setDefaultTab] = useState('windows')

    useEffect(() => {
        const lang = i18n.language
        if (lang.startsWith('en')) {
            setCurrentLang('en')
        } else if (lang.startsWith('fa')) {
            setCurrentLang('fa')
        } else if (lang.startsWith('ru')) {
            setCurrentLang('ru')
        } else {
            setCurrentLang('en')
        }
    }, [i18n.language])

    useLayoutEffect(() => {
        switch (os) {
            case 'android':
                setDefaultTab('android')
                break
            case 'ios':
                setDefaultTab('ios')
                break
            case 'linux':
                setDefaultTab('linux')
                break
            case 'macos':
                setDefaultTab('macos')
                break
            case 'windows':
                setDefaultTab('windows')
                break
            default:
                setDefaultTab('pc')
                break
        }
    }, [os])

    if (!subscription) return null

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const hasPlatformApps = {
        ios: appsConfig.ios && appsConfig.ios.length > 0,
        android: appsConfig.android && appsConfig.android.length > 0,
        windows: appsConfig.windows && appsConfig.windows.length > 0,
        macos: appsConfig.macos && appsConfig.macos.length > 0,
        linux: appsConfig.linux && appsConfig.linux.length > 0,
        androidtv: appsConfig.androidtv && appsConfig.androidtv.length > 0,
        appletv: appsConfig.appletv && appsConfig.appletv.length > 0,
        steamdeck: appsConfig.steamdeck && appsConfig.steamdeck.length > 0,
        router: appsConfig.router && appsConfig.router.length > 0
    }

    if (!hasPlatformApps.ios && !hasPlatformApps.android && !hasPlatformApps.windows) {
        return null
    }

    const openDeepLink = (urlScheme: string, isNeedBase64Encoding: boolean | undefined) => {
        if (isNeedBase64Encoding) {
            const encoded = btoa(`${subscriptionUrl}`)
            const encodedUrl = `${urlScheme}${encoded}`
            window.open(encodedUrl, '_blank')
        } else {
            window.open(`${urlScheme}${subscriptionUrl}`, '_blank')
        }
    }

    const availablePlatforms = [
        hasPlatformApps.android && {
            value: 'android',
            label: 'Android',
            icon: <IconBrandAndroid />
        },
        hasPlatformApps.ios && {
            value: 'ios',
            label: 'iOS',
            icon: <IconBrandApple />
        },
        hasPlatformApps.windows && {
            value: 'windows',
            label: 'Windows',
            icon: <IconBrandWindows />
        },
        hasPlatformApps.macos && {
            value: 'macos',
            label: 'macOS',
            icon: <IconBrandApple />
        },
        hasPlatformApps.linux && {
            value: 'linux',
            label: 'Linux',
            icon: <FaLinux /> // или другая иконка Linux
        },
        hasPlatformApps.androidtv && {
            value: 'androidtv',
            label: 'Android TV',
            icon: <IconDeviceTv />
        },
        hasPlatformApps.appletv && {
            value: 'appletv',
            label: 'Apple TV',
            icon: <IconDeviceTv />
        },
        hasPlatformApps.steamdeck && {
            value: 'steamdeck',
            label: 'Steam Deck',
            icon: <IconBrandSteam />
        },
        hasPlatformApps.router && {
            value: 'router',
            label: 'Роутер',
            icon: <IconRouter />
        }
    ].filter(Boolean) as {
        icon: React.ReactNode
        label: string
        value: string
    }[]

    if (
        !hasPlatformApps[defaultTab as keyof typeof hasPlatformApps] &&
        availablePlatforms.length > 0
    ) {
        setDefaultTab(availablePlatforms[0].value)
    }

    const getAppsForPlatform = (platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'androidtv' | 'appletv' | 'steamdeck' | 'router') => {
        return appsConfig[platform] || []
    }

    const getSelectedAppForPlatform = (platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'androidtv' | 'appletv' | 'steamdeck' | 'router') => {
        const apps = getAppsForPlatform(platform)
        if (apps.length === 0) return null
        return apps[0]
    }

    const renderFirstStepButton = (app: IAppConfig) => {
        if (app.installationStep.buttons.length > 0) {
            return (
                <Group>
                    {app.installationStep.buttons.map((button, index) => {
                        const buttonText = button.buttonText[currentLang] || button.buttonText.en

                        return (
                            <Button
                                component="a"
                                href={button.buttonLink}
                                key={index}
                                leftSection={<IconExternalLink size={16} />}
                                target="_blank"
                                variant="light"
                            >
                                {buttonText}
                            </Button>
                        )
                    })}
                </Group>
            )
        }

        return null
    }

    const getPlatformTitle = (platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'androidtv' | 'appletv' | 'steamdeck' | 'router') => {
        return t('installation-guide.widget.install-and-open-app', {
            appName: '{appName}'
        })
    }

    return (
        <Box>
            <Group justify="space-between" mb="md">
                <Text fw={700} size="xl">
                    {t('installation-guide.widget.installation')}
                </Text>

                {availablePlatforms.length > 1 && (
                    <Select
                        allowDeselect={false}
                        data={availablePlatforms.map((opt) => ({
                            value: opt.value,
                            label: opt.label
                        }))}
                        leftSection={
                            availablePlatforms.find((opt) => opt.value === defaultTab)?.icon
                        }
                        onChange={(value) => setDefaultTab(value || '')}
                        placeholder={t('installation-guide.widget.select-device')}
                        radius="md"
                        size="sm"  
                        style={{ width: 155 }}                            
                        value={defaultTab}                        
                        withScrollArea={false}
                    />
                )}
            </Group>

            {hasPlatformApps[defaultTab as keyof typeof hasPlatformApps] && (
                <BaseInstallationGuideWidget
                    appsConfig={appsConfig}
                    currentLang={currentLang}
                    firstStepTitle={getPlatformTitle(defaultTab as 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'androidtv' | 'appletv' | 'steamdeck' | 'router')}
                    getAppsForPlatform={getAppsForPlatform}
                    getSelectedAppForPlatform={getSelectedAppForPlatform}
                    openDeepLink={openDeepLink}
                    platform={defaultTab as 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'androidtv' | 'appletv' | 'steamdeck' | 'router'}
                    renderFirstStepButton={renderFirstStepButton}
                />
            )}
        </Box>
    )
}
