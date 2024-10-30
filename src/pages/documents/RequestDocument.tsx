import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CreditCard, ArrowRight, Check } from 'lucide-react';

interface DocumentType {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  description: string;
  processingTime: string;
}

const documentTypes: DocumentType[] = [
  {
    id: 'auth-code',
    name: 'رمز المصادقة',
    nameEn: 'Authentication Code',
    price: 79,
    description: 'الحصول على رمز المصادقة الرسمي للشركة',
    processingTime: '2-3 أيام عمل'
  },
  {
    id: 'utr',
    name: 'خطاب UTR',
    nameEn: 'UTR Letter',
    price: 99,
    description: 'إصدار خطاب الرقم المرجعي الضريبي الفريد',
    processingTime: '3-4 أيام عمل'
  },
  {
    id: 'cert',
    name: 'شهادة التأسيس',
    nameEn: 'Certificate of Incorporation',
    price: 149,
    description: 'إصدار شهادة تأسيس الشركة الرسمية',
    processingTime: '4-5 أيام عمل'
  },
  {
    id: 'mem',
    name: 'عقد التأسيس',
    nameEn: 'Memorandum of Association',
    price: 199,
    description: 'إعداد وثيقة عقد التأسيس القانونية',
    processingTime: '5-7 أيام عمل'
  }
];

export const RequestDocument = () => {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [step, setStep] = useState<'select' | 'payment'>('select');

  const handleSelectDocument = (doc: DocumentType) => {
    setSelectedDoc(doc);
    setStep('payment');
  };

  const handlePayment = async () => {
    // Here you would integrate with your payment provider
    try {
      // Simulating payment process
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('تم تقديم الطلب بنجاح');
      navigate('/dashboard/documents');
    } catch (error) {
      alert('حدث خطأ أثناء معالجة الطلب');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">طلب مستند جديد</h1>
        <button
          onClick={() => navigate('/dashboard/documents')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowRight className="ml-2 h-5 w-5" />
          العودة
        </button>
      </div>

      {step === 'select' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentTypes.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleSelectDocument(doc)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 ml-4" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{doc.nameEn}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">£{doc.price}</span>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">{doc.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  وقت المعالجة: {doc.processingTime}
                </span>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  اختيار
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        selectedDoc && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">تأكيد الطلب</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">المستند</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedDoc.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">السعر</span>
                  <span className="font-medium text-gray-900 dark:text-white">£{selectedDoc.price}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-300">وقت المعالجة</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedDoc.processingTime}</span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handlePayment}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="ml-2 h-5 w-5" />
                  إتمام الطلب والدفع
                </button>
                <button
                  onClick={() => setStep('select')}
                  className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  العودة للاختيار
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};