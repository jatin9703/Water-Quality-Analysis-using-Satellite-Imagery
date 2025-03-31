import { useContext, useEffect } from "react";
import * as d3 from "d3";
import { CoordinateContext } from "@/app/context/coordinateContext";

const AreaGraph = ({ data }) => {
    const { activeSection, analysisOptions } = useContext(CoordinateContext);

    let margin = {};
    let graphWidth;
    let graphHeight;
    let fontSize;
    let graphTitleFontSize;
    let graphTitlePosition;
    let graphTitle;

    let xAxisParameter;
    let yAxisParameter;

    let xAxisLabel;
    let yAxisLabel;

    let parsedData;

    useEffect(() => {
        if (!data || Object.keys(data).length === 0) return;

        // Clear previous SVG
        d3.select("#area-graph-container").select("svg").remove();

        xAxisParameter = analysisOptions.xAxisParameter;
        yAxisParameter = analysisOptions.yAxisParameter;

        let xAxisLabel = xAxisParameter;
        let yAxisLabel = yAxisParameter;

        if (activeSection === "analysis") {
            margin = { top: 100, right: 30, bottom: 105, left: 75 };
            graphWidth = 1180;
            graphHeight = 600;
            fontSize = "16px";
            graphTitleFontSize = "20px";
            graphTitlePosition = -10;
        } else {
            margin = { top: 45, right: 10, bottom: 85, left: 65 };
            graphWidth = 580;
            graphHeight = 350;
            fontSize = "14px";
            graphTitleFontSize = "17px";
            graphTitlePosition = 5;
        }

        switch (xAxisParameter) {
            case 'Temperature':
                xAxisParameter = 'TEMP';
                break;
            case 'Chemical Oxygen Demand (COD)':
                xAxisParameter = 'COD';
                break;
            case 'Biological Oxygen Demand (BOD)':
                xAxisParameter = 'BOD';
                break;
            case 'Dissolved Oxygen (DO)':
                xAxisParameter = 'DO';
                break;
            case 'Fecal Coliform (FC)':
                xAxisParameter = 'FC';
                break;
            case 'Nitrate':
                xAxisParameter = 'NT';
                break;
            default:
                // Keep xAxisParameter unchanged if no match
                break;
        }
        
        switch (yAxisParameter) {
            case 'Temperature':
                yAxisParameter = 'TEMP';
                break;
            case 'Chemical Oxygen Demand (COD)':
                yAxisParameter = 'COD';
                break;
            case 'Biological Oxygen Demand (BOD)':
                yAxisParameter = 'BOD';
                break;
            case 'Dissolved Oxygen (DO)':
                yAxisParameter = 'DO';
                break;
            case 'Fecal Coliform (FC)':
                yAxisParameter = 'FC';
                break;
            case 'Nitrate':
                xAxisParameter = 'NT';
                break;
            default:
                // Keep yAxisParameter unchanged if no match
                break;
        }

        if (xAxisParameter === 'Date Range') {
            parsedData = Object.entries(data)
                .filter(([_, values]) => values[yAxisParameter] !== undefined) // Filter out undefined values
                .map(([category, values]) => ({
                    category: category,
                    value: values[yAxisParameter]
                }));
        } else {
            parsedData = Object.entries(data)
                .filter(([_, values]) => values[yAxisParameter] !== undefined) // Filter out undefined values
                .map(([_, values]) => ({
                    category: values[xAxisParameter],
                    value: values[yAxisParameter]
                }));
        }

        if (xAxisLabel === 'Temperature') {
            xAxisLabel = 'Temperature (°C)';
        }
        if (yAxisLabel === 'Temperature') {
            yAxisLabel = 'Temperature (°C)';
        }

        if (xAxisParameter === 'Date Range') {
            graphTitle = `Temporal Analysis of ${yAxisLabel} Levels`;

        } else {
            graphTitle = `${xAxisLabel} vs ${yAxisLabel}`;
        }

        const width = graphWidth - margin.left - margin.right;
        const height = graphHeight - margin.top - margin.bottom;

        // Create SVG container
        const svg = d3
            .select("#area-graph-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Set up scales
        const x = d3.scaleBand()
            .domain(parsedData.map(d => d.category))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(parsedData, d => d.value)])
            .nice()
            .range([height, 0]);

        // Define the area generator
        const area = d3.area()
            .x(d => x(d.category) + x.bandwidth() / 2)
            .y0(height)
            .y1(d => y(d.value))
            .curve(d3.curveMonotoneX);

        // Append area path
        svg.append("path")
            .datum(parsedData)
            .attr("fill", "#FFAA00")
            .attr("stroke", "#36A4BE")
            .attr("stroke-width", 2)
            .attr("d", area)
            .style("opacity", 1);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        svg.append("g").call(d3.axisLeft(y));

        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 15)
            .attr("fill", "#cccccc")
            .attr("font-size", fontSize)
            .attr("font-weight", "bold")
            .text(xAxisLabel);

        // Add Y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 25)
            .attr("fill", "#cccccc")
            .attr("font-size", fontSize)
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-90)")
            .text(yAxisLabel);

        // Add graph title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2 + graphTitlePosition)
            .attr("text-anchor", "middle")
            .attr("fill", "#FFFFFF")
            .attr("font-size", graphTitleFontSize)
            .attr("font-weight", "bold")
            .text(graphTitle);

        // Tooltip setup
        const tooltip = d3.select("body")
            .append("div")
            .style("position", "absolute")
            .style("background", "#1F1F1F")
            .style("color", "#FFFFFF")
            .style("border", "1px solid #444")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.5)");

        // Add circles for hover detection
        svg.selectAll(".data-point")
            .data(parsedData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.category) + x.bandwidth() / 2)
            .attr("cy", d => y(d.value))
            .attr("r", 6) // Size for easier hover
            .attr("fill", "transparent") // Invisible but interactive
            .attr("stroke", "#36A4BE")
            .attr("stroke-width", 2)
            .on("mouseover", (event, d) => {
                tooltip
                    .style("opacity", 1)
                    .html(`<span>${xAxisParameter}: ${d.category}<br>${yAxisParameter}: ${d.value}${yAxisParameter === 'TEMP' ? '°C' : ''}</span>`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 30}px`);
            })
            .on("mouseout", () => {
                tooltip.style("opacity", 0);
            });

            // if(activeSection=='analysis'){
            //     svg.selectAll(".value-label")
            //     .data(parsedData)
            //     .enter()
            //     .append("text")
            //     .attr("x", d => x(d.category) + x.bandwidth() / 2)
            //     .attr("y", d => y(d.value) - 15) // Position slightly above circle
            //     .attr("text-anchor", "middle")
            //     .attr("fill", "#FFFFFF")
            //     .attr("font-size", "14px")
            //     .attr("font-weight", "bold")
            //     .text(d => d.value);
            // }


    }, [data, analysisOptions, activeSection]);

    return null;
};

export default AreaGraph;
