import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export function ContactMap() {

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Contact Information */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            ช่องทางติดต่อ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">ที่อยู่</p>
              <p className="text-sm text-muted-foreground">
                <strong>สำนักงานใหญ่:</strong> 42 อาคารไอ ซี พี ชั้น 5 ถนนสุรวงศ์ แขวงสี่พระยา เขตบางรัก กรุงเทพมหานคร 10500<br />
                <strong>โรงงานนครปฐม:</strong> 151 หมู่ที่ 8 ตำบลสามวายเผือก อำเภอเมืองนครปฐม จังหวัดนครปฐม 73000
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">โทรศัพท์</p>
              <p className="text-sm text-muted-foreground">
                02-0299888 ต่อ 101<br />
                065-5091216
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">อีเมล</p>
              <p className="text-sm text-muted-foreground">
                hr@icpladda.com
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">เวลาทำการ</p>
              <p className="text-sm text-muted-foreground">
                จันทร์-ศุกร์ 8.30-17.30 น.<br />
                เสาร์-อาทิตย์ ปิดทำการ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            แผนที่
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px] rounded-lg overflow-hidden border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
            <div className="text-center p-6">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-primary/50" />
              <p className="text-lg font-semibold mb-2">แผนที่บริษัท</p>
              <p className="text-sm text-muted-foreground mb-1">
                สำนักงานใหญ่: 42 อาคารไอ ซี พี ชั้น 5 ถนนสุรวงศ์
              </p>
              <p className="text-sm text-muted-foreground">
                แขวงสี่พระยา เขตบางรัก กรุงเทพมหานคร 10500
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            เพิ่ม Mapbox Token เพื่อแสดงแผนที่แบบโต้ตอบได้
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
