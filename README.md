<<<<<<< HEAD
# WE Quiz Game

لعبة اختبار معلومات تفاعلية مع نظام ترتيب اللاعبين.

## المميزات

- ✅ تسجيل دخول بالبريد الإلكتروني واسم المستخدم (اسم المستخدم فريد)
- ✅ إضافة الفرع عند التسجيل
- ✅ عرض الأسئلة مع Field (س1 - السؤال، س2 - السؤال، إلخ)
- ✅ نظام ترتيب اللاعبين حسب النقاط الإجمالية
- ✅ إمكانية رؤية تقدم اللاعبين الآخرين
- ✅ حفظ البيانات في Supabase

## إعداد قاعدة البيانات

1. افتح Supabase Dashboard
2. اذهب إلى SQL Editor
3. قم بتشغيل محتوى ملف `supabase_schema.sql`

## إعداد المشروع

```bash
# تثبيت المتطلبات
pnpm install

# نسخ ملف البيئة (اختياري - القيم موجودة بالفعل في الكود)
cp .env.example .env.local

# تشغيل المشروع محلياً
pnpm dev
```

## النشر على استضافة مجانية

### Vercel (موصى به)

1. قم برفع المشروع على GitHub
2. اذهب إلى [Vercel](https://vercel.com)
3. سجل دخول بحساب GitHub
4. اضغط "New Project"
5. اختر المستودع
6. في إعدادات Build:
   - **Framework Preset:** Other
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist/public`
   - **Install Command:** `pnpm install`
7. **إضافة متغيرات البيئة (Environment Variables):**
   - اضغط على "Environment Variables"
   - أضف المتغيرات التالية:
     - `VITE_SUPABASE_URL` = `https://ixoxyglkpwhggxmomwih.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3h5Z2xrcHdoZ2d4bW9td2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzY0NTQsImV4cCI6MjA3OTg1MjQ1NH0.gyZGxeua5p3Zo6JyMoerZlcctE7tpTqAkZoQHaNrxC4`
8. اضغط "Deploy"

### Netlify

1. قم برفع المشروع على GitHub
2. اذهب إلى [Netlify](https://netlify.com)
3. اضغط "New site from Git"
4. اختر المستودع
5. في إعدادات Build:
   - Build command: `pnpm build`
   - Publish directory: `dist`
6. اضغط "Deploy site"

## ملاحظات

- **متغيرات البيئة:** يمكنك استخدام ملف `.env.local` محلياً (يتم تجاهله في Git)
- **Vercel:** تأكد من إضافة متغيرات البيئة في إعدادات المشروع
- **Supabase:** تأكد من تشغيل SQL schema في Supabase قبل استخدام التطبيق
- **الأسئلة:** يتم تحميلها من `client/public/questions.json`

## هيكل المشروع

```
quiz_game/
├── client/              # تطبيق React
│   ├── src/
│   │   ├── components/ # المكونات
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # الصفحات
│   │   └── lib/        # مكتبات (Supabase)
│   └── public/
│       └── questions.json
├── server/             # خادم Express
├── supabase_schema.sql # SQL schema
└── package.json
```

## التطوير

```bash
# تشغيل في وضع التطوير
pnpm dev

# بناء للإنتاج
pnpm build

# معاينة البناء
pnpm preview
```

=======
# WE-Quiz
>>>>>>> b5e8bbded1d033b6c5528ce203416506c82e99db
