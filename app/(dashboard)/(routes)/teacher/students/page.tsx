import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Filter, MoreHorizontal, Mail, MessageSquare } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function StudentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold">Students</h1>
          <p className="text-muted-foreground">Manage and track student progress</p>
        </div>
        <Button>Add Student</Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Students Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            name: "Alice Johnson",
            email: "alice.johnson@email.com",
            avatar: "/placeholder.svg?height=40&width=40",
            coursesEnrolled: 3,
            coursesCompleted: 1,
            totalProgress: 67,
            lastActive: "2 hours ago",
            status: "Active",
            joinDate: "Jan 2024",
          },
          {
            name: "Bob Smith",
            email: "bob.smith@email.com",
            avatar: "/placeholder.svg?height=40&width=40",
            coursesEnrolled: 5,
            coursesCompleted: 3,
            totalProgress: 85,
            lastActive: "1 day ago",
            status: "Active",
            joinDate: "Dec 2023",
          },
          {
            name: "Carol Davis",
            email: "carol.davis@email.com",
            avatar: "/placeholder.svg?height=40&width=40",
            coursesEnrolled: 2,
            coursesCompleted: 2,
            totalProgress: 100,
            lastActive: "3 days ago",
            status: "Completed",
            joinDate: "Nov 2023",
          },
          {
            name: "David Wilson",
            email: "david.wilson@email.com",
            avatar: "/placeholder.svg?height=40&width=40",
            coursesEnrolled: 4,
            coursesCompleted: 0,
            totalProgress: 23,
            lastActive: "1 week ago",
            status: "Inactive",
            joinDate: "Feb 2024",
          },
          {
            name: "Eva Brown",
            email: "eva.brown@email.com",
            avatar: "/placeholder.svg?height=40&width=40",
            coursesEnrolled: 6,
            coursesCompleted: 4,
            totalProgress: 92,
            lastActive: "5 hours ago",
            status: "Active",
            joinDate: "Oct 2023",
          },
          {
            name: "Frank Miller",
            email: "frank.miller@email.com",
            avatar: "/placeholder.svg?height=40&width=40",
            coursesEnrolled: 1,
            coursesCompleted: 0,
            totalProgress: 45,
            lastActive: "2 days ago",
            status: "Active",
            joinDate: "Mar 2024",
          },
        ].map((student, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant={
                    student.status === "Active" ? "default" : student.status === "Completed" ? "secondary" : "outline"
                  }
                >
                  {student.status}
                </Badge>
                <span className="text-sm text-muted-foreground">Joined {student.joinDate}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Enrolled</p>
                  <p className="font-medium">{student.coursesEnrolled} courses</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="font-medium">{student.coursesCompleted} courses</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{student.totalProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.totalProgress}%` }}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last active {student.lastActive}</span>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
