/** VERSION: 1.0.0 Please do not delete this line. Thank you! **/
// Override Settings
var boostPFSInstantSearchConfig = {
	search: {
		//suggestionMode: 'test',
		//suggestionPosition: 'left'
    suggestionMobileStyle: 'style2'
	}
};

(function() {
	BoostPFS.inject(this);

	// Customize style of Suggestion box
	SearchInput.prototype.customizeInstantSearch = function() {
		var suggestionElement = this.$uiMenuElement;
		var searchElement = this.$element;
		var searchBoxId = this.id;
	};

  // Bind Event for input search Mobile
  var bindEventsMobile = InstantSearchMobile.prototype.bindEvents;
  InstantSearchMobile.prototype.bindEvents = function() {
    bindEventsMobile.call(this);

    var self = this;
    var searchButtonMobile = '.site-nav--mobile .search-button, .js-search-destop';
    var searchInputMobile = '.search-input-group input[type="search"], .wg-search-form .search-input';
    var searchCloseButtonMobile = '.drawer__close > button, .drawer_back a';
    jQ(searchButtonMobile).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputMobile).focus();
      self.openSuggestionMobile();
      jQ(searchCloseButtonMobile).trigger('click');

    });
  }
  
  // Bind Event for input search style 3
  var bindEvents = InstantSearchStyle3.prototype.bindEvents;
  InstantSearchStyle3.prototype.bindEvents = function() {
    bindEvents.call(this);

    var self = this;
    var searchButtonDesktop = '.site-header__links .search-button';
    var searchInputDesktop = '#SearchContainer #search-input';
    var searchCloseButtonDesktop = '.drawer__close > button';
    jQ(searchButtonDesktop).off('click').click(function(e) {
      e.preventDefault();
      //e.stopPropagation();
      jQ(searchInputDesktop).focus();
      self.openSuggestionStyle3();
      jQ(searchCloseButtonDesktop).trigger('click');

    });
  }

  // Fix search for the Flow theme
  jQ('.site-header__links .search-button').on('click', function() {
    setTimeout(function() {
      boostPFS.initSearchBox();
      if(Utils.isCollectionPage()) jQ('.search-input-group > .boost-pfs-search-box').val('');
    }, 500);
  });

})();