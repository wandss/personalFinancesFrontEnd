<template>
    <overlay :show="show" v-show="show">
        <transition name="slideMenu">
            <div id="menu" v-show="show">
                <div class="row">
                    <div class="col">
                        <h4 id="title">{{title}}</h4>
                    </div>
                    <div class="col">
                        <span id="close" class="close mb-2" @click="$emit('close')">
                            &times;
                        </span>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <accordion :accordionData="menuItems"
                         id="menuItems" @click="$emit('click', $event)"/>
                    </div>
                </div>
            </div>
        </transition>
    </overlay>
</template>
<script>
import Overlay from "@/components/Overlay";
import Accordion from "@/components/Accordion";
export default{
    name:'MainMenu',
    components:{Overlay, Accordion},
    props:{
        show:{
            type:Boolean,
            default:false,
        },
        title:{
            type:String,
        },
        menuItems:{
            type:Array,
            required:true,
            default:()=>[]
        }
    },
}
</script>
<style scoped>
#menu{
    background-color:#EEE;
    width:60%;
    min-width:65%;
    max-width:75%;
    height:100%;
}
#close{
    color:black;
    font-size:2rem;
    float:right;
    margin-right:1rem;

}
.slideMenu-enter-active, .slideMenu-leave-ative{
    transition:all .2s;
}
.slideMenu-enter, .slideMenu-leave-to{
    transform:translateX(-25rem);
}
#title{
    padding-left:1rem;
    padding-top:1rem;
    color:rgba(249, 148, 58, 0.91);
    text-shadow:-1px 2px 2px #333;
}
</style>
