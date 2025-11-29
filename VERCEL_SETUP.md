# تعليمات النشر على Vercel

## خطوات النشر

### 1. رفع المشروع على GitHub
- قم بإنشاء مستودع جديد على GitHub
- ارفع جميع ملفات المشروع

### 2. إعداد Vercel

1. اذهب إلى [Vercel](https://vercel.com)
2. سجل دخول بحساب GitHub
3. اضغط على **"Add New..."** ثم **"Project"**
4. اختر المستودع الذي رفعته
5. في صفحة الإعدادات:

#### إعدادات Build:
- **Framework Preset:** Other
- **Root Directory:** `./` (اتركه فارغاً)
- **Build Command:** `pnpm exec vite build`
- **Output Directory:** `dist/public`
- **Install Command:** `pnpm install`

**ملاحظة:** ملف `vercel.json` موجود في المشروع - Vercel سيتعرف عليه تلقائياً وستكون الإعدادات جاهزة!

#### متغيرات البيئة (Environment Variables):
اضغط على **"Environment Variables"** وأضف:

```
VITE_SUPABASE_URL
https://ixoxyglkpwhggxmomwih.supabase.co
```

```
VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3h5Z2xrcHdoZ2d4bW9td2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzY0NTQsImV4cCI6MjA3OTg1MjQ1NH0.gyZGxeua5p3Zo6JyMoerZlcctE7tpTqAkZoQHaNrxC4
```

**ملاحظة:** تأكد من تحديد **Production, Preview, Development** لكل متغير

### 3. النشر
- اضغط على **"Deploy"**
- انتظر حتى يكتمل البناء
- سيتم توفير رابط للموقع

## إعداد ملف .env محلياً (للتطوير)

أنشئ ملف `.env.local` في المجلد الرئيسي:

```env
VITE_SUPABASE_URL=https://ixoxyglkpwhggxmomwih.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4b3h5Z2xrcHdoZ2d4bW9td2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzY0NTQsImV4cCI6MjA3OTg1MjQ1NH0.gyZGxeua5p3Zo6JyMoerZlcctE7tpTqAkZoQHaNrxC4
```

**ملاحظة:** ملف `.env.local` موجود في `.gitignore` ولن يتم رفعه على GitHub

## التحقق من النشر

بعد النشر:
1. تأكد من أن الموقع يعمل
2. جرب تسجيل لاعب جديد
3. تأكد من أن البيانات تُحفظ في Supabase
4. تحقق من لوحة المتصدرين

## استكشاف الأخطاء

### المشكلة: الموقع لا يعمل
- تأكد من أن Output Directory هو `dist/public`
- تأكد من أن Build Command هو `pnpm build`

### المشكلة: Supabase لا يعمل
- تأكد من إضافة متغيرات البيئة في Vercel
- تأكد من أن القيم صحيحة
- تأكد من تشغيل SQL schema في Supabase

### المشكلة: البناء فشل
- تأكد من أن `package.json` يحتوي على جميع المتطلبات
- تأكد من أن `pnpm install` يعمل محلياً

