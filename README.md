**TaskFlow - Front-end Developer Assessment (DEVDEVA)**

สวัสดีครับ Repository นี้คือผลงานแบบทดสอบ Front-end Developer ของผมครับ (Sakditat Thoumsaeng หรือ เบสท์)

นอกจากฟีเจอร์หลักที่ทาง DEVDEVA ระบุไว้ในโจทย์ (Dashboard Kanban, กรองข้อมูล, Pagination, กราฟ 3 แกน, และ Export PDF) ผมได้ตั้งใจต่อยอดและเพิ่มลูกเล่นต่างๆ เข้าไป เพื่อให้โปรเจคนี้ออกมาสมบูรณ์แบบและให้ประสบการณ์เหมือน Web Application ที่พร้อมใช้งานจริงบน Production มากที่สุดครับ

---

🛠️ **เครื่องมือที่ใช้ (Tech Stack)**

*Framework:* React + TypeScript (Vite)
*Styling:* Tailwind CSS
*State Management:* Zustand (จัดการ State ส่วนกลางให้ไหลลื่นเหมือนดึงจาก API จริง)
*Animations:* Framer Motion
*Charts:* Recharts
*PDF Export:* html-to-image + jspdf

---

✨ **ลูกเล่นและฟีเจอร์ที่เพิ่มเติมจากโจทย์ (Extra Features & Polish)**

ในส่วนนี้คือรายละเอียดที่ผมแอบเติมเข้าไป นอกเหนือจากในเอกสารโจทย์ เพื่อยกระดับ UX/UI และระบบหลังบ้านครับ:

**1. 🖱️ Interactive Kanban & Task Management**
ผมตั้งใจทำให้บอร์ดสามารถใช้งานได้จริงเหมือนแอปอย่าง Jira หรือ Trello ครับ:
* *Drag & Drop:* สามารถคลิกค้างที่การ์ดแล้วลาก (Drag & Drop) ข้ามคอลัมน์เพื่อเปลี่ยน Status (To Do, In Progress, Done) ได้แบบเรียลไทม์
* *Full Task Management:* ในหน้า Popup รายละเอียดของ Task นอกจากการดูข้อมูลแล้ว ผมได้เพิ่มปุ่ม **Edit** เพื่อแก้ไขข้อมูล, ระบบเพิ่มย่อย **To-do List (Checklists)** ภายในการ์ด, ฟีเจอร์กดเพิ่ม/ลดรูปผู้รับผิดชอบ (**Assignees**), และมีปุ่ม **Delete** สำหรับลบ Task ได้ด้วยครับ

**2. 🗄️ Simulated Backend & Mock Data**
เพื่อให้แอปทำงานได้เสมือนจริงที่สุดโดยไม่ต้องต่อ API ผมได้วางโครงสร้างข้อมูลจำลองไว้:
* *Mock Data System:* มีการสร้าง `mockTasks` และ `mockAnalytics` ที่มีโครงสร้างข้อมูลสมจริง รวมถึงการจำลอง `currentUser` เพื่อให้ระบบรู้ว่าใครกำลังล็อกอินอยู่ (ใช้สำหรับการแสดงผล My Tasks)
* การกระทำทั้งหมด (เพิ่ม, ลบ, แก้ไข, ลากวาง) จะถูกจัดการผ่าน **Zustand** ทำให้ข้อมูลเปลี่ยนและอัปเดตบนหน้าจอทันทีแบบ Seamless ครับ

**3. 🎨 Dynamic Theme & Animated Backgrounds**
ไม่ใช่แค่การเปลี่ยนสีแบบธรรมดา แต่ผมได้ทำระบบสลับโหมด Light / Dark Mode ที่มาพร้อมกับพื้นหลังแอนิเมชันที่เปลี่ยนอารมณ์ของแอปไปเลย:
* *Light Mode:* พื้นหลังเป็นแอนิเมชัน "Bubble" ลอยไปมา ให้ความรู้สึกสดใสและเป็นมิตร
* *Dark Mode:* พื้นหลังเปลี่ยนเป็นแอนิเมชัน "Hexagon" ให้ความรู้สึกดุดัน ล้ำสมัย สไตล์ Tech
* *ปุ่ม Toggle* สลับโหมดมีการใช้ Framer Motion ทำแอนิเมชันหมุนสลับไอคอน

