Nebulr.Routers.Router = Backbone.Router.extend({
  initialize: function (options) {
    this.$rootEl = options.$rootEl;
    this.currentUserId = options.currentUserId;
    this.missions = new Nebulr.Collections.Missions();
    this.users = new Nebulr.Collections.Users();
  },

  routes: {
    '': 'missionIndex',
    'missions/new': 'missionNew',
    'missions/:id': 'missionShow',
    'users/:id': 'userShow'
  },

  missionNew: function () {
    var model = new Nebulr.Models.Mission();
    var view = new Nebulr.Views.MissionForm({
      model: model,
      currentUserId: this.currentUserId
    });
    this._swapView(view);
  },

  missionShow: function (id) {
    var model = this.missions.getOrFetch(id);
    var view = new Nebulr.Views.MissionShow({
      model: model,
      currentUserId: this.currentUserId
    });
    this._swapView(view);
  },

  missionIndex: function () {
    this.missions.fetch();
    var view = new Nebulr.Views.MissionIndex({
      collection: this.missions,
      itemSize: 4
    });
    this._swapView(view);
  },

  userShow: function (id) {
    var model = this.users.getOrFetch(id);
    var view = new Nebulr.Views.UserShow({
      model: model,
      currentUserId: this.currentUserId
    });
    this._swapView(view);
  },

  _swapView: function (view) {
    this._currentView && this._currentView.remove();
    this._currentView = view;
    this.$rootEl.html(view.render().$el);
  }
});
