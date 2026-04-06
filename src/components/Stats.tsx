import { Award, Briefcase, TrendingUp, Clock } from "lucide-react";
import { stats } from "@/data/stats";
import HighlightCard from "@/components/HighlightCard";

const statIcons = [Award, Briefcase, TrendingUp, Clock];

export default function Stats() {
  return (
    <section className="section-bg py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => {
            const Icon = statIcons[index % statIcons.length];
            return (
              <HighlightCard key={stat.label}>
                <div className="glass glass-hover p-4 md:p-6 text-center">
                  <div className="icon-container mx-auto mb-2 md:mb-3">
                    <Icon size={20} />
                  </div>
                  <div className="text-2xl md:text-4xl font-bold gold-gradient font-heading mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-white font-medium text-xs md:text-base">
                    {stat.label}
                  </div>
                  <div className="text-slate-400 text-xs mt-1 hidden md:block">
                    {stat.description}
                  </div>
                </div>
              </HighlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
