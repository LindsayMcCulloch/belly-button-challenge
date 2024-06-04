// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Filter the metadata for the object with the desired sample number
 metadata = data.metadata.filter(obj => obj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
 panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
Object.entries(metadata).forEach(([key, value]) => {
  panel.append("p").text(`${key}: ${value}`);
});
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

  //Filter sample data
  sampleData = data.samples.filter(obj => obj.id == sample)[0];

    // Get the top ten samples
    // Filter the samples for the object with the desired sample number
    // Get the otu_ids, otu_labels, and sample_values
  otu_ids = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  otu_labels = sampleData.otu_labels.slice(0, 10).reverse();
    sample_values = sampleData.sample_values.slice(0, 10).reverse();

    // Build a Bubble Chart
    bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      yaxis: { title: "Number of Bacteria" },
      xaxis: { title: "OTU ID" },
      margin: { t: 50, b: 50 },
      hovermode: "closest"
    };

    bubbleData = [{
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      text: sampleData.otu_labels,
      mode: "markers",
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: "Earth"
      }
    }];

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    barData = [{
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    }];

    barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      yaxis: { title: "OTU ID" },
      margin: { t: 30, l: 150 }
    };


    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdownMenu.append("option").text(sample).property("value", sample);
    });


    // Get the first sample from the list
    firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialise the dashboard
init();