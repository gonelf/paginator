var empty = "Empty container";

function emptyContainers () {
  $(".container").each(function(item) {
    if($(this).html() == "") {
      $(this).addClass("empty");
      $(this).html(empty);
    }
  });
}
function identify (target) {
  if($("#page").find('div.identify').length == 0) {
    const p = target.position();
    const top = p.top-25;
    const label = "<div class='identify' style='position: absolute; top: "+top+"px; left: "+p.left+"'>"+target.attr('type')+"</div>";
    $("#page").append(label);
  }
}

function edit (target) {
  $("#edit-"+target.attr('type')).show();
  if (target.attr('type') == "text") {
    edit_text(target);
  }
}

function slider (name, min, max, step, init_value, target_id) {
  var a = '<div class="form-group">'+
    '<label for="customRange3">'+name+'</label>'+
    '<input type="range" attr="'+name+'" parent="'+target_id+'" class="custom-range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+init_value+'" id="customRange3">'+
  '</div>';
  console.log(a);
  return a;
}

function px_to_em(value) {
  return parseFloat(value) / 16;
}

function em_to_px (value) {
  return value * 16;
}

function edit_text (target) {
  currentSelection = target;
  $("#text-val").val(target.text());
  var slide_attributes = ["font-size", "letter-spacing"];
  slide_attributes.forEach((item, i) => {
    $("#edit-text-components").append(slider(item, 0, 5, 0.25, px_to_em(target.css(item)), target.attr('id')));
  });

}

var itemCount = 1;
function addBlock (target, name) {
  const blocks = {
    'text': '<div id="###" class="item text" type="text">Lorem Ipsum.</div>',
    'container': '<div id="###" class="item container p-3 connectedSortable empty" type="container">Empty container</div>'
  };

  var block = $(blocks[name].replace("###", name+"_"+itemCount));
  itemCount++;

  if (name == "container") {
    block.droppable(droppableOptions);
    block.sortable(sortableOptions);
  }

  $(target).append(block);
}

$(".control").click(function(){
  addBlock("#page", this.id);
});
var currentSelection = null;

$("div").on('click', '.item', function(e){
  e.preventDefault();
  e.stopPropagation();
  $(".item").removeClass('selected');
  $(this).addClass('selected');
  edit($(this));
});

$("div").on('mouseover', '.item', function(e){
  $(this).addClass('hover');
  identify($(this));
});

$("div").on('mouseleave', '.item', function(e){
  $(this).removeClass('hover');
  $(".identify").remove();
});

// sortable
var placeholder;
var prev_container;

var sortableOptions = {
  // helper: 'clone',
  placeholder: "sort",
  connectWith: ".container",
  start: function (e, ui) {
    ui.item.show();
    placeholder = ui.item.clone().removeClass("connectedSortable")
    .removeClass("ui-droppable").removeClass("ui-sortable")
    .removeClass("ui-sortable-handle");
    ui.item.after(placeholder).hide();
  },
  stop: function(event, ui) {
    placeholder.remove();
    setTimeout(function () {
      emptyContainers();
    }, 10);

    if(dropped_container.hasClass("empty")) {
      dropped_container.removeClass("empty");
      var html = dropped_container.html();
      dropped_container.html(html.replace(empty, ""));
    }
  },
  helper: function() { return '<p></p>'; }
};
$(".container").sortable(sortableOptions);

var droppableOptions = {
    drop:function(event,ui){
      dropped_container = $(this);
    }
};
$(".container").sortable(sortableOptions);

// edit
// text
$("#text-val").on("change paste keyup", function () {
  currentSelection.text($(this).val());
});

// sliders
$(document).on("input", ".custom-range", function(){
  var i = $(this);
  $("#"+i.attr("parent")).css(i.attr("attr"), em_to_px(i.val())+"px");
})

addBlock("#page", "text");
addBlock("#page", "container");
