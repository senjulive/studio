'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Shield, 
  Users, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CreditCard,
  Flag
} from "lucide-react";
import { cn } from "@/lib/utils";

type VerificationStatus = "pending" | "approved" | "rejected" | "incomplete";

type UserVerification = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  phoneNumber: string;
  documentType: "passport" | "driver_license" | "national_id";
  documentNumber: string;
  documentFront: string;
  documentBack?: string;
  selfie: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  riskLevel: "low" | "medium" | "high";
};

const mockVerifications: UserVerification[] = [
  {
    id: "kyc_001",
    userId: "user_123",
    userName: "JohnDoe2024",
    email: "john.doe@example.com",
    fullName: "John Michael Doe",
    dateOfBirth: "1990-05-15",
    nationality: "United States",
    address: "123 Main Street, New York, NY 10001",
    phoneNumber: "+1-555-123-4567",
    documentType: "passport",
    documentNumber: "P123456789",
    documentFront: "https://example.com/docs/passport_front.jpg",
    selfie: "https://example.com/docs/selfie.jpg",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
    riskLevel: "low"
  },
  {
    id: "kyc_002",
    userId: "user_456",
    userName: "JaneSmith",
    email: "jane.smith@example.com",
    fullName: "Jane Elizabeth Smith",
    dateOfBirth: "1985-08-22",
    nationality: "Canada",
    address: "456 Oak Avenue, Toronto, ON M5V 2A1",
    phoneNumber: "+1-416-555-7890",
    documentType: "driver_license",
    documentNumber: "DL987654321",
    documentFront: "https://example.com/docs/license_front.jpg",
    documentBack: "https://example.com/docs/license_back.jpg",
    selfie: "https://example.com/docs/selfie2.jpg",
    status: "approved",
    submittedAt: "2024-01-14T14:20:00Z",
    reviewedAt: "2024-01-15T09:45:00Z",
    reviewedBy: "Admin Team",
    riskLevel: "low"
  },
  {
    id: "kyc_003",
    userId: "user_789",
    userName: "SuspiciousUser",
    email: "suspicious@tempmail.com",
    fullName: "Bob Suspicious",
    dateOfBirth: "2005-01-01",
    nationality: "Unknown",
    address: "Fake Address 123",
    phoneNumber: "+1-000-000-0000",
    documentType: "national_id",
    documentNumber: "ID000000000",
    documentFront: "https://example.com/docs/fake_id.jpg",
    selfie: "https://example.com/docs/fake_selfie.jpg",
    status: "rejected",
    submittedAt: "2024-01-13T16:30:00Z",
    reviewedAt: "2024-01-14T11:20:00Z",
    reviewedBy: "Security Team",
    rejectionReason: "Fraudulent documents detected",
    riskLevel: "high"
  }
];

