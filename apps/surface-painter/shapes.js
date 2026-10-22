/* Additional solids from the second worksheet. Geometry is authored without dimension labels. */
window.SurfaceShapes=(()=>{
const N=96,TAU=Math.PI*2,E4=[[0,1],[1,2],[2,3],[3,0]];
const titles=['L字の柱','中央が高い立体','溝のある立体','重ねた円柱②','丸い穴の円柱','四角い穴の円柱','円すいと円柱②','2つの円すい','円すいのくぼみ'];
const labels=['上段（1）','上段（2）','上段（3）','3-3（1）','3-3（2）','3-3（3）','3-3（4）','3-3（5）','3-3（6）'];
const splittable=[true,true,true,true,false,false,true,true,false];
function build(which,split){let polys=[],areas=[],names=[];
const add=(v,n,id,edges=E4)=>polys.push({v,n,id,edges});
const pt=(r,a,y)=>[r*Math.cos(a),y,r*Math.sin(a)];
function disk(r,y,id,up){const v=Array.from({length:N},(_,i)=>pt(r,i*TAU/N,y));add(v,[0,up?1:-1,0],id,v.map((_,i)=>[i,(i+1)%N]));}
function side(r,lo,hi,id,inside=false){for(let i=0;i<N;i++){const a=i*TAU/N,b=(i+1)*TAU/N,m=(a+b)/2,k=inside?-1:1;add([pt(r,a,lo),pt(r,b,lo),pt(r,b,hi),pt(r,a,hi)],[k*Math.cos(m),0,k*Math.sin(m)],id,[[0,1],[2,3]]);}}
function annulus(r,inner,y,id,up, square=false){const innerPt=a=>square?pt(inner/Math.max(Math.abs(Math.cos(a)),Math.abs(Math.sin(a))),a,y):pt(inner,a,y);for(let i=0;i<N;i++){const a=i*TAU/N,b=(i+1)*TAU/N;add([innerPt(a),pt(r,a,y),pt(r,b,y),innerPt(b)],[0,up?1:-1,0],id,[[0,3],[1,2]]);}}
function cone(r,base,apex,id,inside=false){const h=Math.abs(apex-base),l=Math.hypot(h,r),k=inside?-1:1,sign=Math.sign(apex-base);for(let i=0;i<N;i++){const a=i*TAU/N,b=(i+1)*TAU/N,m=(a+b)/2;add([pt(r,a,base),pt(r,b,base),[0,apex,0]],[k*h/l*Math.cos(m),k*sign*r/l,k*h/l*Math.sin(m)],id,[[0,1]]);}}
function prism(profile,depth,boxes,vertical=false){const d=depth/2,faceEdges=profile.map((_,i)=>[i,(i+1)%profile.length]),area=Math.abs(profile.reduce((s,p,i)=>{const q=profile[(i+1)%profile.length];return s+p[0]*q[1]-p[1]*q[0]},0))/2;
areas=[area,area,...profile.map((p,i)=>{const q=profile[(i+1)%profile.length];return Math.hypot(q[0]-p[0],q[1]-p[1])*depth})];names=['手前の面','奥の面',...profile.map((_,i)=>`側面${i+1}`)];
const segment=(a,b,offset)=>{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy),normal=[dy/l,-dx/l,0];const on=(p,u,v)=>Math.abs((p[0]-u[0])*(v[1]-u[1])-(p[1]-u[1])*(v[0]-u[0]))<1e-7&&p[0]>=Math.min(u[0],v[0])-1e-7&&p[0]<=Math.max(u[0],v[0])+1e-7&&p[1]>=Math.min(u[1],v[1])-1e-7&&p[1]<=Math.max(u[1],v[1])+1e-7;let edge=profile.findIndex((p,i)=>on(a,p,profile[(i+1)%profile.length])&&on(b,p,profile[(i+1)%profile.length]));const id=edge<0?contact++:edge+2;add([[a[0]+offset[0],a[1]+offset[1],d],[b[0]+offset[0],b[1]+offset[1],d],[b[0]+offset[0],b[1]+offset[1],-d],[a[0]+offset[0],a[1]+offset[1],-d]],normal,id);};
let contact=areas.length;
if(!split){add(profile.map(([x,y])=>[x,y,d]),[0,0,1],0,faceEdges);add(profile.map(([x,y])=>[x,y,-d]),[0,0,-1],1,faceEdges);profile.forEach((a,i)=>segment(a,profile[(i+1)%profile.length],[0,0]));}
else for(const box of boxes){const [x0,x1,y0,y1,offset]=box,rect=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];add(rect.map(([x,y])=>[x+offset[0],y+offset[1],d]),[0,0,1],0);add(rect.map(([x,y])=>[x+offset[0],y+offset[1],-d]),[0,0,-1],1);rect.forEach((a,i)=>{const b=rect[(i+1)%4],dx=b[0]-a[0],dy=b[1]-a[1],den=dx*dx+dy*dy;const cuts=[0,1];for(const p of profile){const t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/den;if(t>1e-7&&t<1-1e-7&&Math.abs((p[0]-a[0])*dy-(p[1]-a[1])*dx)<1e-7)cuts.push(t)}const ts=[...new Set(cuts)].sort((a,b)=>a-b);for(let j=0;j<ts.length-1;j++)segment([a[0]+dx*ts[j],a[1]+dy*ts[j]],[a[0]+dx*ts[j+1],a[1]+dy*ts[j+1]],offset);});}
if(vertical)for(const f of polys){f.v=f.v.map(([x,y,z])=>[x,z,y]);f.n=[f.n[0],f.n[2],f.n[1]];}}
if(which===0){prism([[-2.25,-2.5],[2.25,-2.5],[2.25,-.5],[.75,-.5],[.75,2.5],[-2.25,2.5]],5,[[-2.25,.75,-2.5,2.5,[-.55,0]],[.75,2.25,-2.5,-.5,[.55,0]]],true);}
if(which===1){prism([[-2.4,-1.8],[2.4,-1.8],[2.4,0],[.6,0],[.6,1.8],[-1.2,1.8],[-1.2,0],[-2.4,0]],1.5,[[-2.4,2.4,-1.8,0,[0,-.4]],[-1.2,.6,0,1.8,[0,.85]]]);}
if(which===2){prism([[-1.5,-1],[1.5,-1],[1.5,1],[.5,1],[.5,0],[-.5,0],[-.5,1],[-1.5,1]],4,[[-1.5,1.5,-1,0,[0,-.45]],[-1.5,-.5,0,1,[-.3,.8]],[.5,1.5,0,1,[.3,.8]]]);}
if(which===3){const r=2,small=1.5,lo=-2,join=.5,hi=2,up=split?.85:0,down=split?-.4:0;disk(small,hi+up,0,true);side(small,join+up,hi+up,1);annulus(r,small,join+down,2,true);side(r,lo+down,join+down,3);disk(r,lo+down,4,false);areas=[Math.PI*small*small,TAU*small*(hi-join),Math.PI*(r*r-small*small),TAU*r*(join-lo),Math.PI*r*r];names=['小さい円柱の上面','小さい円柱の側面','輪の面','大きい円柱の側面','底面'];if(split){disk(small,join+down,5,true);disk(small,join+up,6,false);}}
if(which===4){const r=2.4,h=3.2,inner=.8;annulus(r,inner,h/2,0,true);annulus(r,inner,-h/2,1,false);side(r,-h/2,h/2,2);side(inner,-h/2,h/2,3,true);areas=[Math.PI*(r*r-inner*inner),Math.PI*(r*r-inner*inner),TAU*r*h,TAU*inner*h];names=['上の輪の面','下の輪の面','外側の曲面','穴の内側の曲面'];}
if(which===5){const r=1.6,h=4.8,a=.4;annulus(r,a,h/2,0,true,true);annulus(r,a,-h/2,1,false,true);side(r,-h/2,h/2,2);add([[-a,-h/2,-a],[-a,h/2,-a],[-a,h/2,a],[-a,-h/2,a]],[1,0,0],3);add([[a,-h/2,-a],[a,h/2,-a],[a,h/2,a],[a,-h/2,a]],[-1,0,0],4);add([[-a,-h/2,-a],[a,-h/2,-a],[a,h/2,-a],[-a,h/2,-a]],[0,0,1],5);add([[-a,-h/2,a],[a,-h/2,a],[a,h/2,a],[-a,h/2,a]],[0,0,-1],6);areas=[Math.PI*r*r-4*a*a,Math.PI*r*r-4*a*a,TAU*r*h,...Array(4).fill(2*a*h)];names=['手前の穴のある面','奥の穴のある面','外側の曲面','穴の内側1','穴の内側2','穴の内側3','穴の内側4'];for(const f of polys){f.v=f.v.map(([x,y,z])=>[x,z,y]);f.n=[f.n[0],f.n[2],f.n[1]];}}
if(which===6){const r=1.5,lo=-2,join=-.2,hi=join+Math.sqrt(56)*.3,up=split?.85:0,down=split?-.4:0;cone(r,join+up,hi+up,0);side(r,lo+down,join+down,1);disk(r,lo+down,2,false);areas=[Math.PI*r*2.7,TAU*r*1.8,Math.PI*r*r];names=['円すいの側面','円柱の側面','底面'];if(split){disk(r,join+down,3,true);disk(r,join+up,4,false);}}
if(which===7){const r=1.5,top=Math.sqrt(125)*.15,bottom=-Math.sqrt(300)*.15,up=split?.65:0,down=split?-.65:0;cone(r,up,top+up,0);cone(r,down,bottom+down,1);areas=[Math.PI*r*2.25,Math.PI*r*3];names=['上の円すいの側面','下の円すいの側面'];if(split){disk(r,up,2,false);disk(r,down,3,true);}}
if(which===8){const r=2.25,h=3,depth=Math.sqrt(99)*.15;side(r,-h/2,h/2,0);disk(r,-h/2,1,false);cone(r,h/2,h/2-depth,2,true);areas=[TAU*r*h,Math.PI*r*r,Math.PI*r*2.7];names=['外側の曲面','底面','くぼみの内側の曲面'];}
const points=polys.flatMap(f=>f.v),min=[0,1,2].map(k=>Math.min(...points.map(p=>p[k]))),max=[0,1,2].map(k=>Math.max(...points.map(p=>p[k]))),center=min.map((a,k)=>(a+max[k])/2),radius=Math.max(...points.map(p=>Math.hypot(...p.map((a,k)=>a-center[k])))),scale=2.8/radius;for(const f of polys)f.v=f.v.map(p=>p.map((a,k)=>(a-center[k])*scale));
return {polys,areas,names};
}
return {titles,labels,splittable,build};
})();
