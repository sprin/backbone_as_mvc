//== Edit ==
// Represents replacement text for an arbitrary DOM element
//
// Has attributes:
// `path` - the path to the element
//  Storing path allows the Notes to be serialized
// independent of the document being annotated.
// `text` - the text to be inserted into the element
window.Edit = Backbone.Model.extend({

});

//== EditList Collection ==
window.EditList = Backbone.Collection.extend({

  model: Edit

});

$(document).ready(function() {

  window.EditView = Backbone.View.extend({

    events: {
      'click': function() { this.trigger('log') }
    },

    initialize: function() {
      this.tr = this.options.tr;
      _.bindAll(this, 'render');
      // Bindings

      // Re-render on changes to the Edit.
      this.tr.on('change', this.render);
    },

    // Render
    render: function() {
      this.$el.html(
        this.tr.get('text')
      );
    }

  });

  window.EditController = Backbone.View.extend({

    initialize: function() {
      this.tr = this.options.tr;
      this.el = this.options.el;
      this.tr_view = new EditView({
        tr: this.tr,
        el: this.el
      });

      // Bindings
      this.tr_view.on('log', this.log);
    },

    log: function() {
      console.log(this.tr.cid + ': ' + this.tr.get('path'));
    }
  });
    
  window.EditListController = Backbone.View.extend({
    
    initialize: function() {
      var tr_list = this.tr_list = new EditList(),
          tr_con_list = this.tr_con_list = [];
      $('p').each(function() {
        tr = new Edit({
          path: $(this).getPath()
        });
        tr_list.add(tr);
        tr_con_list.push(
          new EditController({
            tr: tr,
            el: this
          })
        );
      });
    }
  });
});

jQuery.fn.getPath = function () {
    if (this.length != 1) throw 'Requires one element.';

    var path, node = this;
    while (node.length) {
        var realNode = node[0], name = realNode.localName;
        if (!name) break;
        name = name.toLowerCase();

        var parent = node.parent();

        var siblings = parent.children(name);
        if (siblings.length > 1) { 
            name += ':eq(' + siblings.index(realNode) + ')';
        }

        path = name + (path ? '>' + path : '');
        node = parent;
    }

    return path;
};

