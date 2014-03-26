var Bracket = (function() {
  var pairing_template = '\
    <li class="bracket_pairing pairing_{pairing}">\
      <ul>\
        <li class="bracket_item bracket_item_top bracket_pairing_{pairing}" \
            data-pairing="{pairing}" data-bracket="{bracket}" data-value="{first.value}">\
          {first.name}\
        </li>\
        <li class="bracket_item bracket_item_bottom" \
            data-pairing="{pairing}" data-bracket="{bracket}" data-value="{second.value}">\
          {second.name}\
        </li>\
      </ul>\
    </li>\
  ';
  var bracket_template = '<div class="bracket_container"> \
    {#data}\
      <ul class="bracket_section bracket_{$idx}">\
        {#data bracket=$idx}\
          {>bracket_pairing pairing=$idx /}\
        {/data}\
      </ul>\
    {/data}\
  </div>\
  <button type="button" class="reset">Try Again</button>\
  ';
  var compiled_pairing = dust.compile(pairing_template, 'bracket_pairing');
  dust.loadSource(compiled_pairing);
  var compiled_bracket = dust.compile(bracket_template, 'bracket');
  dust.loadSource(compiled_bracket);


  var Constructor = function(spreadsheet_id, selector, proxy) {
    var bracket = new Bracket;
    bracket.spreadsheet_id = spreadsheet_id;
    bracket.element = jQuery(selector);
    $.when(bracket.load()).done(function() {
      bracket.reset();
    });
    return bracket;
  };

  var Bracket = function() {
    return {
      load: function() {
        var self = this;
        var promise = new $.Deferred();
        var options = {
          key: this.spreadsheet_id,
          callback: function(data) {
            data = data.Sheet1.elements;
            for (var i = 0; i < data.length; i++) {
              data[i].name = data[i].makemodel;
              data[i].value = parseFloat(data[i].comb08u, 10);
            }
            self.raw_data = data;

            promise.resolve();
          },
        }
        if (this.proxy) {
          options.proxy = this.proxy;
        }
        Tabletop.init(options); 
        
        //REMOVE ME
        /*
        this.raw_data = [
          { name: '1', value: 1, },
          { name: '2', value: 2, },
          { name: '3', value: 3, },
          { name: '4', value: 4, },
          { name: '5', value: 5, },
          { name: '6', value: 6, },
          { name: '7', value: 7, },
          { name: '8', value: 8, },
          { name: '9', value: 9, },
          { name: '10', value: 10, },
          { name: '11', value: 11, },
          { name: '12', value: 12, },
          { name: '13', value: 13, },
          { name: '14', value: 14, },
          { name: '15', value: 15, },
          { name: '16', value: 16, },
        ];
        promise.resolve();
        //END REMOVE ME
        */

        return promise;

      },
      reset: function() {
        var self = this;
        this.randomize_data_order();
        this.organize_data();

        $.when(this.create()).done(function() {
          self.bind();
        });
      },
      create: function() {
        var self = this;
        this.correct = 0;
        this.answered = 0;
        var promise = new $.Deferred();
        dust.render('bracket', this, function(err, out) {
          self.element.html(out);
          self.element.find('.bracket_item').hide();
          self.element.find('.bracket_0 .bracket_item').show();
          self.element.find('.bracket_8 .bracket_item').show();
          promise.resolve();
        });
        return promise;
      },
      randomize_data_order: function() {
        var current_index = this.raw_data.length

        while (0 !== current_index) {
          var random_index = Math.floor(Math.random() * current_index);
          current_index -= 1;

          var temporary_value = this.raw_data[current_index];
          this.raw_data[current_index] = this.raw_data[random_index];
          this.raw_data[random_index] = temporary_value;

        }
      },
      organize_data: function() {
        this.data = [
        ];

        var first_round = sorting_loop(this.raw_data);
        var second_round = sorting_loop(first_round.next);
        var third_round = sorting_loop(second_round.next);
        var fourth_round = sorting_loop(third_round.next);
        var final_round = sorting_loop(fourth_round.next);

        this.data.push({data: first_round.left});
        this.data.push({data: second_round.left});
        this.data.push({data: third_round.left});
        this.data.push({data: fourth_round.left});
        this.data.push({data: final_round.left});
        this.data.push({data: fourth_round.right});
        this.data.push({data: third_round.right});
        this.data.push({data: second_round.right});
        this.data.push({data: first_round.right});
      },
      bind: function() {
        var self = this;
        this.element.find('.reset').click(function() {
          self.reset();
        });
        this.element.find('.bracket_item').click(function(event) {
          var is_right = true;
          var clicked = $(event.target);
          var correct_val = parseInt(clicked.attr('data-value'), 10);
          clicked.parent().find('li').each(function() {
            $(this).unbind('click');
            if (parseInt($(this).attr('data-value')) > correct_val) {
              is_right = false;
              correct_val = parseInt($(this).attr('data-value'), 10);
            }
          });
          clicked.addClass(is_right ? 'right' : 'wrong');
          if (is_right) { self.correct++; }

          var bracket;
          var this_bracket = parseInt(clicked.attr('data-bracket'), 10);
          var final_bracket = parseInt(self.data.length, 10) / 2
          if (this_bracket > final_bracket) { //is on the right
            bracket = this_bracket - 1; //move toward center
          } else if (this_bracket < final_bracket) { //is on the left
            bracket = this_bracket + 1; //move toward center
          }

          if (bracket) {
            var pairing = Math.floor(clicked.attr('data-pairing') / 2);
            self.element.find('.bracket_' + bracket + 
              ' .pairing_' + pairing + ' li'
            ).each(function() {
              if (parseInt($(this).attr('data-value'), 10) === correct_val) {
                $(this).show();
              }
            })

            self.answered++;
            if (self.answered + 1 === self.raw_data.length) { //all questions answered
              self.finished();
            }
          }
        });
      },
      finished: function() {
        alert ( 'You got ' + this.correct + ' correct!');
      },

    };
  };

  var sorting_loop = function(values) {
    var push_to = first_array = [];
    var second_array = [];
    var next_round = [];
    for (var i = 0; i < values.length; i++) {

      var set = { first: values[i], second: values[i+1] };
      if (values[i].value > values[i+1].value) {
        set.first.winner = true;
        next_round.push(values[i]);
      } else {
        set.second.winner = true;
        next_round.push(values[i+1]);
      }

      if (i >= values.length / 2) {
        push_to = second_array;
      }
      push_to.push(set)

      i++;
    }
    return { left: first_array, right: second_array, next: next_round };
  };

  return Constructor;
})()
