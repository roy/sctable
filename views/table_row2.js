/*globals SCTable*/

SCTable.TableRowView2 = SC.View.extend(SC.Control, SC.Benchmark, {
  
  // PUBLIC PROPERTIES
  
  classNames: 'sctable-row-view',

  isMouseOver: NO,
  
  displayProperties: ['isMouseOver'],
  
  /*
    @read-only
  */
  tableDelegate: function() {
    return this.getPath('displayDelegate.tableDelegate');
  }.property('displayDelegate').cacheable(),
  
  // PUBLIC METHODS
  
  createChildViews: function() {
    this._updateColumns();
  },
    
  willDestroyLayer: function() {
    this.set('content', null);
  },

  prepareForReuse: function() {
    this.invokeOnce('_updateChildViews');
  },

  render: function(context, firstTime) {
    context = context.setClass('hover', this.get('isMouseOver'));

    if (firstTime || this._needsFullRender) {
      context = this.renderChildViews(context, YES);
    }
  },

  mouseEntered: function(evt) {
    this.set('isMouseOver', YES);
  },
  
  mouseExited: function(evt) {
    this.set('isMouseOver', NO);
  },
  
  // PRIVATE METHODS
  
  _updateChildViews: function() {
    var childViews = this.get('childViews');
    var i, len = childViews ? childViews.length : 0;
    var content = this.get('content');

    for (i = 0; i < len; i++) {
      childViews[i].set('content', content);
    }

    this._needsFullRender = YES;
    this.displayDidChange();
  },
  
  _updateColumns: function() {
    var columns = this.getPath('tableDelegate.columns');
    var childViews = [], content = this.get('content');
    var left = 0;
    
    if (columns && columns.isEnumerable) {
      columns.forEach(function(col, index) {
        var view, width = col.get('width');
        
        view = this.createChildView(SC.LabelView, {
          layout: { left: left, top: 0, bottom: 0, width: width },
          contentValueKey: col.get('valueKey')
        });
        view.set('content', content);
        childViews.push(view);
        
        left += width;
      }, this);
    }
    
    this.replaceAllChildren(childViews);
  },
  
  // PRIVATE PROPERTIES
  
  _needsFullRender: NO

});

SCTable.TableRowView2.mixin({
  isReusableInCollections: YES
});
