// Clay restyle pipeline for low-poly furniture GLBs (Grok, Nov 2026).
// node tools/clay-models/restyle.mjs <srcDir> <outDir> <list.json>
// list.json: [{"src":"Kitchen Fridge.glb","out":"fridge","tint":"pink"(optional)}]
// - every material -> matte clay (roughness .9, metalness 0) with a pastel colour mapped from the original hue
// - textures / unused data removed, vertices welded, duplicates merged, positions/normals quantized (KHR_mesh_quantization)
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,weld,quantize,flatten,join} from '@gltf-transform/functions';
import fs from 'fs';import path from 'path';
const [src,out,listF]=process.argv.slice(2);
const PAL={pink:'#f4a9bb',rose:'#e98aa3',peach:'#f6c3a0',butter:'#f7dc9c',sage:'#a8c99f',mint:'#bfe3cf',sky:'#b5d3ee',lavender:'#c8b6e6',wood:'#dcb48f',cream:'#fbf0e2',grey:'#ddd0c8',cocoa:'#9a7468'};
const lin=h=>{const n=parseInt(h.slice(1),16);return[(n>>16)/255,(n>>8&255)/255,(n&255)/255].map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);};
const srgb=c=>c<=.0031308?c*12.92:1.055*c**(1/2.4)-.055;
function pick(rgb){const [r,g,b]=rgb.map(srgb);const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,s=mx===mn?0:(mx-mn)/(1-Math.abs(2*l-1));
 let h=0;if(mx!==mn){h=mx===r?((g-b)/(mx-mn))%6:mx===g?(b-r)/(mx-mn)+2:(r-g)/(mx-mn)+4;h=(h*60+360)%360;}
 if(l>.82)return'cream';if(l<.18)return'cocoa';if(s<.15)return l>.55?'cream':'grey';
 if(h<20||h>=330)return l>.6?'pink':'rose';if(h<45)return l<.45?'wood':'peach';if(h<70)return'butter';if(h<165)return'sage';if(h<200)return'mint';if(h<250)return'sky';if(h<330)return'lavender';return'pink';}
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const list=JSON.parse(fs.readFileSync(listF,'utf8'));fs.mkdirSync(out,{recursive:true});const rep=[];
for(const it of list){const doc=await io.read(path.join(src,it.src));const root=doc.getRoot();
 for(const m of root.listMaterials()){const k=it.map?.[m.getName()]||(it.tint&&it.tintMat===m.getName()?it.tint:null)||pick(m.getBaseColorFactor().slice(0,3));
  m.setBaseColorFactor([...lin(PAL[k]),1]).setBaseColorTexture(null).setMetallicRoughnessTexture(null).setNormalTexture(null).setEmissiveTexture(null).setOcclusionTexture(null)
   .setRoughnessFactor(.9).setMetallicFactor(0).setEmissiveFactor([0,0,0]).setAlphaMode('OPAQUE');
  for(const e of m.listExtensions())m.setExtension(e.extensionName,null);m.setName('clay-'+k);}
 for(const t of root.listTextures())t.dispose();
 await doc.transform(dedup(),flatten(),join(),weld({tolerance:1e-4}),quantize({quantizePosition:14,quantizeNormal:10}),prune());
 for(const e of root.listExtensionsUsed())if(!['KHR_mesh_quantization'].includes(e.extensionName))e.dispose();
 const f=path.join(out,it.out+'.glb');await io.write(f,doc);rep.push([it.out,fs.statSync(f).size]);}
console.log(rep.map(r=>r.join(':')).join(' '));
