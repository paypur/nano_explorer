"use client"

import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    Colors,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getNodeWeights } from '@/functions/ServerFunctions';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Colors,
    Title,
    Tooltip,
);

export default function page() {

    const [dataset, setDataset] = useState([])

    useEffect(() => {
        const update = async () => {
            setDataset(await getNodeWeights())
        }
        update()
    }, [])

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                stacked: false
            }
        },
        interaction: {
            // mode: 'index' as const,
            // intersect: false,
        },

        maintainAspectRatio: true,
        parsing: {
            xAxisKey: 'time',
            yAxisKey: 'weight'
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
        <div className='border border-sky-600 rounded my-8'>
            <Line className='py-2 px-4' options={options} data={data}/>
        </div>
    )
}