import { useState, useEffect, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { fetchAnalyticsData, type AnalyticsData } from '../data/mockAnalytics';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface TooltipPayload {
    dataKey: string;
    color: string;
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

interface LegendPayload {
    value: string;
    id: string;
    dataKey: string;
    color: string;
}

interface CustomLegendProps {
    payload?: LegendPayload[];
}

const CustomTooltip = ({ active , payload , label }: CustomTooltipProps) => {
    if (active && payload && payload.length > 0 && label) {
        const getDisplayName = (dataKey: string) => {
            switch (dataKey) {
                case 'productivity' : return 'Productivity (%)';
                case 'momentum' : return 'Task Momentum';
                case 'members' : return 'Active Member';
                default: return dataKey;
            }
        };

        return (
            <div className='bg-white dark:bg-brand-navy border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg min-w-[150px]'>
                <p className='text-gray-500 dark:text-gray-400 font-medium mb-2 border-b border-gray-100 dark:border-gray-800 pb-1 text-center'>{label}</p>
                {payload.map((entry , index) => (
                    <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1.5">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-gray-700 dark:text-gray-300">{getDisplayName(entry.dataKey)}</span>
                        </div>
                        <span className="font-bold ml-4" style={{ color: entry.color }}>
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null
};

const CustomLegend = ({ payload }: CustomLegendProps) => {
    
    const legendInfo: Record<string, { title: string; desc: string }> = {
        productivity: { title: 'Productivity', desc: 'เปอร์เซ็นต์ความคืบหน้าของงานในแต่ละชั่วโมง' },
        momentum: { title: 'Task Momentum', desc: 'อัตราส่วนงานที่เสร็จ หักลบด้วยงานที่งอกใหม่' },
        members: { title: 'Active Members', desc: 'จำนวนคนในทีมที่กำลังออนไลน์ในขณะนั้น' }
    };

    return (
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 md:mt-6">
          {payload?.map((entry, index) => {
            const info = legendInfo[entry.dataKey];
            return (
              <div key={index} className="relative flex items-center gap-2 group cursor-help hover:bg-brand-blue-hover/10 dark:hover:bg-brand-grey-border/7 rounded-full p-2">
                
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {info?.title || entry.value}
                </span>
                
                {/* กล่อง Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 text-center shadow-xl pointer-events-none">
                  {info?.desc}

                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>

                </div>
    
              </div>
            );
          })}
        </div>
      );
    
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData[]>([]);
    const [isLoading , setIsLoading] = useState(true);

    const [isExporting, setIsExporting] = useState(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const result = await fetchAnalyticsData();
            setData(result);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const handleExportPDF = async () => {
        const input = pdfRef.current;
        if (!input) return;

        try {
            setIsExporting(true);

            const dataUrl = await toPng(input, {
                quality: 1.0,
                pixelRatio: 2,
                backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#f8fafc', 
            });

            // สร้างไฟล์ PDF แนวนอน
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfPageHeight = pdf.internal.pageSize.getHeight();
            
            // คำนวณความสูงรูป
            const imgProps = pdf.getImageProperties(dataUrl);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            if (document.documentElement.classList.contains('dark')) {
                pdf.setFillColor('#0f172a');
                pdf.rect(0, 0, pdfWidth, pdfPageHeight, 'F');
            } else {
                pdf.setFillColor('#f8fafc');
                pdf.rect(0, 0, pdfWidth, pdfPageHeight, 'F');
            }

            const yPos = (pdfPageHeight - imgHeight) / 2;

            pdf.addImage(dataUrl, 'PNG', 0, yPos, pdfWidth, imgHeight);
            pdf.save('TaskFlow-Analytics.pdf');

        } catch (error) {
            console.error("Error exporting PDF:", error);
            alert("เกิดข้อผิดพลาดในการ Export PDF ครับ");
        } finally {
            setIsExporting(false);
        }
    };

    const customLegendPayload = [
        { value: 'Productivity', id: 'productivity', dataKey: 'productivity', color: '#10b981' },
        { value: 'Task Momentum', id: 'momentum', dataKey: 'momentum', color: '#f59e0b' },
        { value: 'Active Members', id: 'members', dataKey: 'members', color: '#3b82f6' }
    ];

    return (
        <div className="flex flex-col min-h-full gap-6" >

            {/* Header */}
            <div className='flex items-center justify-start mt-2'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
                        Team Productivity & Workload Overview
                    </h2>
                    <p className='text-status-gray-text mt-1 text-sm pt-1 hidden md:block'>
                        Monitor team performance, task momentum, and active members over the last 24 hours.
                    </p>
                </div>
            </div>

            <div className='flex justify-end md:pr-6'>
                <button
                    onClick={handleExportPDF}
                    disabled={isLoading || isExporting}
                    className='flex items-center justify-center gap-2 bg-white dark:bg-brand-blue/60 border border-brand-grey-border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-blue-900/60 text-brand-purple dark:text-brand-grey-border px-4 py-2 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 cursor-pointer hover:scale-[1.02] focus:scale-100 w-full md:w-40 shrink-0'
                >
                    {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18}/>}
                    <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
                </button>
            </div>

            {/* Graph */}
            <div className='flex-1 bg-white dark:bg-brand-navy rounded-2xl border border-brand-grey-border dark:border-gray-800 p-4 md:p-6 shadow-sm min-h-[450px] max-h-fit' ref={pdfRef}>
                <h3 className='text-gray-500 dark:text-gray-400 font-medium mb-6'>Daily Graph</h3>

                {isLoading ? (
                    <div className='h-[350px] w-full flex flex-col items-center justify-center text-brand-blue'>
                        <Loader2 className="animate-spin mb-4" size={40} />
                        <p className="text-status-gray-text font-medium animate-pulse">Fetching analytics data...</p>
                    </div>
                ) : (
                    <>
                        <div className='w-full overflow-x-auto pb-4 scrollbar-hide'>
                            <div className='h-[350px] min-w-[750px] w-full'>
                                <ResponsiveContainer width="100%" height="100%">

                                    <AreaChart data={data} margin={{ top:10 , right: 10 , left: 0 , bottom: 0 }}>

                                        <defs>
                                            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid strokeDasharray="3 3" vertical={false} className='dark:stroke-gray-500 stroke-brand-grey-text' />

                                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10}/>

                                        <YAxis yAxisId="blue" orientation="left" domain={[0, 10]} ticks={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#3b82f6', fontSize: 12 }} width={30} />
                                        <YAxis yAxisId="yellow" orientation="left" domain={[-100, 100]} ticks={[-100, 100]} axisLine={false} tickLine={false} tick={{ fill: '#f59e0b', fontSize: 12 }} width={40} />
                                        <YAxis yAxisId="green" orientation="left" domain={[0, 100]} ticks={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#10b981', fontSize: 12 }} width={35} />

                                        <ReferenceLine y={0} yAxisId="yellow" stroke="#e5e7eb" className="dark:stroke-gray-700" />

                                        <Tooltip content={<CustomTooltip />} />

                                        <Area yAxisId="green" type="monotone" dataKey="productivity" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGreen)" dot={{ r: 3, fillOpacity: 1 }} activeDot={{ r: 6 }} />
                                        <Area yAxisId="yellow" type="monotone" dataKey="momentum" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorYellow)" dot={{ r: 3, fillOpacity: 1 }} activeDot={{ r: 6 }} />
                                        <Area yAxisId="blue" type="monotone" dataKey="members" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorBlue)" dot={{ r: 3, fillOpacity: 1 }} activeDot={{ r: 6 }} />
                                    
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <CustomLegend payload={customLegendPayload} />
                    </>
                )}

            </div>
        </div>
    );
};