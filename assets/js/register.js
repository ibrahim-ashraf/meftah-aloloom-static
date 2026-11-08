(function () {
  "use strict";

  var form = document.getElementById("registration-form");
  if (!form) return;

  var feedback = document.getElementById("registration-feedback");
  var handoff = document.getElementById("registration-handoff");
  var messageField = document.getElementById("registration-message");
  var whatsappLink = document.getElementById("registration-whatsapp-link");
  var copyFeedback = document.getElementById("registration-copy-feedback");

  window.AcademySite.setupCopy(
    document.getElementById("registration-copy-button"),
    messageField,
    copyFeedback
  );

  var fields = [
    { id: "full-name", required: true, label: "الاسم الكامل" },
    { id: "gender", required: true, label: "النوع" },
    { id: "birth-date", required: true, label: "تاريخ الميلاد" },
    { id: "nationality", required: true, label: "الجنسية" },
    { id: "country", required: true, label: "الدولة" },
    { id: "phone", required: true, label: "رقم الهاتف" },
    { id: "email", required: true, label: "البريد الإلكتروني" },
    { id: "memorized-parts", required: true, label: "عدد الأجزاء المحفوظة" },
    { id: "reason", required: true, label: "سبب الرغبة في الالتحاق" }
  ];

  function validateField(field) {
    var input = document.getElementById(field.id);
    var error = document.getElementById(field.id + "-error");
    var message = "";
    var value = input.value.trim();

    if (field.required && !value) {
      message = "هذا الحقل مطلوب.";
    } else if (field.id === "birth-date" && value) {
      var birthDate = new Date(value + "T00:00:00");
      if (Number.isNaN(birthDate.getTime()) || birthDate > new Date()) {
        message = "أدخل تاريخ ميلاد صحيحًا غير واقع في المستقبل.";
      }
    } else if (field.id === "phone" && value && !/^\+[1-9][0-9]{7,14}$/.test(value)) {
      message = "أدخل الرقم بالصيغة الدولية، مع + ورمز الدولة، وبأرقام إنجليزية فقط ودون مسافات.";
    } else if (field.id === "email" && value && !input.validity.valid) {
      message = "أدخل بريدًا إلكترونيًا صحيحًا.";
    } else if (field.id === "memorized-parts" && value) {
      var parts = Number(value);
      if (!Number.isInteger(parts) || parts < 0 || parts > 30) {
        message = "أدخل عددًا صحيحًا من ٠ إلى ٣٠.";
      }
    }

    error.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    handoff.hidden = true;
    feedback.textContent = "";

    var firstInvalid = null;
    fields.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = document.getElementById(field.id);
    });
    if (firstInvalid) {
      feedback.textContent = "يرجى مراجعة الحقول المحددة وإكمال البيانات المطلوبة.";
      firstInvalid.focus();
      return;
    }

    var values = new FormData(form);
    var entries = [
      ["الاسم الكامل", values.get("fullName")],
      ["النوع", values.get("gender")],
      ["تاريخ الميلاد", values.get("birthDate")],
      ["الجنسية", values.get("nationality")],
      ["الدولة", values.get("country")],
      ["العنوان", values.get("address")],
      ["رقم الهاتف", values.get("phone")],
      ["البريد الإلكتروني", values.get("email")],
      ["عدد الأجزاء المحفوظة", values.get("memorizedParts")],
      ["سبب الرغبة في الالتحاق بالأكاديمية", values.get("reason")],
      ["كيف تعرّفت على الأكاديمية؟ (مكان العلم بنا)", values.get("referral")],
      ["ملاحظات إضافية", values.get("notes")]
    ];
    var message = "طلب تسجيل - أكاديمية مفتاح العلوم\n\n" + entries
      .filter(function (entry) { return String(entry[1] || "").trim(); })
      .map(function (entry) { return entry[0] + ": " + String(entry[1]).trim(); })
      .join("\n");

    window.AcademySite.prepareWhatsApp(message, {
      feedback: feedback,
      handoff: handoff,
      messageField: messageField,
      whatsappLink: whatsappLink
    });
  });

  fields.forEach(function (field) {
    var input = document.getElementById(field.id);
    input.addEventListener("input", function () { validateField(field); });
    input.addEventListener("change", function () { validateField(field); });
  });
}());
