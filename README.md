# أكاديمية مفتاح العلوم

موقع تعريفي وتسجيلي ثابت لأكاديمية مفتاح العلوم لتعليم كلام الحي القيوم. يعرّف بالأكاديمية ومجالاتها التعليمية، ويتيح تجهيز بيانات التسجيل أو الاستفسار في رسالة واتساب يراجعها المستخدم ويرسلها بنفسه. لا يستخدم الموقع خادمًا أو قاعدة بيانات أو مكتبات خارجية.

## هيكل الملفات

- `index.html`: الصفحة الرئيسية والتعريف بالأكاديمية.
- `register.html`: نموذج التسجيل.
- `contact.html`: نموذج التواصل.
- `privacy.html`: سياسة الخصوصية وشرح انتقال البيانات إلى واتساب.
- `404.html`: صفحة للمسارات غير الموجودة.
- `assets/css/style.css`: تنسيقات الموقع المتجاوبة.
- `assets/js/config.js`: بيانات الأكاديمية وروابطها القابلة للتعديل.
- `assets/js/main.js`: السلوك المشترك وتجهيز رابط واتساب.
- `assets/js/register.js`: التحقق من نموذج التسجيل وبناء رسالته.
- `assets/js/contact.js`: التحقق من نموذج التواصل وبناء رسالته.
- `.nojekyll`: تعطيل معالجة Jekyll الافتراضية في GitHub Pages.

## ربط نموذج التسجيل بـ Google Sheets وإرسال الإيميلات

لحفظ بيانات الطلاب تلقائيًا في جدول Google وإرسال بريد إلكتروني تأكيدي للطالب وإشعار لك، اتبع الخطوات البسيطة التالية (مجانية تمامًا وبلا أي خادم):

