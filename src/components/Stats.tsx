import { Award, Briefcase, TrendingUp, Clock } from "lucide-react";
import { stats } from "@/data/stats";

const statIcons = [Award, Briefcase, TrendingUp, Clock];

export default function Stats() {
  return (
    <section className="section-bg py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length];
            return (
              <div
                key={stat.label}
                className="glass glass-hover p-6 text-center"
              >
                <div className="icon-container mx-auto mb-3">
                  <Icon size={20} />
                </div>
                <div className="text-3xl md:text-4xl font-bold gold-gradient font-heading mb-2">
                  {stat.value}
                </div>
                <div className="text-white font-medium text-sm md:text-base">
                  {stat.label}
                </div>
                <div className="text-slate-400 text-xs mt-1 hidden md:block">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
