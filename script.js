var empty = "Empty container";
var itemCont = 0;
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

function edit_text (target) {
  currentSelection = target;
  $("#text-val").val(target.text());
}

function addBlock (target, name) {
  const blocks = {
    'text': '<div class="item text" type="text">Lorem Ipsum.</div>',
    'container': '<div class="item container p-3 connectedSortable empty" type="container">Empty container</div>'
  };

  var block = $(blocks[name]);

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

addBlock("#page", "text");
addBlock("#page", "container");