1. أنشئ جدول بيانات جديد في [Google Sheets](https://sheets.new) وسمّه مثلًا: `تسجيلات أكاديمية مفتاح العلوم`.
2. في الصف الأول (العناوين)، اكتب:
   - `تاريخ التسجيل` | `الاسم الكامل` | `تاريخ الميلاد` | `الجنسية` | `الدولة` | `الهاتف` | `البريد الإلكتروني` | `عدد الأجزاء` | `ملاحظات`
3. من القائمة العلوية للجدول، اختر **Extensions (الإضافات)** ثم **Apps Script**.
4. احذف الكود الموجود والصق الكود التالي:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    var submittedAt = data.submittedAt || new Date().toLocaleString("ar-EG");
    var fullName = data.fullName || "";
    var birthDate = data.birthDate || "";
    var nationality = data.nationality || "مصري";
    var country = data.country || "مصر";
    var phone = data.phone || "";
    var email = data.email || "";
    var memorizedParts = data.memorizedParts || "0";
    var notes = data.notes || "لا يوجد";

    // إضافة صف جديد بالبيانات في الجدول
    sheet.appendRow([
      submittedAt,
      fullName,
      birthDate,
      nationality,
      country,
      phone,
      email,
      memorizedParts,
      notes
    ]);

    // 1. إرسال بريد إلكتروني تأكيدي منسق للطالب (HTML + نص عادي)
    if (email) {
      var studentSubject = "تأكيد استلام طلب التسجيل | أكاديمية مفتاح العلوم";
      var studentText = "أهلًا بك يا " + fullName + "،\n\n" +
        "نسعد بانضمامك، ونفيدك بأنه تم استلام طلب تسجيلك بنجاح في أكاديمية مفتاح العلوم لتعليم كلام الحي القيوم.\n" +
        "سنتواصل معك مباشرة عبر واتساب على رقمك (" + phone + ") لتنسيق موعد حلقتك الفردية الأولى ومناقشة تفاصيل الدراسة.\n\n" +
        "ملخص بياناتك:\n" +
        "- الاسم: " + fullName + "\n" +
        "- تاريخ الميلاد: " + birthDate + "\n" +
        "- الهاتف: " + phone + "\n" +
        "- الأجزاء المحفوظة: " + memorizedParts + "\n\n" +
        "أكاديمية مفتاح العلوم";

      var studentHtml = '<div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #dce8df; border-radius: 12px; background: #ffffff; color: #20302b; line-height: 1.8;">' +
        '<div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #20594d;">' +
          '<h1 style="color: #123c35; font-size: 22px; margin: 0 0 6px;">أكاديمية مفتاح العلوم</h1>' +
          '<p style="color: #596862; font-size: 13px; margin: 0;">لتعليم كلام الحي القيوم</p>' +
        '</div>' +
        '<div style="padding: 24px 0;">' +
          '<h2 style="color: #20594d; font-size: 18px; margin-top: 0;">أهلًا بك يا ' + fullName + '</h2>' +
          '<p style="font-size: 15px; color: #354a3f;">نسعد بانضمامك إلى رحلة تعلّم القرآن الكريم وأحكام التجويد والقراءات. نفيدك بأنه تم استلام طلب تسجيلك بنجاح.</p>' +
          '<div style="margin: 20px 0; padding: 16px 20px; border-radius: 8px; background: #f4f8f4; border: 1px solid #dce8df;">' +
            '<h3 style="color: #123c35; font-size: 15px; margin: 0 0 12px;">ملخص بيانات طلبك:</h3>' +
            '<table style="width: 100%; font-size: 14px; color: #20302b; border-collapse: collapse;">' +
              '<tr><td style="padding: 6px 0; color: #596862; width: 140px;">الاسم الكامل:</td><td style="font-weight: bold;">' + fullName + '</td></tr>' +
              '<tr><td style="padding: 6px 0; color: #596862;">تاريخ الميلاد:</td><td>' + birthDate + '</td></tr>' +
              '<tr><td style="padding: 6px 0; color: #596862;">رقم الهاتف:</td><td dir="ltr" style="text-align: right;">' + phone + '</td></tr>' +
              '<tr><td style="padding: 6px 0; color: #596862;">الأجزاء المحفوظة:</td><td>' + memorizedParts + ' جزء</td></tr>' +
              (notes !== "لا يوجد" ? '<tr><td style="padding: 6px 0; color: #596862;">ملاحظات:</td><td>' + notes + '</td></tr>' : '') +
            '</table>' +
          '</div>' +
          '<div style="padding: 14px 18px; border-radius: 8px; background: #eaf3ed; border-right: 4px solid #20594d; margin-top: 20px;">' +
            '<p style="margin: 0; color: #123c35; font-size: 14px; font-weight: bold;">الخطوة التالية:</p>' +
            '<p style="margin: 6px 0 0; color: #354a3f; font-size: 13px;">سنتواصل معك مباشرة عبر <strong>واتساب</strong> على رقمك المسجل لتحديد المواعيد الأنسب لجدولك وبدء حلقتك الفردية الأولى بإذن الله.</p>' +
          '</div>' +
        '</div>' +
        '<div style="text-align: center; padding-top: 18px; border-top: 1px solid #edf1ed; color: #8c9c93; font-size: 12px;">' +
          'جميع الحقوق محفوظة © أكاديمية مفتاح العلوم' +
        '</div>' +
      '</div>';

      MailApp.sendEmail({
        to: email,
        subject: studentSubject,
        body: studentText,
        htmlBody: studentHtml
      });
    }

    // 2. إرسال إشعار فوري لك كمسؤول الأكاديمية (HTML + نص عادي)
    var adminEmail = Session.getActiveUser().getEmail();
    var adminSubject = "طالب جديد مسجل: " + fullName;
    var adminText = "تم تسجيل طالب جديد عبر الموقع:\n\n" +
      "- الاسم: " + fullName + "\n" +
      "- تاريخ الميلاد: " + birthDate + "\n" +
      "- الهاتف: " + phone + "\n" +
      "- البريد: " + email + "\n" +
      "- الأجزاء المحفوظة: " + memorizedParts + "\n" +
      "- الملاحظات: " + notes;

    var cleanPhoneForWa = phone.replace(/[^0-9]/g, "");
    var waAdminLink = "https://wa.me/" + cleanPhoneForWa;

    var adminHtml = '<div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #dce8df; border-radius: 12px; background: #ffffff; color: #20302b;">' +
      '<h2 style="color: #123c35; margin-top: 0;">طالب جديد سجّل في الأكاديمية</h2>' +
      '<table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-top: 15px;">' +
        '<tr><td style="padding: 8px; border: 1px solid #e8eee9; background: #f9fbf9; width: 140px;">الاسم:</td><td style="padding: 8px; border: 1px solid #e8eee9; font-weight: bold;">' + fullName + '</td></tr>' +
        '<tr><td style="padding: 8px; border: 1px solid #e8eee9; background: #f9fbf9;">تاريخ الميلاد:</td><td style="padding: 8px; border: 1px solid #e8eee9;">' + birthDate + '</td></tr>' +
        '<tr><td style="padding: 8px; border: 1px solid #e8eee9; background: #f9fbf9;">الهاتف:</td><td style="padding: 8px; border: 1px solid #e8eee9;" dir="ltr"><a href="' + waAdminLink + '" target="_blank">' + phone + '</a></td></tr>' +
        '<tr><td style="padding: 8px; border: 1px solid #e8eee9; background: #f9fbf9;">البريد:</td><td style="padding: 8px; border: 1px solid #e8eee9;"><a href="mailto:' + email + '">' + email + '</a></td></tr>' +
        '<tr><td style="padding: 8px; border: 1px solid #e8eee9; background: #f9fbf9;">الأجزاء المحفوظة:</td><td style="padding: 8px; border: 1px solid #e8eee9;">' + memorizedParts + '</td></tr>' +
        '<tr><td style="padding: 8px; border: 1px solid #e8eee9; background: #f9fbf9;">الملاحظات:</td><td style="padding: 8px; border: 1px solid #e8eee9;">' + notes + '</td></tr>' +
      '</table>' +
      '<div style="margin-top: 20px; text-align: center;">' +
        '<a href="' + waAdminLink + '" target="_blank" style="display: inline-block; padding: 10px 20px; background: #20594d; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">مراسلة الطالب مباشرة على واتساب</a>' +
      '</div>' +
    '</div>';

    MailApp.sendEmail({
      to: adminEmail,
      subject: adminSubject,
      body: adminText,
      htmlBody: adminHtml
    });

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. اضغط **Deploy (نشر)** في أعلى الصفحة ثم اختر **New deployment**.
6. اضغط على أيقونة الترس بجانب "Select type" واختر **Web app**.
7. في خانة **Execute as** اختر **Me**.
8. في خانة **Who has access** اختر **Anyone**.
9. اضغط **Deploy** ووافق على الصلاحيات المطلوبة (Authorize access).
10. انسخ الرابط الممنوح لك تحت **Web app URL**.
11. افتح ملف `assets/js/config.js` في مشروعك، وضعه في خانة `googleSheetUrl: "الرابط_هنا"`.

بذلك يصبح النموذج جاهزًا لاستقبال بيانات الطلاب فوريًا في الجدول وإرسال الإيميلات آليًا!

## التشغيل محليًا

يمكن فتح `index.html` مباشرة في المتصفح لمعاينة الصفحات. لا يتطلب المشروع تثبيت حزم أو بناء ملفات. لاختبار سلوك النماذج بصورة أفضل، شغّل خادم ملفات محليًا من مجلد المشروع، مثل إضافة Live Server في المحرر أو:

```sh
python -m http.server 8000
```

ثم افتح `http://localhost:8000`. بعد إدخال رقم واتساب صحيح في الإعدادات، اختبر النماذج ببيانات غير حساسة، وتحقق من الرسالة في واتساب قبل إرسالها.

## النشر على GitHub Pages

1. ادفع ملفات المشروع إلى الفرع الذي تريد النشر منه في المستودع.
2. افتح **Settings** في المستودع، ثم **Pages**.
3. ضمن **Build and deployment** اختر **Deploy from a branch**.
4. اختر الفرع ومجلد النشر `/(root)` ثم اضغط **Save**.
5. انتظر اكتمال النشر وافتح الرابط الذي تعرضه صفحة Pages.

كل الروابط والموارد المحلية نسبية إلى ملفات الصفحات، لذلك تعمل عند النشر على نطاق المستخدم أو داخل مسار مستودع مثل `https://username.github.io/repository/`.

## اختبار الموقع بعد النشر

- افتح الصفحات الأربع وروابط التنقل والتذييل، ثم جرّب رابطًا غير موجود للتأكد من ظهور صفحة 404.
- اختبر النموذجين على هاتف وحاسوب، وتحقق من رسائل الأخطاء العربية ومن بقاء البيانات المدخلة بعد الخطأ.
- جرّب رقم الهاتف بصيغة دولية صحيحة وبأرقام إنجليزية، وتأكد من رفض الأرقام العربية وتاريخ الميلاد المستقبلي وعدد الأجزاء خارج النطاق ٠–٣٠.
- تحقق من أن الرسالة العربية تُفتح بصورة سليمة في واتساب، وأن الموقع لا يدّعي إرسالها قبل تأكيد الإرسال داخل واتساب.
- جرّب لوحة المفاتيح وقارئ الشاشة وتكبير النص، واختبر بديل فتح واتساب ونسخ الرسالة.

## الخصوصية

تُعالج بيانات النماذج في متصفح المستخدم فقط لتكوين نص الرسالة ورابط واتساب. لا تُرسل إلى هذا الموقع ولا تُخزّن فيه. يفتح واتساب خدمة خارجية، وتخضع البيانات بعد الانتقال إليها لشروط تلك الخدمة.
