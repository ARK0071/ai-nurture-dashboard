
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { getAlertsForUser, Alert, patients } from "@/lib/data";
import Navbar from "@/components/Navbar";
import AlertsList from "@/components/AlertsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  AlertTriangle, 
  Brain, 
  Bot, 
  MessageSquare, 
  Calendar, 
  Stethoscope, 
  Users, 
  VolumeX, 
  Volume2,
  UserCheck
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [assignedAlerts, setAssignedAlerts] = useState<Alert[]>([]);
  const [escalatedAlerts, setEscalatedAlerts] = useState<Alert[]>([]);
  const [virtualAssistantActive, setVirtualAssistantActive] = useState(true);
  const [patientConversation, setPatientConversation] = useState<{patientId: string, messages: {sender: 'ai' | 'patient', text: string}[]}>({
    patientId: '3', // Default to Mary Williams (critical patient)
    messages: []
  });
  const [newMessage, setNewMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    const user = getCurrentUser();
    if (user) {
      // Get alerts for the user
      const userAlerts = getAlertsForUser(user);
      setAlerts(userAlerts);
      
      // Simulate AI-assigned alerts (this would be dynamically assigned in a real system)
      setAssignedAlerts(userAlerts.filter((_, index) => index % 3 === 0));
      
      // Simulate escalated alerts
      setEscalatedAlerts(userAlerts.filter(alert => 
        alert.status === 'critical' && !alert.isRead
      ));
    }
    
    // Simulate Virtual Nursing Assistant conversation
    if (virtualAssistantActive) {
      const timer = setTimeout(() => {
        const randomMessages = [
          {sender: 'ai', text: "How are you feeling this morning, Mrs. Williams?"},
          {sender: 'patient', text: "Not so well, I'm having trouble breathing."},
          {sender: 'ai', text: "I'm sorry to hear that. Your oxygen levels do appear to be lower than normal. I'll notify a nurse immediately."},
          {sender: 'ai', text: "A nurse has been dispatched to your room. They should arrive shortly."}
        ];
        
        setPatientConversation(prev => ({
          ...prev,
          messages: randomMessages
        }));
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [navigate, virtualAssistantActive]);
  
  const handleMarkAlertAsRead = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
    
    // Also update in assigned/escalated lists
    setAssignedAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
    
    setEscalatedAlerts(prevAlerts => 
      prevAlerts.filter(alert => alert.id !== alertId)
    );
    
    toast({
      title: "Alert marked as addressed",
      description: "The care team has been notified of your response."
    });
  };
  
  const handleAssignAlert = (alertId: string) => {
    // Find the alert
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    // Add to assigned alerts if not already there
    if (!assignedAlerts.some(a => a.id === alertId)) {
      setAssignedAlerts(prev => [...prev, alert]);
      
      toast({
        title: "Alert assigned to you",
        description: `You've been assigned to respond to ${alert.message}`
      });
    }
  };
  
  const handleEscalateAlert = (alertId: string) => {
    // Find the alert
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    // Add to escalated alerts if not already there
    if (!escalatedAlerts.some(a => a.id === alertId)) {
      setEscalatedAlerts(prev => [...prev, {...alert, status: 'critical'}]);
      
      toast({
        title: "Alert escalated",
        description: "This has been escalated to a senior nurse",
        variant: "destructive"
      });
    }
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    setPatientConversation(prev => ({
      ...prev,
      messages: [...prev.messages, {sender: 'ai', text: newMessage}]
    }));
    
    setNewMessage('');
    
    // Simulate patient response
    setTimeout(() => {
      const patientResponses = [
        "I'm feeling a bit better now, thank you.",
        "Can you ask the nurse to bring me some water?",
        "I'm still having some pain in my chest.",
        "When is the doctor coming to see me today?"
      ];
      
      const randomResponse = patientResponses[Math.floor(Math.random() * patientResponses.length)];
      
      setPatientConversation(prev => ({
        ...prev,
        messages: [...prev.messages, {sender: 'patient', text: randomResponse}]
      }));
      
      // If message contains concerning content, simulate escalation
      if (randomResponse.includes('pain')) {
        toast({
          title: "Patient Alert",
          description: "Patient reported chest pain. This has been added to alerts.",
          variant: "destructive"
        });
        
        // Add a new alert
        const newAlert: Alert = {
          id: `new-${Date.now()}`,
          patientId: patientConversation.patientId,
          type: 'prediction',
          message: 'Patient reported chest pain during virtual check-in',
          status: 'warning',
          timestamp: new Date(),
          isRead: false
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        setAssignedAlerts(prev => [newAlert, ...prev]);
      }
    }, 1500);
  };
  
  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Voice Assistant Activated",
        description: "Listening for your commands...",
      });
      
      // Simulate voice recognition after 2 seconds
      setTimeout(() => {
        const recognizedText = "Check on Mary Williams and ask about her oxygen levels";
        setNewMessage(recognizedText);
        
        toast({
          title: "Voice Recognized",
          description: recognizedText,
        });
        
        setIsListening(false);
      }, 2000);
    }
  };
  
  const predictionsData = [
    {
      patientId: '2',
      patientName: 'Richard Thompson',
      predictionType: 'Dehydration Risk',
      confidenceScore: 78,
      evidenceFactors: [
        'Decreased fluid intake over 24 hours',
        'Slight increase in heart rate (+8 bpm)',
        'Reduced mobility (28% decrease)'
      ],
      recommendedActions: [
        'Increase fluid intake to 1.5L over next 8 hours',
        'Monitor heart rate every 2 hours',
        'Document urine output'
      ],
      timeWindow: '6-12 hours'
    },
    {
      patientId: '3',
      patientName: 'Mary Williams',
      predictionType: 'Fall Risk',
      confidenceScore: 92,
      evidenceFactors: [
        'Irregular gait detected on movement sensors',
        'Three bathroom visits during night hours',
        'Blood pressure medication adjustment yesterday',
        'Previous fall history (2 months ago)'
      ],
      recommendedActions: [
        'Implement fall precautions immediately',
        'Install bed alarm',
        'Schedule physical therapy assessment',
        'Review medication side effects'
      ],
      timeWindow: '24-48 hours'
    },
    {
      patientId: '1',
      patientName: 'Eleanor Johnson',
      predictionType: 'UTI Development',
      confidenceScore: 65,
      evidenceFactors: [
        'Slight temperature elevation (0.8°F)',
        'Increased bathroom visits',
        'Recent confusion reported by night staff'
      ],
      recommendedActions: [
        'Increase hydration',
        'Monitor temperature every 4 hours',
        'Consider urinalysis if symptoms persist'
      ],
      timeWindow: '48-72 hours'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">AI-Powered Alerts & Management</h1>
          <p className="text-muted-foreground">
            Smart prioritization, virtual assistant, and predictive insights
          </p>
        </div>
        
        <Tabs defaultValue="task-management">
          <TabsList className="mb-4">
            <TabsTrigger value="task-management" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" /> Task Prioritization
            </TabsTrigger>
            <TabsTrigger value="virtual-assistant" className="flex items-center">
              <Bot className="h-4 w-4 mr-1" /> Virtual Assistant
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center">
              <Brain className="h-4 w-4 mr-1" /> Predictive Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="task-management">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Alert Triage</CardTitle>
                  <CardDescription>AI-prioritized alerts needing review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="text-3xl font-bold">{alerts.length}</div>
                      <div className="text-sm text-muted-foreground">Pending alerts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Assigned to You</CardTitle>
                  <CardDescription>Tasks AI has assigned to your queue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <UserCheck className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="text-3xl font-bold">{assignedAlerts.length}</div>
                      <div className="text-sm text-muted-foreground">Assigned tasks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={escalatedAlerts.length > 0 ? "border-status-critical" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-lg ${escalatedAlerts.length > 0 ? "text-status-critical" : ""}`}>
                    Escalated Cases
                  </CardTitle>
                  <CardDescription>Requires immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <AlertTriangle className={`h-8 w-8 mr-3 ${escalatedAlerts.length > 0 ? "text-status-critical animate-pulse" : "text-muted-foreground"}`} />
                    <div>
                      <div className="text-3xl font-bold">{escalatedAlerts.length}</div>
                      <div className="text-sm text-muted-foreground">Critical cases</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    AI-Prioritized Alerts
                  </CardTitle>
                  <CardDescription>
                    Smart triage based on severity, patient history, and staff availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertsList 
                    alerts={alerts}
                    onMarkRead={handleMarkAlertAsRead}
                    showAIPrioritization={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2 text-primary" />
                    Your Assigned Cases
                  </CardTitle>
                  <CardDescription>
                    Tasks assigned to you by the AI system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {assignedAlerts.length > 0 ? (
                    <div className="space-y-3">
                      {assignedAlerts.map(alert => (
                        <div key={alert.id} className={`flex items-start justify-between p-3 rounded-md border ${
                          alert.status === 'critical' ? 'bg-status-critical/10 border-status-critical' : 
                          alert.status === 'warning' ? 'bg-status-warning/10 border-status-warning' : 
                          'bg-card border-border'
                        } ${alert.isRead ? 'opacity-70' : ''}`}>
                          <AlertBadge alert={alert} />
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleMarkAlertAsRead(alert.id)}
                            >
                              Mark Resolved
                            </Button>
                            
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleEscalateAlert(alert.id)}
                            >
                              Escalate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No cases currently assigned to you
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="virtual-assistant">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2 text-primary" />
                      Virtual Nursing Assistant
                    </CardTitle>
                    <CardDescription>
                      AI-powered assistance for patient communication
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 mb-4">
                      <Switch
                        id="assistant-active"
                        checked={virtualAssistantActive}
                        onCheckedChange={setVirtualAssistantActive}
                      />
                      <Label htmlFor="assistant-active">
                        Assistant {virtualAssistantActive ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium mb-2">Active Patient Checks</h3>
                        <div className="space-y-2 text-sm">
                          {patients.map(patient => (
                            <div key={patient.id} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Badge variant="outline" className={
                                  patient.id === '3' ? 'bg-status-critical/10 text-status-critical border-status-critical' : 
                                  patient.id === '2' ? 'bg-status-warning/10 text-status-warning border-status-warning' : 
                                  'bg-primary/10 text-primary border-primary'
                                }>
                                  Room {patient.room}
                                </Badge>
                                <span className="ml-2">{patient.name}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 text-xs"
                                onClick={() => {
                                  setPatientConversation({
                                    patientId: patient.id,
                                    messages: []
                                  });
                                  toast({
                                    title: "Patient Changed",
                                    description: `Now communicating with ${patient.name}`
                                  });
                                }}
                              >
                                Connect
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium mb-2">Scheduled Check-ins</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Room 105C (Mary) - 10:30 AM</span>
                            </div>
                            <Badge>Upcoming</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Room 102B (Richard) - 11:15 AM</span>
                            </div>
                            <Badge>Upcoming</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>Room 101A (Eleanor) - 9:00 AM</span>
                            </div>
                            <Badge variant="outline">Completed</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="rounded-md border p-4">
                        <h3 className="font-medium mb-2">System Status</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Voice Recognition</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Response Latency</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Normal (0.8s)</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Smart Speakers</span>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">4/4 Online</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Patient Communication Interface</CardTitle>
                    <CardDescription>
                      Virtual assistant conversation with {
                        patients.find(p => p.id === patientConversation.patientId)?.name || 'Patient'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <div className="flex-grow bg-muted/30 rounded-md p-4 mb-4 overflow-y-auto h-[320px]">
                      {patientConversation.messages.length > 0 ? (
                        <div className="space-y-4">
                          {patientConversation.messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                msg.sender === 'ai' 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-muted'
                              }`}>
                                <div className="text-xs mb-1 opacity-70">
                                  {msg.sender === 'ai' ? 'Virtual Nurse' : 'Patient'}
                                </div>
                                <p>{msg.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Bot className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No conversation history yet.</p>
                            <p className="text-sm">Send a message to begin communication.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleListening}
                        className={isListening ? "bg-primary text-primary-foreground" : ""}
                      >
                        {isListening ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                      <Input
                        placeholder="Type a message to the patient..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-grow"
                      />
                      <Button onClick={handleSendMessage}>
                        <MessageSquare className="h-4 w-4 mr-2" /> Send
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Quick Responses:</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => setNewMessage("How are you feeling today?")}
                        >
                          How are you feeling?
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => setNewMessage("Do you need any assistance right now?")}
                        >
                          Need assistance?
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => setNewMessage("Have you taken your medication today?")}
                        >
                          Medication check
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => setNewMessage("A nurse will be with you shortly.")}
                        >
                          Nurse coming soon
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    Predictive Health Insights
                  </h2>
                  <p className="text-muted-foreground">
                    AI-generated predictions based on analyzing patient data patterns
                  </p>
                </div>
                <Button variant="outline" className="flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Run Full Assessment
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Active Predictions</CardTitle>
                  <CardDescription>Current health risk predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="text-3xl font-bold">{predictionsData.length}</div>
                      <div className="text-sm text-muted-foreground">Actionable insights</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Patient Coverage</CardTitle>
                  <CardDescription>Patients with active monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="text-3xl font-bold">{patients.length}</div>
                      <div className="text-sm text-muted-foreground">Monitored patients</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Prediction Accuracy</CardTitle>
                  <CardDescription>Overall AI prediction performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <div className="text-3xl font-bold">93%</div>
                      <div className="text-sm text-muted-foreground">Historical accuracy</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {predictionsData.map((prediction, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className={
                          prediction.confidenceScore > 80 
                            ? "bg-status-critical/10 text-status-critical border-status-critical" 
                            : prediction.confidenceScore > 70
                              ? "bg-status-warning/10 text-status-warning border-status-warning"
                              : "bg-primary/10 text-primary border-primary"
                        }>
                          {prediction.confidenceScore}% Confidence
                        </Badge>
                        <CardTitle className="mt-2">{prediction.predictionType}</CardTitle>
                        <CardDescription>
                          Patient: {prediction.patientName} (Room {
                            patients.find(p => p.id === prediction.patientId)?.room || '-'
                          })
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {prediction.timeWindow} Window
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Evidence Factors:</h3>
                        <ul className="space-y-1 text-sm">
                          {prediction.evidenceFactors.map((factor, i) => (
                            <li key={i} className="flex items-start">
                              <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recommended Actions:</h3>
                        <ul className="space-y-2 text-sm">
                          {prediction.recommendedActions.map((action, i) => (
                            <li key={i} className="flex items-start">
                              <span className="flex items-center justify-center flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-medium mr-2">
                                {i+1}
                              </span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm">View Full Analysis</Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          // Create a new alert from this prediction
                          const newAlert: Alert = {
                            id: `pred-${Date.now()}`,
                            patientId: prediction.patientId,
                            type: 'prediction',
                            message: `${prediction.predictionType}: ${prediction.recommendedActions[0]}`,
                            status: prediction.confidenceScore > 80 ? 'critical' : 'warning',
                            timestamp: new Date(),
                            isRead: false
                          };
                          
                          setAlerts(prev => [newAlert, ...prev]);
                          setAssignedAlerts(prev => [newAlert, ...prev]);
                          
                          toast({
                            title: "Task Created",
                            description: `New task created for ${prediction.patientName}`
                          });
                        }}
                      >Create Task</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Alerts;
