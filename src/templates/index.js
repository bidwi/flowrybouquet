document.addEventListener('DOMContentLoaded', () => {
  // Ambil elemen footer
  const footerContact = document.getElementById('footer-contact');

  // Ambil nomor WhatsApp dari process.env
  const phoneNumber = process.env.VITE_WHATSAPP_PHONE_NUMBER;

  if (phoneNumber) {
    // Buat link WhatsApp
    const whatsappLink = document.createElement('a');
    whatsappLink.href = `https://wa.me/${phoneNumber}`;
    whatsappLink.target = '_blank';
    whatsappLink.rel = 'noopener noreferrer';
    whatsappLink.textContent = 'WhatsApp';

    // Tambahkan link ke elemen footer
    footerContact.textContent = 'Contact us: ';
    footerContact.appendChild(whatsappLink);
  } else {
    footerContact.textContent = 'Contact information is not available.';
  }
});
