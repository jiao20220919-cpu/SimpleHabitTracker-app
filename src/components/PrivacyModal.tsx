/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Check } from 'lucide-react';
import { Language } from '../locales';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  onClose,
  lang = 'zh',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[3px]"
            id="privacy-modal-overlay"
          />

          {/* Modal Card Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.38 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col max-h-[85vh]"
            id="privacy-modal-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500 fill-indigo-100 dark:fill-indigo-950" />
                {lang === 'zh' ? '隐私政策' : lang === 'ja' ? 'プライバシーポリシー' : 'Privacy Policy'}
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
                id="btn-close-privacy"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto py-5 pr-1 space-y-5 text-sm text-zinc-600 dark:text-zinc-300 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              
              {/* Badge info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/50 dark:border-indigo-950/50 rounded-2xl">
                <span className="text-base">🛡️</span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {lang === 'zh' 
                    ? '100% 纯本地化存储 · 零个人数据收集' 
                    : lang === 'ja'
                    ? '100% オフラインローカル保存 · 個人情報の収集ゼロ'
                    : '100% Offline Local Storage · Zero Personal Data Collected'}
                </span>
              </div>

              {lang === 'zh' ? (
                <>
                  <section className="space-y-2">
                    <p className="leading-relaxed">
                      感谢您选择使用 <strong>Minimalist 极简自律飞轮</strong>。我们非常重视您的隐私，并致力于保障您的个人信息安全。本隐私政策旨在向您说明本应用对个人数据的使用情况。
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      一、 核心原则：零个人数据收集
                    </h3>
                    <p className="leading-relaxed pl-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                      我们完全不收集、不存储、不传输任何您的个人数据。
                    </p>
                    <ul className="list-disc pl-7 text-[13px] text-zinc-500 dark:text-zinc-400 space-y-1">
                      <li><strong>无需注册或登录</strong>：您在使用本应用的所有功能时，无需注册账户，无需提供手机号、邮箱等个人身份信息。</li>
                      <li><strong>不包含任何第三方跟踪SDK</strong>：我们拒绝植入任何第三方统计、广告、追踪代码。</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      二、 数据的本地化存储与完全控制
                    </h3>
                    <p className="leading-relaxed pl-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                      您在本应用中创建的所有习惯、打卡记录、番茄钟计时、专注时长和心情日记，均以完全加密的形式存储在您当前使用的移动设备本地沙盒中（通过 IndexedDB / LocalStorage 存储）。
                    </p>
                    <ul className="list-disc pl-7 text-[13px] text-zinc-500 dark:text-zinc-400 space-y-1">
                      <li><strong>无云端同步</strong>：我们没有建立任何中心化服务器来托管您的数据，任何数据都不会传输给外部。</li>
                      <li><strong>本地安全沙盒</strong>：由于数据驻留在沙盒中，其他第三方应用无法越权读取您的打卡与日记内容。</li>
                      <li><strong>完全自主控制</strong>：您可以随时利用应用底部的“清空数据”或“导出习惯数据”功能，一键清除、覆盖或备份您本地的所有自律数据。</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      三、 敏感权限使用说明
                    </h3>
                    <p className="leading-relaxed pl-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                      为了保证最佳的用户交互体验，本应用可能会在必要时向您申请系统权限：
                    </p>
                    <ul className="list-disc pl-7 text-[13px] text-zinc-500 dark:text-zinc-400 space-y-1">
                      <li><strong>设备震动控制（Vibration）</strong>：仅用于打卡、番茄钟结束时的轻微触觉反馈（Haptic Feedback），提供更具质感的物理爽感。</li>
                      <li><strong>本地存储访问</strong>：用于在系统沙盒内读写本地缓存。我们绝对不会访问您沙盒之外的任何系统相册、通讯录或短信。</li>
                    </ul>
                  </section>

                  <section className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      如果您对我们的隐私策略有任何疑问、建议或反馈，欢迎通过以下电子邮件联系：
                      <span className="block mt-1 font-semibold text-zinc-500 dark:text-zinc-400">Email: jiao20220919@gmail.com</span>
                    </p>
                  </section>
                </>
              ) : lang === 'ja' ? (
                <>
                  <section className="space-y-2">
                    <p className="leading-relaxed">
                      <strong>Minimalist 属性自己管理ツール</strong>（以下「本アプリ」）をご利用いただき、誠にありがとうございます。本アプリは個人情報の保護を最も重視しており、すべてのデータをオフラインで完結する設計を採用しています。
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      1. 個人情報の収集ゼロ
                    </h3>
                    <p className="leading-relaxed pl-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                      開発者を含む第三者がお客様の個人情報を収集、保存、または送信することは一切ありません。
                    </p>
                    <ul className="list-disc pl-7 text-[13px] text-zinc-500 dark:text-zinc-400 space-y-1">
                      <li><strong>登録不要</strong>：アカウント登録、電話番号、メールアドレスなどの入力は一切不要で、すべての機能を利用できます。</li>
                      <li><strong>トラッカー無効</strong>：サードパーティ製の分析、広告、行動追跡用SDKを一切排除しています。</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      2. 完全なローカル管理
                    </h3>
                    <p className="leading-relaxed pl-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                      習慣データ、打刻スタンプ、タイマーログ、日記はすべて、デバイス内部の安全な領域（IndexedDB / LocalStorage）にのみ保存されます。
                    </p>
                    <ul className="list-disc pl-7 text-[13px] text-zinc-500 dark:text-zinc-400 space-y-1">
                      <li><strong>サーバー同期なし</strong>：データをホストするサーバーは存在せず、データがデバイス外に送信されることはありません。</li>
                      <li><strong>自己主権型操作</strong>：設定内の「データ全削除」や「データ書き出し」で、瞬時に端末内のデータを完全消去・バックアップ可能です。</li>
                    </ul>
                  </section>

                  <section className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      ご質問やフィードバックがございましたら、下記までお気軽にお問い合わせください：
                      <span className="block mt-1 font-semibold text-zinc-500 dark:text-zinc-400">Email: jiao20220919@gmail.com</span>
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section className="space-y-2">
                    <p className="leading-relaxed">
                      Thank you for choosing <strong>Minimalist Discipline Flywheel</strong>. We are highly committed to safeguarding your personal data and respect your absolute right to digital privacy. This policy explains our approach to privacy.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      1. Core Principle: Zero Data Collection
                    </h3>
                    <p className="leading-relaxed pl-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                      We do not collect, store, or transmit any of your personal data.
                    </p>
                    <ul className="list-disc pl-7 text-[13px] text-zinc-500 dark:text-zinc-400 space-y-1">
                      <li><strong>No Registration</strong>: You can fully enjoy all features of this App without signing up or creating profiles.</li>
                      <li><strong>No Third-Party Tracker SDKs</strong>: We refuse to inject tracking, advertising, analytics, or behavioral telemetry SDKs.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-bold text-zinc-950 dark:text-white flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      2. On-Device Local Sandbox
                    </h3>
                    <p className="leading-relaxed pl-3 text-[13px] text-zinc-500 dark:text-zinc-400">
                      All your habits, daily check-ins, focus records, and logs are stored strictly in the secure localized sandbox of your current device (via IndexedDB / LocalStorage).
                    </p>
                    <ul className="list-disc pl-7 text-[13px] text-zinc-500 dark:text-zinc-400 space-y-1">
                      <li><strong>No Cloud Sync</strong>: We do not maintain any centralized databases or server instances. No data ever leaves your device.</li>
                      <li><strong>Sovereign Controls</strong>: You can permanently wipe or export your data at any moment using the "Clear Data" button in settings.</li>
                    </ul>
                  </section>

                  <section className="space-y-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      For any queries regarding our Zero-Data privacy model, please reach us at:
                      <span className="block mt-1 font-semibold text-zinc-500 dark:text-zinc-400">Email: jiao20220919@gmail.com</span>
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200"
                id="btn-confirm-privacy"
              >
                <Check className="h-4 w-4" />
                {lang === 'zh' ? '我知道了' : lang === 'ja' ? '確認しました' : 'Got it'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
