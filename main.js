import './style.css'
import * as d3 from "d3";

/////////TITLE///////////

d3.select('#app')
  .append('h1')
  .attr('id', 'title')
  .text('Doping in Professional Bicycle Racing');

d3.select('#app')
  .append('h2')
  .attr('id', 'subTitle')
  .text("35 Fastest times up Alpe d'Hue");

/////////REQ DATA & SVG//////////

const req = new XMLHttpRequest();
req.open("GET", 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);

  const windowWidth = window.innerWidth;

  const svg = d3.select('#app')
    .append('svg')
    .attr('id', 'scatterplot') /////////
    .attr('class', 'scatterplot')
    .attr('width', (d) => windowWidth > '1060' ? '1000' : windowWidth - 100) /////////////
    .attr('height', (d) => windowWidth > '1060' ? '500' : windowWidth / 2);  //////////////

  let w = document.querySelector('#scatterplot').getAttribute('width'); //////////

  let h = document.querySelector('#scatterplot').getAttribute('height'); //////////

  let padding = 60;

  const element = document.querySelector('#scatterplot')

  /////////AXES/////////

  let timeFormat = d3.timeFormat("%M:%S");

  const xScale = d3.scaleUtc()
    .domain([d3.min(json, (d) => new Date(d['Year'] - 1)), d3.max(json, (d) => new Date(d['Year'] + 1))])
    .range([padding, w - padding]);

  const yScale = d3.scaleUtc()
    .domain([d3.max(json, (d) => d3.timeParse('%M:%S')(d['Time'])), d3.min(json, (d) => d3.timeParse('%M:%S')(d['Time']))])
    .range([h - padding, padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

  svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr('id', 'x-axis')
    .call(xAxis);

  svg.append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .attr('id', 'y-axis')
    .call(yAxis);

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr('x', -(h / 2))
    .attr('y', padding / 2)
    .attr("dy", "-1em")
    .style("text-anchor", "middle")
    .text("Time in Minutes");

  /////////CIRCLE/////////

  svg.selectAll('circle')
    .data(json)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', '5')
    .attr('data-xvalue', (d) => new Date(d['Year'], 0))
    .attr('data-yvalue', (d) => d3.timeParse('%M:%S')(d['Time']))
    .attr('cx', (d) => xScale(d['Year']))
    .attr('cy', (d) => yScale(d3.timeParse('%M:%S')(d['Time'])))
    .attr('fill', (d) => d['Doping'] == "" ? '#4F709C' : '#FC7300')

  /////////TOOLTIP/////////

  d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .attr('style', 'position: absolute; opacity: 0;')
    .append('p')
    .attr('id', 'riderName')
    .attr('class', 'tooltip-text')
  d3.select('#tooltip')
    .append('p')
    .attr('id', 'date-time')
    .attr('class', 'tooltip-text')
  d3.select('#tooltip')
    .append('br')
  d3.select('#tooltip')
    .append('p')
    .attr('id', 'allegations')
    .attr('class', 'tooltip-text');

  d3.select('svg')
    .selectAll('circle')
    .data(json)
    .join('circle')

    .on('mouseover', function (d) {
      let rider = this[Object.keys(this)[0]]['Name'];
      let nationality = this[Object.keys(this)[0]]['Nationality'];
      let year = this[Object.keys(this)[0]]['Year'];
      let time = this[Object.keys(this)[0]]['Time'];
      let allegations = this[Object.keys(this)[0]]['Doping'];

      d3.select('#tooltip')
        .attr('data-year', (d) => this.getAttribute('data-xvalue'))
        .style('opacity', '1');
      d3.select('#riderName')
        .text(rider + ": " + nationality);
      d3.select('#date-time')
        .text("Year: " + year + ", Time: " + time);
      d3.select('#allegations')
        .text(allegations);
    })
    .on('mouseout', function (e) {
      d3.select('#tooltip')
        .style('opacity', 0);
    })
    .on('mousemove', function (e) {
      d3.select('#tooltip')
        .style('left', (e.clientX + 15) + 'px')
        .style('top', (e.clientY - 40) + 'px')
        .style('background', (d) => this[Object.keys(this)[0]]['Doping'] == "" ? '#4F709C' : '#FC7300');
    });
  /////////Legend//////////
  d3.select('#app').append("div")
    .attr("id", "legend")
    .style('right', (d) => windowWidth > '1060' ? padding + 'px' : '10px')
    .append('div')
    .attr('class', 'legendDiv');

  d3.select('.legendDiv')
    .append('div')
    .attr('class', 'legendDivTop');

  d3.select('.legendDiv')
    .append('div')
    .attr('class', 'legendDivBottom');

  d3.select('.legendDivTop')
    .append('span')
    .text('No Doping Allegations');

  d3.select('.legendDivTop')
    .append('div')
    .attr('class', 'withoutDope');

  d3.select('.legendDivBottom')
    .append('span')
    .text('Riders With Doping Allegations')

  d3.select('.legendDivBottom')
    .append('div')
    .attr('class', 'withDope')

};