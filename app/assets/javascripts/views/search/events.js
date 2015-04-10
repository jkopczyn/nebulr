Nebulr.Views.EventMapShow = Backbone.View.extend({
  attributes: {
    id: "map-canvas"
  },

  initialize: function (options) {
    this._markers = {};
    this.otherFilterData = options.otherFilterData;
    this.listenTo(this.collection, 'add', this.addMarker);
    this.listenTo(this.collection, 'remove', this.removeMarker);
  },

  render: function () {
    var mapOptions = {
      center: { lat: 37.7833, lng: -122.4167},
      zoom: 12
    };

    this._map = new google.maps.Map(this.el, mapOptions);

    this.collection.each(this.addMarker.bind(this));
    this.attachMapListeners();
  },

  attachMapListeners: function () {
    google.maps.event.addListener(this._map, 'idle', this.search.bind(this));
    // google.maps.event.addListener(this._map, 'click', this.createListing.bind(this));
  },

  // Event handlers
  addMarker: function (mission) {
    if (this._markers[mission.id]) { return; }
    var view = this;

    var latLng = new google.maps.LatLng(
      mission.get('latitude'),
      mission.get('longitude')
    );

    var marker = new google.maps.Marker({
      position: latLng,
      map: this._map,
      title: mission.get('title')
    });

    google.maps.event.addListener(marker, 'click', function (event) {
      view.showMarkerInfo(event, marker);
    });

    this._markers[mission.id] = marker;
  },

  // createListing: function (event) {
  //   var latitude = event.latLng.latitude();
  //   var longitutde = event.latLng.longitude();
  //   var mission = new Nebulr.Models.Mission({
  //     latitude: latitude,
  //     longitutde: longitutde
  //   });
  //
  //   mission.save({}, {
  //     success: function () {
  //       this.collection.add(mission);
  //     }.bind(this)
  //   });
  // },

  updateOtherFilterData: function () {

  },

  search: function () {
    // This method will re-fetch the map's collection, using the
    // map's current bounds as constraints on latitude/longitude.

    var mapBounds = this._map.getBounds();
    var ne = mapBounds.getNorthEast();
    var sw = mapBounds.getSouthWest();

    var filterData = {
      min_lat: sw.lat(), max_lat: ne.lat(),
      min_lng: sw.lng(), max_lng: ne.lng()
    };

    this.collection.fetch({
      data: { search: $.extend(filterData, this.otherFilterData) }
    });
  },

  removeMarker: function (mission) {
    var marker = this._markers[mission.id];
    marker.setMap(null);
    delete this._markers[mission.id];
  },

  showMarkerInfo: function (event, marker) {
    // This event will be triggered when a marker is clicked. Right now it simply
    // opens an info window with the title of the marker. However, you could get
    // fancier if you wanted (maybe use a template for the content of the window?)

    var infoWindow = new google.maps.InfoWindow({
      content: marker.title
    });

    infoWindow.open(this._map, marker);
  },

  startBounce: function (id) {
    var marker = this._markers[id];
    marker.setAnimation(google.maps.Animation.BOUNCE);
    },

  stopBounce: function (id) {
    var marker = this._markers[id];
    marker.setAnimation(null);
  }
});