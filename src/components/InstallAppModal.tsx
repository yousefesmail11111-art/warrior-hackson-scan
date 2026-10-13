/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Monitor,
  Apple,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Share2,
  MoreVertical,
  Layers,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppModalProps {
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isDesktop, install } = usePWAInstall();
  const [activePlatformTab, setActivePlatformTab] = useState<'ANDROID' | 'PC' | 'IOS'>(
    isAndroid ? 'ANDROID' : isIOS ? 'IOS' : 'PC'
  );
  const [installSuccess, setInstallSuccess] = useState(false);

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Download className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                تثبيت التطبيق على الهاتف أو الكمبيوتر
              </h3>
              <p className="text-xs text-slate-400">
                Install as a standalone Native-like App (PWA) with Home Screen Icon
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick 1-Click Install Banner if browser supports prompt */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> ميزة التثبيت المباشر متاحة في متصفحك
                </span>
                <h4 className="text-sm font-bold text-slate-100">
                  اضغط للتثبيت الفوري كأيقونة تطبيق
                </h4>
                <p className="text-xs text-slate-300">
                  سيتم تثبيت التطبيق فوراً بدون الحاجة لمتجر تطبيقات، وسيعمل بشكل مستقل وسريع.
                </p>
              </div>

              <button
                onClick={handleDirectInstall}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت التطبيق الآن (Install Now)</span>
              </button>
            </div>
          )}

          {installSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>تم التثبيت بنجاح! ستجد الأيقونة الآن على شاشتك الرئيسية وقائمة التطبيقات.</span>
            </div>
          )}

          {isInstalled && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>أنت تستخدم التطبيق بالفعل في وضع التثبيت المستقل (Standalone PWA App).</span>
            </div>
          )}

          {/* Platform Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActivePlatformTab('ANDROID')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activePlatformTab === 'ANDROID'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>هاتف أندرويد (Android)</span>
              </button>

              <button
                onClick={() => setActivePlatformTab('PC')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activePlatformTab === 'PC'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>الكمبيوتر / اللابتوب (PC / Mac)</span>
              </button>

              <button
                onClick={() => setActivePlatformTab('IOS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activePlatformTab === 'IOS'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Apple className="w-3.5 h-3.5" />
                <span>الآيفون (iPhone / iPad)</span>
              </button>
            </div>

            {/* TAB 1: ANDROID GUIDE */}
            {activePlatformTab === 'ANDROID' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    طريقة التثبيت على هاتف الأندرويد (Google Chrome أو Samsung Internet):
                  </h4>

                  <ol className="space-y-3 pr-4 list-decimal text-slate-300">
                    <li className="leading-relaxed">
                      افتح هذا الرابط في متصفح <strong>Google Chrome</strong> أو{' '}
                      <strong>Samsung Internet</strong> على هاتفك الأندرويد.
                    </li>
                    <li className="leading-relaxed">
                      اضغط على قائمة <strong>الخيارات (الثلاث نقاط الرأسية ⋮)</strong> في أعلى الزاوية
                      اليمنى أو اليسرى من المتصفح.
                    </li>
                    <li className="leading-relaxed">
                      اختر من القائمة <strong>&quot;تثبيت التطبيق&quot; (Install app)</strong> أو{' '}
                      <strong>&quot;إضافة إلى الشاشة الرئيسية&quot; (Add to Home screen)</strong>.
                    </li>
                    <li className="leading-relaxed">
                      اضغط على <strong>تثبيت (Install)</strong> لتأكيد الإضافة.
                    </li>
                  </ol>

                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-emerald-300 text-[11px] leading-relaxed">
                    ✨ <strong>النتيجة:</strong> ستظهر أيقونة التطبيق بشعار الدرع الأمني واسم{' '}
                    <strong>Warrior Hackson Scan</strong> بين تطبيقات هاتفك. عند الضغط عليها تفتح في
                    شاشة كاملة وتعمل كتطبيق هاتف حقيقي وسريع!
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PC / LAPTOP GUIDE */}
            {activePlatformTab === 'PC' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-indigo-400" />
                    طريقة التثبيت على الكمبيوتر (Windows / Mac / Linux):
                  </h4>

                  <ol className="space-y-3 pr-4 list-decimal text-slate-300">
                    <li className="leading-relaxed">
                      في متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong>، انظر
                      إلى شريط العنوان (Address Bar) في الأعلى حيث يوجد رابط الموقع.
                    </li>
                    <li className="leading-relaxed">
                      ستجد أيقونة تثبيت صغيرة شكل شاشة أو علامة زائد داخل دائرة (<strong>⊕</strong> أو{' '}
                      <strong>Install app</strong>) في أقصى يمين شريط العنوان.
                    </li>
                    <li className="leading-relaxed">
                      اضغط عليها واضغط <strong>&quot;Install&quot; (تثبيت)</strong>.
                    </li>
                    <li className="leading-relaxed">
                      بدلاً من ذلك: يمكنك الضغط على الثلاث نقاط <strong>(⋮)</strong> في المتصفح &larr;{' '}
                      <strong>Save and share</strong> &larr; <strong>Install Warrior Hackson Scan</strong>.
                    </li>
                  </ol>

                  <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/30 text-indigo-300 text-[11px] leading-relaxed">
                    💻 <strong>النتيجة:</strong> سيتم إنشاء اختصار رسمي على سطح المكتب (Desktop Icon)
                    وقائمة Start، ويفتح كنافذة برنامج مستقل دون أشرطة المتصفح المزدحمة.
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: IOS GUIDE */}
            {activePlatformTab === 'IOS' && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Apple className="w-4 h-4 text-purple-400" />
                    طريقة التثبيت على هواتف آيفون (iPhone / Safari):
                  </h4>

                  <ol className="space-y-3 pr-4 list-decimal text-slate-300">
                    <li className="leading-relaxed">
                      افتح الموقع في متصفح <strong>Safari</strong> على جهاز الآيفون.
                    </li>
                    <li className="leading-relaxed">
                      اضغط على زر <strong>المشاركة (Share)</strong> — الأيقونة المربعة مع سهم لأعلى (
                      <Share2 className="w-3.5 h-3.5 inline mx-1 text-indigo-400" />) في شريط سفاري
                      السفلي.
                    </li>
                    <li className="leading-relaxed">
                      مرر الخيارات لأسفل واضغط على{' '}
                      <strong>&quot;إضافة إلى الشاشة الرئيسية&quot; (Add to Home Screen)</strong>.
                    </li>
                    <li className="leading-relaxed">
                      اضغط على <strong>&quot;إضافة&quot; (Add)</strong> في أعلى الزاوية.
                    </li>
                  </ol>

                  <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/30 text-purple-300 text-[11px] leading-relaxed">
                    📱 <strong>النتيجة:</strong> ستُضاف الأيقونة على الشاشة الرئيسية للآيفون، وتفتح
                    مباشرة كأداة أمنية بكامل الشاشة.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features of Installed App */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
              <span className="text-emerald-400 font-bold block mb-1">⚡ وصول فوري</span>
              <p className="text-[11px] text-slate-400 font-sans">
                نقرة واحدة على الأيقونة تفتح الأداة مباشرة بدون كتابة روابط.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
              <span className="text-indigo-400 font-bold block mb-1">🛡️ وضع الشاشة الكاملة</span>
              <p className="text-[11px] text-slate-400 font-sans">
                يعمل كتطبيق أصلي (Standalone) بدون أشرطة عناوين المتصفح.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center">
              <span className="text-purple-400 font-bold block mb-1">💾 خفيف وسريع</span>
              <p className="text-[11px] text-slate-400 font-sans">
                لا يستهلك مساحة التخزين أو الرام ويعمل بتقنية PWA الحديثة.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Warrior Hackson Scan &bull; Install Guide</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
          >
            فهمت، إغلاق (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
