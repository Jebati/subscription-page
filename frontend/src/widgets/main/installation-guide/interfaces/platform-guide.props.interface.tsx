import {
    IAppConfig,
    IPlatformConfig
} from '@shared/constants/apps-config/interfaces/app-list.interface'

export interface IPlatformGuideProps {
    getAppsForPlatform: (platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'androidtv' | 'appletv' | 'steamdeck' | 'router') => IAppConfig[]
    getSelectedAppForPlatform: (platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'androidtv' | 'appletv' | 'steamdeck' | 'router') => IAppConfig | null
    openDeepLink: (urlScheme: string, isNeedBase64Encoding: boolean | undefined) => void
    appsConfig: IPlatformConfig
}
