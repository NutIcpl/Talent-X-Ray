import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCandidates } from "@/contexts/CandidatesContext";

const JobApplication = () => {
  const { toast } = useToast();
  const { addCandidate } = useCandidates();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    position: "",
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.position || !formData.fullName || !formData.email || !selectedFile) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "กรุณากรอกข้อมูลทุกช่องที่มีเครื่องหมาย * และอัปโหลดเรซูเม่",
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
    });
    setSelectedFile(null);
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
                  });
                  setSelectedFile(null);
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