**4. 📊 Advanced Analytics Chart**
ในหน้ากราฟ ผมได้เพิ่มกิมมิคเพื่อแก้ปัญหาการใช้งานจริงและเพิ่ม UX ที่ดี:
* *Simulated Loading State:* มีการทำ Loading screen จำลองการรอโหลดข้อมูลจาก API ก่อนที่กราฟจะแสดงผล
* *Interactive Legend Tooltip:* นอกจาก Tooltip บนเส้นกราฟแล้ว ผมได้ทำ Custom Legend ด้านล่าง ที่ผู้ใช้สามารถ "เอาเมาส์ไปชี้ที่จุดสี (Legend)" เพื่อดูคำอธิบายความหมายของกราฟแต่ละเส้นได้ (เช่น เส้นนี้คือเปอร์เซ็นต์อะไร)
* *Swipeable Chart (Mobile):* บนจอมือถือ กราฟจะไม่ถูกบีบจนดูไม่รู้เรื่อง แต่จะสามารถใช้นิ้ว "ปัดซ้าย-ขวา" เพื่อดูช่วงเวลาได้อย่างอิสระ โดยที่ Legend และแกน Y ยังล็อคติดอยู่กับที่

**5. ✨ Micro-interactions & UX Polish**
การเก็บรายละเอียดเล็กๆ น้อยๆ บนเว็บแอป:
* *Animated Progress Bar:* แถบ Progress Bar ของแต่ละ Task จะไม่ได้โผล่มาทื่อๆ แต่จะค่อยๆ วิ่งจาก 0 ไปถึงเปอร์เซ็นต์ที่กำหนด
* *Animated Avatar Group:* รูปภาพผู้รับผิดชอบ (Assignees) ที่ซ้อนกันอยู่ จะมีแอนิเมชันขยายตัวและโชว์ชื่อเมื่อเอาเมาส์ไป Hover
* *Click-Outside Dropdowns:* เมนู Dropdown ต่างๆ (เช่น Navbar Profile, Filter เลือก Priority) ถูกเขียน Logic ให้พับเก็บตัวเองอัตโนมัติเมื่อผู้ใช้คลิกพื้นที่ว่างบนจอ
* *Flip Button:* ปุ่ม "New Task" บนมือถือผมทำเป็น Flip Button ที่สลับข้อความได้ เพิ่มลูกเล่นให้น่ากดมากขึ้น

**6. 🏗️ Clean Architecture & Routing**
* *Pages vs Components:* ผมจัดโครงสร้างโฟลเดอร์แยกหน้าเพจหลัก (Dashboard, My Tasks, Analytics) ออกจากชิ้นส่วน UI ย่อยๆ ชัดเจน เพื่อให้โค้ดไม่อ่านยากเวลาแอปขยายใหญ่ขึ้น
* *Fully Functional Sidebar:* เมนูข้างๆ กดไปหน้าต่างๆ ได้จริง (Dashboard / My Tasks / Analytics) โดยใช้ React Router ครับ
* *TypeScript 100%: * โปรเจคนี้รัน `npm run build` ไม่มี Error หรือ Warning ครับ

**7. 📱 Fully Responsive (Mobile-First Experience)**
โจทย์อาจจะโชว์แค่ภาพบน Desktop แต่ผมได้ออกแบบ Layout ใหม่ให้รองรับมือถือ 100% ครับ เช่น:
* *Slide-in Mobile Sidebar:* เปลี่ยน Sidebar แถบข้างให้กลายเป็นเมนูแฮมเบอร์เกอร์ที่สไลด์ออกมาพร้อม Backdrop สีดำ
* *Vertical Task Stacking:* บนมือถือ กล่อง To Do, In Progress, Done จะเปลี่ยนจากการวางเรียงแนวนอนมาเป็นแนวตั้ง เพื่อให้เลื่อนอ่านได้ง่าย ไม่ต้องพยายามเพ่งสายตา
* *Mobile-friendly FilterBar:* จัดเรียงช่อง Search และปุ่ม Filter ใหม่ให้กดง่ายใกล้นิ้วโป้ง และย้ายปุ่ม New Task มาไว้ด้านล่างสุดให้เด่นชัด

---

**📚 เอกสารประกอบการพัฒนา (Documentation)**
เพื่อให้เห็นภาพรวมของกระบวนการคิดและการวางแผนงาน ผมได้แนบเอกสารเพิ่มเติมไว้ในโฟลเดอร์ `docs/` ครับ:
* [📝 แผนการทำงานและสถาปัตยกรรม (Development Plan)](./docs/แผนการทำงานแบบทดสอบ_Front-end.md) - แสดงแผนการทำงานคร่าวๆตั้งแต่วันแรกจนจบโปรเจค
* [📊 แนวคิดการจำลองข้อมูลกราฟ (Graph Logic)](./docs/GraphLogic.md) - อธิบายที่มาที่ไปของข้อมูลแต่ละแกนในหน้า Analytics

**💻 วิธีการรันโปรเจคเพื่อทดสอบ**
1. Clone โปรเจคนี้ลงเครื่อง
2. ติดตั้งแพ็กเกจ: `npm install`
3. สตาร์ทโปรเจค: `npm run dev`

*ขอบคุณที่สละเวลาเข้ามาตรวจผลงานและพิจารณาครับ ขอบคุณสำหรับโอกาสที่ให้ผมได้ลองทำ TaskFlow ครับผม ขอบคุณครับ*