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
    Tooltip
} from 'chart.js';
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
);

export default function Page() {

    const [dataset, setDataset] = useState<any[]>([])

    useAsyncEffect(async () => {
        setDataset(await getNodeWeights())
    }, [])

    ChartJS.defaults.color = '#f3f4f6';

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                stacked: false,
                border: {
                    color: '#f3f4f6'
                }
            },
            x: {
                border: {
                    color: '#f3f4f6'
                }
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
        },
    }

    const data = {
        datasets: dataset,
    };

    return (
        <div className='w-[85.25rem] my-8'>
            <Line className='py-2 px-4' options={options} data={data} />
        </div>
    )

}