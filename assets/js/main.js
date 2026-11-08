(function () {
  "use strict";

  var config = window.ACADEMY_CONFIG;
  var year = String(new Date().getFullYear());
  document.querySelectorAll("[data-current-year]").forEach(function (element) {
    element.textContent = year;
  });

  [
    { key: "facebookUrl", name: "facebook" },
    { key: "whatsappChannelUrl", name: "whatsappChannel" }
  ].forEach(function (social) {
    var link = document.querySelector('[data-social-link="' + social.name + '"]');
    var url = config[social.key];
    if (!link || !url) return;

    try {
      var parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "https:") throw new Error("يجب أن يبدأ رابط التواصل بـ https://");
      link.href = parsedUrl.href;
      link.closest("[data-social-item]").hidden = false;
    } catch (error) {
      console.error("إعداد رابط " + social.name + " غير صالح:", error);
    }
  });

  function getWhatsAppUrl(message) {
    var phone = config.whatsappPhone;
    if (!/^[1-9][0-9]{7,14}$/.test(phone)) return null;
    return "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
  }

  function setupCopy(button, messageField, feedback) {
    button.addEventListener("click", function () {
      messageField.focus();
      messageField.select();
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        feedback.textContent = "تعذّر النسخ التلقائي. حدّد النص ثم انسخه باستخدام Ctrl+C أو خيار النسخ في جهازك.";
        return;
      }

      navigator.clipboard.writeText(messageField.value).then(function () {
        feedback.textContent = "نُسخت الرسالة إلى الحافظة.";
      }).catch(function (error) {
        console.error("تعذر نسخ رسالة واتساب:", error);
        feedback.textContent = "تعذّر النسخ التلقائي. حدّد النص أعلاه ثم انسخه يدويًا.";
      });
    });
  }

  function prepareWhatsApp(message, elements) {
    var url = getWhatsAppUrl(message);
    elements.feedback.textContent = "";
    elements.handoff.hidden = true;

    if (!url) {
      elements.feedback.textContent = "لم يُضف رقم واتساب الأكاديمية أو أن صياغته غير صحيحة. يرجى التواصل مع إدارة الموقع لتحديث الإعدادات.";
      return;
    }

    var accepted = window.confirm("ستُجهّز بياناتك في رسالة وتُفتح خدمة واتساب لإرسالها إلى الأكاديمية. راجع الرسالة، ولن تُرسل إلا بعد ضغطك على زر الإرسال داخل واتساب. هل تريد المتابعة؟");
    if (!accepted) {
      elements.feedback.textContent = "لم يُفتح واتساب. يمكنك مراجعة بياناتك أو تعديلها ثم المحاولة مجددًا.";
      return;
    }

    elements.messageField.value = message;
    elements.whatsappLink.href = url;
    elements.handoff.hidden = false;
    elements.feedback.textContent = "سيُفتح واتساب الآن مع الرسالة المجهزة. لم تُرسل الرسالة بعد؛ راجعها واضغط زر الإرسال داخل واتساب لإتمام الإرسال.";

    var whatsappWindow = window.open(url, "_blank");
    if (whatsappWindow) {
      whatsappWindow.opener = null;
    } else {
      elements.feedback.textContent = "تعذّر فتح واتساب تلقائيًا. استخدم زر «فتح واتساب يدويًا» أو انسخ نص الرسالة أدناه. لم تُرسل الرسالة.";
      elements.messageField.focus();
      elements.messageField.select();
    }
  }

  window.AcademySite = Object.freeze({
    prepareWhatsApp: prepareWhatsApp,
    setupCopy: setupCopy
  });
}());
