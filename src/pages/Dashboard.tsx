
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { getPatientsForUser, getAlertsForUser, Patient, Alert } from "@/lib/data";
import Navbar from "@/components/Navbar";
import PatientCard from "@/components/PatientCard";
import AlertsList from "@/components/AlertsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Users, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    const user = getCurrentUser();
    if (user) {
      setPatients(getPatientsForUser(user));
      setAlerts(getAlertsForUser(user));
    }
  }, [navigate]);
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.room.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const criticalPatientsCount = patients.filter(patient => {
    const vitals = patient.vitals;
    return (
      vitals.heartRate.status === 'critical' ||
      vitals.oxygenLevel.status === 'critical' ||
      vitals.movement.status === 'critical' ||
      vitals.sleep.status === 'critical'
    );
  }).length;
  
  const warningPatientsCount = patients.filter(patient => {
    const vitals = patient.vitals;
    return (
      (vitals.heartRate.status === 'warning' ||
      vitals.oxygenLevel.status === 'warning' ||
      vitals.movement.status === 'warning' ||
      vitals.sleep.status === 'warning') &&
      !(vitals.heartRate.status === 'critical' ||
      vitals.oxygenLevel.status === 'critical' ||
      vitals.movement.status === 'critical' ||
      vitals.sleep.status === 'critical')
    );
  }).length;
  
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
          <h1 className="text-3xl font-bold mb-2">Patient Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor real-time patient vitals and receive AI-driven alerts
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Patients</CardTitle>
              <CardDescription>Monitoring status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="text-3xl font-bold">{patients.length}</div>
                  <div className="text-sm text-muted-foreground">Active patients</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={criticalPatientsCount > 0 ? "border-status-critical" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-status-critical">Critical Status</CardTitle>
              <CardDescription>Patients needing immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className={`h-8 w-8 mr-3 ${criticalPatientsCount > 0 ? "text-status-critical animate-pulse" : "text-muted-foreground"}`} />
                <div>
                  <div className="text-3xl font-bold">{criticalPatientsCount}</div>
                  <div className="text-sm text-muted-foreground">Critical patients</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={warningPatientsCount > 0 ? "border-status-warning" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-status-warning">Warning Status</CardTitle>
              <CardDescription>Patients requiring monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className={`h-8 w-8 mr-3 ${warningPatientsCount > 0 ? "text-status-warning" : "text-muted-foreground"}`} />
                <div>
                  <div className="text-3xl font-bold">{warningPatientsCount}</div>
                  <div className="text-sm text-muted-foreground">Warning patients</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6 relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search patients by name or room number" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="patients">
          <TabsList className="mb-4">
            <TabsTrigger value="patients">All Patients</TabsTrigger>
            <TabsTrigger value="critical">Critical Status</TabsTrigger>
            <TabsTrigger value="warnings">Warnings</TabsTrigger>
            <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patients">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No patients found matching your search
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="critical">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.filter(patient => {
                const vitals = patient.vitals;
                return (
                  vitals.heartRate.status === 'critical' ||
                  vitals.oxygenLevel.status === 'critical' ||
                  vitals.movement.status === 'critical' ||
                  vitals.sleep.status === 'critical'
                );
              }).length > 0 ? (
                filteredPatients.filter(patient => {
                  const vitals = patient.vitals;
                  return (
                    vitals.heartRate.status === 'critical' ||
                    vitals.oxygenLevel.status === 'critical' ||
                    vitals.movement.status === 'critical' ||
                    vitals.sleep.status === 'critical'
                  );
                }).map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No patients with critical status
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="warnings">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.filter(patient => {
                const vitals = patient.vitals;
                return (
                  (vitals.heartRate.status === 'warning' ||
                  vitals.oxygenLevel.status === 'warning' ||
                  vitals.movement.status === 'warning' ||
                  vitals.sleep.status === 'warning') &&
                  !(vitals.heartRate.status === 'critical' ||
                  vitals.oxygenLevel.status === 'critical' ||
                  vitals.movement.status === 'critical' ||
                  vitals.sleep.status === 'critical')
                );
              }).length > 0 ? (
                filteredPatients.filter(patient => {
                  const vitals = patient.vitals;
                  return (
                    (vitals.heartRate.status === 'warning' ||
                    vitals.oxygenLevel.status === 'warning' ||
                    vitals.movement.status === 'warning' ||
                    vitals.sleep.status === 'warning') &&
                    !(vitals.heartRate.status === 'critical' ||
                    vitals.oxygenLevel.status === 'critical' ||
                    vitals.movement.status === 'critical' ||
                    vitals.sleep.status === 'critical')
                  );
                }).map(patient => (
                  <PatientCard key={patient.id} patient={patient} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No patients with warning status
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>
                  Showing recent abnormalities and AI predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertsList 
                  alerts={alerts} 
                  onMarkRead={handleMarkAlertAsRead}
                  emptyMessage="No alerts at this time. All patients are stable."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
