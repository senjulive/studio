'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { countries } from '@/lib/countries';
import { 
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  Camera,
  Shield,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Building,
  Eye,
  Download,
  X,
  Check,
  Info
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Identity Verification - AstralCore",
  description: "Complete your identity verification to unlock all platform features.",
};

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  required: boolean;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  occupation: string;
  sourceOfFunds: string;
  annualIncome: string;
  tradingExperience: string;
}

interface AddressInfo {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function VerificationPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    occupation: '',
    sourceOfFunds: '',
    annualIncome: '',
    tradingExperience: ''
  });

  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verificationSteps: VerificationStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Provide your basic personal details',
      status: 'in_progress',
      required: true
    },
    {
      id: 'address',
      title: 'Address Verification',
      description: 'Confirm your residential address',
      status: 'pending',
      required: true
    },
    {
      id: 'identity',
      title: 'Identity Documents',
      description: 'Upload your government-issued ID',
      status: 'pending',
      required: true
    },
    {
      id: 'selfie',
      title: 'Selfie Verification',
      description: 'Take a selfie with your ID document',
      status: 'pending',
      required: true
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review all information before submission',
      status: 'pending',
      required: true
    }
  ];

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'in_progress';
    return 'pending';
  };

  const getVerificationLevel = () => {
    const completedSteps = verificationSteps.filter(step => step.status === 'completed').length;
    if (completedSteps === 0) return { level: 'Unverified', color: 'bg-red-500', limit: '$0' };
    if (completedSteps <= 2) return { level: 'Level 1', color: 'bg-yellow-500', limit: '$1,000' };
    if (completedSteps <= 4) return { level: 'Level 2', color: 'bg-blue-500', limit: '$10,000' };
    return { level: 'Level 3', color: 'bg-green-500', limit: 'Unlimited' };
  };

  const verificationLevel = getVerificationLevel();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }

      const newDocument: UploadedDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: documentType,
        size: file.size,
        url: URL.createObjectURL(file),
        status: 'pending'
      };

      setUploadedDocuments(prev => [...prev, newDocument]);
      
      toast({
        title: "Document uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const removeDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleNextStep = () => {
    if (currentStep < verificationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Verification Submitted",
        description: "Your verification documents have been submitted for review. You'll receive an update within 24-48 hours.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Identity Verification</h1>
          <p className="text-muted-foreground">
            Complete your verification to unlock higher trading limits and premium features
          </p>
        </div>
        <Badge className={`${verificationLevel.color} text-white`}>
          {verificationLevel.level}
        </Badge>
      </div>

      {/* Verification Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Why Verify Your Identity?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Higher Limits</h3>
              <p className="text-sm text-muted-foreground">
                Increase your daily trading and withdrawal limits up to unlimited
              </p>
            </div>
            <div className="text-center p-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Enhanced Security</h3>
              <p className="text-sm text-muted-foreground">
                Protect your account with verified identity and enhanced security features
              </p>
            </div>
            <div className="text-center p-4">
              <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Premium Features</h3>
              <p className="text-sm text-muted-foreground">
                Access advanced trading tools, priority support, and exclusive features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Levels & Limits</CardTitle>
          <CardDescription>
            Each verification level unlocks higher trading limits and additional features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium">
              <div>Level</div>
              <div>Daily Limit</div>
              <div>Monthly Limit</div>
              <div>Requirements</div>
            </div>
            <Separator />
            
            <div className="grid grid-cols-4 gap-4 text-sm items-center">
              <Badge variant="outline" className="w-fit">Unverified</Badge>
              <span>$100</span>
              <span>$500</span>
              <span className="text-muted-foreground">Email only</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-sm items-center">
              <Badge className="bg-yellow-500 w-fit">Level 1</Badge>
              <span>$1,000</span>
              <span>$5,000</span>
              <span className="text-muted-foreground">Personal info + Phone</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-sm items-center">
              <Badge className="bg-blue-500 w-fit">Level 2</Badge>
              <span>$10,000</span>
              <span>$50,000</span>
              <span className="text-muted-foreground">ID verification + Address</span>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-sm items-center">
              <Badge className="bg-green-500 w-fit">Level 3</Badge>
              <span>Unlimited</span>
              <span>Unlimited</span>
              <span className="text-muted-foreground">Full KYC + Selfie</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Progress</CardTitle>
          <CardDescription>
            Complete all steps to achieve full verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={(currentStep / verificationSteps.length) * 100} className="w-full" />
            
            <div className="flex justify-between text-sm">
              {verificationSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium ${
                    getStepStatus(index) === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : getStepStatus(index) === 'in_progress'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {getStepStatus(index) === 'completed' ? <Check className="h-4 w-4" /> : index + 1}
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${
                      getStepStatus(index) === 'in_progress' ? 'text-blue-600' : ''
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep + 1}: {verificationSteps[currentStep]?.title}
          </CardTitle>
          <CardDescription>
            {verificationSteps[currentStep]?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information Step */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Please ensure all information matches your government-issued ID exactly.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="As shown on ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="As shown on ID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select 
                    value={personalInfo.nationality}
                    onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, nationality: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.name}>
                          <div className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={personalInfo.occupation}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, occupation: e.target.value }))}
                  placeholder="Your current occupation"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceOfFunds">Source of Funds</Label>
                  <Select 
                    value={personalInfo.sourceOfFunds}
                    onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, sourceOfFunds: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employment">Employment</SelectItem>
                      <SelectItem value="business">Business Income</SelectItem>
                      <SelectItem value="investments">Investments</SelectItem>
                      <SelectItem value="inheritance">Inheritance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualIncome">Annual Income</Label>
                  <Select 
                    value={personalInfo.annualIncome}
                    onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, annualIncome: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-25k">Under $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                      <SelectItem value="over-250k">Over $250,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradingExperience">Trading Experience</Label>
                <Select 
                  value={personalInfo.tradingExperience}
                  onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, tradingExperience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                    <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Address Information Step */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertDescription>
                  Provide your current residential address. This will be verified with a utility bill or bank statement.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  value={addressInfo.streetAddress}
                  onChange={(e) => setAddressInfo(prev => ({ ...prev, streetAddress: e.target.value }))}
                  placeholder="Street address, apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={addressInfo.city}
                    onChange={(e) => setAddressInfo(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={addressInfo.state}
                    onChange={(e) => setAddressInfo(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State or Province"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={addressInfo.postalCode}
                    onChange={(e) => setAddressInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="Postal/ZIP code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={addressInfo.country}
                    onValueChange={(value) => setAddressInfo(prev => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.name}>
                          <div className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Identity Documents Step */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Upload clear, high-quality photos of your government-issued ID. Accepted formats: passport, driver's license, or national ID card.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Front of ID</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload the front side of your ID document
                    </p>
                    <Label htmlFor="id-front" className="cursor-pointer">
                      <Button variant="outline" className="w-full">
                        Choose File
                      </Button>
                      <Input
                        id="id-front"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'id-front')}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Back of ID</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload the back side of your ID document
                    </p>
                    <Label htmlFor="id-back" className="cursor-pointer">
                      <Button variant="outline" className="w-full">
                        Choose File
                      </Button>
                      <Input
                        id="id-back"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'id-back')}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              {uploadedDocuments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {uploadedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(doc.size)} • {doc.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDocument(doc.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selfie Verification Step */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertDescription>
                  Take a clear selfie while holding your ID document next to your face. Ensure good lighting and that both your face and ID are clearly visible.
                </AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-semibold mb-2">Take Selfie with ID</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hold your ID document next to your face and take a clear photo
                  </p>
                  <Label htmlFor="selfie" className="cursor-pointer">
                    <Button>
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Input
                      id="selfie"
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileUpload(e, 'selfie')}
                      className="hidden"
                    />
                  </Label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Tips for a good selfie:</h4>
                  <ul className="text-sm text-left space-y-1">
                    <li>• Use good lighting, preferably natural light</li>
                    <li>• Keep your face and ID clearly visible</li>
                    <li>• Remove any accessories that might obscure your face</li>
                    <li>• Look directly at the camera</li>
                    <li>• Hold the ID close to your face</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Please review all your information before submitting. Once submitted, you cannot modify your verification details.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{personalInfo.firstName} {personalInfo.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span>{personalInfo.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nationality:</span>
                      <span>{personalInfo.nationality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Occupation:</span>
                      <span>{personalInfo.occupation}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Address Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Street:</span>
                      <span>{addressInfo.streetAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">City:</span>
                      <span>{addressInfo.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">State:</span>
                      <span>{addressInfo.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Country:</span>
                      <span>{addressInfo.country}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Uploaded Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uploadedDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Badge variant="outline">Ready</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep === verificationSteps.length - 1 ? (
              <Button 
                onClick={handleSubmitVerification}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Verification
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={handleNextStep}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
