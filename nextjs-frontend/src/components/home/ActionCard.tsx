import React from 'react'

interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

export const ActionCard = ({ icon, title, subtitle }: ActionCardProps) => {
    return (
        <div className="backdrop-blur-md rounded-lg p-3 border transition-all shadow duration-300 hover:scale-105 hover:shadow-lg cursor-pointer group bg-white/40 border-white/30 text-gray-800 hover:bg-white/60 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/15">
            <div className="flex flex-col items-center space-y-1.5">
                <div className="p-1.5 rounded-md transition-all duration-300 group-hover:scale-110 bg-white/70 border border-white/40 dark:bg-white/10 dark:border-white/20">
                    <div className="w-4 h-4">
                        {icon}
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{subtitle}</p>
                </div>
            </div>
        </div>
    );
};

export default ActionCard