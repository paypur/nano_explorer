"use client"

import { getNodeWeightsAdress } from '@/serverFunctions/MongoDB';

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
import { cache, useState } from 'react';
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

export default function RepresentativeWeightGraph(props: { nanoAddress: string }) {

    const [dataset, setDataset] = useState<any[]>([])

    // TODO: doesnt work
    const getData = cache(async (a: string) => { return await getNodeWeightsAdress(a) })

    useAsyncEffect(async () => {
        setDataset(await getData(props.nanoAddress))
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
                ticks: {
                    autoSkip: false,
                    maxTicksLimit: 12
                }
            }
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        maintainAspectRatio: false,
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
        <div className='w-[42rem] h-[176px]'>
            {/* @ts-expect-error Server Component */}
            <Line options={options} data={data} />
        </div>
    )

}