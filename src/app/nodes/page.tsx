"use client"

import { getNodeWeights } from '@/functions/ServerFunctions';
import {
    Chart as ChartJS,
    CategoryScale,
    Colors,
    Filler,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    TimeSeriesScale
} from 'chart.js';

import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

import { Line } from 'react-chartjs-2';
import { useState } from 'react';
import useAsyncEffect from "use-async-effect"

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Colors,
    Filler,
    Title,
    Tooltip,
    TimeSeriesScale,
);

export default function Page() {

    const [dataset, setDataset] = useState<any[]>([])

    useAsyncEffect(async () => {
        setDataset(await getNodeWeights())
        console.log(await dataset[0])
    }, [])

    ChartJS.defaults.color = '#f3f4f6';

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                border: {
                    color: '#f3f4f6'
                },
                stacked: true,
            },
            x: {
                adapters: {
                    date: {
                        locale: enUS
                    }
                },
                border: {
                    color: '#f3f4f6'
                },
                time: {
                    round: 'day'
                },
                type: 'timeseries',
            }
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        maintainAspectRatio: true,
        parsing: {
            xAxisKey: 'time',
            yAxisKey: 'rawWeight'
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                bodyFont: {
                    family: "consolas"
                }
            }
        },
    }

    const data = {
        datasets: dataset,
    };

    return (
        <div className='w-[85.25rem] my-8'>
            {/* @ts-expect-error Server Component */}
            <Line className='py-2 px-4' options={options} data={data} />
        </div>
    )

}