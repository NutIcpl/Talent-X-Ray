import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyPolicyDialog = ({ open, onOpenChange }: PrivacyPolicyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            หนังสือให้ความยินยอม
          </DialogTitle>
          <DialogDescription>สำหรับผู้สมัครงาน</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6 text-sm">
            <section className="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border border-primary/20">
              <p className="text-muted-foreground leading-relaxed">
                ข้าพเจ้าได้อ่านและเข้าใจข้อความในประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคลสำหรับผู้สมัครงาน
                และบุคคลที่เกี่ยวข้องกับผู้สมัครงาน ของบริษัท ไอ ซี พี ลัดดา จำกัด (ICP LADDA CO., LTD.) ที่ออกตาม
                พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ.๒๕๖๒ โดยละเอียดแล้ว และขอให้ความยินยอมดังนี้
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">
                    ข้าพเจ้ายินยอมให้บริษัทเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลที่มีความอ่อนไหวของข้าพเจ้า
                    ได้แก่ ศาสนา น้ำหนัก ส่วนสูง ประวัติอาชญากรรม และข้อมูลสุขภาพ เพื่อวัตถุประสงค์ในการสมัครงาน
                    เพื่อให้บริษัทพิจารณาความเหมาะสมในการจ้างงาน และวัตถุประสงค์ด้านการบริหารงานบุคคล
                    ตามที่ระบุไว้ในประกาศฯ
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">
                    ข้าพเจ้ายินยอมให้บริษัทเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
                    เพื่อวัตถุประสงค์เกี่ยวกับการควบคุมคุณภาพ และการดำเนินงานภายใต้มาตรฐาน ISO
                    และเพื่อวัตถุประสงค์ที่จำเป็นต่อการดำเนินการตามกฎหมาย
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">
                    ข้าพเจ้ายินยอมให้บริษัทเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้า
                    เพื่อวัตถุประสงค์ในการป้องกันโรคติดต่อในสถานประกอบการ
                    และเพื่อวัตถุประสงค์ในการติดต่อสื่อสารในกรณีฉุกเฉิน
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">
                    ข้าพเจ้ายินยอมให้บริษัทเปิดเผยข้อมูลส่วนบุคคลของข้าพเจ้าให้แก่บริษัทในเครือ บริษัทแม่
                    บริษัทย่อย บริษัทร่วม และหน่วยงานที่เกี่ยวข้องของบริษัท
                    เพื่อวัตถุประสงค์ในการบริหารงานบุคคลและเพื่อประโยชน์ในการดำเนินธุรกิจของบริษัท
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-accent/5 to-primary/5 p-4 rounded-lg border border-accent/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <p className="text-muted-foreground text-xs leading-relaxed">
                  <span className="font-semibold text-foreground">หมายเหตุ:</span> ความยินยอมนี้ครอบคลุมการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล
                  ตามที่ระบุไว้ในประกาศนโยบายคุ้มครองข้อมูลส่วนบุคคลสำหรับผู้สมัครงานและบุคคลที่เกี่ยวข้องกับผู้สมัครงาน
                  ท่านสามารถเพิกถอนความยินยอมได้ตามขั้นตอนที่ระบุไว้ในประกาศฯ
                </p>
              </div>
            </section>

            <section className="text-center text-xs text-muted-foreground pt-4 border-t">
              <p>บริษัท ไอ ซี พี ลัดดา จำกัด (ICP LADDA CO., LTD.)</p>
              <p className="mt-1">เลขที่ ๔๒๕/๑-๔ ถนนสุรวงศ์ แขวงสุริยวงศ์ เขตบางรัก กรุงเทพมหานคร ๑๐๕๐๐</p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;
