(function($) {

  $.fn.categorycloud = function(options) {
    var opts = $.extend({}, $.fn.categorycloud.defaults, options);
    categoryWeights = this.map(function(){
      return $(this).attr("rel");
    });
    categoryWeights = jQuery.makeArray(categoryWeights).sort(compareWeights);
    lowest = categoryWeights[0];
    highest = categoryWeights.pop();
    range = highest - lowest;
    if(range === 0) {range = 1;}
    // Sizes
    if (opts.size) {
      fontIncr = (opts.size.end - opts.size.start)/range;
    }
    // Colors
    if (opts.color) {
      colorIncr = colorIncrement (opts.color, range);
    }
    return this.each(function() {
      weighting = $(this).attr("rel") - lowest;
      if (opts.size) {
        $(this).css({"font-size": opts.size.start + (weighting * fontIncr) + opts.size.unit});
      }
      if (opts.color) {
        $(this).css({"color": categoryColor(opts.color, colorIncr, weighting)});
      }
    });
  };

  $.fn.categorycloud.defaults = {
    size: {start: 14, end: 18, unit: "pt"}
  };

  // Converts hex to an RGB array
  function toRGB (code) {
    if (code.length == 4) {
      code = jQuery.map(/\w+/.exec(code), function(el) {return el + el; }).join("");
    }
    hex = /(\w{2})(\w{2})(\w{2})/.exec(code);
    return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
  }

  // Converts an RGB array to hex
  function toHex (ary) {
    return "#" + jQuery.map(ary, function(i) {
      hex =  i.toString(16);
      hex = (hex.length == 1) ? "0" + hex : hex;
      return hex;
    }).join("");
  }

  function colorIncrement (color, range) {
    return jQuery.map(toRGB(color.end), function(n, i) {
      return (n - toRGB(color.start)[i])/range;
    });
  }

  function categoryColor (color, increment, weighting) {
    rgb = jQuery.map(toRGB(color.start), function(n, i) {
      ref = Math.round(n + (increment[i] * weighting));
      if (ref > 255) {
        ref = 255;
      } else {
        if (ref < 0) {
          ref = 0;
        }
      }
      return ref;
    });
    return toHex(rgb);
  }

  function compareWeights(a, b)
  {
    return a - b;
  }

})(jQuery);
