import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import { TextInput, Button } from '@mantine/core'

const HappTVCode = ({ selectedApp, subscriptionData }) => {
    const [code, setCode] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Регулярное выражение для проверки кода (5 символов: цифры и заглавные английские буквы)
    const codeRegex = /^[A-Z0-9]{5}$/

    const handleCodeChange = (event) => {
        let value = event.currentTarget.value

        // Удаляем все символы кроме цифр и английских букв
        value = value.replace(/[^A-Za-z0-9]/g, '')

        // Переводим в верхний регистр
        value = value.toUpperCase()

        // Ограничиваем длину до 5 символов
        value = value.slice(0, 5)

        setCode(value)
    }

    const handleSendSubscription = async () => {
        // Проверяем валидность кода
        if (!codeRegex.test(code)) {
            notifications.show({
                title: 'Ошибка',
                message: 'Код должен содержать ровно 5 символов (цифры и английские буквы)',
                color: 'red'
            })
            return
        }

        // Проверяем наличие данных подписки
        if (!subscriptionData) {
            notifications.show({
                title: 'Ошибка',
                message: 'Данные подписки не найдены',
                color: 'red'
            })
            return
        }

        setIsLoading(true)

        try {
            // Кодируем данные подписки в Base64
            const encodedData = btoa(subscriptionData)

            // Отправляем POST запрос
            const response = await fetch(`https://${window.location.host}/happ/sendtv/${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: encodedData
                })
            })

            if (response.ok) {
                notifications.show({
                    title: 'Успешно',
                    message: 'Подписка успешно отправлена на TV',
                    color: 'green'
                })
                setCode('') // Очищаем поле после успешной отправки
            } else {
                throw new Error(`HTTP ${response.status}`)
            }
        } catch (error) {
            console.error('Error sending subscription:', error)
            notifications.show({
                title: 'Ошибка',
                message: 'Не удалось отправить подписку. Проверьте код и попробуйте снова.',
                color: 'red'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        selectedApp &&
        selectedApp?.addSubscriptionStep?.isHappTV && (
            <TextInput
                placeholder="Код"
                value={code}
                onChange={handleCodeChange}
                error={
                    code && !codeRegex.test(code)
                        ? 'Код должен содержать ровно 5 символов'
                        : null
                }
                maxLength={5}
                rightSection={
                    <Button
                        onClick={handleSendSubscription}
                        disabled={!codeRegex.test(code) || isLoading}
                        loading={isLoading}
                        size="xs"
                        variant="filled"
                    >
                        Отправить
                    </Button>
                }
                rightSectionWidth={100}
                rightSectionPointerEvents="all"
                style={{
                   width: '200px'
                }}
                styles={{
                    input: {
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: '1.1em',
                    },
                }}
            />
        )
    )
}

export default HappTVCode
