class matrixVis {

    constructor(parentElement, famData, marrData, bizData){
        this.parentElement = parentElement;
        this.famData = famData;
        this.marrData = marrData;
        this.bizData = bizData;
        this.displayData = [];

        this.initVis()
    }


    initVis(){

        let vis = this;

        vis.babysvg = d3.select("#matrixLegend").append("svg")
            .attr("width", 300)
            .attr("height", 20);
        vis.babysvg.append('rect')
            .attr("height", 20)
            .attr("width", 20)
            .attr("fill", "DarkCyan");
        vis.babysvg.append("text")
            .text("Marriage Ties")
            .attr("stroke", "black")
            .attr("x", 25)
            .attr("y", 14);
        vis.babysvg.append('rect')
            .attr("height", 20)
            .attr("width", 20)
            .attr("x", 140)
            .attr("fill", "Coral")
        vis.babysvg.append("text")
            .text("Business Ties")
            .attr("stroke", "black")
            .attr("x", 165)
            .attr("y", 14);

        vis.margin = {top: 0, right: 20, bottom: 20, left: 20};
       // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.width = 800;
        vis.height = 600;

        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.cellHeight = 20;
        vis.cellWidth = 20;
        vis.cellPadding = 10;

        // Make data structure

        for (let i = 0; i < this.famData.length; i++) {

            vis.displayData.push(
                {
                    index: i,
                    name: this.famData[i].Family,
                    wealth: this.famData[i].Wealth,
                    priorates: this.famData[i].Priorates,
                    marriageSum: this.marrData[i].reduce(function(a, b){ return a + b; }, 0),
                    marriageArray: this.marrData[i],
                    businessSum: this.bizData[i].reduce(function(a, b){ return a + b; }, 0),
                    businessValues: this.bizData[i],
                    relationships: this.marrData[i].reduce(function(a, b){ return a + b; }, 0) + this.bizData[i].reduce(function(a, b){ return a + b; }, 0)
                })
        }

        // Column names, fixed

        vis.cols = vis.svg.selectAll("g.col-name")
            .data(vis.displayData)
            .enter()
            .append("g")
            .attr("class", "col-name")
            .attr('transform', (d) => (`translate (${135 + vis.margin.left + d.index*(vis.cellHeight + vis.cellPadding)}, ${vis.margin.left + 80}) rotate (-90)`))

        vis.names_x = vis.cols.append("text")
            .merge(vis.cols)
            .text((d) => d.name)
            .attr("class", "fam-names-x")
            .attr("stroke", "black")
            .attr("x", 0)
            .attr("y", 0);

        // Create rows

        vis.rows = vis.svg.selectAll("g.matrix-row")
            .data(vis.displayData, function(d) { return d.index; });

        vis.rows.enter()
            .append("g")
            .merge(vis.rows)
            .attr("class", "matrix-row")
            .attr('transform', (d, i) => (`translate (${vis.margin.left}, ${110 + vis.margin.left + i*(vis.cellHeight + vis.cellPadding)})`));

        this.wrangleData();

    }

    wrangleData() {

        let vis = this;

        // Sort!!

        if (selectedCategory === "index"){
            vis.displayData = vis.displayData.sort((a,b) => {return a[selectedCategory] - b[selectedCategory]});
        } else {
            vis.displayData = vis.displayData.sort((a,b) => {return b[selectedCategory] - a[selectedCategory]});
        }

        //vis.displayData = vis.displayData.sort((a,b) => {return b[selectedCategory] - a[selectedCategory]})

        console.log(vis.displayData);

        this.updateVis();
    }

    updateVis() {

        let vis = this;

        // Bind and merge rows to sorted data

        vis.rows = vis.svg.selectAll("g.matrix-row")
            .data(vis.displayData, function(d) { return d.index; });

        vis.rows.enter()
            .append("g")
            .merge(vis.rows)
            .attr("class", "matrix-row")
            .style("opacity", 0.5)
            .transition()
            .duration(800)
            .attr('transform', (d, i) => (`translate (${vis.margin.left}, ${110 + vis.margin.left + i*(vis.cellHeight + vis.cellPadding)})`))
            .style("opacity", 1)

        vis.names = vis.rows.append("text")
            .merge(vis.rows)
            .text((d) => d.name)
            .attr("class", "fam-names-y")
            .attr("stroke", "black")
            .attr("x", 0)
            .attr("y", 0);

        // Draw triangles

        vis.marrCells = vis.rows
            .selectAll('.marr-tri')
            .data(d => d.marriageArray)
            .enter()
            .append("path")
            .attr("class", "triangle-path")
            .attr("fill", function(d) { return (d === 1 ? "DarkCyan" : "lightgray"); });

        vis.bizCells = vis.rows
            .selectAll('.marr-tri-2')
            .data(d => d.businessValues)
            .enter()
            .append("path")
            .attr("class", "triangle-path-2")
            .attr("fill", function(d) { return (d === 1 ? "Coral" : "lightgray"); });


        vis.marrCells.attr("d", function(d, index) {

            let x = 120 + (vis.cellWidth + vis.cellPadding) * index;
            let y = -15;

            return 'M ' + x +' '+ y + ' l ' + vis.cellWidth + ' 0 l 0 ' + vis.cellHeight + ' z';
        });


        vis.bizCells.attr("d", function(d, index) {

            let x = 120 + (vis.cellWidth + vis.cellPadding) * index;
            let y = -15;

            return 'M ' + x +' '+ y + ' l 0 ' + vis.cellWidth + ' l' + vis.cellHeight + ' 0 z';
        });


    }
}