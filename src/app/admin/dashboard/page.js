"use client";

import jwt from "jsonwebtoken";
import { useState, useCallback, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Layout,
  LogOut,
  Menu,
  MessagesSquare,
  PieChart,
  School,
  Users,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  getFeedbacksUrl,
  getAllCollegesUrl,
  getNonVarifiedCollegesUrl,
  verifyCollegeUrl,
  rejectverifyCollegeUrl,
  blockCollegeUrl,
  getAllCollegeCountUrl,
  getAllStudentsCountUrl,
  getAllAlumniCountUrl,
} from "@/urls/urls.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getUser, isAuthenticated } from "@/services/checkAuth";
import { getAllContactForm } from "@/features/contact/contactSlice";
import { getAllFeedbacks } from "@/features/feedback/feedbackSlice";
import { getAlumniList } from "@/features/alumni/alumniSlice";
import { getStudentList } from "@/features/student/studentSlice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAllEvents, postEvent } from "@/features/event/eventSlice";

export default function AdminDashboard() {
  const { toast } = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [registerdColleges, setRegisterdColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const contactList = useSelector((state) => state?.contact?.contactData);
  const feedbackList = useSelector((state) => state?.feedback?.feedbackData);
  const alumniList = useSelector((state) => state?.alumniList?.alumniList);
  console.log("🚀 ~ AdminDashboard ~ alumniList:", alumniList);
  const studentList = useSelector((state) => state?.studentList?.studentList);
  const eventList = useSelector((state) => state?.event?.eventList);
  const user = getUser();
  console.log("🚀 ~ AdminDashboard ~ user:", user)

  const colleges = [
    {
      id: 1,
      name: "Department of Computer Science",
      plan: "Premium",
      students: 5000,
      alumni: 20000,
      status: "Approved",
      remainingTime: "11 months",
      revenue: 50000,
    },
    {
      id: 2,
      name: "Department of Clothing",
      plan: "Medium",
      students: 2000,
      alumni: 8000,
      status: "Approved",
      remainingTime: "5 months",
      revenue: 20000,
    },
    {
      id: 3,
      name: "Department of Texile Technology",
      plan: "Free",
      students: 1000,
      alumni: 3000,
      status: "Pending",
      remainingTime: "N/A",
      revenue: 0,
    },
    {
      id: 4,
      name: "BBA",
      plan: "Premium",
      students: 3000,
      alumni: 15000,
      status: "Approved",
      remainingTime: "8 months",
      revenue: 50000,
    },
    {
      id: 5,
      name: "Applied Sciences",
      plan: "Medium",
      students: 4000,
      alumni: 18000,
      status: "Pending",
      remainingTime: "N/A",
      revenue: 0,
    },
  ];

  useEffect(() => {
    const auth = isAuthenticated();
    if (!auth ) {
      console.log("User not authenticated, redirecting to login");
      router.replace("/admin/login");
      return;
    }
  }, [router]);

  const [formData, setFormData] = useState({
    eventPhoto: null,
    title: "",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "eventPhoto") {
      setFormData({ ...formData, eventPhoto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventForm = new FormData();
    eventForm.append("eventPhoto", formData.eventPhoto);
    eventForm.append("title", formData.title);
    eventForm.append("date", formData.date);
    eventForm.append("description", formData.description);

    dispatch(postEvent(eventForm));
    setFormData({
      eventPhoto: null,
      title: "",
      date: "",
      description: "",
    });
  };

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllContactForm());
    dispatch(getAllFeedbacks());
    dispatch(getAlumniList());
    dispatch(getStudentList());
  }, [dispatch]);

  function filterTable(e, tableId) {
    const filter = e.target.value.toLowerCase();
    const table = document.getElementById(tableId);
    const rows = table?.getElementsByTagName("tr");

    if (!rows) return;

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      let match = false;

      for (let j = 0; j < cells.length; j++) {
        const text = cells[j]?.textContent || cells[j]?.innerText;
        if (text.toLowerCase().includes(filter)) {
          match = true;
          break;
        }
      }

      rows[i].style.display = match ? "" : "none";
    }
  }

  return (
    <>
      {isAdmin === true && (
        <>
          <div className="flex h-screen bg-gray-100">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-2xl font-bold">AMS</h1>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Menu />
                    </Button>
                  </div>
                  <div className="flex-1 px-4 py-6 space-y-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/">
                        <Layout className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/analytics">
                        <PieChart className="mr-2 h-4 w-4" />
                        Analytics
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <School className="mr-2 h-4 w-4" />
                      Colleges
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Users
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <MessagesSquare className="mr-2 h-4 w-4" />
                      Feedback
                    </Button>
                  </div>
                  <div className="p-4 border-t">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="flex-1 overflow-y-auto p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Colleges
                      </CardTitle>
                      <School className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1</div>
                      <p className="text-xs text-muted-foreground">
                        +1 from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Students
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {studentList?.totalStudents}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +5% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Alumni
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {alumniList?.totalAlumni}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +2% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Users
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {studentList?.totalStudents + alumniList?.totalAlumni ||
                          "Total"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        +10% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Revenue
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">Coming Soon</div>
                      <p className="text-xs text-muted-foreground">
                        From all Departments plans
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Tabs defaultValue="colleges" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="colleges">Departments</TabsTrigger>
                    <TabsTrigger value="students">All Students</TabsTrigger>
                    <TabsTrigger value="alumni">Alumni List</TabsTrigger>
                    <TabsTrigger value="feedback">User Feedback</TabsTrigger>
                    <TabsTrigger value="inqueries">User inquiries</TabsTrigger>
                    <TabsTrigger value="postEvent">Post New Event</TabsTrigger>
                    <TabsTrigger value="allEvents">All Events</TabsTrigger>
                  </TabsList>
                  <TabsContent value="colleges">
                    <Card>
                      <CardHeader>
                        <CardTitle>Registered Department</CardTitle>
                        <CardDescription>
                          Manage Department and their subscription plans.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Plan</TableHead>
                              <TableHead>Students</TableHead>
                              <TableHead>Alumni</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Remaining Time</TableHead>
                              <TableHead>Revenue</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {colleges?.map((college) => (
                              <TableRow key={college.id}>
                                <TableCell className="font-medium">
                                  {college.name}
                                </TableCell>
                                <TableCell>{college?.plan}</TableCell>
                                <TableCell>
                                  {college?.students?.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  {college?.alumni?.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      college?.status === "Approved"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {college.status === "Approved"
                                      ? "Verified"
                                      : "Pending"}
                                  </span>
                                </TableCell>
                                <TableCell>{college?.remainingTime}</TableCell>
                                <TableCell>
                                  ${college?.revenue?.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="students" id="studentsTable">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <CardTitle>All Students</CardTitle>
                            <CardDescription>
                              All Students From Every Department
                            </CardDescription>
                          </div>
                          <input
                            type="text"
                            placeholder="Search..."
                            className="p-2 border border-gray-300 rounded-md w-full sm:w-64"
                            onKeyUp={(e) => filterTable(e, "studentsTable")}
                          />
                        </div>
                      </CardHeader>

                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Requested Plan</TableHead>
                              <TableHead>Details</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentList?.students?.map((student) => (
                              <TableRow key={student?.id?._id}>
                                <TableCell className="font-medium">
                                  {student?.name}
                                </TableCell>
                                <TableCell>{student?.batch}</TableCell>
                                <TableCell>{student?.degree}</TableCell>
                                <TableCell>{student?.university}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="alumni" id="alumniTable">
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <CardTitle>Alumni List</CardTitle>
                            <CardDescription>
                              Alumni From all Departments are Here!
                            </CardDescription>
                          </div>
                          <input
                            type="text"
                            placeholder="Search..."
                            className="p-2 border border-gray-300 rounded-md w-full sm:w-64"
                            onKeyUp={(e) => filterTable(e, "alumniTable")}
                          />
                        </div>
                      </CardHeader>

                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Batch</TableHead>
                              <TableHead>Job Title</TableHead>
                              <TableHead>Company Name</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {alumniList?.alumni?.map((alumni) => (
                              <TableRow key={alumni?.id?._id}>
                                <TableCell className="font-medium">
                                  {alumni?.name}
                                </TableCell>
                                <TableCell>{alumni?.batch}</TableCell>
                                <TableCell>{alumni?.jobTitle}</TableCell>
                                <TableCell>{alumni?.companyName}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="feedback">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Feedback</CardTitle>
                        <CardDescription>
                          Recent feedback from AMS users.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          {feedbackList?.map((feedback) => (
                            <div
                              key={feedback._id}
                              className="mb-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center mb-2">
                                <h3 className="font-semibold">
                                  {feedback?.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  ({feedback?.email})
                                </p>
                              </div>
                              <p className="text-sm text-gray-600">
                                Garduation Year:
                                <b>({feedback?.graduationYear})</b>
                              </p>
                              <p className="text-sm text-gray-600">
                                Rating In Stars: <b>{feedback?.rating}</b>
                              </p>
                              <hr />
                              <p className="text-sm text-gray-600 py-2">
                                {feedback?.review}
                              </p>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="inqueries">
                    <Card>
                      <CardHeader>
                        <CardTitle>User inqueries</CardTitle>
                        <CardDescription>
                          Recent inqueries from AMS users.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          {contactList?.map((inquiry) => (
                            <div
                              key={inquiry._id}
                              className="mb-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center mb-2">
                                <h3 className="font-semibold">
                                  {inquiry?.firstName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  ({inquiry?.email})
                                </p>
                              </div>
                              <p className="text-sm text-gray-600">
                                Inquiry Type:({inquiry?.inquiryType})
                              </p>
                              <hr />
                              <p className="text-sm text-gray-600 py-2">
                                {inquiry?.message}
                              </p>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="postEvent">
      <Card>
        <CardHeader>
          <CardTitle>Post New Event</CardTitle>
          <CardDescription>Submit an event to share with alumni.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <Input type="file" name="eventPhoto" accept="image/*" onChange={handleChange} required />
            <Input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
            <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <Textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} required />
            <Button type="submit">Post Event</Button>
          </form>
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="allEvents">
  <Card>
    <CardHeader>
      <CardTitle>All Events</CardTitle>
      <CardDescription>List of all submitted events</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Photo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventList?.map((event) => (
              <TableRow key={event._id}>
                <TableCell className="font-medium">{event?.title}</TableCell>
                <TableCell>{new Date(event?.date).toLocaleDateString()}</TableCell>
                <TableCell className="max-w-[300px] truncate">{event?.description}</TableCell>
                <TableCell>
                  <img
                    src={event?.eventPhoto?.url || "/placeholder.jpg"}
                    alt="Event"
                    className="w-20 h-14 object-cover rounded"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
  </Card>
</TabsContent>


                </Tabs>
              </main>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{selectedCollege?.name} Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Name:</span>
                  <span className="col-span-3">{selectedCollege?.name}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Plan:</span>
                  <span className="col-span-3">{selectedCollege?.plan}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">email:</span>
                  <span className="col-span-3">{selectedCollege?.email}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">website:</span>
                  <span className="col-span-3">{selectedCollege?.website}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">linkedin:</span>
                  <span className="col-span-3">
                    {selectedCollege?.linkedin}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Contact No:</span>
                  <span className="col-span-3">{selectedCollege?.phone}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Status:</span>
                  <span className="col-span-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedCollege?.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedCollege?.status === "Approved"
                        ? "Verified"
                        : "Pending"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full mx-2 text-xs ${
                        selectedCollege?.isBlocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedCollege?.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </span>
                </div>
                {selectedCollege?.remainingTime && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Remaining Time:</span>
                    <span className="col-span-3">
                      {selectedCollege?.remainingTime}
                    </span>
                  </div>
                )}
                {selectedCollege?.revenue && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-medium">Revenue:</span>
                    <span className="col-span-3">
                      ${selectedCollege?.revenue?.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
