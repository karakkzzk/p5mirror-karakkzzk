//

function photo_name(index) {
  return index.toString().padStart(3, '0') + my.imageExt;
}

function photo_list_entry(index) {
  let name = photo_name(index);
  let uid = my.uid;
  return { name, index, uid };
}

function photo_path_entry(entry) {
  return entry.uid + '/' + entry.name;
}

async function photo_list_add(entry) {
  my.photo_list.push(entry);
  if (my.photo_list.length > my.photo_max) {
    await photo_list_trim();
  }

  // Change to photo_list send to cloud
  dbase_group_update({ photo_list: my.photo_list });
}

async function photo_list_trim() {
  //
  // remove the first entry in photo_list
  //
  let first = my.photo_list.shift();
  await photo_list_remove_entry(first);
}

async function photo_list_remove_entry(entry) {
  // console.log('photo_list_remove_entry entry', entry);

  let path = photo_path_entry(entry);
  try {
    await fstorage_remove({ path });
    remove_img_index(entry.index);
  } catch (err) {
    console.log('show_action err', err);
  }
}

function remove_img_index(index) {
  // console.log('remove_img_index index', index);
  let id = 'id_img_' + index;
  let img = select('#' + id);
  // console.log('remove_img_index img', img);
  if (img) {
    img.remove();
  }
}

async function show_action() {
  //
  // console.log('show_action my.photo_list', my.photo_list);
  for (let entry of my.photo_list) {
    let path = photo_path_entry(entry);
    try {
      let url = await fstorage_download_url({ path });
      url_result(url, entry.index);
    } catch (err) {
      console.log('show_action err', err);
    }
  }
  function url_result(url, index) {
    // console.log('url_result index', index, 'url', url);
    let img = find_img(index);
    img.elt.src = url;
  }
}

// Create image element for an index
//  or return if already present
//
function find_img(index) {
  let id = 'id_img_' + index;
  let img = select('#' + id);
  if (!img) {
    // console.log('show_action id', id);
    img = createImg('', 'image');
    img.id(id);
    // console.log('show_action createImg', img);
    // my.gallery_div.child(img);

    // Add image as first child to see most recent first
    my.gallery_div.elt.prepend(img.elt);

    let iwidth = my.thumbWidth;
    img.style('width: ' + iwidth + 'px;');
  }
  return img;
}
