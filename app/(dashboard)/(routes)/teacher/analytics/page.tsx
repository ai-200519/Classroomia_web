import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getAnalytics } from "@/actions/get-analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, DollarSign } from "lucide-react"
import Chart from "./_components/chart"

const AnalyticsPage = async () => {
    const { userId } = await auth()

    if (!userId) {
        return redirect("/")
    }
    const {
        data,
        totalRevenue,
        totalSales,
        courseProgress,
        topPerformingCourses,
        overallCompletionRate
    } = await getAnalytics(userId)

    return (
        <div className="p-6 space-y-6 bg-slate-50">
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">Suivez les performances de votre cours et l&apos;engagement des étudiants
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de revenues</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD"
                            }).format(totalRevenue)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total des ventes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSales}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">taux de complétion du cours</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{overallCompletionRate}%</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                <Card>
                    <CardHeader>
                        <CardTitle>Cursus les plus performants</CardTitle>
                        <CardDescription>Basée sur tqux de complétion et nombre des élèves</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topPerformingCourses.map((course, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="space-y-1">
                                    <h4 className="font-medium">{course.course}</h4>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <span>{course.enrollments} étudiants</span>
                                        <span>{course.completionRate}% completion</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD"
                                        }).format(course.revenue)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Vue d&apos;ensemble des progrès du cours</CardTitle>
                        <CardDescription>Suivre les taux de progression pour tous les cours</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {courseProgress.map((course, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">{course.course}</h4>
                                        <span className="text-sm text-muted-foreground">{course.completionRate}% completion ratio</span>
                                    </div>
                                    <Progress value={course.completionRate} className="h-2" />
                                    <div className="grid grid-cols-4 gap-4 text-sm">
                                        <div className="text-center">
                                            <p className="font-medium">{course.totalStudents}</p>
                                            <p className="text-muted-foreground">Total</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-green-600">{course.completed}</p>
                                            <p className="text-muted-foreground">Terminé</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium text-blue-600">{course.inProgress}</p>
                                            <p className="text-muted-foreground">En Progress</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>                
                </div>
                <div>    
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue pour chaque Cursus</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <Chart data={data}/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AnalyticsPage