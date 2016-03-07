jQuery(function($) {
  window.multiView = null;
  window.explorerDiv = $('.data-explorer-here');

  // create the demo dataset
  var dataset = createDemoDataset();
  // now create the multiview
  // this is rather more elaborate than the minimum as we configure the
  // MultiView in various ways (see function below)
  window.multiview = createMultiView(dataset);
});

// create standard demo dataset
function createDemoDataset() {
  var dataset = new recline.Model.Dataset({
  url: 'data/explorer.csv',
  backend: 'csv',
  // delimiter: ',',
  // quotechar: '"',
  // encoding: 'utf8'
});

// remember this is async so if you want to do something you need to call it in done method e.g.
// dataset.fetch.done(function(dataset) { console.log(dataset.recordCount)});
dataset.fetch();

  return dataset;
}

// make MultivView
//
// creation / initialization in a function so we can call it again and again
var createMultiView = function(dataset, state) {
  // remove existing multiview if present
  var reload = false;
  if (window.multiView) {
    window.multiView.remove();
    window.multiView = null;
    reload = true;
  }

  var $el = $('<div />');
  $el.appendTo(window.explorerDiv);

  // customize the subviews for the MultiView
  var views = [
    {
      id: 'grid',
      label: 'Grid',
      view: new recline.View.SlickGrid({
        model: dataset,
        state: {
          gridOptions: {
            editable: true,
            // Enable support for row add
            enabledAddRow: true,
            // Enable support for row delete
            enabledDelRow: true,
            // Enable support for row ReOrder 
            enableReOrderRow:true,
            autoEdit: false,
            enableCellNavigation: true
          },
          columnsEditor: [
            { column: 'date', editor: Slick.Editors.Date },
            { column: 'sometext', editor: Slick.Editors.Text }
          ]
        }
      })
    },
    {
      id: 'graph',
      label: 'Graph',
      view: new recline.View.Graph({
        model: dataset

      })
    },
    {
      id: 'map',
      label: 'Map',
      view: new recline.View.Map({
        model: dataset
      })
    }
  ];

  var multiView = new recline.View.MultiView({
    model: dataset,
    el: $el,
    state: state,
    views: views
  });
  return multiView;
}