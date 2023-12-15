"use client"

import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    Colors,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    LineOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartData } from '@/constants/Types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Colors,
    Title,
    Tooltip,
);

export default function LineChart(props: {dataFunction: any, options: LineOptions}) {

    const [dataset, setDataset] = useState<ChartData[]>([])

    useEffect(() => {
        const update = async () => {
            setDataset(await props.dataFunction())
        }
        update()
    }, [])

    const data = {
        datasets: dataset,
    };

    return (
        <>
            <div className='border border-sky-600 rounded my-8 w-[72rem]'>
                <Line className='py-2 px-4' options={props.options} data={data}/>
            </div>
        </>
    )
}