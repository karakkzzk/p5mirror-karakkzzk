cd "/Users/kkzzk./Downloads/p5mirror-karakkzzk/downloads/../p5projects"
#
echo unzip 1 "GestureControlledVisuals_Kara_Final-2ruTzbg66"
rm -rf "./GestureControlledVisuals_Kara_Final-2ruTzbg66"
mkdir "./GestureControlledVisuals_Kara_Final-2ruTzbg66"
pushd "./GestureControlledVisuals_Kara_Final-2ruTzbg66" > /dev/null
unzip -q "../../downloads/zips/GestureControlledVisuals_Kara_Final-2ruTzbg66"
popd > /dev/null
#
echo unzip 2 "KaraFinal_v2-VvAEyeQ0l"
rm -rf "./KaraFinal_v2-VvAEyeQ0l"
mkdir "./KaraFinal_v2-VvAEyeQ0l"
pushd "./KaraFinal_v2-VvAEyeQ0l" > /dev/null
unzip -q "../../downloads/zips/KaraFinal_v2-VvAEyeQ0l"
popd > /dev/null
#
echo unzip 3 "KaraFinal_v1-f8S6e7DSk"
rm -rf "./KaraFinal_v1-f8S6e7DSk"
mkdir "./KaraFinal_v1-f8S6e7DSk"
pushd "./KaraFinal_v1-f8S6e7DSk" > /dev/null
unzip -q "../../downloads/zips/KaraFinal_v1-f8S6e7DSk"
popd > /dev/null
#
echo unzip 4 "Push and Draw copy copy copyworks copy copy-AACxYHsl_"
rm -rf "./Push and Draw copy copy copyworks copy copy-AACxYHsl_"
mkdir "./Push and Draw copy copy copyworks copy copy-AACxYHsl_"
pushd "./Push and Draw copy copy copyworks copy copy-AACxYHsl_" > /dev/null
unzip -q "../../downloads/zips/Push and Draw copy copy copyworks copy copy-AACxYHsl_"
popd > /dev/null
#
echo unzip 5 "Push and Draw copy copy copyworks copy-ZnlZtj9cO"
rm -rf "./Push and Draw copy copy copyworks copy-ZnlZtj9cO"
mkdir "./Push and Draw copy copy copyworks copy-ZnlZtj9cO"
pushd "./Push and Draw copy copy copyworks copy-ZnlZtj9cO" > /dev/null
unzip -q "../../downloads/zips/Push and Draw copy copy copyworks copy-ZnlZtj9cO"
popd > /dev/null
#
echo unzip 6 "Push and Draw copy copy copyworks-7No-vxrsY"
rm -rf "./Push and Draw copy copy copyworks-7No-vxrsY"
mkdir "./Push and Draw copy copy copyworks-7No-vxrsY"
pushd "./Push and Draw copy copy copyworks-7No-vxrsY" > /dev/null
unzip -q "../../downloads/zips/Push and Draw copy copy copyworks-7No-vxrsY"
popd > /dev/null
#
echo unzip 7 "Push and Draw copy copy-_ymznQLgB"
rm -rf "./Push and Draw copy copy-_ymznQLgB"
mkdir "./Push and Draw copy copy-_ymznQLgB"
pushd "./Push and Draw copy copy-_ymznQLgB" > /dev/null
unzip -q "../../downloads/zips/Push and Draw copy copy-_ymznQLgB"
popd > /dev/null
#
echo unzip 8 "Enchanting nickel-foe-KrRvv"
rm -rf "./Enchanting nickel-foe-KrRvv"
mkdir "./Enchanting nickel-foe-KrRvv"
pushd "./Enchanting nickel-foe-KrRvv" > /dev/null
unzip -q "../../downloads/zips/Enchanting nickel-foe-KrRvv"
popd > /dev/null
#
echo unzip 9 "Push and Draw add in visuals attempt-Yv4ZaMyZO"
rm -rf "./Push and Draw add in visuals attempt-Yv4ZaMyZO"
mkdir "./Push and Draw add in visuals attempt-Yv4ZaMyZO"
pushd "./Push and Draw add in visuals attempt-Yv4ZaMyZO" > /dev/null
unzip -q "../../downloads/zips/Push and Draw add in visuals attempt-Yv4ZaMyZO"
popd > /dev/null
#
echo unzip 10 "Shimmer bronze copy-URSmmZlJ4"
rm -rf "./Shimmer bronze copy-URSmmZlJ4"
mkdir "./Shimmer bronze copy-URSmmZlJ4"
pushd "./Shimmer bronze copy-URSmmZlJ4" > /dev/null
unzip -q "../../downloads/zips/Shimmer bronze copy-URSmmZlJ4"
popd > /dev/null
#
echo unzip 11 "Handpose_Webcam copy-_TZB1IIde"
rm -rf "./Handpose_Webcam copy-_TZB1IIde"
mkdir "./Handpose_Webcam copy-_TZB1IIde"
pushd "./Handpose_Webcam copy-_TZB1IIde" > /dev/null
unzip -q "../../downloads/zips/Handpose_Webcam copy-_TZB1IIde"
popd > /dev/null
#
echo unzip 12 "Rock-Paper-Scissor copy-TxKZMW6kB"
rm -rf "./Rock-Paper-Scissor copy-TxKZMW6kB"
mkdir "./Rock-Paper-Scissor copy-TxKZMW6kB"
pushd "./Rock-Paper-Scissor copy-TxKZMW6kB" > /dev/null
unzip -q "../../downloads/zips/Rock-Paper-Scissor copy-TxKZMW6kB"
popd > /dev/null
#
echo unzip 13 "Frequent reason-FpeKSPIgH"
rm -rf "./Frequent reason-FpeKSPIgH"
mkdir "./Frequent reason-FpeKSPIgH"
pushd "./Frequent reason-FpeKSPIgH" > /dev/null
unzip -q "../../downloads/zips/Frequent reason-FpeKSPIgH"
popd > /dev/null
#
echo unzip 14 "ims04_kara.z_ver2-tqrzTfi_7"
rm -rf "./ims04_kara.z_ver2-tqrzTfi_7"
mkdir "./ims04_kara.z_ver2-tqrzTfi_7"
pushd "./ims04_kara.z_ver2-tqrzTfi_7" > /dev/null
unzip -q "../../downloads/zips/ims04_kara.z_ver2-tqrzTfi_7"
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