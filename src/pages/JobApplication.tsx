import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, Plus, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCandidates } from "@/contexts/CandidatesContext";

const JobApplication = () => {
  const { toast } = useToast();
  const { addCandidate } = useCandidates();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [languages, setLanguages] = useState<Array<{ language: string; level: string }>>([
    { language: "", level: "good" }
  ]);
  const [formData, setFormData] = useState({
    position: "",
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    informationSource: "",
    privacyConsent: false,
  });

  const availablePositions = [
    "Senior Software Engineer",
    "Product Manager",
    "UX/UI Designer",
    "Data Analyst",
    "Marketing Manager",
    "Sales Executive",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast({
        title: "ไฟล์ถูกเลือกแล้ว",
        description: `${e.target.files[0].name}`,
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "อัปโหลดรูปภาพสำเร็จ",
        description: file.name,
      });
    }
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", level: "good" }]);
  };

  const removeLanguage = (index: number) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  const updateLanguage = (index: number, field: "language" | "level", value: string) => {
    const updated = [...languages];
    updated[index][field] = value;
    setLanguages(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.position || !formData.fullName || !formData.email || !selectedFile || !formData.privacyConsent) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณากรอกข้อมูลทุกช่องที่มีเครื่องหมาย * อัปโหลดเรซูเม่ และยินยอมนโยบายความเป็นส่วนตัว",
        variant: "destructive",
      });
      return;
    }

    // Add candidate to context
    addCandidate({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone || "-",
      position: formData.position,
      experience: "ระบุในเรซูเม่",
      skills: [],
      resumeFile: selectedFile.name,
      coverLetter: formData.coverLetter,
    });

    toast({
      title: "ส่งใบสมัครสำเร็จ",
      description: `ใบสมัครของคุณสำหรับตำแหน่ง ${formData.position} ถูกส่งแล้ว`,
    });

    // Reset form
    setFormData({
      position: "",
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      informationSource: "",
      privacyConsent: false,
    });
    setSelectedFile(null);
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
    setLanguages([{ language: "", level: "good" }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">สมัครงาน</h1>
        <p className="text-muted-foreground mt-2">
          กรอกข้อมูลและอัปโหลดเรซูเม่เพื่อสมัครงาน
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ฟอร์มสมัครงาน</CardTitle>
          <CardDescription>
            กรุณากรอกข้อมูลให้ครบถ้วนและอัปโหลดเรซูเม่ของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="position">
                ตำแหน่งงานที่สนใจ <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.position}
                onValueChange={(value) =>
                  setFormData({ ...formData, position: value })
                }
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="เลือกตำแหน่งงาน" />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">
                ชื่อ-นามสกุล <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  อีเมล <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="081-234-5678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">
                อัปโหลดเรซูเม่ <span className="text-destructive">*</span>
              </Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resume" className="cursor-pointer">
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <FileText className="h-6 w-6" />
                      <span className="font-medium">{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div>
                        <span className="text-primary font-medium">
                          คลิกเพื่ออัปโหลด
                        </span>
                        <span className="text-muted-foreground"> หรือลากไฟล์มาวางที่นี่</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        รองรับไฟล์ PDF, DOC, DOCX (สูงสุด 5MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter">จดหมายสมัครงาน</Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData({ ...formData, coverLetter: e.target.value })
                }
                placeholder="แนะนำตัวและเหตุผลที่สนใจสมัครงานตำแหน่งนี้..."
                rows={5}
              />
            </div>

            {/* Profile Photo Upload */}
            <div className="space-y-2">
              <Label>รูป / Photo</Label>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {profilePhotoPreview ? (
                      <img 
                        src={profilePhotoPreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label htmlFor="profile-photo">
                    <Button type="button" variant="secondary" className="cursor-pointer" asChild>
                      <span>Browse</span>
                    </Button>
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    รองรับไฟล์ JPG, PNG (สูงสุด 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Language Literacy */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>ระดับทักษะทางภาษา / Language Literacy</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLanguage}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  เพิ่มภาษา / Add a language
                </Button>
              </div>
              
              {languages.map((lang, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <Select
                        value={lang.language}
                        onValueChange={(value) => updateLanguage(index, "language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="ภาษาอังกฤษ / English" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">ภาษาอังกฤษ / English</SelectItem>
                          <SelectItem value="chinese">ภาษาจีน / Chinese</SelectItem>
                          <SelectItem value="japanese">ภาษาญี่ปุ่น / Japanese</SelectItem>
                          <SelectItem value="korean">ภาษาเกาหลี / Korean</SelectItem>
                          <SelectItem value="french">ภาษาฝรั่งเศส / French</SelectItem>
                          <SelectItem value="german">ภาษาเยอรมัน / German</SelectItem>
                          <SelectItem value="spanish">ภาษาสเปน / Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {languages.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLanguage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <RadioGroup
                    value={lang.level}
                    onValueChange={(value) => updateLanguage(index, "level", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id={`excellent-${index}`} />
                      <Label htmlFor={`excellent-${index}`} className="font-normal">
                        ดีมาก / Excellence
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id={`good-${index}`} />
                      <Label htmlFor={`good-${index}`} className="font-normal">
                        ดี / Good
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id={`fair-${index}`} />
                      <Label htmlFor={`fair-${index}`} className="font-normal">
                        พอใช้ / Fair
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>

            {/* Information Source */}
            <div className="space-y-2">
              <Label htmlFor="informationSource">
                ท่านทราบข้อมูลการสมัครจากที่ใด / Where do you get the information?
              </Label>
              <Select
                value={formData.informationSource}
                onValueChange={(value) =>
                  setFormData({ ...formData, informationSource: value })
                }
              >
                <SelectTrigger id="informationSource">
                  <SelectValue placeholder="เลือกช่องทางที่รับข่าวสาร / Selected" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">เว็บไซต์บริษัท / Company Website</SelectItem>
                  <SelectItem value="jobboard">เว็บไซต์หางาน / Job Board</SelectItem>
                  <SelectItem value="social-media">โซเชียลมีเดีย / Social Media</SelectItem>
                  <SelectItem value="referral">เพื่อนแนะนำ / Referral</SelectItem>
                  <SelectItem value="newspaper">หนังสือพิมพ์ / Newspaper</SelectItem>
                  <SelectItem value="other">อื่นๆ / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Privacy Consent */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={formData.privacyConsent}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, privacyConsent: checked as boolean })
                }
              />
              <Label htmlFor="privacy" className="font-normal leading-relaxed">
                ฉันยินยอมให้ข้อมูลและใช้งาน{" "}
                <a href="#" className="text-primary underline">
                  นโยบายความเป็นส่วนตัว
                </a>{" "}
                แล้ว <span className="text-destructive">*</span>
              </Label>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                ส่งใบสมัคร
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    position: "",
                    fullName: "",
                    email: "",
                    phone: "",
                    coverLetter: "",
                    informationSource: "",
                    privacyConsent: false,
                  });
                  setSelectedFile(null);
                  setProfilePhoto(null);
                  setProfilePhotoPreview(null);
                  setLanguages([{ language: "", level: "good" }]);
                }}
              >
                ล้างข้อมูล
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplication;
