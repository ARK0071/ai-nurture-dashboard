
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { patients, getPatientHistory, Alert } from "@/lib/data";
import Navbar from "@/components/Navbar";
import VitalSign from "@/components/VitalSign";
import AlertsList from "@/components/AlertsList";
import HistoricalChart from "@/components/HistoricalChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Edit, UserPlus, MessageSquare, CalendarClock } from "lucide-react";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(patients.find(p => p.id === id));
  const [historyData, setHistoryData] = useState<any>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    if (!patient) {
      navigate("/dashboard");
      return;
    }
    
    // Get patient history
    const history = getPatientHistory(patient.id, 7);
    setHistoryData(history);
    
    // Get patient alerts
    setAlerts(patient.alerts);
  }, [id, navigate, patient]);
  
  if (!patient) return null;
  
  const handleMarkAlertAsRead = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4"
            onClick={() => navigate("/dashboard")}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={patient.photo} alt={patient.name} />
                <AvatarFallback className="text-lg">{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <div className="flex items-center text-muted-foreground space-x-3">
                  <span>{patient.age} years</span>
                  <span>•</span>
                  <span>Room {patient.room}</span>
                  <span>•</span>
                  <span>ID: {patient.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button size="sm" variant="outline" className="flex items-center">
                <Edit className="mr-1 h-4 w-4" /> Edit Profile
              </Button>
              <Button size="sm" variant="outline" className="flex items-center">
                <UserPlus className="mr-1 h-4 w-4" /> Assign Caregiver
              </Button>
              <Button size="sm" className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" /> Add Note
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Heart Rate</CardTitle>
              <CardDescription>Current reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <VitalSign type="heart" vital={patient.vitals.heartRate} size="lg" />
                <div className="text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3 inline mr-1" />
                  Updated {new Date(patient.vitals.heartRate.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Oxygen Level</CardTitle>
              <CardDescription>Current reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <VitalSign type="oxygen" vital={patient.vitals.oxygenLevel} size="lg" />
                <div className="text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3 inline mr-1" />
                  Updated {new Date(patient.vitals.oxygenLevel.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Movement</CardTitle>
              <CardDescription>Current reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <VitalSign type="movement" vital={patient.vitals.movement} size="lg" />
                <div className="text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3 inline mr-1" />
                  Updated {new Date(patient.vitals.movement.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sleep</CardTitle>
              <CardDescription>Current reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <VitalSign type="sleep" vital={patient.vitals.sleep} size="lg" />
                <div className="text-xs text-muted-foreground">
                  <CalendarClock className="h-3 w-3 inline mr-1" />
                  Updated {new Date(patient.vitals.sleep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="trends">
          <TabsList className="mb-4">
            <TabsTrigger value="trends">Historical Trends</TabsTrigger>
            <TabsTrigger value="alerts">Patient Alerts</TabsTrigger>
            <TabsTrigger value="notes">Care Notes</TabsTrigger>
            <TabsTrigger value="family">Family Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends">
            {historyData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HistoricalChart 
                  data={historyData.heartRate}
                  title="Heart Rate (Last 7 Days)"
                  dataKey="Heart Rate"
                  unit="bpm"
                  color="#F44336"
                  minValue={60}
                  maxValue={120}
                />
                
                <HistoricalChart 
                  data={historyData.oxygenLevel}
                  title="Oxygen Level (Last 7 Days)"
                  dataKey="Oxygen Level"
                  unit="%"
                  color="#2196F3"
                  minValue={85}
                  maxValue={100}
                />
                
                <HistoricalChart 
                  data={historyData.movement}
                  title="Movement (Last 7 Days)"
                  dataKey="Movement"
                  unit="activity/hr"
                  color="#4CAF50"
                  minValue={0}
                  maxValue={5}
                />
                
                <HistoricalChart 
                  data={historyData.sleep}
                  title="Sleep (Last 7 Days)"
                  dataKey="Sleep"
                  unit="hrs"
                  color="#9C27B0"
                  minValue={0}
                  maxValue={10}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Patient Alerts</CardTitle>
                <CardDescription>
                  Recent health abnormalities and AI predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsList 
                  alerts={alerts} 
                  onMarkRead={handleMarkAlertAsRead}
                  emptyMessage="No alerts for this patient. All vitals are normal."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Care Notes</CardTitle>
                <CardDescription>
                  Recent care notes and observations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  No care notes have been added yet
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="family">
            <Card>
              <CardHeader>
                <CardTitle>Family Contacts</CardTitle>
                <CardDescription>
                  Family members and emergency contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patient.familyMembers.length > 0 ? (
                  <div>Family contact list would go here</div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No family contacts have been added yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatientDetail;
