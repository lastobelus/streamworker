function update_stream_worker_progress(total, success, errors){
  var bar = $("#stream-worker-progress");
  var bar_success = $("#stream-worker-progress .bar-success");
  var bar_error = $("#stream-worker-progress .bar-danger");

  bar_success.width(
    Math.floor(success*bar.width()/total)
  );
  bar_error.width(
    Math.floor(errors*bar.width()/total)
  );
}

function pauseStreamWorker(id, btn_id) {
  console.log("pauseStreamWorker id: " + id + " btn_id: " + btn_id);
  var pause_btn = pauseButton(id, btn_id);
  console.log('pause_btn:');
  console.log(pause_btn);
  var icon = pause_btn.find('i');
  //console.log('icon:');
  //console.log(icon);
  $("#stream_worker-modal .modal-footer").show();
  pause_btn.removeClass("disabled");
  pause_btn.data('event', 'resume');
  icon.removeClass("icon-spin");
  icon.removeClass("icon-pause");
  icon.removeClass("icon-refresh");
  icon.addClass("icon-play");
}

function resumeStreamWorker(id, btn_id) {
  //console.log("resumeStreamWorker id: " + id + " btn_id: " + btn_id);
  var pause_btn = pauseButton(id, btn_id);
  //console.log('pause_btn:');
  //console.log(pause_btn);
  var icon = pause_btn.find('i');
  //console.log('icon:');
  //console.log(icon);
  $("#stream_worker-modal .modal-footer").hide();
  pause_btn.removeClass("disabled");
  pause_btn.data('event', 'pause');
  icon.removeClass("icon-spin");
  icon.removeClass("icon-play");
  icon.removeClass("icon-refresh");
  icon.addClass("icon-pause");
}

// jquery $() returns set, so when we call this with (42, 42) or ('new', 'new') we
// just get the one button, and when we call with (42, 'new') we get the table
// button and the large button in the modal
function pauseButton(id, btn_id){
  return $("#stream_worker-pause-btn-"+ id).add("#stream_worker-pause-btn-"+ btn_id);
}

function enableModalPauseButton(id) {
  resumeStreamWorker('new', 'new');
  _enablePauseButton(id, 'new') ;
}

function disablePauseButton(id) {
  pauseButton(id, 'new').addClass("disabled");
}

function enablePauseButton(id) {
  _enablePauseButton(id, id) ;
}

function _enablePauseButton(id, btn_id) {
  //console.log("enablePauseButton id: " + id + " btn_id: " + btn_id);
  var pause_btn = pauseButton(btn_id, btn_id);
  pause_btn.on('click', function() {
    console.log("pause_btn click:");
    console.log($(this));
    var icon = $(this).find('i');
    $(this).addClass("disabled");
    icon.addClass("icon-spin");
    icon.addClass("icon-refresh");
    icon.removeClass("icon-pause");
    icon.removeClass("icon-play");
    $.ajax({
      url: "/metafield_exports/" + id + "/event",
      data: {"perform_event": $(this).data('event')},
      type: "PUT",
      dataType: "json",
      success: function (data) {
        console.log("pause_btn click: perform_event: success: "+data.state);
        switch(data.state) {
        case "paused":
        console.log('  call pauseStreamWorker')
        pauseStreamWorker(id, btn_id);
        break;
        case "created":
        case "initialized":
        case "processing":
        console.log('  call resumeStreamWorker')
        resumeStreamWorker(id, btn_id);
        $('#resume-metafield_export-form').get(0).setAttribute('action', '/metafield_exports/'+id)
        $('#resume-metafield_export-form').submit();
        break;
        }
      },
      error: function (xhr, status) {
        //console.log('perform_event: error: ' + status);
        //console.log(xhr);
      }
    })
  });
  pause_btn.removeClass("disabled");
}

function triggerModalPauseButton(id){
  console.log('triggerModalPauseButton '+id);
  var pause_btn = pauseButton('new', 'new');
  console.log(pause_btn);
  pause_btn.trigger('click');
}