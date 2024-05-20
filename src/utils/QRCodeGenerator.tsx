import { useEffect, useState } from "react";
import { toDataURL, QRCodeToDataURLOptions } from "qrcode";

const options: QRCodeToDataURLOptions = {
  width: 300,
  margin: 2,
};

const generateQRCode = (value: string, setQr: (qr: string) => void) => {
  toDataURL(value, options, (err, url) => {
    if (err) {
      console.error(err);
      return;
    }
    setQr(url);
  });
};

const QrCodeGenerator = ({ shopName }: { shopName: string }) => {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    if (shopName) {
      const url = `http://localhost/send/${shopName}`;
      generateQRCode(url, setQr);
    }
  }, [shopName]);

  return qr ? <img src={qr} alt={`QR code for ${shopName}`} /> : null;
};

export default QrCodeGenerator;
