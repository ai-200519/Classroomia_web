'use client'
import { ConfirmModal } from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/use-confetti-store'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

interface ActionsProps {
    disabled: boolean
    courseId: string
    isPublished: boolean
}
const Actions = ({ disabled, courseId, isPublished }: ActionsProps) => {
    const router = useRouter();
    const confetti = useConfettiStore();
    const [isLoading, setIsLoading] = React.useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success('Cursus non publié')
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success('Cursus Publié avec succès')
                confetti.onOpen();
            }

            router.refresh()
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}`)
            toast.success('Cursus supprimé avec succès')
            router.refresh();
            router.push(`/teacher/courses`)
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className='flex items-center gap-x-2'>
            <Button onClick={onClick} disabled={disabled || isLoading}  size={'sm'}>
                {isPublished ? 'non publié' : "Publié"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size={'sm'} disabled={isLoading} variant={'destructive'}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Actions