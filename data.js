/* =========================================================
   ข้อมูลส่วนตัว: แก้ที่ไฟล์นี้ไฟล์เดียว ทุกหน้าจะเปลี่ยนตาม
   (index.html, about.html, projects.html, resume.html)
   ========================================================= */
var SITE = {
  nameEn: 'Pongsathorn Siriprompitak',
  nameTh: 'พงศธร ศิริพรหมพิทักษ์',
  email: 'Pongsathorn.sir@spumail.net',
  phone: '098-059-7942',
  github: 'https://github.com/Pstsrppt',
  linkedin: 'https://www.linkedin.com/in/pongsathorn-siriprompithak-560466350',
  cv: 'resume.pdf',      // นำไฟล์ PDF เรซูเม่มาวางไว้ที่โฟลเดอร์เดียวกับ index.html แล้วตั้งชื่อว่า resume.pdf
  careerRole: 'นักพัฒนาซอฟต์แวร์ระดับจูเนียร์',   // สายงานที่มองหา (ตัวใหญ่)
  careerFocus: '(ASP.NET Core MVC, C#, MySQL)',   // คำขยาย (ตัวเล็กบรรทัดล่าง)
  avail: 'พร้อมเริ่มฝึกสหกิจได้ทันที หลักสูตร 4 เดือน',
  major: 'วิทยาการคอมพิวเตอร์และวิทยาการข้อมูล',
  gpa: '3.18',
  university: 'ม.ศรีปทุม',
  universityFull: 'มหาวิทยาลัยศรีปทุม',
  start: 'พร้อมเริ่มทันที',
  coop: 'ฝึกสหกิจ 4 เดือน',
  languages: 'ไทย (เจ้าของภาษา) / อังกฤษ (พื้นฐาน)',
  location: 'กรุงเทพมหานคร',
  birth: '2000-03-22',
  n8nProof: 'บอทแจ้งเตือนแผ่นดินไหวอัตโนมัติใน Discord'
};

// ===== ค่าที่คำนวณอัตโนมัติ (ไม่ต้องแก้ส่วนนี้) =====
SITE.name = SITE.nameTh || SITE.nameEn;
SITE.first = SITE.name.split(' ')[0];
SITE.last = SITE.name.split(' ').slice(1).join(' ');
if(SITE.birth){ const b=new Date(SITE.birth), n=new Date(); let a=n.getFullYear()-b.getFullYear(); if(n.getMonth()<b.getMonth()||(n.getMonth()===b.getMonth()&&n.getDate()<b.getDate())) a--; SITE.birthText=b.toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'})+' · อายุ '+a+' ปี'; }
SITE.career = SITE.careerRole ? SITE.careerRole + ' ' + SITE.careerFocus : SITE.career;
