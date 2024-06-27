import type { Chart, ChartType, Plugin } from "chart.js";

export const doughnutTotalTextPlugin: Plugin = {
    id: 'doughnutTotalTextPlugin',
    afterDraw: (chart) => {
        const width = chart.width;
        const height = chart.height;
        const fontSize = (height / 114).toFixed(2)
        chart.ctx.font = fontSize + "em Arial"
        chart.ctx.textBaseline = "middle"

        const total = getTotalFromChartDatasets(chart)

        const text = `${total}`;
        const textX = Math.round((width - chart.ctx.measureText(text).width) / 2)
        const textY = height / 2
        chart.ctx.fillText(text, textX, textY)
    },
}

export const htmlLegendPlugin: Plugin = {
    id: 'htmlLegend',
    afterUpdate: (chart, arg, options) => {
        const ul = getOrCreateLegendList(chart, options.container);

        if (!ul) {
            return null
        }

        // Remove old legend items
        while (ul.firstChild) {
            ul.firstChild.remove();
        }


        // Reuse the built-in legendItems generator
        const items = chart.options.plugins?.legend?.labels?.generateLabels?.(chart as Chart) || [];

        for (const item of items) {
            let text
            const li = document.createElement('li');
            li.style.alignItems = 'center';
            li.style.cursor = 'pointer';
            li.style.display = 'flex';
            li.style.flexDirection = 'row';

            li.onclick = () => {
                if (chart.config && 'type' in chart.config) {
                    const {type} = chart.config;

                    if (type === 'pie' || type === 'doughnut') {
                        // Pie and doughnut charts only have a single dataset and visibility is per item
                        if (item.index != null) {
                            chart.toggleDataVisibility(item.index);
                        }
                    } else {
                        if (item.datasetIndex != null) {
                            chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                        }
                    }
                }
                chart.update();
            };

            // Color box
            const boxSpan = document.createElement('span');
            if (typeof item.fillStyle === "string") {
                boxSpan.style.background = item.fillStyle;
            }
            if (typeof item.strokeStyle === "string") {
                boxSpan.style.borderColor = item.strokeStyle;
            }
            boxSpan.style.borderWidth = item.lineWidth + 'px';
            boxSpan.style.borderRadius = '50%'
            boxSpan.style.display = 'inline-block';
            boxSpan.style.flexShrink = '0';
            boxSpan.style.height = '12px';
            boxSpan.style.width = '12px';
            boxSpan.style.marginRight = '10px';

            // Text
            const textContainer = document.createElement('p');
            if (typeof item.fontColor === "string") {
                textContainer.style.color = item.fontColor;
            }
            textContainer.style.margin = '0';
            textContainer.style.padding = '0';
            textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

            if (item.index || item.index === 0) {
                const total = getTotalFromChartDatasets(chart);

                if (total && typeof total === 'number' && total !== 0) {
                    const percentage = getChartDatapointByIdx(item.index, chart) / total * 100;
                    text = document.createTextNode(`${item.text} (${percentage.toFixed(2)}%)`);
                } else {
                    text = document.createTextNode(`${item.text}`);
                }
            } else {
                text = document.createTextNode(item.text)
            }

            textContainer.appendChild(text);

            li.appendChild(boxSpan);
            li.appendChild(textContainer);
            ul.appendChild(li);
        }
    }
}

function getOrCreateLegendList(chart: Chart<ChartType>, id: string): HTMLUListElement | null {
    const legendContainer = document.getElementById(id);

    if (!legendContainer) {
        return null
    }

    let listContainer = legendContainer.querySelector('ul')

    if (!listContainer) {
        listContainer = document.createElement('ul')
        listContainer.style.display = 'flex'
        listContainer.style.flexDirection = 'column'
        listContainer.style.gap = '10px'
        listContainer.style.margin = '0'
        listContainer.style.padding = '0'

        legendContainer.appendChild(listContainer)
    }

    return listContainer
}


function getTotalFromChartDatasets(chart: Chart<ChartType>) {
    const datapoints =  chart.data.datasets[0].data

    return datapoints.reduce((total, datapoint) => {
        if (typeof total === 'number' && typeof datapoint === 'number') {
            return total + datapoint
        }

        return total
    }, 0)
}


function getChartDatapointByIdx(index: number, chart: Chart<ChartType>): number {
    const datapoints =  chart.data.datasets[0].data

    return datapoints[index] as number
}
