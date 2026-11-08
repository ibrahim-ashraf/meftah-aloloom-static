(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var name = document.getElementById("contact-name");
  var message = document.getElementById("contact-message");
  var feedback = document.getElementById("contact-feedback");
  var handoff = document.getElementById("contact-handoff");
  var messageCopy = document.getElementById("contact-message-copy");
  var whatsappLink = document.getElementById("contact-whatsapp-link");

  window.AcademySite.setupCopy(
    document.getElementById("contact-copy-button"),
    messageCopy,
    document.getElementById("contact-copy-feedback")
  );

  function validate(input, errorId, label) {
    var error = document.getElementById(errorId);
    var problem = input.value.trim() ? "" : "أدخل " + label + ".";
    error.textContent = problem;
    input.setAttribute("aria-invalid", problem ? "true" : "false");
    return !problem;
  }

  [name, message].forEach(function (input) {
    input.addEventListener("input", function () {
      validate(input, input === name ? "contact-name-error" : "contact-message-error", input === name ? "اسمك" : "رسالتك");
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    handoff.hidden = true;
    feedback.textContent = "";

    var validName = validate(name, "contact-name-error", "اسمك");
    var validMessage = validate(message, "contact-message-error", "رسالتك");
    if (!validName || !validMessage) {
      feedback.textContent = "يرجى كتابة الاسم والرسالة قبل المتابعة.";
      (validName ? message : name).focus();
      return;
    }

    var text = "رسالة إلى أكاديمية مفتاح العلوم\n\nالاسم: " + name.value.trim() + "\nالرسالة: " + message.value.trim();
    window.AcademySite.prepareWhatsApp(text, {
      feedback: feedback,
      handoff: handoff,
      messageField: messageCopy,
      whatsappLink: whatsappLink
    });
  });
}());
