define([
  'dojo/_base/declare',
  "dojo/_base/array",
   'dojo/_base/lang',
   "dojo/on",
  'jimu/BaseWidget'
], function(
  declare,
  array,
  lang,
  on,
  BaseWidget
) {

  var clazz = declare([BaseWidget], {
    //these two properties are defined in the BaseWiget
    baseClass: 'google-analytics',
    name: 'GoogleAnalytics',

    // add additional properties here

    postCreate: function () {
        console.log("Init Google Analytics")
        // This starts the google analytics code (do not delete)
        eval(this.config.code)
        // Event
        ga('send', 'event', 'Widget', 'Google Analytics', 'postCreate');




      // summary:
      //      Overrides method of same name in dijit._Widget.
      // tags:
      //      private
      this.inherited(arguments);
      console.log('GoogleAnalytics::postCreate', arguments);

      // add additional post constructor logic here
    },

    // start up child widgets
    startup: function() {
      // summary:
      //      Overrides method of same name in dijit._Widget.
      // tags:
      //      private
      this.inherited(arguments);
      console.log('GoogleAnalytics::startup', arguments);
    
      
      // On click
      on(this.map, "click", lang.hitch(this, function (event) {
          ga('send', 'event', 'Map', 'click', 'x:'+ event.x + " y:" + event.y);

      }));

      // On Double click
      on(this.map, "dbl-click", lang.hitch(this, function (event) {
          ga('send', 'event', 'Map', 'dbl-click', 'x:' + event.x + " y:" + event.y);

      }));

      // On Extent Change
      on(this.map, "extent-change", lang.hitch(this, function (event) {
          ga('send', 'event', 'Map', 'extent-change', 'delta [x,y]:[' + event.delta.x + "," + event.delta.y + "], extent[xmax,xmin,ymax,ymin]: [" + event.extent.xmax + "," + event.extent.xmin + "," + event.extent.ymax + "," + event.extent.ymin + "] levelChange:" + event.levelChange + " lod[level,scale]: [" +  event.lod.level + "," + event.lod.scale + "]");

      }));

        //Log Layers in the map
      array.forEach(this.map.layerIds, lang.hitch(this, function (id) {
          var layer = this.map.getLayer(id);
          ga('send', 'event', 'Layers', layer.id, layer.url);
      }));

        // Track New Layers 
      on(this.map, "layer-add", lang.hitch(this, function (event) {
          var layer = event.layer
          ga('send', 'event', 'Map', 'layer-add', 'id:' + layer.id + " url:" + layer.url);

      }));


        // Track Removed Layers 
      on(this.map, "layer-remove", lang.hitch(this, function (event) {
          var layer = event.layer
          ga('send', 'event', 'Map', 'layer-remove', 'id:' + layer.id + " url:" + layer.url);

      }));

        // On pan
      on(this.map, "pan", lang.hitch(this, function (event) {
          ga('send', 'event', 'Map', 'pan', 'delta [x,y]:[' + event.delta.x + "," + event.delta.y + "], extent[xmax,xmin,ymax,ymin]: [" + event.extent.xmax + "," + event.extent.xmin + "," + event.extent.ymax + "," + event.extent.ymin + "]");

      }));

        // On Zoom
      on(this.map, "zoom", lang.hitch(this, function (event) {
          ga('send', 'event', 'Map', 'zoom', 'anchor [x,y]:[' + event.x + "," + event.y + "], extent[xmax,xmin,ymax,ymin]: [" + event.extent.xmax + "," + event.extent.xmin + "," + event.extent.ymax + "," + event.extent.ymin + "]" + " zoomFactor: " +event.zoomFactor);

      }));

    },

    onOpen: function () {
   
      //  console.log("Init Google Analytics")
      //  eval(this.config.code)
      //  ga('send', 'event', 'Widget - Google Analytics', 'open');

      //console.log('GoogleAnalytics::onOpen', arguments);

      // add code to execute whenever the widget is opened
    },

    onClose: function() {
      // summary:
      //      Overrides method of same name in jimu._BaseWidget.
      console.log('GoogleAnalytics::onClose', arguments);

      // add code to execute whenever the widget is closed
    }
  });

  return clazz;
});