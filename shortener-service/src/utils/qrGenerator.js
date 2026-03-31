const QRCode = require('qrcode');

const generateQRCode = async (url) => {
  try {
    const qrImage = await QRCode.toDataURL(url);
    return qrImage;
  } catch (err) {
    console.error('QR Generate Error:', err);
    return null;
  }
};

module.exports = { generateQRCode };
