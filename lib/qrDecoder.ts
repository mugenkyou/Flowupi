/**
 * Robust Multi-Strategy Client-Side QR Code Decoder Utility for Image Files & Screenshots
 * Supports High-Resolution Mobile Screenshots (GPay, PhonePe, Paytm, BHIM, BharatQR)
 */

export async function decodeQrFromImageFile(file: File): Promise<string> {
  if (!file) {
    throw new Error('NO_FILE_PROVIDED');
  }

  // Ensure file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('INVALID_FILE_TYPE');
  }

  // Ensure temporary DOM element exists for Html5Qrcode DOM attachment
  let container = document.getElementById('qr-decoder-temp-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'qr-decoder-temp-container';
    container.style.display = 'block';
    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '-9999px';
    container.style.width = '1px';
    container.style.height = '1px';
    container.style.overflow = 'hidden';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.setAttribute('aria-hidden', 'true');
    document.body.appendChild(container);
  }

  // --- STRATEGY 1: Native BarcodeDetector API (Chrome, Edge, Safari 17+, Android WebViews) ---
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const BarcodeDetectorClass = (window as any).BarcodeDetector;
      const detector = new BarcodeDetectorClass({ formats: ['qr_code'] });
      const imageBitmap = await createImageBitmap(file);
      const barcodes = await detector.detect(imageBitmap);
      if (barcodes && barcodes.length > 0 && barcodes[0]?.rawValue) {
        return barcodes[0].rawValue;
      }
    } catch (err) {
      console.warn('Strategy 1 (BarcodeDetector) failed/skipped:', err);
    }
  }

  // --- STRATEGY 2: Direct Html5Qrcode scanFile ---
  let html5QrCodeInstance: any = null;
  try {
    const { Html5Qrcode } = await import('html5-qrcode');
    html5QrCodeInstance = new Html5Qrcode('qr-decoder-temp-container');
    const directResult = await html5QrCodeInstance.scanFile(file, false);
    if (directResult && directResult.trim()) {
      return directResult;
    }
  } catch (err) {
    console.warn('Strategy 2 (Html5Qrcode direct) failed:', err);
  }

  // Helper to convert Image to Canvas
  const loadImageToCanvas = (file: File): Promise<{ img: HTMLImageElement; canvas: HTMLCanvasElement }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('CANVAS_CONTEXT_FAILED'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        resolve({ img, canvas });
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  };

  const canvasToFile = (canvas: HTMLCanvasElement, filename: string): Promise<File> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('CANVAS_BLOB_FAILED'));
          return;
        }
        resolve(new File([blob], filename, { type: 'image/png' }));
      }, 'image/png');
    });
  };

  // --- STRATEGY 3: Downscaled Canvas Resizing (Fixes High-Res Phone Screenshots) ---
  try {
    const { img } = await loadImageToCanvas(file);
    const maxDimension = Math.max(img.width, img.height);

    if (maxDimension > 800 && html5QrCodeInstance) {
      // Scale down to 800px max side
      const scale = 800 / maxDimension;
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = Math.round(img.width * scale);
      scaledCanvas.height = Math.round(img.height * scale);
      const ctx = scaledCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, scaledCanvas.width, scaledCanvas.height);
        const scaledFile = await canvasToFile(scaledCanvas, 'scaled_qr.png');

        // Test with BarcodeDetector if available
        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
          try {
            const BarcodeDetectorClass = (window as any).BarcodeDetector;
            const detector = new BarcodeDetectorClass({ formats: ['qr_code'] });
            const bitmap = await createImageBitmap(scaledFile);
            const barcodes = await detector.detect(bitmap);
            if (barcodes && barcodes.length > 0 && barcodes[0]?.rawValue) {
              return barcodes[0].rawValue;
            }
          } catch (_) {}
        }

        // Test with Html5Qrcode
        const scaledResult = await html5QrCodeInstance.scanFile(scaledFile, false);
        if (scaledResult && scaledResult.trim()) {
          return scaledResult;
        }
      }
    }

    // --- STRATEGY 4: Center/Bottom Crop (Targeting standard Indian app QR placement) ---
    if (img.width > 200 && img.height > 200 && html5QrCodeInstance) {
      const cropCanvas = document.createElement('canvas');
      const cropX = Math.round(img.width * 0.05);
      const cropY = Math.round(img.height * 0.15);
      const cropW = Math.round(img.width * 0.9);
      const cropH = Math.round(img.height * 0.7);

      cropCanvas.width = cropW;
      cropCanvas.height = cropH;

      const ctx = cropCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
        const croppedFile = await canvasToFile(cropCanvas, 'cropped_qr.png');

        const croppedResult = await html5QrCodeInstance.scanFile(croppedFile, false);
        if (croppedResult && croppedResult.trim()) {
          return croppedResult;
        }
      }
    }
  } catch (err) {
    console.warn('Strategy 3/4 canvas scaling & cropping failed:', err);
  }

  throw new Error('NO_QR_DETECTED');
}
