/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Trophy, Trash2, Archive, Check, Sparkles } from 'lucide-react';
import { Habit } from '../types';
import { calculateStreaks, getColorClasses, getLocalDateString, DayItem } from '../utils';
import { HabitIcon } from './HabitIcon';

interface HabitCardProps {
  habit: Habit;
  days: DayItem[];
  onToggleDate: (habitId: string, dateString: string) => void;
  onDelete: (habitId: string) => void;
  onToggleArchive: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  days,
  onToggleDate,
  onDelete,
  onToggleArchive,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { currentStreak, longestStreak } = calculateStreaks(habit.completedDates);
  const colorSchema = getColorClasses(habit.color);
  const todayStr = getLocalDateString();
  const isCompletedToday = habit.completedDates.includes(todayStr);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 md:p-6 bg-white dark:bg-zinc-900 ${
        isCompletedToday
          ? 'shadow-sm border-zinc-200 dark:border-zinc-800'
          : 'shadow-md shadow-zinc-100/50 dark:shadow-none border-zinc-150 dark:border-zinc-800/80'
      }`}
      id={`habit-card-${habit.id}`}
    >
      {/* Background Glow accent */}
      {isCompletedToday && (
        <div className={`absolute -right-12 -top-12 h-24 w-24 rounded-full blur-2xl opacity-12 ${colorSchema.bg}`} />
      )}

      {/* Main Row: Header Info */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Animated App Icon Wrapper */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${colorSchema.bg} ${colorSchema.text} border ${colorSchema.border}`}
          >
            <HabitIcon name={habit.icon} className="h-6 w-6" />
          </motion.div>

          <div>
            <h3 className="font-sans text-[17px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
              {habit.name}
              {isCompletedToday && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex text-amber-500"
                  title="今日已打卡"
                >
                  <Sparkles className="h-4 w-4 fill-current" />
                </motion.span>
              )}
            </h3>
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {habit.category === 'health' && '🏥 健康'}
              {habit.category === 'sport' && '💪 运动'}
              {habit.category === 'mind' && '🧘 心智'}
              {habit.category === 'work' && '💼 工作'}
              {habit.category === 'custom' && '✨ 自定义'}
            </span>
          </div>
        </div>

        {/* Small Utility Menu Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggleArchive(habit.id)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600 dark:text-zinc-500 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-300 transition-colors"
            title={habit.archived ? "取消归档" : "归档习惯"}
            id={`btn-archive-${habit.id}`}
          >
            <Archive className="h-4.5 w-4.5" />
          </button>
          
          {showConfirmDelete ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onDelete(habit.id)}
                className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400"
                id={`btn-confirm-delete-${habit.id}`}
              >
                确认
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="rounded-lg bg-zinc-50 px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400"
                id={`btn-cancel-delete-${habit.id}`}
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-500 dark:text-zinc-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
              title="删除习惯"
              id={`btn-delete-${habit.id}`}
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4.5 flex flex-wrap items-center gap-4 border-t border-b border-zinc-100 dark:border-zinc-800/80 py-3 text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-500">
            <Flame className="h-4 w-4 fill-current" />
          </div>
          <div>
            <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 leading-none">当前连续</div>
            <div className="text-[13px] font-bold font-mono text-zinc-800 dark:text-zinc-200">{currentStreak} 天</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/20 text-violet-500">
            <Trophy className="h-4 w-4 fill-current" />
          </div>
          <div>
            <div className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 leading-none">历史最高</div>
            <div className="text-[13px] font-bold font-mono text-zinc-800 dark:text-zinc-200">{longestStreak} 天</div>
          </div>
        </div>

        {/* Completion rate */}
        <div className="ml-auto text-right">
          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 block leading-none">打卡率</span>
          <span className="text-[13px] font-bold font-mono text-zinc-800 dark:text-zinc-200">
            {habit.completedDates.length > 0 
              ? `${Math.round((habit.completedDates.length / 30) * 100)}%`
              : '0%'
            }
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal ml-0.5">/30天</span>
          </span>
        </div>
      </div>

      {/* Week Grid checklist */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-400 dark:text-zinc-500">
          <span>最近打卡记录 (本周)</span>
          <span>{habit.completedDates.length} 次总打卡</span>
        </div>
        
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const isCompleted = habit.completedDates.includes(day.dateString);
            
            return (
              <div key={day.dateString} className="flex flex-col items-center">
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-1.5 font-medium">
                  {day.dayName}
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleDate(habit.id, day.dateString)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
                    isCompleted
                      ? `${colorSchema.accentBg} text-white border-transparent shadow`
                      : day.isToday
                        ? `${colorSchema.text} ${colorSchema.bg} border-2 ${colorSchema.border}`
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-600 bg-transparent'
                  }`}
                  id={`btn-day-${habit.id}-${day.dateString}`}
                  title={`${day.dateString} ${isCompleted ? '已打卡' : '点击打卡'}`}
                >
                  {isCompleted ? (
                    <Check className="h-4.5 w-4.5 stroke-[3]" />
                  ) : (
                    <span className={`text-[12px] font-mono font-semibold ${day.isToday ? 'font-bold' : ''}`}>
                      {day.dayNumber}
                    </span>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
