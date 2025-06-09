'use client'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'
import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'

interface CourseEnrollButtonProps {
    courseId: string,
    price: number
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const onClick = async () => {
        try {
            setIsLoading(true)

            const response = await axios.post(`/api/courses/${courseId}/checkout`)

            if (!response.data?.url) {
                throw new Error("No checkout URL received")
            }

            window.location.assign(response.data.url)
        } catch (error) {
            console.error("Checkout error:", error)
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    toast.error("Vous devez être connecté pour acheter ce cours")
                } else if (error.response?.status === 400) {
                    toast.error("Vous avez déjà acheté ce cours")
                } else if (error.response?.data) {
                    toast.error(error.response.data)
                } else {
                    toast.error("Une erreur est survenue lors du paiement")
                }
            } else {
                toast.error("Une erreur est survenue lors du paiement")
            }
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <Button className='w-full md:w-auto' size={'sm'} disabled={isLoading} onClick={onClick}>
            S&apos;inscrire pour {formatPrice(price)}
        </Button>
    )
}

export default CourseEnrollButton