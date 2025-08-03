import {
    Accordion,
    AccordionControl,
    ActionIcon,
    Alert,
    Button,
    Group,
    Image,
    Stack,
    Text
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { renderSVG } from 'uqr'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscriptionInfoStoreInfo } from '@entities/subscription-info-store'
import { IconCopy, IconInfoCircle, IconLink, IconPrinter, IconQrcode } from '@tabler/icons-react'

export const SubscriptionLinkWidget = () => {
    const { t } = useTranslation()
    const { subscription } = useSubscriptionInfoStoreInfo()
    const clipboard = useClipboard({ timeout: 10000 })

    if (!subscription) return null

    const subscriptionUrl = constructSubscriptionUrl(
        window.location.href,
        subscription.user.shortUuid
    )

    const handleCopy = (url = subscriptionUrl) => {
        notifications.show({
            title: t('subscription-link.widget.link-copied'),
            message: t('subscription-link.widget.link-copied-to-clipboard'),
            color: 'teal'
        })
        clipboard.copy(url)
    }

    const handleQrCopy = (url, name) => {
        console.log(url, name)

        const subscriptionQrCode = renderSVG(url, {
            whiteColor: '#FFFFFF',
            blackColor: '#161B22'
        })

        modals.open({
            centered: true,
            title: `${t('subscription-link.widget.get-link')} ${name}`,
            children: (
                <>
                    <Stack align="center">
                        <Image
                            src={`data:image/svg+xml;utf8,${encodeURIComponent(subscriptionQrCode)}`}
                        />
                        <Text fw={600} size="lg" ta="center">
                            {t('subscription-link.widget.scan-qr-code')}
                        </Text>
                        <Text c="dimmed" size="sm" ta="center">
                            {t('subscription-link.widget.line-1')}
                        </Text>

                        <Button fullWidth onClick={() => handleCopy(url)} variant="filled">
                            {t('subscription-link.widget.copy-link')}
                        </Button>
                    </Stack>
                </>
            )
        })
    }

    const getLinks = () =>
        subscription.links.map((link) => ({
            name: decodeURI(link.split('#')[1]).trim(),
            link
        }))

    return (
        <>
            <Button
                onClick={() => {
                    const subscriptionQrCode = renderSVG(subscriptionUrl, {
                        whiteColor: '#FFFFFF',
                        blackColor: '#161B22'
                    })

                    modals.open({
                        centered: true,
                        title: t('subscription-link.widget.get-link'),
                        children: (
                            <>
                                <Stack align="center">
                                    <Image
                                        src={`data:image/svg+xml;utf8,${encodeURIComponent(subscriptionQrCode)}`}
                                    />
                                    <Text fw={600} size="lg" ta="center">
                                        {t('subscription-link.widget.scan-qr-code')}
                                    </Text>
                                    <Text c="dimmed" size="sm" ta="center">
                                        {t('subscription-link.widget.line-1')}
                                    </Text>

                                    <Button
                                        fullWidth
                                        onClick={() => handleCopy(subscriptionUrl)}
                                        variant="filled"
                                    >
                                        {t('subscription-link.widget.copy-link')}
                                    </Button>

                                    <Accordion
                                        variant="filled"
                                        radius="md"
                                        style={{ width: '100%' }}
                                    >
                                        <Accordion.Item value="item-1">
                                            <AccordionControl
                                                icon={
                                                    <IconLink
                                                        size={15}
                                                        stroke={1.5}
                                                        color="var(--mantine-color-dimmed)"
                                                    />
                                                }
                                            >
                                                Прямые ссылки
                                            </AccordionControl>
                                            <Accordion.Panel>
                                                <Alert
                                                    spacing="sm"
                                                    variant="light"
                                                    color="orange"
                                                    title="Внимание"
                                                    icon={<IconInfoCircle size="sm" variant="filled" />}
                                                    style={{ marginBottom: '1.5rem' }}
                                                >
                                                    Прямые ссылки нужны крайне редко. Например при установке на роутер или на очень старый телефон с проблемными сертификатами.
                                                </Alert>

                                                <Stack spacing="sm">
                                                    {getLinks().map((item, index) => (
                                                        <Group
                                                            key={index}
                                                            justify="space-between"
                                                            align="center"
                                                        >
                                                            <Text size="sm" weight={500}>
                                                                {item.name}
                                                            </Text>
                                                            <Group spacing="sm">
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="filled"
                                                                    onClick={() =>
                                                                        handleCopy(item.link)
                                                                    }
                                                                >
                                                                    <IconCopy size={14} />
                                                                </ActionIcon>
                                                                <ActionIcon
                                                                    size="sm"
                                                                    variant="filled"
                                                                    onClick={() =>
                                                                        handleQrCopy(
                                                                            item.link,
                                                                            item.name
                                                                        )
                                                                    }
                                                                >
                                                                    <IconQrcode size={14} />
                                                                </ActionIcon>
                                                            </Group>
                                                        </Group>
                                                    ))}
                                                </Stack>
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>
                                </Stack>
                            </>
                        )
                    })
                }}
                variant="outline"
            >
                {t('subscription-link.widget.get-link')}
            </Button>
        </>
    )
}
