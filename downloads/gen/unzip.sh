cd "/Users/kkzzk./Documents/GitHub/p5mirror-karakkzzk/downloads/../p5projects"
#
echo unzip 1 "ims01-kara.z-LYvffn-eM"
rm -rf "./ims01-kara.z-LYvffn-eM"
mkdir "./ims01-kara.z-LYvffn-eM"
pushd "./ims01-kara.z-LYvffn-eM" > /dev/null
unzip -q "../../downloads/zips/ims01-kara.z-LYvffn-eM"
popd > /dev/null
#
echo unzip 2 "Innovative crafter-OcjJ4foZE"
rm -rf "./Innovative crafter-OcjJ4foZE"
mkdir "./Innovative crafter-OcjJ4foZE"
pushd "./Innovative crafter-OcjJ4foZE" > /dev/null
unzip -q "../../downloads/zips/Innovative crafter-OcjJ4foZE"
popd > /dev/null

cd ..
# remove redundant p5.js p5.sound.min.js
rm -f p5projects/*/p5.*
# sync last_updatedAt.txt
cd downloads/json
if [ -e pending_updatedAt.txt ]; then
  rm -f last_updatedAt.txt
  mv pending_updatedAt.txt last_updatedAt.txt
fi