export function ProfilePageAdmin() {
  const { toast } = useToast();
  const [verifications, setVerifications] = React.useState<UserVerification[]>(mockVerifications);
  const [selectedVerification, setSelectedVerification] = React.useState<UserVerification | null>(null);
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterRisk, setFilterRisk] = React.useState<string>("all");
  const [rejectionReason, setRejectionReason] = React.useState("");

  const filteredVerifications = verifications.filter(verification => {
    if (filterStatus !== "all" && verification.status !== filterStatus) return false;
    if (filterRisk !== "all" && verification.riskLevel !== filterRisk) return false;
    return true;
  });

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "approved": return "bg-green-500/10 border-green-500/20 text-green-400";
      case "rejected": return "bg-red-500/10 border-red-500/20 text-red-400";
      case "incomplete": return "bg-gray-500/10 border-gray-500/20 text-gray-400";
      default: return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const getRiskColor = (risk: UserVerification['riskLevel']) => {
    switch (risk) {
      case "low": return "bg-green-500/10 border-green-500/20 text-green-400";
      case "medium": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      case "high": return "bg-red-500/10 border-red-500/20 text-red-400";
      default: return "bg-gray-500/10 border-gray-500/20 text-gray-400";
    }
  };

  const handleApproveVerification = (verificationId: string) => {
    setVerifications(prev => prev.map(verification => 
      verification.id === verificationId 
        ? { 
            ...verification, 
            status: "approved" as VerificationStatus,
            reviewedAt: new Date().toISOString(),
            reviewedBy: "Admin Team"
          }
        : verification
    ));
    
    toast({
      title: "Verification Approved",
      description: "User has been successfully verified",
    });
  };

  const handleRejectVerification = (verificationId: string, reason: string) => {
    setVerifications(prev => prev.map(verification => 
      verification.id === verificationId 
        ? { 
            ...verification, 
            status: "rejected" as VerificationStatus,
            reviewedAt: new Date().toISOString(),
            reviewedBy: "Admin Team",
            rejectionReason: reason
          }
        : verification
    ));
    
    toast({
      title: "Verification Rejected",
      description: `Verification rejected: ${reason}`,
      variant: "destructive"
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const stats = {
    total: verifications.length,
    pending: verifications.filter(v => v.status === "pending").length,
    approved: verifications.filter(v => v.status === "approved").length,
    rejected: verifications.filter(v => v.status === "rejected").length,
    highRisk: verifications.filter(v => v.riskLevel === "high").length
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Settings className="h-5 w-5" />
          KYC Verification Management
        </CardTitle>
        <CardDescription>
          Review and manage user identity verification requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total KYC</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.highRisk}</div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRisk} onValueChange={setFilterRisk}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by risk" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verification Requests */}
        <div className="space-y-4">
          {filteredVerifications.map((verification) => (
            <div key={verification.id} className={cn(
              "group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 bg-background/50",
              verification.riskLevel === "high" && "border-red-500/50 bg-red-500/5",
              verification.status === "pending" && "border-yellow-500/50 bg-yellow-500/5"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{verification.fullName}</h4>
                      <Badge variant="outline" className={getStatusColor(verification.status)}>
                        {verification.status}
                      </Badge>
                      <Badge variant="outline" className={getRiskColor(verification.riskLevel)}>
                        {verification.riskLevel} risk
                      </Badge>
                    </div>
                    
                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{verification.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{verification.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Age: {calculateAge(verification.dateOfBirth)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{verification.nationality}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          <span>{verification.documentType.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Submitted: {new Date(verification.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {verification.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">Rejected: {verification.rejectionReason}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>KYC Verification Details</DialogTitle>
                          <DialogDescription>
                            Review {verification.fullName}'s verification documents
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid gap-4 grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Full Name</label>
                              <div className="p-2 bg-muted/50 rounded">{verification.fullName}</div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Date of Birth</label>
                              <div className="p-2 bg-muted/50 rounded">{verification.dateOfBirth}</div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Nationality</label>
                              <div className="p-2 bg-muted/50 rounded">{verification.nationality}</div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Phone Number</label>
                              <div className="p-2 bg-muted/50 rounded">{verification.phoneNumber}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <div className="p-2 bg-muted/50 rounded">{verification.address}</div>
                          </div>
                          
                          <div className="grid gap-4 grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Document Type</label>
                              <div className="p-2 bg-muted/50 rounded">{verification.documentType.replace('_', ' ').toUpperCase()}</div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Document Number</label>
                              <div className="p-2 bg-muted/50 rounded">{verification.documentNumber}</div>
                            </div>
                          </div>
                          
                          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Document Front</label>
                              <img 
                                src={verification.documentFront} 
                                alt="Document Front" 
                                className="w-full h-32 object-cover rounded border"
                              />
                            </div>
                            {verification.documentBack && (
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Document Back</label>
                                <img 
                                  src={verification.documentBack} 
                                  alt="Document Back" 
                                  className="w-full h-32 object-cover rounded border"
                                />
                              </div>
                            )}
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Selfie</label>
                              <img 
                                src={verification.selfie} 
                                alt="Selfie" 
                                className="w-full h-32 object-cover rounded border"
                              />
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {verification.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveVerification(verification.id)}
                        className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Verification</DialogTitle>
                            <DialogDescription>
                              Please provide a reason for rejecting this verification
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Enter rejection reason..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setRejectionReason("")}>
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                handleRejectVerification(verification.id, rejectionReason);
                                setRejectionReason("");
                              }}
                              disabled={!rejectionReason.trim()}
                            >
                              Reject Verification
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
