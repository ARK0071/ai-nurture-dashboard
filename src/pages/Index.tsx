
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-4xl">
          <div className="mb-8 flex justify-center">
            <div className="bg-medical-blue text-white p-4 rounded-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 8V5c0-1-1-2-2-2H7C6 3 5 4 5 5v3" />
                <path d="M5 16v3c0 1 1 2 2 2h10c1 0 2-1 2-2v-3" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            CareVitals <span className="text-primary">AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            AI-powered patient monitoring for nursing homes. 
            Real-time vitals tracking and intelligent alerts for enhanced care.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/login")}>
              Sign In to Dashboard
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CareVitals AI - Demo for Nursing Home Patient Monitoring
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
