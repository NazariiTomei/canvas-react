import{_ as d,C as g,c as i,a as o,b as l,o as c,p as m,d as h}from"./index-Bcp_3mIL.js";const u={data(){return{cropper:null,imageUrl:null,croppedImage:null}},methods:{onFileChange(e){const r=e.target.files[0];if(r){const a=new FileReader;a.onload=n=>{this.imageUrl=n.target.result,console.log(this.imageUrl),this.$nextTick(()=>{this.cropper&&this.cropper.destroy(),this.cropper=new g(this.$refs.image,{aspectRatio:1,viewMode:1})})},a.readAsDataURL(r)}},cropImage(){if(this.cropper){const e=this.cropper.getCroppedCanvas();this.croppedImage=e.toDataURL("image/png")}}},beforeDestroy(){this.cropper&&this.cropper.destroy()}},_=e=>(m("data-v-d586b433"),e=e(),h(),e),f={key:0},I=["src"],C={key:1},v=_(()=>o("h3",null,"Cropped Image:",-1)),U=["src"];function k(e,r,a,n,t,s){return c(),i("div",null,[o("input",{type:"file",onChange:r[0]||(r[0]=(...p)=>s.onFileChange&&s.onFileChange(...p))},null,32),t.imageUrl?(c(),i("div",f,[o("img",{ref:"image",src:t.imageUrl,alt:"Source Image"},null,8,I)])):l("",!0),o("button",{onClick:r[1]||(r[1]=(...p)=>s.cropImage&&s.cropImage(...p))},"Crop"),t.croppedImage?(c(),i("div",C,[v,o("img",{src:t.croppedImage,alt:"Cropped Image"},null,8,U)])):l("",!0)])}const b=d(u,[["render",k],["__scopeId","data-v-d586b433"]]);export{b as default};
