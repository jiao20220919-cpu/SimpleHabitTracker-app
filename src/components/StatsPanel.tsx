/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Flame, CheckCircle, Percent, Trophy } from 'lucide-react';
import { Habit, HabitCategory } from '../types';
import { calculateStreaks, getLocalDateString } from '../utils';

interface StatsPanelProps {
  habits: Habit[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ habits }) => {
  const activeHabits = habits.filter(h => !h.archived);
  const totalActive = activeHabits.length;
  const todayStr = getLocalDateString();
  
  const completedToday = activeHabits.filter(h => h.completedDates.includes(todayStr)).length;
  const completionRate = totalActive > 0 ? Math.round((completedToday / totalActive) * 100) : 0;

  // Calculate highest current streak and total active habit streak days
  let highestStreak = 0;
  let totalCheckins = 0;

  activeHabits.forEach(h => {
    const { currentStreak } = calculateStreaks(h.completedDates);
    if (currentStreak > highestStreak) {
      highestStreak = currentStreak;
    }
    totalCheckins += h.completedDates.length;
  });

  const categories: { id: HabitCategory; label: string; color: string }[] = [
    { id: 'health', label: '🏥 健康', color: 'bg-indigo-500 dark:bg-indigo-400' },
    { id: 'sport', label: '💪 运动', color: 'bg-emerald-500 dark:bg-emerald-400' },
    { id: 'mind', label: '🧘 心智', color: 'bg-amber-500 dark:bg-amber-400' },
    { id: 'work', label: '💼 工作', color: 'bg-rose-500 dark:bg-rose-400' },
    { id: 'custom', label: '✨ 自定义', color: 'bg-violet-500 dark:bg-violet-400' },
  ];

  const categoryStats = categories.map(cat => {
    const catHabits = activeHabits.filter(h => h.category === cat.id);
    const count = catHabits.length;
    let rate = 0;
    if (count > 0) {
      const totalRate = catHabits.reduce((acc, h) => {
        const hRate = Math.min(100, Math.round((h.completedDates.length / 30) * 100));
        return acc + hRate;
      }, 0);
      rate = Math.round(totalRate / count);
    }
    return { ...cat, count, rate };
  });

  // Calculate annual contribution heatmap data (53 weeks * 7 days = 371 days)
  const today = new Date();
  const startOfGrid = new Date(today);
  // Go back 52 weeks (364 days)
  startOfGrid.setDate(today.getDate() - 364);
  const startDayOfWeek = startOfGrid.getDay(); // 0 is Sunday
  // Align to Sunday of that start week
  startOfGrid.setDate(startOfGrid.getDate() - startDayOfWeek);

  const gridDays: { dateString: string; count: number; label: string }[] = [];
  const tempDate = new Date(startOfGrid);

  for (let i = 0; i < 371; i++) {
    const dateStr = getLocalDateString(tempDate);
    let completedCount = 0;
    activeHabits.forEach(h => {
      if (h.completedDates.includes(dateStr)) {
        completedCount++;
      }
    });

    const formattedLabel = `${tempDate.getFullYear()}年${tempDate.getMonth() + 1}月${tempDate.getDate()}日`;
    const label = `${formattedLabel} · 打卡 ${completedCount} 项习惯`;

    gridDays.push({
      dateString: dateStr,
      count: completedCount,
      label,
    });

    tempDate.setDate(tempDate.getDate() + 1);
  }

  // Get intensity color scale
  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200/20';
    if (totalActive === 0) return 'bg-emerald-400';
    const ratio = count / totalActive;
    if (ratio <= 0.25) return 'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/10';
    if (ratio <= 0.5) return 'bg-emerald-300 dark:bg-emerald-800/40';
    if (ratio <= 0.75) return 'bg-emerald-500 dark:bg-emerald-600/70';
    return 'bg-emerald-600 dark:bg-emerald-400';
  };

  return (
    <div className="space-y-4" id="stats-panel-wrapper">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" id="stats-panel">
        {/* Metric 1: Today's Completion Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-4 rounded-2xl border border-zinc-150 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
          id="stat-today-completion"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">今日打卡进度</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <h4 className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-100">{completedToday}</h4>
              <span className="text-sm font-semibold text-zinc-400">/ {totalActive} 个习惯</span>
            </div>
            {/* Micro Progress Bar */}
            <div className="mt-2.5 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-indigo-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Metric 2: Streak Level */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 rounded-2xl border border-zinc-150 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
          id="stat-highest-streak"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-400">
            <Flame className="h-6 w-6 fill-current" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">最佳连续纪录</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <h4 className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-100">{highestStreak}</h4>
              <span className="text-sm font-semibold text-zinc-400">天</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">持续坚守，星光不问赶路人</p>
          </div>
        </motion.div>

        {/* Metric 3: Total Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-4 rounded-2xl border border-zinc-150 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
          id="stat-total-checkins"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">总累计打卡次数</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <h4 className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-100">{totalCheckins}</h4>
              <span className="text-sm font-semibold text-zinc-400">次</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">点滴积累，见证更好的自己</p>
          </div>
        </motion.div>
      </div>

      {/* Category breakdown stats list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-zinc-150 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900"
        id="category-stats-breakdown"
      >
        <div className="flex items-center justify-between mb-3.5">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            分类习惯打卡表现（30天平均）
          </h5>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">相对饱和度</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-6">
          {categoryStats.map((stat) => (
            <div key={stat.id} className="space-y-1.5" id={`category-stat-${stat.id}`}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-650 dark:text-zinc-300 flex items-center gap-1">
                  {stat.label}
                  <span className="text-[10px] font-normal text-zinc-400 dark:text-zinc-500">({stat.count})</span>
                </span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200">{stat.rate}%</span>
              </div>
              
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.rate}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${stat.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Annual Contribution Graph Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-zinc-150 bg-white p-5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900 overflow-hidden"
        id="annual-heatmap-panel"
      >
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
            <span>📅 年度习惯打卡活跃度</span>
            <span className="text-[10px] font-normal text-zinc-400 dark:text-zinc-500">(过去 53 周)</span>
          </h5>
          <div className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            <span>少</span>
            <div className="h-2 w-2 rounded-[1.5px] bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-250/25" />
            <div className="h-2 w-2 rounded-[1.5px] bg-emerald-100 dark:bg-emerald-950/40" />
            <div className="h-2 w-2 rounded-[1.5px] bg-emerald-300 dark:bg-emerald-800/40" />
            <div className="h-2 w-2 rounded-[1.5px] bg-emerald-500" />
            <div className="h-2 w-2 rounded-[1.5px] bg-emerald-600 dark:bg-emerald-400" />
            <span>多</span>
          </div>
        </div>

        {/* Heatmap Layout with horizontal scroll */}
        <div className="overflow-x-auto pb-1 -mx-2 px-2 scrollbar-thin">
          <div className="flex gap-1 min-w-[640px] items-start">
            {/* Week Labels Column aligned with rows */}
            <div className="grid grid-rows-7 gap-[2.5px] text-[8px] text-zinc-400 dark:text-zinc-500 font-bold pr-2 h-[75px] select-none text-right shrink-0">
              <span>日</span>
              <span />
              <span>二</span>
              <span />
              <span>四</span>
              <span />
              <span>六</span>
            </div>

            {/* Grid Days Columns (flows vertically with vertical grid-flow-col) */}
            <div className="grid grid-flow-col grid-rows-7 gap-[2.5px] flex-1 h-[75px]">
              {gridDays.map((day, idx) => (
                <div
                  key={`${day.dateString}-${idx}`}
                  className={`h-20 w-20 rounded-[1.5px] transition-all hover:scale-125 duration-100 cursor-help ${getIntensityColor(day.count)}`}
                  style={{ width: '8.5px', height: '8.5px' }}
                  title={day.label}
                  id={`heatmap-cell-${idx}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
