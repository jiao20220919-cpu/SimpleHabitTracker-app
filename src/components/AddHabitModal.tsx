/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { Habit, HabitCategory } from '../types';
import { HabitIcon } from './HabitIcon';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'archived'>) => void;
}

const CATEGORIES: { id: HabitCategory; label: string; icon: string }[] = [
  { id: 'health', label: '🏥 健康', icon: 'Heart' },
  { id: 'sport', label: '💪 运动', icon: 'Activity' },
  { id: 'mind', label: '🧘 心智', icon: 'Sparkles' },
  { id: 'work', label: '💼 工作', icon: 'Briefcase' },
  { id: 'custom', label: '✨ 自定义', icon: 'Smile' },
];

const COLORS = [
  { name: 'indigo', hex: '#6366f1', label: '靛蓝' },
  { name: 'emerald', hex: '#10b981', label: '翡绿' },
  { name: 'teal', hex: '#14b8a6', label: '青绿' },
  { name: 'amber', hex: '#f59e0b', label: '琥珀' },
  { name: 'rose', hex: '#f43f5e', label: '玫瑰' },
  { name: 'violet', hex: '#8b5cf6', label: '紫罗兰' },
];

const ICONS = [
  'Activity', 'Moon', 'Droplet', 'Sparkles', 'BookOpen', 'Brain', 
  'Coffee', 'Heart', 'Smile', 'Flame', 'Trophy', 'Sun'
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAddHabit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<HabitCategory>('health');
  const [selectedColor, setSelectedColor] = useState('indigo');
  const [selectedIcon, setSelectedIcon] = useState('Activity');
  const [error, setError] = useState('');

  // Reset inputs when open states change
  useEffect(() => {
    if (isOpen) {
      setName('');
      setCategory('health');
      setSelectedColor('indigo');
      setSelectedIcon('Activity');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('请输入习惯名称！');
      return;
    }
    if (name.length > 25) {
      setError('名称不能超过 25 个字符');
      return;
    }

    onAddHabit({
      name: name.trim(),
      category,
      color: selectedColor,
      icon: selectedIcon,
      frequency: 'daily',
    });

    onClose();
  };

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
            id="modal-overlay"
          />

          {/* Modal Card Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.38 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
            id="add-habit-modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500 fill-indigo-100 dark:fill-indigo-950" />
                新增习惯
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors"
                id="btn-close-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Input name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                  习惯名称
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="例如：早起跑步、每天喝水 2L..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  maxLength={25}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-950"
                  id="input-habit-name"
                />
                {error && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-rose-500 dark:text-rose-400 font-medium">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Category Select Chips */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  选择分类
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        category === cat.id
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700/80'
                      }`}
                      id={`btn-select-cat-${cat.id}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icons Grid Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  选择图标
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {ICONS.map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setSelectedIcon(ico)}
                      className={`flex h-11 items-center justify-center rounded-xl border transition-all ${
                        selectedIcon === ico
                          ? 'border-indigo-500 bg-indigo-50/50 text-indigo-600 dark:border-indigo-400 dark:bg-indigo-950/30 dark:text-indigo-400'
                          : 'border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 dark:border-zinc-800 dark:text-zinc-500 dark:hover:border-zinc-700 dark:hover:text-zinc-300'
                      }`}
                      id={`btn-select-icon-${ico}`}
                      title={ico}
                    >
                      <HabitIcon name={ico} className="h-5 w-5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Themes Circles Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
                  专属皮肤色
                </label>
                <div className="flex items-center gap-3">
                  {COLORS.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110`}
                      style={{ backgroundColor: col.hex }}
                      id={`btn-select-color-${col.name}`}
                      title={col.label}
                    >
                      {selectedColor === col.name && (
                        <motion.div
                          layoutId="activeColorBorder"
                          className="absolute -inset-1 rounded-full border-2 border-zinc-900 dark:border-white"
                          style={{ borderColor: col.hex }}
                        />
                      )}
                      {selectedColor === col.name && (
                        <span className="text-[10px] font-bold text-white drop-shadow-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl bg-zinc-50 border border-zinc-200 px-4.5 py-2.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700/80"
                  id="btn-cancel-modal"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-indigo-600 px-5.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  id="btn-submit-modal"
                >
                  确认创建
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
