import { useContext, useEffect } from "react";
import * as d3 from "d3";
import { CoordinateContext } from "@/app/context/coordinateContext";

const ScatterPlot = ({ data }) => {
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

        // Clear any previous SVG
        d3.select("#scatter-plot-container").select("svg").remove();

        xAxisParameter = analysisOptions.xAxisParameter;
        yAxisParameter = analysisOptions.yAxisParameter;

        xAxisLabel = xAxisParameter;
        yAxisLabel = yAxisParameter;

        if (activeSection === 'analysis') {
            margin = { top: 100, right: 30, bottom: 105, left: 75 };
            graphWidth = 1180;
            graphHeight = 600;
            fontSize = '16px';
            graphTitleFontSize = '20px';
            graphTitlePosition = -10;
        } else {
            margin = { top: 45, right: 10, bottom: 85, left: 65 };
            graphWidth = 580;
            graphHeight = 350;
            fontSize = '14px';
            graphTitleFontSize = '17px';
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
            .filter(([_,values])=>values[yAxisParameter]!==undefined)   
            .map(([category, values]) => ({
                x: new Date (category), // Convert date to a Date object
                y: values[yAxisParameter]
            }));
        } else {
            parsedData = Object.entries(data)
            .filter(([_,values])=>values[yAxisParameter]!==undefined)   
            .map(([_, values]) => ({
                x: values[xAxisParameter],
                y: values[yAxisParameter]
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
            .select("#scatter-plot-container")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

// Set up scales
const x = xAxisParameter === 'Date Range'
    ? d3.scaleTime()
        .domain(d3.extent(parsedData, d => d.x)) // Time scale for dates
        .range([0, width])
    : d3.scaleLinear()
        .domain([d3.min(parsedData, d => d.x), d3.max(parsedData, d => d.x)])
        .range([0, width]);

const y = d3.scaleLinear()
    .domain([d3.min(parsedData, d => d.y), d3.max(parsedData, d => d.y)])
    .nice()
    .range([height, 0]);

// Add X axis with formatted dates
const xAxis = d3.axisBottom(x)
    .ticks(5) // Adjust the number of ticks if needed
    .tickFormat(d3.timeFormat("%Y-%m-%d")); // Format ticks as 'yyyy-mm-dd'

svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

        // Add X axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 15) // Adjust positioning
            .attr("fill", "#cccccc")
            .attr("font-size", fontSize)
            .attr("font-weight", "bold")
            .text(xAxisLabel);

        // Add Y axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 25) // Adjust positioning
            .attr("fill", "#cccccc")
            .attr("font-size", fontSize)
            .attr("font-weight", "bold")
            .attr("transform", "rotate(-90)") // Rotate for Y-axis
            .text(yAxisLabel);

        // Add scatter plot points
        svg.selectAll(".dot")
            .data(parsedData)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 5) // Radius of the dots
            .attr("fill", "#FFAA00")  // Fill color
            .attr("stroke", "#36A4BE") // Border color
            .attr("stroke-width", 2);  // Border thickness

        // Add graph title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2 + graphTitlePosition) // Position above the graph
            .attr("text-anchor", "middle")
            .attr("fill", "#FFFFFF") // Title color
            .attr("font-size", graphTitleFontSize) // Title font size
            .attr("font-weight", "bold") // Bold title
            .text(graphTitle);

        // Create tooltip
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

// Add hover functionality with tooltip
svg.selectAll(".dot")
    .on("mouseover", (event, d) => {
        let formattedDate = '';
        if (xAxisParameter === 'Date Range') {
            // Format the date to 'yyyy-mm-dd'
            const date = new Date(d.x);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }

        tooltip
            .style("opacity", 1)
            .html(`<span>${xAxisParameter}: ${xAxisParameter === 'Date Range' ? formattedDate : d.x}<br>${yAxisParameter}: ${d.y}${yAxisParameter === 'TEMP' ? '°C' : ''}</span>`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 30}px`)
            .style("font-size", "14px");  // Added font size
    })
    .on("mouseout", () => {
        tooltip.style("opacity", 0);
    });

        console.log(parsedData);

    }, [data, analysisOptions, activeSection]);

    return null;
};

export default ScatterPlot;