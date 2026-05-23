import { Toaster } from 'react-hot-toast';

export default function ToastContext() {
  return <Toaster position="top-right" toastOptions={{ style: { borderRadius: '6px', fontSize: '14px' } }} />;
}
