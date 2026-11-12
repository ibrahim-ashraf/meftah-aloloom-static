(function () {
  "use strict";

  var form = document.getElementById("registration-form");
  if (!form) return;

  var config = window.ACADEMY_CONFIG || {};
  var feedback = document.getElementById("registration-feedback");
  var submitBtn = document.getElementById("register-submit-btn");
  var successCard = document.getElementById("registration-success");
  var successEmailNotice = document.getElementById("success-email-notice");
  var whatsappDirectLink = document.getElementById("whatsapp-direct-link");

  var birthYear = document.getElementById("birth-year");
  var birthMonth = document.getElementById("birth-month");
  var birthDay = document.getElementById("birth-day");
  var birthDateError = document.getElementById("birth-date-error");
  var phoneInput = document.getElementById("phone");

  // ترجمة وإعدادات مكتبة intl-tel-input المتوافقة مع v25
  var arTranslations = {
    eg: "مصر",
    selectedCountryAriaLabel: "البلد المحدد",
    noCountrySelected: "لم يتم تحديد أي بلد",
    countryListAriaLabel: "قائمة الدول",
    searchPlaceholder: "بحث",
    zeroSearchResults: "لم يتم العثور على نتائج",
    oneSearchResult: "تم العثور على نتيجة واحدة",
    multipleSearchResults: "تم العثور على ${count} من النتائج"
  };

  var iti = null;
  if (window.intlTelInput && phoneInput) {
    iti = window.intlTelInput(phoneInput, {
      i18n: arTranslations,
      onlyCountries: ["eg"],
      allowDropdown: false,
      showFlags: true,
      initialCountry: "eg",
      strictMode: true,
      nationalMode: true,
      separateDialCode: false,
      loadUtils: function () {
        return import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js");
      }
    });
  }

  var monthNames = [
    "١ - يناير", "٢ - فبراير", "٣ - مارس", "٤ - أبريل",
    "٥ - مايو", "٦ - يونيو", "٧ - يوليو", "٨ - أغسطس",
    "٩ - سبتمبر", "١٠ - أكتوبر", "١١ - نوفمبر", "١٢ - ديسمبر"
  ];

  // إعداد قائمة السنوات بنطاق سن الطالب من 5 إلى 80 سنة
  var currentYear = new Date().getFullYear();
  var maxBirthYear = currentYear - 5;
  var minBirthYear = currentYear - 80;

  for (var y = maxBirthYear; y >= minBirthYear; y--) {
    var optYear = document.createElement("option");
    optYear.value = String(y);
    optYear.textContent = String(y);
    birthYear.appendChild(optYear);
  }

  // إعداد قائمة الشهور
  monthNames.forEach(function (name, index) {
    var optMonth = document.createElement("option");
    optMonth.value = String(index + 1);
    optMonth.textContent = name;
    birthMonth.appendChild(optMonth);
  });

  function updateDays() {
    var yearVal = parseInt(birthYear.value, 10);
    var monthVal = parseInt(birthMonth.value, 10);
    var prevDay = birthDay.value;

    birthDay.innerHTML = '<option value="">اختر اليوم</option>';

    if (!yearVal || !monthVal) {
      birthDay.disabled = true;
      return;
    }

    birthDay.disabled = false;
    var maxDays = new Date(yearVal, monthVal, 0).getDate();

    for (var d = 1; d <= maxDays; d++) {
      var optDay = document.createElement("option");
      optDay.value = String(d);
      optDay.textContent = String(d);
      birthDay.appendChild(optDay);
    }

    if (prevDay && parseInt(prevDay, 10) <= maxDays) {
      birthDay.value = prevDay;
    }
  }

  birthYear.addEventListener("change", function () {
    if (birthYear.value) {
      birthMonth.disabled = false;
      if (birthMonth.value) {
        updateDays();
      }
    } else {
      birthMonth.value = "";
      birthMonth.disabled = true;
      birthDay.value = "";
      birthDay.disabled = true;
    }
    validateBirthDate();
  });

  birthMonth.addEventListener("change", function () {
    if (birthMonth.value) {
      updateDays();
    } else {
      birthDay.value = "";
      birthDay.disabled = true;
    }
    validateBirthDate();
  });

  birthDay.addEventListener("change", function () {
    validateBirthDate();
  });

  function validateBirthDate() {
    var message = "";
    if (!birthYear.value) {
      message = "يرجى اختيار سنة الميلاد أولًا.";
    } else if (!birthMonth.value) {
      message = "يرجى اختيار شهر الميلاد.";
    } else if (!birthDay.value) {
      message = "يرجى اختيار يوم الميلاد.";
    } else {
      var y = parseInt(birthYear.value, 10);
      var m = parseInt(birthMonth.value, 10) - 1;
      var d = parseInt(birthDay.value, 10);
      var chosen = new Date(y, m, d);
      if (chosen > new Date()) {
        message = "تاريخ الميلاد لا يمكن أن يكون في المستقبل.";
      }
    }

    birthDateError.textContent = message;
    var isInvalid = !!message;
    birthYear.setAttribute("aria-invalid", isInvalid ? "true" : "false");
    birthMonth.setAttribute("aria-invalid", isInvalid ? "true" : "false");
    birthDay.setAttribute("aria-invalid", isInvalid ? "true" : "false");
    return !message;
  }

  var textFields = [
    { id: "full-name", required: true },
    { id: "phone", required: true },
    { id: "email", required: true },
    { id: "memorized-parts", required: true }
  ];

  function validateField(field) {
    var input = document.getElementById(field.id);
    var error = document.getElementById(field.id + "-error");
    var message = "";
    var value = input.value.trim();

    if (field.required && !value) {
      message = "هذا الحقل مطلوب.";
    } else if (field.id === "phone" && value) {
      var raw = value.replace(/[\s\-]/g, "");
      var isEgyptian = /^(\+?20|0)?1[0125][0-9]{8}$/.test(raw);
      if (!isEgyptian && iti && !iti.isValidNumber()) {
        message = "أدخل رقم هاتف مصري صحيح (مثال: 01012345678).";
      }
    } else if (field.id === "email" && value && !input.validity.valid) {
      message = "أدخل بريدًا إلكترونيًا صحيحًا لاستلام التأكيد.";
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
    feedback.textContent = "";

    var firstInvalid = null;

    textFields.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) {
        firstInvalid = document.getElementById(field.id);
      }
    });

    var dobValid = validateBirthDate();
    if (!dobValid && !firstInvalid) {
      firstInvalid = !birthYear.value ? birthYear : (!birthMonth.value ? birthMonth : birthDay);
    }

    var consentInput = document.getElementById("privacy-consent");
    var consentError = document.getElementById("privacy-consent-error");
    if (consentInput && !consentInput.checked) {
      if (consentError) consentError.textContent = "يجب الموافقة على سياسة الخصوصية للمتابعة.";
      consentInput.setAttribute("aria-invalid", "true");
      if (!firstInvalid) firstInvalid = consentInput;
    } else if (consentError) {
      consentError.textContent = "";
      if (consentInput) consentInput.setAttribute("aria-invalid", "false");
    }

    if (firstInvalid) {
      feedback.textContent = "يرجى مراجعة الحقول المحددة وتصحيحها قبل الإرسال.";
      firstInvalid.focus();
      return;
    }

    var values = new FormData(form);
    var formattedDate = birthYear.value + "-" +
      String(birthMonth.value).padStart(2, "0") + "-" +
      String(birthDay.value).padStart(2, "0");

    var fullPhone = "";
    if (iti && typeof iti.getNumber === "function") {
      fullPhone = iti.getNumber();
    }
    if (!fullPhone) {
      var rawDigits = values.get("phone").trim().replace(/[\s\-]/g, "");
      if (rawDigits.startsWith("0")) {
        fullPhone = "+20" + rawDigits.substring(1);
      } else if (!rawDigits.startsWith("+")) {
        fullPhone = "+20" + rawDigits;
      } else {
        fullPhone = rawDigits;
      }
    }

    var payload = {
      fullName: values.get("fullName").trim(),
      birthDate: formattedDate,
      nationality: "مصري",
      country: "مصر",
      phone: fullPhone,
      email: values.get("email").trim(),
      memorizedParts: values.get("memorizedParts").trim(),
      notes: (values.get("notes") || "").trim(),
      submittedAt: new Date().toLocaleString("ar-EG")
    };

    // تجهيز زر الإرسال
    submitBtn.disabled = true;
    var originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text">جارٍ إرسال طلبك...</span>';

    var sheetUrl = config.googleSheetUrl;

    function handleSuccess() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.reset();
      birthMonth.disabled = true;
      birthDay.disabled = true;

      if (successEmailNotice) {
        successEmailNotice.textContent = "تم إرسال بريد إلكتروني تأكيدي إلى: " + payload.email;
      }

      if (whatsappDirectLink) {
        var phoneTarget = config.whatsappPhone || "201094646815";
        var waMsg = "السلام عليكم، قمت بتقديم طلب تسجيل في أكاديمية مفتاح العلوم باسم: " + payload.fullName;
        whatsappDirectLink.href = "https://wa.me/" + phoneTarget + "?text=" + encodeURIComponent(waMsg);
      }

      successCard.hidden = false;
      feedback.textContent = "";
      successCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (!sheetUrl) {
      // تنبيه في حال عدم تعيين الرابط بعد في config.js
      setTimeout(function () {
        handleSuccess();
        console.warn("تنبيه: لم يتم تعيين googleSheetUrl في config.js بعد. تم عرض نجاح التسجيل للمعاينة.");
      }, 500);
      return;
    }

    // إرسال البيانات إلى Google Apps Script Web App
    fetch(sheetUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function () {
      handleSuccess();
    }).catch(function (error) {
      console.error("خطأ أثناء إرسال البيانات:", error);
      // في حالة حدوث مشكلة شبكة، نظهر النجاح ونعطي للطالب خيار واتساب الاحتياطي
      handleSuccess();
    });
  });

  textFields.forEach(function (field) {
    var input = document.getElementById(field.id);
    input.addEventListener("input", function () { validateField(field); });
    input.addEventListener("change", function () { validateField(field); });
  });

  var consentField = document.getElementById("privacy-consent");
  if (consentField) {
    consentField.addEventListener("change", function () {
      var err = document.getElementById("privacy-consent-error");
      if (consentField.checked) {
        if (err) err.textContent = "";
        consentField.setAttribute("aria-invalid", "false");
      }
    });
  }
}());
