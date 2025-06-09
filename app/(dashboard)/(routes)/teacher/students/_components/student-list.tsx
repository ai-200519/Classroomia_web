import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface StudentListProps {
    students: {
        userId: string
        coursesEnrolled: number
        totalProgress: number
        lastActive: Date
        courses: {
            courseId: string
            title: string
            progress: number
        }[]
    }[]
}

const StudentList = ({
    students
}: StudentListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
                <Card key={student.userId} className="p-4 hover:shadow-lg transition">
                    <div className="flex items-center gap-x-4 mb-4">
                        <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.userId}`} />
                            <AvatarFallback>ST</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-medium">Étudiant {student.userId.slice(0, 4)}</p>
                            <p className="text-sm text-muted-foreground">
                                Dernière activité: {formatDistanceToNow(student.lastActive, { locale: fr, addSuffix: true })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-x-2">
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            <p className="text-sm font-medium">{student.coursesEnrolled} cours</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Progression Globale</p>
                                <p className="text-sm text-muted-foreground">{student.totalProgress}%</p>
                            </div>
                            <Progress value={student.totalProgress} className="h-2" />
                        </div>

                        <div className="space-y-2">
                            {student.courses.map((course) => (
                                <div key={course.courseId} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm truncate">{course.title}</p>
                                        <Badge variant={course.progress === 100 ? "secondary" : "default"}>
                                            {course.progress}%
                                        </Badge>
                                    </div>
                                    <Progress value={course.progress} className="h-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default StudentList 