import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getTeacherStudents } from "@/actions/get-teacher-students"
import StudentList from "./_components/student-list"
import { Card } from "@/components/ui/card"
import { Users, BookOpen, CheckCircle } from "lucide-react"

const StudentsPage = async () => {
    const { userId } = await auth()

    if (!userId) {
        return redirect("/")
    }

    const students = await getTeacherStudents(userId)

    const totalStudents = students.length
    const totalCourses = students.reduce((acc, student) => acc + student.coursesEnrolled, 0)
    const averageProgress = students.reduce((acc, student) => acc + student.totalProgress, 0) / (totalStudents || 1)

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <div>
                            <p className="font-medium">Total Étudiants</p>
                            <p className="text-2xl font-bold">{totalStudents}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-x-2">
                        <BookOpen className="h-5 w-5 text-green-500" />
                        <div>
                            <p className="font-medium">Cours Inscrits</p>
                            <p className="text-2xl font-bold">{totalCourses}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-x-2">
                        <CheckCircle className="h-5 w-5 text-purple-500" />
                        <div>
                            <p className="font-medium">Progression Moyenne</p>
                            <p className="text-2xl font-bold">{Math.round(averageProgress)}%</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold">Liste des Étudiants</h2>
                <StudentList students={students} />
            </div>
        </div>
    )
}

export default StudentsPage
