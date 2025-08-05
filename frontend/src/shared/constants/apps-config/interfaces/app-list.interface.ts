export interface IAppConfig {
    id: `${Lowercase<string>}`
    name: string
    isFeatured: boolean
    isNeedBase64Encoding?: boolean
    urlScheme: string
    isRouter: boolean,
    installationStep: {
        buttons: {
            buttonLink: string
            buttonText: {
                en: string
                fa: string
                ru: string
            }
        }[]
        description: {
            en: string
            fa: string
            ru: string
        }
    }
    addSubscriptionStep: {
        description: {
            en: string
            fa: string
            ru: string
        },        
        isCopyButton?: boolean
    }
    connectAndUseStep: {
        description: {
            en: string
            fa: string
            ru: string
        }
    }
    additionalBeforeAddSubscriptionStep?: {
        buttons: {
            buttonLink: string
            buttonText: {
                en: string
                fa: string
                ru: string
            }
        }[]
        description: {
            en: string
            fa: string
            ru: string
        }
        title: {
            en: string
            fa: string
            ru: string
        }
    }
    additionalAfterAddSubscriptionStep?: {
        buttons: {
            buttonLink: string
            buttonText: {
                en: string
                fa: string
                ru: string
            }
        }[]
        description: {
            en: string
            fa: string
            ru: string
        }
        title: {
            en: string
            fa: string
            ru: string
        }
    }
}

export interface IPlatformConfig {
    ios: IAppConfig[],        // iOS
    android: IAppConfig[],    // Android
    windows: IAppConfig[],    // Windows
    macos: IAppConfig[],      // macOS
    linux: IAppConfig[],      // Linux
    androidtv: IAppConfig[],  // Android TV
    appletv: IAppConfig[],    // Apple TV
    steamdeck: IAppConfig[],  // Steam Deck
    router: IAppConfig[]      // Router
}
