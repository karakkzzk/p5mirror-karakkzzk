//
function ui_init() {
  //
  my.effectBtn = ui_createButton('Effect');
  my.effectBtn.mousePressed(effect_action);

  my.takeBtn = ui_createButton('Take');
  my.takeBtn.mousePressed(take_action);

  my.removeBtn = ui_createButton('Remove');
  my.removeBtn.mousePressed(remove_action);

  my.showBtn = ui_createButton('Show');
  my.showBtn.mousePressed(show_action);

  my.photo_count_span = createSpan('' + my.photo_list.length);

  my.gallery_div = ui_div_empty('igallery');
}

function effect_action() {
  my.slit_scan = !my.slit_scan;
}

async function take_action() {
  // console.log('take_action');

  let entry = photo_list_entry(my.photo_index + 1);
  let path = photo_path_entry(entry);

  let layer = my.canvas;
  let imageQuality = my.imageQuality;
  try {
    await fstorage_upload({ path, layer, imageQuality });

    await photo_list_add(entry);

    dbase_group_update({ photo_index: dbase_increment(1) });
    //
  } catch (err) {
    console.log('take_action err', err);
  }
}

async function remove_action() {
  // console.log('remove_action photo_count', my.photo_list.length);
  if (my.photo_list.length < 1) {
    // No more images in the cloud
    //  zero out photo_index
    dbase_group_update({ photo_index: 0 });
    return;
  }
  //
  // remove the last entry in photo_list
  //
  let last = my.photo_list.pop();
  await photo_list_remove_entry(last);

  // Update photo_list in the cloud
  dbase_group_update({ photo_list: my.photo_list });
}
