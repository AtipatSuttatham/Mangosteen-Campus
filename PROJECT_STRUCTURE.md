# โครงสร้างโปรเจกต์ — LMS Mangosteen Campus

> ไฟล์นี้ต้องอัปเดตทุกครั้งที่มีการเพิ่ม/ย้าย/ลบไฟล์หรือโฟลเดอร์สำคัญ (ตามที่กำหนดใน `CLAUDE.md`)

```
Mangosteen Campus/
├── CLAUDE.md                # สเปกโปรเจกต์ทั้งหมด — tech stack, สิทธิ์ตาม role, data model decisions, workflow
├── PROJECT_STRUCTURE.md     # ไฟล์นี้ — เอกสารอธิบายโครงสร้างไฟล์/โฟลเดอร์ทั้งหมด
├── docker-compose.yml       # Postgres สำหรับ dev เท่านั้น (backend/frontend รันตรงบนเครื่อง ไม่ containerize)
├── .gitignore
├── docs/                    # เอกสารออกแบบระบบ
│   ├── database.md          # สเปกฐานข้อมูลแบบละเอียด (freeze v1.3) — ต้นทางของ decision การออกแบบ
│   ├── database-erd.md      # ER diagram (Mermaid) แยกตามโดเมน
│   ├── database-fields.md   # ตาราง field แบบ quick reference
│   └── database-guide.md    # อธิบาย lifecycle/workflow การใช้งานแต่ละ table แบบครบวงจร
├── backend/                 # Django + DRF project (uv, Python 3.13)
│   └── (จะเพิ่มรายละเอียดตอนสร้าง scaffold)
└── frontend/                # React + Vite + TypeScript + Tailwind v4 (pnpm)
    └── (จะเพิ่มรายละเอียดตอนสร้าง scaffold)
```

## หมายเหตุ
- โครงสร้างนี้จะขยายรายละเอียดขึ้นเรื่อยๆ ตามที่ implement จริงในแต่ละ vertical slice
- Django apps ใน `backend/` แบ่งตามโดเมนตาม `docs/database.md` §2 — จะเพิ่มเข้ามาทีละแอปตามฟีเจอร์ที่กำลังทำ ไม่สร้างล่วงหน้าทั้งหมด
