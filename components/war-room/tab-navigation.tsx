import { 
  Briefcase, 
  Users, 
  Wallet, 
  Archive, 
  LayoutGrid 
} from "lucide-react";
import { motion } from "framer-motion";

export type TabId = "ops" | "intel" | "treasury" | "archives";

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: "ops", label: "OPS", icon: Briefcase, color: "text-blue-400" },
    { id: "intel", label: "INTEL", icon: Users, color: "text-emerald-400" },
    { id: "treasury", label: "TREASURY", icon: Wallet, color: "text-amber-400" },
    { id: "archives", label: "ARCHIVES", icon: Archive, color: "text-purple-400" },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b border-cyan-500/20 pb-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as TabId)}
            className={`group relative flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all hover:bg-cyan-500/10 ${
              isActive ? "text-cyan-50" : "text-cyan-500/60"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg border border-cyan-500/30 bg-cyan-500/10"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <Icon className={`relative z-10 h-4 w-4 ${isActive ? tab.color : ""}`} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
