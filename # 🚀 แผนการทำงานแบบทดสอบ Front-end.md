# 🚀 แผนการทำงานแบบทดสอบ Front-end Developer (Project: TaskFlow)

**Tech Stack:** React + TypeScript + Tailwind CSS + Vite
**State Management:** Zustand
**Libraries เพิ่มเติม:** Framer Motion (Animation), Recharts (กราฟ), html2canvas & jspdf (Export PDF), Lucide React (Icons)

---

## 🗓️ วันที่ 1: โครงสร้างพื้นฐาน และ Mock Data (Foundation & Data)
*เป้าหมาย: ตั้งไข่โปรเจคให้แข็งแรง วางระบบ State ให้พร้อม*

- [✔️] **Project Setup (เช้า):**
    - สร้างโปรเจคด้วย React + Vite
    - ติดตั้ง Tailwind CSS และ Libraries ทั้งหมดที่ต้องใช้งาน
- [✔️] **Mock Data (สายๆ):**
    - สร้างไฟล์ `src/data/mockTasks.ts` จำลองข้อมูล Task (ประมาณ 15-20 รายการ)
    - กำหนดให้มีสถานะ (To Do, In Progress, Done) และ Priority ที่หลากหลาย
- [✔️] **Global State Management (บ่าย):**
    - สร้าง Zustand Store สำหรับจัดการ Task (อ่าน, เพิ่ม, อัปเดต)
    - สร้าง State สำหรับจัดการ Dark / Light Mode
- [✔️] **Layout พื้นฐาน (เย็น):**
    - สร้างโครงร่าง Sidebar (ทำให้เลื่อนซ่อน/ขยายได้) และ Main Content
    - ทำระบบ Dark / Light Mode ให้ใช้งานได้จริง (เปลี่ยนสีพื้นหลัง/ตัวหนังสือ)

---

## 🗓️ วันที่ 2: สร้างหน้า Dashboard และระบบค้นหา (Core Features)
*เป้าหมาย: ปั้น UI ตามเรฟเฟอเรนซ์ และทำให้ระบบทำงานโต้ตอบได้*

- [✔️] **Task Card & Board (เช้า):**
    - สร้าง Component `TaskCard` ตามโจทย์ (ชื่อ, Tag, วันที่, Status, Progress, รูป Avatar)
    - จัด Layout นำ Card มาเรียงในคอลัมน์ To Do, In Progress, Done
- [✔️] **ระบบ Search & Filter (บ่าย):**
    - ทำช่อง Search พร้อมระบบ **Debounce** (หน่วงเวลาพิมพ์)
    - ทำ Dropdown สำหรับ Filter (ตาม Priority และ Status)
    - ผูกระบบ Search/Filter เข้ากับ State ของ Board เพื่ออัปเดตข้อมูลแบบ Real-time
- [✔️] **Popup (Modal) ดูรายละเอียดและแก้ไข (เย็น):**
    - คลิกที่ Card -> แสดง Modal ข้อมูลของการ์ดนั้นๆ
    - ทำฟอร์มรองรับการสร้าง New Task และการกดอัปเดต Task เดิม
- [✔️] **Pagination (ค่ำ):**
    - ทำระบบแบ่งหน้า (เช่น หน้าละ 6-9 Task) และแสดงผลการ์ดที่เหลือเมื่อเปลี่ยนหน้า

---

## 🗓️ วันที่ 3: กราฟมหาโหด, การขัดเกลา และส่งงาน (Graph, Polish & Submit)
*เป้าหมาย: เก็บตกโจทย์กราฟ เพิ่มลูกเล่น Animation ให้พรีเมียม และเตรียมส่งงาน*

- [✔️] **Daily Graph (เช้า):**
    - ใช้ `Recharts` สร้างกราฟเส้น 3 สี
    - เซ็ตค่า Scale ตามโจทย์ (เขียว 0-100, เหลือง -100 ถึง 100, น้ำเงิน 0-10)
    - ปรับแต่ง Custom Tooltip ให้แสดงกรอบข้อมูลและตัวเลขตามเรฟเฟอเรนซ์
- [✔️] **Export PDF (สายๆ):**
    - เขียนฟังก์ชันจับภาพกราฟและ Export เป็นไฟล์ PDF (ใช้ `html2canvas` ประกอบกับ `jspdf`)
- [✔️] **ขัดเกลา UI & UX (บ่าย):**
    - เช็ค Responsive (ลองย่อขยายจอว่า UI ไม่พัง)
    - ใส่ Animation ด้วย `Framer Motion` (เพิ่มลูกเล่นตอนเปลี่ยนหน้า, เปิด/ปิด Modal, หรือการ์ดสลับที่ตอน Filter)
- [✔️] **Deploy & ส่งงาน (เย็น):**
    - Push โค้ดทั้งหมดขึ้น GitHub
    - Deploy โปรเจค (แนะนำ Vercel หรือ Netlify)
    - ร่างอีเมลส่งงาน (แนบลิงก์ GitHub, ลิงก์เว็บ Live URL, พร้อมอธิบาย Tech Stack และจุดเด่นของโค้ดเรา เช่น การใช้ Zustand, Debounce และ Animation)