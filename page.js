function swichGender(el){
    el.querySelector("img").src =  `./0x72_DungeonTilesetII_v1.4/frames/${el.className.replace("card ", "")}_${el.querySelector("input").value == "m" ? "f" : "m"}_idle_anim_f1.png`;
    el.querySelector("input").value = el.querySelector("input").value == "m" ? "f" : "m";
}
 