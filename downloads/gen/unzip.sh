cd "/Users/kkzzk./Documents/GitHub/p5mirror-karakkzzk/downloads/../p5projects"
#
echo unzip 1 "ims04-kara.z-aD2bqoiLh"
rm -rf "./ims04-kara.z-aD2bqoiLh"
mkdir "./ims04-kara.z-aD2bqoiLh"
pushd "./ims04-kara.z-aD2bqoiLh" > /dev/null
unzip -q "../../downloads/zips/ims04-kara.z-aD2bqoiLh"
popd > /dev/null
#
echo unzip 2 "p5moExamples photo booth 70 copy-v7NuIZk5"
rm -rf "./p5moExamples photo booth 70 copy-v7NuIZk5"
mkdir "./p5moExamples photo booth 70 copy-v7NuIZk5"
pushd "./p5moExamples photo booth 70 copy-v7NuIZk5" > /dev/null
unzip -q "../../downloads/zips/p5moExamples photo booth 70 copy-v7NuIZk5"
popd > /dev/null
#
echo unzip 3 "ims03-kara.z-Mtdn3z1CO"
rm -rf "./ims03-kara.z-Mtdn3z1CO"
mkdir "./ims03-kara.z-Mtdn3z1CO"
pushd "./ims03-kara.z-Mtdn3z1CO" > /dev/null
unzip -q "../../downloads/zips/ims03-kara.z-Mtdn3z1CO"
popd > /dev/null
#
echo unzip 4 "Innovative crafter-OcjJ4foZE"
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